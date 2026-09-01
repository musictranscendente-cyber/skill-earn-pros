// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice Minimal Chainlink price feed interface — declared locally so this file
/// compiles in Remix without needing the full @chainlink/contracts package.
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

/**
 * @title PvP Pro — Genesis Sale
 * @notice Ledger + payment collector for the PvP Pro Genesis founder round.
 *
 * Accepts ETH and any owner-approved ERC20 — stablecoins priced 1:1 with USD,
 * or other assets (e.g. wrapped BTC) priced live via a Chainlink feed — and
 * records how much PVP each buyer has reserved.
 *
 * This contract does NOT mint or hold the PVP token itself. PVP stays locked
 * ("Reserved") until a separate Claim contract opens at token launch (TGE) —
 * matching the Genesis flow already described on the PvP Pro site.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  STATUS: TESTNET DRAFT — NOT AUDITED. Do not deploy to mainnet or accept
 *  real funds before: (1) a professional smart-contract security audit, and
 *  (2) legal review of the offering for every jurisdiction it's sold into.
 * ─────────────────────────────────────────────────────────────────────────
 */
contract PvPGenesisSale is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct AcceptedAsset {
        bool enabled;
        bool isStable; // true => 1 unit (adjusted for decimals) == $1, no price feed needed
        uint8 tokenDecimals; // 18 for ETH; ERC20s report their own via decimals()
        address priceFeed; // Chainlink AggregatorV3 proxy address (ignored when isStable == true)
    }

    /// @dev address(0) is the key used for native ETH.
    mapping(address => AcceptedAsset) public assets;

    /// PVP price in USD, 18-decimal fixed point (e.g. $0.002 == 2e15).
    uint256 public priceUsd18;
    /// Hard cap for the round, in USD, 18-decimal fixed point.
    uint256 public hardCapUsd18;
    /// Total raised so far, in USD, 18-decimal fixed point.
    uint256 public raisedUsd18;
    /// Where collected funds go on withdraw. Intended to become a multisig (e.g. Safe) before mainnet.
    address public treasury;
    /// Purchases are only accepted while true.
    bool public saleActive;
    /// A price feed answer older than this is rejected (stale-oracle protection).
    uint256 public constant MAX_PRICE_AGE = 1 hours;

    mapping(address => uint256) public usdContributed18;
    mapping(address => uint256) public pvpReserved;

    event AssetConfigured(address indexed token, bool enabled, bool isStable, uint8 tokenDecimals, address priceFeed);
    event TreasuryUpdated(address indexed treasury);
    event ParamsUpdated(uint256 priceUsd18, uint256 hardCapUsd18);
    event SaleStateChanged(bool active);
    event Purchased(
        address indexed buyer, address indexed asset, uint256 assetAmount, uint256 usdValue18, uint256 pvpReserved
    );
    event Withdrawn(address indexed token, uint256 amount, address indexed to);

    error SaleNotActive();
    error AssetNotAccepted();
    error ZeroAmount();
    error HardCapExceeded();
    error StalePrice();
    error InvalidPrice();
    error EditWhileActive();
    error ZeroAddress();

    modifier whenSaleActive() {
        if (!saleActive) revert SaleNotActive();
        _;
    }

    constructor(address initialOwner, address initialTreasury, uint256 _priceUsd18, uint256 _hardCapUsd18)
        Ownable(initialOwner)
    {
        if (initialTreasury == address(0)) revert ZeroAddress();
        treasury = initialTreasury;
        priceUsd18 = _priceUsd18;
        hardCapUsd18 = _hardCapUsd18;
    }

    // ───────────────────────── Owner configuration ─────────────────────────
    // Price and hard cap can only change while the sale is paused (saleActive
    // == false) — that keeps every live change fully visible: nobody can have
    // the terms shift under them mid-purchase.

    function configureAsset(address token, bool enabled, bool isStable, uint8 tokenDecimals, address priceFeed)
        external
        onlyOwner
    {
        if (!isStable && priceFeed == address(0)) revert ZeroAddress();
        assets[token] = AcceptedAsset(enabled, isStable, tokenDecimals, priceFeed);
        emit AssetConfigured(token, enabled, isStable, tokenDecimals, priceFeed);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert ZeroAddress();
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function setParams(uint256 _priceUsd18, uint256 _hardCapUsd18) external onlyOwner {
        if (saleActive) revert EditWhileActive();
        if (_hardCapUsd18 < raisedUsd18) revert HardCapExceeded();
        priceUsd18 = _priceUsd18;
        hardCapUsd18 = _hardCapUsd18;
        emit ParamsUpdated(_priceUsd18, _hardCapUsd18);
    }

    function setSaleActive(bool active) external onlyOwner {
        saleActive = active;
        emit SaleStateChanged(active);
    }

    // ───────────────────────────── Purchases ────────────────────────────────

    function buyWithEth() external payable nonReentrant whenSaleActive {
        if (msg.value == 0) revert ZeroAmount();
        AcceptedAsset memory a = assets[address(0)];
        if (!a.enabled) revert AssetNotAccepted();
        uint256 usdValue18 = _toUsd18(msg.value, a);
        _settle(msg.sender, address(0), msg.value, usdValue18);
    }

    function buyWithToken(address token, uint256 amount) external nonReentrant whenSaleActive {
        if (amount == 0) revert ZeroAmount();
        AcceptedAsset memory a = assets[token];
        if (!a.enabled) revert AssetNotAccepted();
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        uint256 usdValue18 = _toUsd18(amount, a);
        _settle(msg.sender, token, amount, usdValue18);
    }

    function _settle(address buyer, address asset, uint256 assetAmount, uint256 usdValue18) internal {
        if (usdValue18 == 0) revert ZeroAmount();
        if (raisedUsd18 + usdValue18 > hardCapUsd18) revert HardCapExceeded();
        uint256 pvp = (usdValue18 * 1e18) / priceUsd18;
        raisedUsd18 += usdValue18;
        usdContributed18[buyer] += usdValue18;
        pvpReserved[buyer] += pvp;
        emit Purchased(buyer, asset, assetAmount, usdValue18, pvp);
    }

    function _toUsd18(uint256 amount, AcceptedAsset memory a) internal view returns (uint256) {
        uint256 scaled = a.tokenDecimals >= 18
            ? amount / (10 ** (a.tokenDecimals - 18))
            : amount * (10 ** (18 - a.tokenDecimals));
        if (a.isStable) return scaled;
        return (scaled * _latestPrice18(a.priceFeed)) / 1e18;
    }

    function _latestPrice18(address feed) internal view returns (uint256) {
        AggregatorV3Interface f = AggregatorV3Interface(feed);
        (, int256 answer,, uint256 updatedAt,) = f.latestRoundData();
        if (answer <= 0) revert InvalidPrice();
        if (block.timestamp - updatedAt > MAX_PRICE_AGE) revert StalePrice();
        uint8 dec = f.decimals();
        return uint256(answer) * (10 ** (18 - dec));
    }

    // ─────────────────────── View helpers for the frontend ──────────────────

    function quote(address token, uint256 amount) external view returns (uint256 usdValue18, uint256 pvp) {
        AcceptedAsset memory a = assets[token];
        usdValue18 = _toUsd18(amount, a);
        pvp = (usdValue18 * 1e18) / priceUsd18;
    }

    function positionOf(address buyer) external view returns (uint256 usd18, uint256 pvp) {
        return (usdContributed18[buyer], pvpReserved[buyer]);
    }

    function remainingUsd18() external view returns (uint256) {
        return hardCapUsd18 > raisedUsd18 ? hardCapUsd18 - raisedUsd18 : 0;
    }

    // ──────── Withdrawals — ALWAYS to `treasury`, never to an arbitrary address ────────
    // Even if the owner key were ever compromised, funds can only move to the
    // pre-set treasury address, not wherever an attacker wants. Before mainnet,
    // `treasury` should be set to a multisig (e.g. Safe), not a single wallet.

    function withdraw(address token, uint256 amount) external onlyOwner nonReentrant {
        if (token == address(0)) {
            (bool ok,) = treasury.call{value: amount}("");
            require(ok, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(treasury, amount);
        }
        emit Withdrawn(token, amount, treasury);
    }

    receive() external payable {
        revert("use buyWithEth");
    }
}
