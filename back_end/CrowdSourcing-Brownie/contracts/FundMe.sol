// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;
    
    address payable public owner;
    AggregatorV3Interface public priceFeed;
    
    //Get called when contract is deployed
    //and store address of admin in owner variable(admin: who deployed this contract)

    constructor(address _priceFeed) public {
        priceFeed = AggregatorV3Interface(_priceFeed); //testnet ETH/USD address
        owner = payable(msg.sender); //Typecasting to make address payable so that to use send and tranfer function
    }

    //this function can be used to pay for thing (payable)
    function fund() public payable {  
        //we are working in Gwei
        uint256 minimumUSD = 2 * 10**18;
        require(
            getConversionRate(msg.value) >= minimumUSD,
            "You have not funded Enough!"
        );
        addressToAmountFunded[msg.sender] += msg.value; //storing funder address to amound funded in map
        funders.push(msg.sender); //storing all funders address
    }

    function getPrice() public view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer * 10000000000); //ETH/USD rate in 18 digit
    }

    // 1000000000
    function getConversionRate(uint256 ethAmount)
        public
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
        return ethAmountInUsd;
    }
    
    function getEntranceFee() public view returns (uint256) {
        // minimumUSD
        uint256 minimumUSD = 50 * 10**18;
        uint256 price = getPrice();
        uint256 precision = 1 * 10**18;
        // return (minimumUSD * precision) / price;
        // We fixed a rounding error found in the video by adding one!
        return ((minimumUSD * precision) / price) + 1;
    }

    //run the "require" statement first before running withdraw
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function withdraw() public payable onlyOwner {
        // transfer eth of this contract to sender
        owner.transfer(address(this).balance);
        //update mapping of funders address=>amount to zero after withdrawing

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        //Resetting funders array
        funders = new address[](0);
    }
}
