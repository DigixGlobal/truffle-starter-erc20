# Digix ETC Redemption Process

This repository contains contracts and scripts for the deployment and execution of Digix's proposed ETC redemption mechanism.

The project is currently in "Dry run" mode, where a live test deployment is available on ETC chain.

---

* **[DGDR to ETC User Guide](https://github.com/DigixGlobal/etc-redemption/blob/master/guide/GUIDE.md)**
* **[Spectrum Dapp UI](https://spectrum-alpha.digixdev.com)**
* **[View Contract Code](https://digixglobal.github.io/etc-redemption/docs/EtcRedemptionToken/)**

---

## Overview

[Digix recently outlined](https://medium.com/@Digix/digixdao-etc-withdrawal-proposal-v1-0-mar-22-2017-578fe1575a40) a proposal to allow DGD holders to redeem ETC. Since this proposal, with feedback from the DGD holder community, it has evolved into a less complex redemption process (by removing the voting step). This repository has been produced to describe and provide all the tools needed perform this updated redemption process.

The proposed contracts and process details are presented to the community for discussion, questions and criticisms. The current codebase is subject to change pending code review.

## Changes to Proposal v1

This updated includes some changes to the [previously announced proposal](https://medium.com/@Digix/digixdao-etc-withdrawal-proposal-v1-0-mar-22-2017-578fe1575a40) - please view the previous version for additional context.

### No More Voting

The main change is that we've decided to skip the carbonvote step. After gauging sentiment from DGD holders (including 'whales' and the general DGD community), there was no resistance to the principal of returning ETC to DGD holders. Therefore we have determined it would be better to forego the voting process as it would yield additional development time and reach a non-controversial already-known outcome (the motion to refund ETC to DGD holders).

### ETC Redemption Contract

The redemption contract allows users to claim an ETC balance by redeeming tokens that are issued to them automatically on the ETC chain.

Each redemption token represents 1:1 equivalent of DGD balances. These redemption tokens are known as `DGDR`, which is an EIP20 token.

To claim ETC, holders of `DGDR` should call a method on the `DGDR` contract to burn their holdings in return of an ETC value. At the point of burning, the balance of `DGDR` drops to 0, and a fixed rate will be used to convert this balance into ETC.

For example, a user has 100 DGD, gets 100 `DGDR`, and burns it for ~22.3 ETC.

The conversion rate to ETC used will be close to 100% of the original ETC pool, but with an additional fee deduced from the pool based on the gas used for testing, deployment and minting (which could amount to around a few USD cents per user).

See [Redemption Token Contract](#redemption-token-contract) section for more details.

### MultiSig & Top-up System

* Two MultiSig contracts
  * ETH Chain (to hold ETH from the Digix crowdsale until governance contracts live)
  * ETC Chain (to hold refunded ETC and top up to the redemption contract, and execute it's methods)
* 4 anonymous trusted parties will be in control of this contract
* 3/4 of the parties to approve any transaction made from it

A 'top-up' system will be used when passing funds to the redemption contract to reduce the effects of any unforeseen exploits. Batches of 100,000 ETC (?) will be added to the redemption contract as required (and topped up as the remaining balance reaches 10,000).

### Additional End User Resources

As development focus shifted a carbonvote process to the redemption contract, some additional end-user requirements were identified to enable DGD holders to perform the redemption on the ETC chain with ease.

* Instructions for MEW / CLI / Mist
* Public ETC RPC Node (compatible with MEW / Spectrum / web3-console)
* Instructions for installing local ETC Node (as fallback for public node)
* Spectrum UI for redemption process (on ETC chain)
* Best practices for hardware / offline signing

## Redemption Process

The new redemption process is split roughly into the following steps:

### Set Up

This stage is managed by DigixGlobal and will not require interaction from DGD holders

1. Public announcement of *snapshot* and *activation* block made
1. After the snapshot block, redemption contract is deployed to ETC and balances are minted
1. Balances published to IPFS, confirmed by script & community
1. Activation block is set, admin changed to Multisig
1. DGDR is funded by Multisig (using top-up)
1. Activation block occurs (within 24 hours)

### Redemption

After the activation block is reached, users with a `DGDR` balance will be able to proceed with redemptions; (optionally trading and then) burning their `DGDR` tokens in return for ETC using one of the following ways:

* Use a local ETC Node
* Use MEW + RPC Node
* Depositing to an exchange during the snapshot block
* Use Spectrum Alpha + RPC Node

#### Note for DGD holders using smart contracts for holding

For those who hold their DGD balances in a contract address that may does not exist on ETC chain, two options are provided:

* Ensure the contract can execute other contracts (to call the redeem method)
* Move the DGDs into a regular address before the Snapshot Block
* Move the DGDs into an Exchange before the Snapshot Block
* Contact Digix to manually process redemption

#### Note to Exchanges

After discussing how exchanges can optimally engage with the redemption process, we identified the following general pattern that should be adopted by exchanges to ensure an easy:

1. Before the snapshot block, disable deposits, redemptions and trading of DGD
1. On the snapshot block, move DGD into a single account / multisig
1. After the activation block, call the redeem method on the token
1. Credit DGD holders with their proportion of the redeemed ETC
1. Re-open trading, deposits and redemptions

### After 1 Year

DGD holders perform a vote to determine action on unclaimed ETC

* Extend the balance 1 year
* Extend the redemption indefinitely (switch owner to `0x0` address)
* Other options to be determined by DGD holders

## Redemption Token Contract

For full documentation on the methods please see the [contract docs](https://digixglobal.github.io/etc-redemption/docs/EtcRedemptionToken/). The redemption contract is an extended EIP20 tradable token with the additional features:

* Permissioned
  * Owned by one admin
  * Admin can transfer ownership
  * Admin can control the activation block / mint tokens / drain contract
* Time-Lockable
  * Disables transfers / redemptions until a specific (activation) block is reached
* Redeemable
  * Admins can fund (ETC) value to the contract
  * Admins can set the rate of ETC redeemed for each token
  * Users with a balance can call 'redeem' (or proxy via default function) to burn balance in return for ETC
  * The redeem function can be passed a different address (uses `msg.sender` if using the default function)

A test suite with 100% method coverage has been added to this repository under `./test`, they can be run with `truffle test`.

### Multisig Wallet

A Multisig contract for holding both ETH and ETC after the activation block will be: https://github.com/ConsenSys/MultiSigWallet. Basic integration tests has been written in this project, with unit tests available in the ConsenSys repository.

## Scripts

This repository contains a series of scripts to facilitate the backend process.

The the parameters can be configured in `./scripts/helpers/config.json`.

|`npm run`|args|Description|
|--|--|---|
|`step-1`||Get the Snapshot (run this with multiple clients & Etherscan)|
|`step-2`||Confirm the Balance Reports are the same|
|`step-3`||Publish report to IPFS|
|`step-4`||Migrate the Contracts to ETC Chain|
|`step-5`|`<tx>`|Mint the Tokens on ETC Chain (optional resume from tx#)|
|`step-6`||Confirm the balances on ETC Chain (do this before and after step 7)|
|`step-4-test`||Migrate Contracts to Kovan (for testing)|
|`step-5-test`|`<tx>`|Mint the Tokens on Kovan (optional resume from tx#)|
|`step-6-test`||Confirm balances on Kovan|
|`estimate-gas`||Estimate total ETC requirements|

## *Estimated* Timelines

|Estimated Date|Event|
|---|---|
|Apr 28th|1 week of public review / discussion of this updated proposal, contract and scripts|
|May 5th|Around 1 week to make any updates or bugfixes to this proposal, pending community feedback|
|May 12th|Snapshot block announced|
|May 26th|Snapshot block occurs|
|May 27th|Balances confirmed, redemption contract deployed|
|May 28th|Activation block reached, redemption is allowed|

## TODOs

* Setup Public ETC RPC Node (compatible with MEW / Spectrum / web3-console)
* Test throwable redeem sender contract (Add a test to send ETH to the contract)
* Script for validating contract addresses
* User Guide / best practices for hardware / offline signing
  * Instructions for MEW / CLI
  * Instructions for installing local ETC Node (as fallback for public node)
  * Spectrum UI for redemption process (on ETC chain)
  * Double check replay attack protection in all redemption methods ETC <-> ETH

## Questions

Please join the Digix slack channel #etc-redemption
