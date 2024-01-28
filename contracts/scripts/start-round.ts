import hre from 'hardhat';
import { Address } from 'viem';

async function main() {
  const publicClient = await hre.viem.getPublicClient();
  const mocoRush = await hre.viem.getContractAt('MocoRush', process.env.MOCORUSH_ADDRESS_SEPOLIA as Address);

  const hash = await mocoRush.write.startNewRound();
  await publicClient.waitForTransactionReceipt({ hash });

  const currentRound = await mocoRush.read.currentRound();
  console.log(`Started round #${currentRound.index}`);
  console.log(` - Start Time: ${new Date(Number(currentRound.startTime) * 1000).toISOString()}`);
  console.log(` - End Time: ${new Date(Number(currentRound.endTime) * 1000).toISOString()}`);
  console.log(` - Current Prize Pool: ${currentRound.prizePool / BigInt(1e18)} MOC`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
