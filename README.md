# Final project idea - Automated rental agreements

## Project description

User and apartment owner enter an agreement for renting a property, i.e. exchanging usage rights to an apartment for as long as payments are made to a specific Ethereum account before the agreed deadline.

User receives a keycode / access token to the apartment after first payment. If a user's payments are late, they will receive a reminder after one week. After e.g. 30 days (variable depending on local jurisdiction) of no payments, usage rights will be automatically transferred back to owner and apartment access rights will be revoked from user. User agrees to this procedure when entering contract with owner.

- Checking for received payments and transferring ownership back to owner on non-payment cases could be scheduled with e.g. Gelato Network (https://docs.gelato.network/tutorial).
- Opening door locks could be done with an app with smart locks, e.g. https://api.getkisi.com/docs. Smart lock APIs won't be explored in this project.

## Simple work flow

1. Enter service web site
2. Login with Metamask
3. Browse apartments
4. Select apartment
5. Agree on contract, pay first installment with Metamask (smart contract call)
6. Ownership is transferred to user account from owner account (smart contract call)
7. Receive key phrase / token / OTP / etc. to access apartment with smart lock app (this part will be mocked in project)

## Scheduled workflow for late payments

1. Run scheduled contract weekly (Gelato? https://docs.gelato.network/tutorial)
2. Check for made payments for each rental agreement (from renter wallet to owner wallet)
3. If last payment is late 7 days, send reminder
4. If last payment is late >= 30 days, transfer ownership back to owner. Revoke user token access rights to apartment smart lock. 



