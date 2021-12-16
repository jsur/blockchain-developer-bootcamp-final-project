# Final project - Automated rental agreements

## Deployed version url:

https://final-project-jsur.vercel.app

## How to run this project locally:

### Prerequisites

- Node.js >= v14
- Truffle and Ganache
- Yarn
- `git fetch --all --tags`
- `git checkout tags/v1.0 -b cert`

### Contracts

- Run `yarn install` in project root to install Truffle build and smart contract dependencies
- Run local testnet in port `7545` with an Ethereum client, e.g. Ganache
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `test`
- `development` network id is 1337, remember to change it in Metamask as well!

### Frontend

- `cd client`
- `yarn install`
- `yarn start`
- Open `http://localhost:3000`

### How to populate locally deployed contract with listings

- `truffle migrate --network development`
- `truffle console --network development`
- `let rr = await Rentals.deployed()`
- Add two listings:
- `rr.addProperty(web3.utils.toWei("0.00156"), "Hämeentie 77", "Duplex with a nice view", "https://google.com","https://www.hermannikuvia.fi/wp-content/uploads/Hameentie-77-sisapiha.jpg")`
- `rr.addProperty(web3.utils.toWei("0.002"), "Mannerheimintie 30 A", "Duplex with a really bad view", "https://google.com","https://www.finna.fi/Cover/Show?id=hkm.HKMS000005%3Akm002zsb&index=0&size=large&source=Solr")`
- Send ETH to local wallet: `web3.eth.sendTransaction({ from: "<your local address>", to: "<your local network wallet>", value: web3.utils.toWei("10") })`
- `cd client && yarn start`
- Open local ui from `http://localhost:3000`
- Make sure your Metamask localhost network is in port `7545` and chain id is `1337`.
- If you get `TXRejectedError` when sending a transaction, reset your Metamask account from Advanced settings.

## Screencast link

https://youtu.be/enwECpgoQUg

## Public Ethereum wallet for certification:

`0x109B58ED673Bb241d170b87e4F88c5f426781fC9`

## Project description

User and apartment owner enter an agreement for renting a property, i.e. exchanging usage rights to an apartment for as long as payments are made to a specific Ethereum account before the agreed deadline.

User receives a keycode / access token to the apartment after first payment. If a user's payments are late, they will receive a reminder after one week. After e.g. 30 days (variable depending on local jurisdiction) of no payments, usage rights will be automatically transferred back to owner and apartment access rights will be revoked from user. User agrees to this procedure when entering contract with owner.

- Checking for received payments and transferring ownership back to owner on non-payment cases could be scheduled with e.g. Gelato Network (https://docs.gelato.network/tutorial).
- Opening door locks could be done with an app with smart locks, e.g. https://api.getkisi.com/docs. Smart lock APIs won't be explored in this project.

## Simple workflow

1. Enter service web site
2. Login with Metamask
3. Browse apartments
4. Select apartment
5. Agree on contract, pay first installment with Metamask (smart contract call)
6. Tenantship is transferred to user account (smart contract call)
7. Receive key phrase / token / OTP / etc. to access apartment with smart lock app (this part will be mocked in project)

## Scheduled workflow for late payments (Not implemented)

1. Run scheduled contract weekly (Gelato? https://docs.gelato.network/tutorial)
2. Check for made payments for each rental agreement (from renter wallet to owner wallet)
3. If last payment is late 7 days, send reminder
4. If last payment is late >= 30 days, remove tenant. Revoke user token access rights to apartment smart lock.

## Directory structure

- `client`: Project's React frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## Environment variables (not needed for running project locally)

```
ROPSTEN_INFURA_PROJECT_ID=
ROPSTEN_MNEMONIC=
```

## TODO features

- Tenant payments tracking
- Tenant removal
- Fund withdrawal
