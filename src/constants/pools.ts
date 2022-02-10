export const POOLS = {
  Pagination: {
    PerPage: 10
  },
  DelegateOwner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: ['0x0000000000000000000000000000000000000000']
  },
  BlockList: [''],
  ExcludedPoolTypes: ['Element', 'AaveLinear', 'Linear'],
  Stable: {
    AllowList: [
      '0x05af8fbfae654eb526059c653141d49ad6b3e7af000200000000000000000010',
      '0xcb983b242d5a24f9d564915eb01c661845f76383000200000000000000000008',
      '0x2ed0071c4c9d60f70eaeafec5e338a4e7b0488ef000200000000000000000013'
    ]
  },
  Investment: {
    AllowList: ['0x0000000000000000000000000000000000000000']
  },
  Factories: {
    '0x13a1d2a9f729cdc485050c53b79689ee9131d898': 'weightedPool',
    '0xb0bf8981b8f814cfba6507c84c8daa7487ae3c9a': 'stablePool',
    '0x949beae5ca469f7f5b9289fdd4f3df3d22286068': 'metaStablePool',
    '0x3609b8cb9e8ccc8fea2492dac82802337b6bc38f': 'weightedPool'
  }
};
