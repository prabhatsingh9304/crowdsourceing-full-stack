It is an web3 full stack app that hold fund of users and owner of the contract can withdraw all the funds.
it is written in solidity, brownie framework and raw html and javascript and it is tested on ganache-cli and sepolia testnet

Functions

- It have a payable fund() function which take user input and check if fundvalue is greater that minimumUSD value
  and fund it to smart contract and store the address of funder into a map(address,amountFunded).
  I used chainlink pricefeed aggregator for ETH/USD conversion. a getConversionRate function is called by passing 
  user input amount value and return USD value and it get checked with minimumUSD value.
- It use onlyOwner modifier to check whether funder is onwner or not. owner is set using constructor and it is the
  user who deployed the contract
- If funder is owner then only withdraw function can be called. Withdraw function tranfer all the balance of this
  contract to owner account

Testing
- Mocks of chainmix pricefeedAggregator is used for local Testing
- Tested on Sepolia testnet

change constants.js contractAddress variable to deployed contract
create .env with variable PRIVATE_KEY, WEB3_ALCHEMY_PROJECT_ID, PVCQHJH32G3DFQQ2SXAUAAVSRAMRHH29KI

