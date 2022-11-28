import React, {Component} from 'react'
import Web3 from 'web3'
import logo from './logo.svg';
import './App.css';

// add a new comment
//import votingArtifact from "../../build/contracts/Voting.json";
//1.) start ganache (include new DNS)
//2.) update truffle-config wtih dns
//2.) deploy contract
//3.) copy over new Voting
//4.) update DNS in DAPP
//5.) npm start
class App extends Component {
	componentWillMount(){
		this.loadBlockchainData()
	}

  async loadBlockchainData(){
        const web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-44-242-153-146.us-west-2.compute.amazonaws.com:8545"))
	 //this.setState( { web3 } )
         var account;
         const accounts  = await web3.eth.getAccounts()
	 console.log(accounts)
	     web3.eth.getAccounts().then((f) => {
             account = f[0];
         })

         //just copy the json file to the src directory
         const networkId = await web3.eth.net.getId();
	 this.setState( { account : accounts[0] }) 
	 console.log(account);
         let jsonData = require('./Hello.json');
         var networkKey =  Object.keys(jsonData['networks'])[Object.keys(jsonData.networks).length-1] 
         const contract = new web3.eth.Contract(jsonData.abi); 
         contract.options.address = jsonData['networks'][networkId]["address"]
         this.setState( { contract }) 
	}

     constructor(props){
	  	super(props)
		console.log("constructor")
	  	this.state = {
			account: '',
			loading: true,
			message: ''
		}
     }

     setHandler = (event) => {
         event.preventDefault();
   	console.log('sending ' + event.target.setText.value + ' to the contract');
		this.state.contract.methods.set(event.target.setText.value).send({ from: this.state.account });
	}

	getCurrentVal = async () => {
		 let val = await this.state.contract.methods.get().call(console.log);
                 this.setState( { message : val })
	 }	
	

	
render(){	

	return (
		<div>

		<h5>message output: {this.state.message}</h5>
		<h4> {"Get/Set Contract interaction"} </h4>
			<form onSubmit={this.setHandler}>
				<input id="setText" type="text"/>
				<button type={"submit"}> Update Contract </button>
			</form>
			<div>
			<button onClick={this.getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button>
			</div>
		</div>
	);
}
}

export default App;
