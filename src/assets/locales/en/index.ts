import messages from './messages';
import account from './account.json';
import chainLinks from './chainLinks.json';
import common from './common.json';
import connectToLedger from './connectToLedger.json';
import landing from './landing.json';
import ledgerScan from './ledgerScan.json';
import legal from './legal.json';
import profile from './profile.json';
import sendTokens from './sendTokens.json';
import settings from './settings.json';
import transaction from './transaction.json';
import walletConnect from './walletConnect.json';
import web3auth from './web3auth.json';

const en = {
  account,
  chainLinks,
  common,
  connectToLedger,
  landing,
  ledgerScan,
  legal,
  profile,
  sendTokens,
  settings,
  transaction,
  walletConnect,
  web3auth,
  ...messages,
};

export default en;
