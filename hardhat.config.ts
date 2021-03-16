import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "deploy proposal", async (args, hre) => {
  const Proposal = await hre.ethers.getContractFactory("ProposalTestnetSetup");
  const proposal = await Proposal.deploy();
  console.log("proposal", proposal.address);
});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.6.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.ETH_RPC_MAINNET,
      },
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : {
            mnemonic:
              "test test test test test test test test test test test junk",
          },
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : {
            mnemonic:
              "test test test test test test test test test test test junk",
          },
    },
  },
  mocha: {
    timeout: 600000,
  },
};

export default config;
