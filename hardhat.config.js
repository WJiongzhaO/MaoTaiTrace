import hardhatEthersPlugin from "@nomicfoundation/hardhat-ethers";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin, hardhatEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.20",
      },
    },
  },
  networks: {
    localhost: {
      type: "http",
      chainId: 31337,
      url: "http://127.0.0.1:8545",
    },
    node: {
      type: "edr-simulated",
      chainType: "l1",
      chainId: 31337,
    },
  },
});
