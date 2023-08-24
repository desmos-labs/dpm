import messages from './messages';
import components from './components';
import account from './account.json';
import chainLinks from './chainLinks.json';
import common from './common.json';
import connectToLedger from './connectToLedger.json';
import dataIntegrity from './dataIntegrity.json';
import governance from './governance.json';
import landing from './landing.json';
import ledger from './ledger.json';
import legal from './legal.json';
import manageStaking from './manageStaking.json';
import notificationChannels from './notificationChannels.json';
import profile from './profile.json';
import restaking from './restaking.json';
import selectNewMnemonicLength from './selectNewMnemonicLength.json';
import selectValidator from './selectValidator.json';
import sendTokens from './sendTokens.json';
import settings from './settings.json';
import stake from './stake.json';
import staking from './staking.json';
import transaction from './transaction.json';
import unbonding from './unbonding.json';
import uriActions from './uriActions.json';
import validatorDetails from './validatorDetails.json';
import walletConnect from './walletConnect.json';
import web3auth from './web3auth.json';

const en = {
  account,
  chainLinks,
  common,
  connectToLedger,
  dataIntegrity,
  governance,
  landing,
  ledger,
  legal,
  manageStaking,
  notificationChannels,
  profile,
  restaking,
  selectNewMnemonicLength,
  selectValidator,
  sendTokens,
  settings,
  stake,
  staking,
  transaction,
  unbonding,
  uriActions,
  validatorDetails,
  walletConnect,
  web3auth,
  ...messages,
  ...components,
};

export default en;
