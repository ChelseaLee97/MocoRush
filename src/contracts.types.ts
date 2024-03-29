//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MocoRush
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mocoRushAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_initialRoundTime', internalType: 'uint256', type: 'uint256' },
      { name: '_roundTimeIncrement', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'OwnableInvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'player', internalType: 'address', type: 'address', indexed: true },
      { name: 'roundIndex', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ButtonPressed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'player', internalType: 'address', type: 'address', indexed: true },
      { name: 'roundIndex', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Donation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roundIndex', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'addedAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'total', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'PrizeIncreased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'player', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'RewardClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roundIndex', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'lastButtonPresser', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'RoundClosed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roundIndex', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'startTime', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'endTime', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'prizePool', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'RoundStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'player', internalType: 'address', type: 'address', indexed: true },
      { name: 'roundIndex', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TicketsBought',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REFERRAL_REWARD_FACTOR',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TICKET_PERCENTAGE_FOR_DISTRIBUTION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TICKET_PERCENTAGE_FOR_LAST_BUTTON_PRESSER',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TICKET_PERCENTAGE_FOR_NEXT_ROUND',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'referral', internalType: 'address', type: 'address' },
    ],
    name: 'buyTickets',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'function', inputs: [], name: 'claimReward', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [{ name: '_player', internalType: 'address', type: 'address' }],
    name: 'claimableRewardOf',
    outputs: [{ name: 'totalClaimable', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'closeRound', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'currentRound',
    outputs: [
      {
        name: '',
        internalType: 'struct MocoRush.Round',
        type: 'tuple',
        components: [
          { name: 'index', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
          { name: 'lastButtonPresser', internalType: 'address', type: 'address' },
          { name: 'totalTicketsBought', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'donateToPrizePool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialRoundTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_player', internalType: 'address', type: 'address' }],
    name: 'playerStateForCurrentRound',
    outputs: [
      {
        name: '',
        internalType: 'struct MocoRush.PlayerStateForRound',
        type: 'tuple',
        components: [
          { name: 'ticketBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'ticketsUsed', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'playerTicketBalanceByRound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'players',
    outputs: [{ name: 'lastClaimIndex', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_ticketAmountToUse', internalType: 'uint256', type: 'uint256' }],
    name: 'pressButton',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'function', inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'roundTimeIncrement',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'rounds',
    outputs: [
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'endTime', internalType: 'uint256', type: 'uint256' },
      { name: 'prizePool', internalType: 'uint256', type: 'uint256' },
      { name: 'lastButtonPresser', internalType: 'address', type: 'address' },
      { name: 'totalTicketsBought', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'startNewRound', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [{ name: '_player', internalType: 'address', type: 'address' }],
    name: 'ticketBalanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
