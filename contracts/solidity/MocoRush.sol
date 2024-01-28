// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
### 게임 규칙 및 메커니즘:

1. **어떻게 이기냐?**
    - 정해진 시간 안에 보유한 티켓을 사용해서 버튼을 누르는 게임
    - 게임 종료 전, 마지막으로 버튼을 누른 사람이 상금 풀의 50%를 가져감
    - 플레이어가 티켓을 사용하여 버튼을 누를 때마다, 게임의 종료 시간이 약간씩 연장됩니다.

    **참여자 상금 분배**:

    - 남은 상금 풀의 50% 중 10%는 다음 라운드 상금풀로 이관되며, 나머지 40%에 대해 모든 참여자 사이에 티켓 구매 비율에 따라 분배됩니다.
    - 예를 들어, 전체 게임에서 100개의 티켓이 팔렸고, 한 사람이 10개의 티켓을 구매했다면, 그 사람은 남은 상금 풀의 10%를 받게 됩니다.
2. **티켓 기반 참여**:
    - 플레이어들은 MOC 토큰을 사용하여 게임 티켓을 구매합니다. 각 티켓 구매는 게임의 '상금 풀'에 기여합니다.
    - Round 별 게임의 종료 시간은 무작위로 설정되며, 종료 시간 전까지 티켓을 구매할 수 있습니다.
3. **상금은 어디서?**
    - 이전 라운드의 상금 10%가 초기 베팅 금액으로 설정됩니다
    - 이후 해당 라운드 티켓 구매금액은 상금으로 모아지며, 일부 랜덤한 금액이 공급될 수도 있습니다(재단이나, 특정 누구의 donation에 의해서)
*/
contract MocoRush is Ownable {
    struct Round {
        uint256 index;
        uint256 startTime;
        uint256 endTime;
        uint256 prizePool;
        address lastButtonPresser;
        uint256 totalTicketsBought;
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
            totalTicketsBought: 0
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
                totalTicketsBought: 0
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
        if (claim.rewardType == RewardType.LAST_BUTTON_PRESS) {
            return round.prizePool * TICKET_PERCENTAGE_FOR_LAST_BUTTON_PRESSER / 100;
        }
        return round.prizePool
            * claim.ticketAmount / round.totalTicketsBought
            * TICKET_PERCENTAGE_FOR_DISTRIBUTION / 100;
    }
}
