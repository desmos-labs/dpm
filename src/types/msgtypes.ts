enum MsgTypes {
  MsgSend = '/cosmos.bank.v1beta1.MsgSend',
  MsgMultiSend = '/cosmos.bank.v1beta1.MsgMultiSend',
  MsgWithdrawDelegatorReward = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  MsgVote = '/cosmos.gov.v1beta1.MsgVote',
  MsgDelegate = '/cosmos.staking.v1beta1.MsgDelegate',
  MsgSaveProfile = '/desmos.profiles.v1beta1.MsgSaveProfile',
  MsgSaveProfileV2 = '/desmos.profiles.v2.MsgSaveProfile',
  MsgLinkChainAccount = '/desmos.profiles.v1beta1.MsgLinkChainAccount',
  MsgLinkChainAccountV2 = '/desmos.profiles.v2.MsgLinkChainAccount',
  MsgUnlinkChainAccount = '/desmos.profiles.v1beta1.MsgUnlinkChainAccount',
  MsgUnlinkChainAccountV2 = '/desmos.profiles.v2.MsgUnlinkChainAccount',
}

export default MsgTypes;
