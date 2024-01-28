import hre from 'hardhat';

async function main() {
  const publicClient = await hre.viem.getPublicClient();

  // get current wallet
  const [deployer] = await hre.viem.getWalletClients();
  console.log(`Deployer Account: ${deployer.account.address}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(
    `Balance: ${await publicClient.getBalance({ address: deployer.account.address }).then((balance) => balance / BigInt(1e18))} ETH`,
  );

  const initialRoundTime = BigInt(86400); // 1 day
  const roundTimeIncrement = BigInt(3600); // 1 hour

  const isMainnet = hre.network.name === 'mainnet';
  if (isMainnet) {
    const mocTokenAddress = '0x6f3b2e99a6b9d2e6d3c6f5b2b9f867f3c5d6f68f';
    const mocoRush = await hre.viem.deployContract('MocoRush', [mocTokenAddress, initialRoundTime, roundTimeIncrement]);
    console.log(`MocoRush deployed to ${mocoRush.address}`);
    return;
  }
  const mockToken = await hre.viem.deployContract('MockToken', []);
  console.log(`MockToken deployed to ${mockToken.address}`);

  const mocoRush = await hre.viem.deployContract('MocoRush', [mockToken.address, initialRoundTime, roundTimeIncrement]);
  console.log(`MocoRush deployed to ${mocoRush.address}`);
  console.log('Set MOCORUSH_ADDRESS_SEPOLIA in .env to the above address.');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
