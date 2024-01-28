import { formatEther, parseEther } from "viem";
import hre from "hardhat";

async function main() {
  const isMainnet = hre.network.name === "mainnet";

  const lockedAmount = parseEther("0.001");

  const mockToken = await hre.viem.deployContract("MockToken", []);

  const lock = await hre.viem.deployContract("MocoRush", [mockToken.address, unlockTime, lockedAmount]);

  console.log(
    `Lock with ${formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
