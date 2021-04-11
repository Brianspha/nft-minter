import { KeyPair } from "near-api-js";

require("dotenv").config();
const nearAPI = require("near-api-js");

const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const ethers = require("ethers");
// …
const { connect, keyStores, Contract, WalletConnection, keyPair } = nearAPI;
/*
const CONTRACT_INFO = require('../contracts.json');
const INFURA_KEY = process.env.INFURA_API_KEY
const MNEMONIC = process.env.MNEMONIC
const NETWORK = CONTRACT_INFO.name;
const CONTRACT_ABI = CONTRACT_INFO.contracts.ERC1155Opensea.abi;
const CONTRACT_ADDRESS = CONTRACT_INFO.contracts.ERC1155Opensea.address;
const OWNER_ADDRESS = ethers.Wallet.fromMnemonic(MNEMONIC).address;
*/
const BLOCKCHAIN = process.env.BLOCKCHAIN;

let RPC_URL;
let nearProvider;
let config;
let near;
let wallet;
let account;
let contract;
switch (BLOCKCHAIN) {
  /*case "ETH":
    if (NETWORK == 'localhost')
    {
        RPC_URL = "http://localhost:8545/";
    }
    
    else
    {
        RPC_URL = `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`;
    }
  break */
  case "NEAR":
    const keyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY = process.env.NEAR_PRIVATE_KEY;
    // creates a public / private key pair using the provided private key
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    // adds the keyPair you created to keyStore
    keyStore
      .setKey("testnet", "process.env.NEAR_ACCOUNT", keyPair)
      .then(async (results) => {
        // console.log("set key: ", results);
        config = {
          networkId: "testnet",
          keyStore, // optional if not signing transactions
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
        };

        near = await connect(config);
        // console.log("near init: ", near);
        account = await near.account(process.env.NEAR_ACCOUNT);
        // console.log("addedAccount: ", addedAccount);
        contract = new Contract(
          account, // name of account that is connecting
          process.env.NEAR_CONTRACT_URL, // config object from initial connection
          {
            // name of contract you're connecting to
            viewMethods: [
              "total_supply",
              "is_approved_or_owner",
              "is_approved_for_all",
              "token_exists",
              "owner_of",
            ], // view methods do not change state but usually return a value
            changeMethods: [
              "mint",
              "get_approved",
              "set_approval_for_all",
              "grant_access",
              "revoke_access",
              "transfer_from",
            ], // change methods modify state
            sender: account, // account object to initialize and sign transactions.
          }
        );
        
      });

    break;
}

/*const provider = new HDWalletProvider(MNEMONIC, RPC_URL);
const web3Instance = new web3(provider);
*/
export async function mintNFT(tokenid, address) {
  var result;
  switch (BLOCKCHAIN) {
    case "NEAR":
       result= await contract.mint(address);
      break;
  }
  /*
  const nftContract = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, { gasLimit: "1000000" })

  let result;

  try {
    console.log("Minting Token " + tokenid + " to " + address + "...");
    let mintResult = await nftContract.methods.mint(address, tokenid, 1, []).send({ from: OWNER_ADDRESS });
    let newBalance = await nftContract.methods.balanceOf(address, tokenid).call();
 
    result = {
      transactionHash: mintResult.transactionHash,
      newBalance
    }

    console.log(result);


  } catch (e)
  {
    console.log(e);
    result = e.toString();
  } */

  return result;

}
