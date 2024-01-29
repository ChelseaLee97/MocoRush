// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MocoRush is Ownable {
    struct Round {
        uint256 index;
        uint256 startTime;
        uint256 endTime;
        uint256 prizePool;
        address lastButtonPresser;
        uint256 totalTicketsBought;
        bool finished;
    }

    mapping (uint256 => mapping (address => uint256)) public playerTicketBalanceByRound;


    struct Player {
        RewardClaim[] claims;
        uint256 lastClaimIndex;
    }

    struct PlayerStateForRound {
        uint256 ticketBalance;
        uint256 ticketsUsed;
    }

    struct RewardClaim {
        RewardType rewardType;
        uint256 roundIndex;
        uint256 ticketAmount;
    }

    enum RewardType {
        DISTRIBUTION,
        LAST_BUTTON_PRESS
    }

    // Constants
    uint256 public constant REFERRAL_REWARD_FACTOR = 1; // Number of extra tickets for referral
    uint256 public constant TICKET_PERCENTAGE_FOR_LAST_BUTTON_PRESSER = 50; // 50% of ticket price goes to last button presser
    uint256 public constant TICKET_PERCENTAGE_FOR_DISTRIBUTION = 40; // 40% of prize pool is distributed among all players based on ticket count
    uint256 public constant TICKET_PERCENTAGE_FOR_NEXT_ROUND = 10; // 10% of prize pool is carried forward to next round

    // Variables
    IERC20 public token;
    uint256 public initialRoundTime;
    uint256 public roundTimeIncrement;

    mapping (address => Player) public players;
    Round[] public rounds;

    // Events
    event RoundStarted(uint256 roundIndex, uint256 startTime, uint256 endTime, uint256 prizePool);
    event RoundClosed(uint256 indexed roundIndex, address lastButtonPresser);
    event TicketsBought(address indexed player, uint256 indexed roundIndex, uint256 amount);
    event PrizeIncreased(uint256 indexed roundIndex, uint256 addedAmount, uint256 total);
    event ButtonPressed(address indexed player, uint256 indexed roundIndex, uint256 amount);
    event RewardClaimed(address indexed player, uint256 amount);
    event Donation(address indexed player, uint256 indexed roundIndex, uint256 amount);

    constructor(IERC20 _token, uint256 _initialRoundTime, uint256 _roundTimeIncrement) Ownable(msg.sender) {
        token = _token;
        initialRoundTime = _initialRoundTime;
        roundTimeIncrement = _roundTimeIncrement;
    }

    function startNewRound() public onlyOwner {
        require(rounds.length == 0 || block.timestamp > currentRound().endTime, "Round is still active");
        Round memory lastRound = currentRound();

        Round memory newRound = Round({
            index: rounds.length,
            startTime: block.timestamp,
            endTime: block.timestamp + initialRoundTime,
            prizePool: lastRound.prizePool * TICKET_PERCENTAGE_FOR_NEXT_ROUND / 100,
            lastButtonPresser: address(0),
            totalTicketsBought: 0,
            finished: false
        });
        rounds.push(newRound);

        emit RoundStarted(newRound.index, newRound.startTime, newRound.endTime, newRound.prizePool);
    }

    // To buy tickets
    function buyTickets(uint256 amount, address referral) public {
        require(token.transferFrom(msg.sender, address(this), amount), "Unable to transfer MOCO");
        require(block.timestamp < currentRound().endTime, "Round has ended");
        require(referral != msg.sender, "Cannot refer yourself");

        Round storage round = rounds[rounds.length - 1];
        round.prizePool += amount;
        round.totalTicketsBought += amount;
        playerTicketBalanceByRound[round.index][msg.sender] += amount;

        if (referral != address(0)) {
            playerTicketBalanceByRound[round.index][referral] += amount * REFERRAL_REWARD_FACTOR;
        }
        emit TicketsBought(msg.sender, round.index, amount);
        emit PrizeIncreased(round.index, amount, round.prizePool);
    }

    function donateToPrizePool(uint256 _amount) public {
        require(token.transferFrom(msg.sender, address(this), _amount), "Unable to transfer MOCO");
        require(block.timestamp < currentRound().endTime, "Round has ended");

        Round storage round = rounds[rounds.length - 1];
        round.prizePool += _amount;

        emit Donation(msg.sender, round.index, _amount);
        emit PrizeIncreased(round.index, _amount, round.prizePool);
    }

    function pressButton(uint256 _ticketAmountToUse) public {
        Round storage round = rounds[rounds.length - 1];
        require(block.timestamp < round.endTime, "Round has ended");
        require(ticketBalanceOf(msg.sender) >= _ticketAmountToUse, "Insufficient tickets");

        playerTicketBalanceByRound[round.index][msg.sender] -= _ticketAmountToUse;
        round.lastButtonPresser = msg.sender;
        round.endTime += roundTimeIncrement;

        players[msg.sender].claims.push(RewardClaim({
            rewardType: RewardType.DISTRIBUTION,
            roundIndex: round.index,
            ticketAmount: _ticketAmountToUse
        }));

        emit ButtonPressed(msg.sender, round.index, _ticketAmountToUse);
    }

    function closeRound() public onlyOwner {
        Round memory round = currentRound();
        require(block.timestamp > round.endTime, "Round is still active");

        rounds[round.index].finished = true;
        players[round.lastButtonPresser].claims.push(RewardClaim({
            rewardType: RewardType.LAST_BUTTON_PRESS,
            roundIndex: round.index,
            ticketAmount: 0
        }));
        emit RoundClosed(round.index, currentRound().lastButtonPresser);

        startNewRound();
    }

    function claimReward() public {
        uint256 totalClaimable = claimableRewardOf(msg.sender);
        require(totalClaimable > 0, "Nothing to claim");
        require(token.transfer(msg.sender, totalClaimable), "Insufficient balance on contract");

        Player storage player = players[msg.sender];
        player.lastClaimIndex = player.claims.length;

        emit RewardClaimed(msg.sender, totalClaimable);
    }

    /****************** VIEW FUNCTIONS ******************/

    function currentRound() public view returns (Round memory) {
        if (rounds.length == 0) {
            return Round({
                index: 0,
                startTime: 0,
                endTime: 0,
                prizePool: 0,
                lastButtonPresser: address(0),
                totalTicketsBought: 0,
                finished: false
            });
        }
        return rounds[rounds.length - 1];
    }

    function ticketBalanceOf(address _player) public view returns (uint256) {
        return playerTicketBalanceByRound[currentRound().index][_player];
    }

    function playerStateForCurrentRound(address _player) external view returns (PlayerStateForRound memory) {
        uint256 ticketsUsed = 0;
        Player storage player = players[_player];
        Round storage round = rounds[rounds.length - 1];
        for (uint256 i = player.lastClaimIndex; i < player.claims.length; i++) {
            if (player.claims[i].roundIndex == round.index && player.claims[i].rewardType == RewardType.DISTRIBUTION) {
                ticketsUsed += player.claims[i].ticketAmount;
            }
        }
        return PlayerStateForRound({
            ticketBalance: ticketBalanceOf(_player),
            ticketsUsed: ticketsUsed
        });
    }

    function claimableRewardOf(address _player) public view returns (uint256 totalClaimable) {
        Player storage player = players[_player];
        for (uint256 i = player.lastClaimIndex; i < player.claims.length; i++) {
            totalClaimable += calculateRewardAmountByClaim(player.claims[i]);
        }
        return totalClaimable;
    }

    function calculateRewardAmountByClaim(RewardClaim memory claim) internal view returns (uint256) {
        Round storage round = rounds[claim.roundIndex];
        if (!round.finished) {
            return 0;
        }
        if (claim.rewardType == RewardType.LAST_BUTTON_PRESS) {
            return round.prizePool * TICKET_PERCENTAGE_FOR_LAST_BUTTON_PRESSER / 100;
        }
        return round.prizePool
            * claim.ticketAmount / round.totalTicketsBought
            * TICKET_PERCENTAGE_FOR_DISTRIBUTION / 100;
    }
}
