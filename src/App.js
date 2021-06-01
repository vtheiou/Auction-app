import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {contractBalance:0, highestBidder:null,highestBid: 0, web3: null, accounts: null, contract: null,current_bid:"" };

  componentDidMount = async () => {
    try {
      
      const web3 = await getWeb3();

      
      const accounts = await web3.eth.getAccounts();

      
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
    const current_bid = "";
    const contractBalance = await instance.methods.getContractBalance().call();

    const highest_bid = await instance.methods.getHighestBid().call();
    const highest_bid_addr = await instance.methods.getHighestBidderAddress().call();
    
      this.setState({ web3, accounts, contract: instance ,highestBid:highest_bid,highestBidder:highest_bid_addr,getContractBalance:contractBalance,current_bid:""});
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid_1 = async () => {
    const { accounts, contract,current_bid} = this.state;
    const bid_value = this.state.current_bid;
    await contract.methods.bid().send({ from: accounts[0],value:bid_value});

    const highest_bid = await contract.methods.getHighestBid().call(); 
    const highest_bid_addr = await contract.methods.getHighestBidderAddress().call(); 

    this.setState({ highestBid: highest_bid ,highestBidder:highest_bid_addr});
      
  };
  bid_2 = async () => {
    const { accounts, contract,current_bid} = this.state;
    const bid_value = this.state.current_bid;
    await contract.methods.bid().send({ from: accounts[0],value:value});
    
    const highest_bid = await contract.methods.getHighestBid().call();

    
    const highest_bid_addr = await contract.methods.getHighestBidderAddress().call();
    
    this.setState({ highestBid: highest_bid ,highestBidder:highest_bid_addr});
      
  };
  highestBid = async ()=>{
    const {accounts,contract} = this.state;

    const highestbid = await contract.methods.getHighestBid().call();
  }
  highestBidder = async () => {
    const {accounts,contract} = this.state;
    await contract.methods.getHighestBidderAddress().call();
    console.log(this.state);

  }
  withdraw = async () => {
     const {accounts,contract} = this.state;
     
     const contractBalance = await contract.methods.getContractBalance().call({from: accounts[0]});


     await contract.methods.withdraw().send({from:accounts[0]});
     
      
     console.log(this.state);
     this.setState({getContractBalance:contractBalance});
  }

  getContractBalance = async () =>{
    const {accounts,contract} = this.state;
    const contractBalance = await contract.methods.getContractBalance().call({from: accounts[0]});
    console.log(this.state.contractBalance);
    this.setState({getContractBalance:contractBalance});

  }
  myChangeHandler  = (event) => {
    this.setState({current_bid : event.target.value*1000000000000000000},() =>{
      console.log(this.state.current_bid);
    });
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Auction Dapp</h1>
        <div>Enter bid amount!</div>
        <input type="text"  onChange={this.myChangeHandler}/>
        <div>Enter for first bidder</div>
        <div>< button onClick={this.bid_1}> Bidder 1</button></div>
        <div>Enter for second bidder</div>
        <div><button onClick={this.bid_2}> Bidder 2</button></div>
        <div><button onClick={this.highestBid}>Get highestBid</button></div>
        <div>{this.state.highestBid}></div>
        <button onClick={this.highestBidder}>Get highestBidderAddress</button>
        <div>{this.state.highestBidder}></div>
        <button onClick={this.withdraw}>Withdraw</button>
        <div>{this.state.withdraw}</div>
        <button onClick={this.getContractBalance}>Contract Balance</button>
        <div>{this.state.getContractBalance}</div>
      </div>
    );
  }
}

export default App;
