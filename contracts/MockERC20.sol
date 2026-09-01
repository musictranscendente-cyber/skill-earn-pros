// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Mock ERC20 — TEST TOKEN, NOT REAL MONEY
 * @notice Freely mintable stand-in token, used ONLY on testnet where no
 * official test deployment exists (e.g. Tether does not publish an official
 * USDT test token on Base Sepolia, and cbBTC only exists on Base mainnet).
 * Anyone can mint any amount to themselves — that's normal and expected for
 * a testnet faucet token, and exactly why this must never touch mainnet.
 *
 * On mainnet, PvPGenesisSale.configureAsset() should point at the REAL token
 * contracts instead (e.g. real USDT / cbBTC on Base) — no code changes
 * needed, just different addresses.
 */
contract MockERC20 is ERC20 {
    uint8 private immutable _decimals;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) ERC20(name_, symbol_) {
        _decimals = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /// @notice Test-only faucet — mints `amount` to the caller. Never include this on mainnet.
    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}
