import { loadFixture, time } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';
import { getAddress } from 'viem';

const DAY = 86400;
const HOUR = 3600;
const NULL_ADDR = '0x0000000000000000000000000000000000000000';

describe('MocoRush', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMocoRushFixture() {
    const initialRoundTime = BigInt(DAY);
    const roundTimeIncrement = BigInt(HOUR);

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const mocToken = await hre.viem.deployContract('MockToken', []);
    const mocoRush = await hre.viem.deployContract('MocoRush', [
      mocToken.address,
      initialRoundTime,
      roundTimeIncrement,
    ]);
    await mocToken.write.approve([mocoRush.address, BigInt(100_000_000) * BigInt(1e18)]);
    const publicClient = await hre.viem.getPublicClient();

    return {
      mocoRush,
      mocToken,
      initialRoundTime,
      roundTimeIncrement,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe('Deployment', function () {
    it('Should set the right initial round time', async function () {
      const { mocoRush, initialRoundTime } = await loadFixture(deployMocoRushFixture);

      expect(await mocoRush.read.initialRoundTime()).to.equal(initialRoundTime);
    });

    it('Should set the right owner', async function () {
      const { mocoRush, owner } = await loadFixture(deployMocoRushFixture);

      expect(await mocoRush.read.owner()).to.equal(getAddress(owner.account.address));
    });
  });

  describe('Round', function () {
    describe('startNewRound()', function () {
      it('Should start a initial round', async function () {
        const { mocoRush, initialRoundTime, publicClient } = await loadFixture(deployMocoRushFixture);

        const txId = await mocoRush.write.startNewRound();
        await publicClient.waitForTransactionReceipt({ hash: txId });

        const roundStartedEvents = await mocoRush.getEvents.RoundStarted();
        expect(roundStartedEvents).to.have.lengthOf(1);
        expect(roundStartedEvents[0].args.roundIndex).to.equal(BigInt(0));

        const currentRound = await mocoRush.read.currentRound();
        expect(currentRound.index).to.equal(BigInt(0));
        expect(currentRound.endTime - currentRound.startTime).to.equal(initialRoundTime);
      });

      it('should reject if called by non-owner', async function () {
        const { mocoRush, otherAccount } = await loadFixture(deployMocoRushFixture);

        await expect(mocoRush.write.startNewRound({ account: otherAccount.account })).to.be.rejectedWith(
          'OwnableUnauthorizedAccount',
        );
      });

      it('should reject if it started before the previous round ended', async function () {
        const { mocoRush } = await loadFixture(deployMocoRushFixture);

        await expect(mocoRush.write.startNewRound()).to.be.fulfilled;
        await expect(mocoRush.write.startNewRound()).to.be.rejectedWith('Round is still active');
      });
    });

    describe('buyTickets(uint256 amount, address referral)', function () {
      it('should buy tickets', async function () {
        const { mocoRush, mocToken, publicClient, owner } = await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();

        const initialBalance = await mocToken.read.balanceOf([owner.account.address]);

        const amount = BigInt(2 * 1e18);
        const txId = await mocoRush.write.buyTickets([amount, NULL_ADDR]);
        await publicClient.waitForTransactionReceipt({ hash: txId });

        const ticketsBoughtEvent = await mocoRush.getEvents.TicketsBought();
        expect(ticketsBoughtEvent).to.have.lengthOf(1);
        expect(ticketsBoughtEvent[0].args.player).to.equal(getAddress(owner.account.address));
        expect(ticketsBoughtEvent[0].args.roundIndex).to.equal(BigInt(0));
        expect(ticketsBoughtEvent[0].args.amount).to.equal(amount);

        // check that the round's total tickets bought is increased
        const currentRound = await mocoRush.read.currentRound();
        expect(currentRound.totalTicketsBought).to.equal(amount);
        expect(await mocToken.read.balanceOf([mocoRush.address])).to.equal(amount);

        // check that the ticket balance is increased
        const myTickets = await mocoRush.read.ticketBalanceOf([owner.account.address]);
        expect(myTickets).to.equal(amount);

        // check that the tokens were transferred
        const myTokenBalance = await mocToken.read.balanceOf([owner.account.address]);
        expect(myTokenBalance).to.equal(initialBalance - amount);
      });

      it("should increase referrer's ticket amount", async function () {
        const { mocoRush, mocToken, publicClient, owner, otherAccount } = await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();

        const initialBalance = await mocToken.read.balanceOf([owner.account.address]);

        const amount = BigInt(2 * 1e18);
        const referral = otherAccount.account.address;

        const txId = await mocoRush.write.buyTickets([amount, referral]);
        await publicClient.waitForTransactionReceipt({ hash: txId });

        const myTickets = await mocoRush.read.ticketBalanceOf([owner.account.address]);
        expect(myTickets).to.equal(amount);

        const otherTickets = await mocoRush.read.ticketBalanceOf([referral]);
        expect(otherTickets).to.equal(amount);
      });

      it('should reject after the round ends', async function () {
        const { mocoRush, initialRoundTime } = await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();

        await time.increase(initialRoundTime);
        await expect(mocoRush.write.buyTickets([BigInt(1e18), NULL_ADDR])).to.be.rejectedWith('Round has ended');
      });

      it('should reject if the amount is greater than the current MOC balance', async function () {
        const { mocoRush, mocToken, owner } = await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();

        const balance = await mocToken.read.balanceOf([owner.account.address]);
        await expect(mocoRush.write.buyTickets([balance + BigInt(1), NULL_ADDR])).to.be.rejectedWith(
          'ERC20InsufficientBalance',
        );
      });
    });

    describe('pressButton(uint256 _ticketAmountToUse)', function () {
      it('should press button', async function () {
        const { mocoRush, publicClient, owner, initialRoundTime, roundTimeIncrement } =
          await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();

        const amount = BigInt(2 * 1e18);
        await mocoRush.write.buyTickets([amount, NULL_ADDR]);

        const txId = await mocoRush.write.pressButton([amount]);
        await publicClient.waitForTransactionReceipt({ hash: txId });

        const buttonPressedEvents = await mocoRush.getEvents.ButtonPressed();
        expect(buttonPressedEvents).to.have.lengthOf(1);
        expect(buttonPressedEvents[0].args.player).to.equal(getAddress(owner.account.address));
        expect(buttonPressedEvents[0].args.roundIndex).to.equal(BigInt(0));
        expect(buttonPressedEvents[0].args.amount).to.equal(amount);

        const currentRound = await mocoRush.read.currentRound();
        expect(currentRound.lastButtonPresser).to.equal(getAddress(owner.account.address));
        expect(currentRound.prizePool).to.equal(amount);

        // check that the round time is increased
        const expectedEndTime = currentRound.startTime + initialRoundTime + roundTimeIncrement;
        expect(currentRound.endTime).to.equal(expectedEndTime);

        const myTickets = await mocoRush.read.ticketBalanceOf([owner.account.address]);
        expect(myTickets).to.equal(BigInt(0));

        // reward should be 0, until the round ends
        const myReward = await mocoRush.read.claimableRewardOf([owner.account.address]);
        expect(myReward).to.equal(BigInt(0));
      });

      it('should reject if the amount is greater than the current ticket balance', async function () {
        const { mocoRush, mocToken, owner } = await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();

        const balance = await mocToken.read.balanceOf([owner.account.address]);
        await expect(mocoRush.write.pressButton([balance + BigInt(1)])).to.be.rejectedWith('Insufficient tickets');
      });

      it('should reject if the round has ended', async function () {
        const { mocoRush, initialRoundTime } = await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();

        await time.increase(initialRoundTime);
        await expect(mocoRush.write.pressButton([BigInt(1e18)])).to.be.rejectedWith('Round has ended');
      });
    });

    describe('closeRound()', function () {
      it('should close the round', async function () {
        const { mocoRush, publicClient, initialRoundTime, owner } = await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();

        const amount = BigInt(2 * 1e18);
        await mocoRush.write.buyTickets([amount, NULL_ADDR]);
        await mocoRush.write.pressButton([amount]);

        await time.increase(2 * DAY);

        const txId = await mocoRush.write.closeRound();
        await publicClient.waitForTransactionReceipt({ hash: txId });

        const roundClosedEvents = await mocoRush.getEvents.RoundClosed();
        expect(roundClosedEvents).to.have.lengthOf(1);
        expect(roundClosedEvents[0].args.roundIndex).to.equal(BigInt(0));

        // should elect the last button presser as the winner
        // so reward should be 90% - (50%: last button presser, 40%: distribution pro-rata to tickets bought)
        expect(await mocoRush.read.claimableRewardOf([owner.account.address])).to.equal((amount * 90n) / 100n);

        // should start a new round
        const currentRound = await mocoRush.read.currentRound();
        expect(currentRound.index).to.equal(BigInt(1));

        // should reserve 10% of the prize pool for the next round
        expect(currentRound.prizePool).to.equal((amount * 1n) / 10n);
      });

      it('should reject if the round has not ended', async function () {
        const { mocoRush } = await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();
        await expect(mocoRush.write.closeRound()).to.be.rejectedWith('Round is still active');
      });
    });

    describe('claimReward()', function () {
      it('should claim reward', async function () {
        const { mocoRush, publicClient, owner } = await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();

        const amount = BigInt(2 * 1e18);
        await mocoRush.write.buyTickets([amount, NULL_ADDR]);
        await mocoRush.write.pressButton([amount]);

        await time.increase(2 * DAY);

        await mocoRush.write.closeRound();

        const txId = await mocoRush.write.claimReward();
        await publicClient.waitForTransactionReceipt({ hash: txId });

        const rewardClaimedEvents = await mocoRush.getEvents.RewardClaimed();
        expect(rewardClaimedEvents).to.have.lengthOf(1);
        expect(rewardClaimedEvents[0].args.player).to.equal(getAddress(owner.account.address));
        expect(rewardClaimedEvents[0].args.amount).to.equal((amount * 90n) / 100n);

        // claimable reward should be 0 after claiming
        const myReward = await mocoRush.read.claimableRewardOf([owner.account.address]);
        expect(myReward).to.equal(BigInt(0));
      });

      it('calling it twice should revert', async function () {
        const { mocoRush, publicClient, owner } = await loadFixture(deployMocoRushFixture);
        await mocoRush.write.startNewRound();

        const amount = BigInt(2 * 1e18);
        await mocoRush.write.buyTickets([amount, NULL_ADDR]);
        await mocoRush.write.pressButton([amount]);

        await time.increase(2 * DAY);

        await mocoRush.write.closeRound();

        await mocoRush.write.claimReward();
        await expect(mocoRush.write.claimReward()).to.be.rejectedWith('Nothing to claim');
      });
    });
  });

  describe('claimableRewardOf()', function () {
    it('should return the correct claimable reward', async function () {
      const { mocoRush, publicClient, owner } = await loadFixture(deployMocoRushFixture);
      await mocoRush.write.startNewRound();

      const amount = BigInt(2 * 1e18);
      await mocoRush.write.buyTickets([amount, NULL_ADDR]);
      await mocoRush.write.pressButton([amount]);

      // reward should be 0, until the round ends
      expect(await mocoRush.read.claimableRewardOf([owner.account.address])).to.equal(BigInt(0));

      await time.increase(2 * DAY);

      await mocoRush.write.closeRound();

      // now reward should be 90% of the prize pool
      const myReward = await mocoRush.read.claimableRewardOf([owner.account.address]);
      expect(myReward).to.equal((amount * 90n) / 100n);
    });
  });
});
