import authz from './authz.json';
import bank from './bank.json';
import common from './common.json';
import distribution from './distribution.json';
import gov from './gov.json';
import ibc from './ibc.json';
import posts from './posts.json';
import profiles from './profiles.json';
import reactions from './reactions.json';
import relationships from './relationships.json';
import reports from './reports.json';
import staking from './staking.json';
import subspaces from './subspaces.json';
import feegrant from './feegrant.json';
import unknown from './unknown.json';
import upgrade from './upgrade.json';

const messages = {
  'messages.authz': authz,
  'messages.bank': bank,
  'messages.common': common,
  'messages.distribution': distribution,
  'messages.gov': gov,
  'messages.ibc': ibc,
  'messages.posts': posts,
  'messages.profiles': profiles,
  'messages.reactions': reactions,
  'messages.relationships': relationships,
  'messages.reports': reports,
  'messages.staking': staking,
  'messages.subspaces': subspaces,
  'messages.feegrant': feegrant,
  'messages.unknown': unknown,
  'messages.upgrade': upgrade,
};

export default messages;
