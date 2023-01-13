import { ApplicationLink, ChainLink, DesmosProfile } from 'types/desmos';
import { applicationLinkStateFromJSON } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links';

/**
 * Format an incoming chain link data from the server into a format that is easier to parse by the app.
 * @param {any} chainLink - Chain link data retrieved from the server.
 * @returns {ChainLink} - A formatted ChainLink object
 */
export const convertGraphQLChainLink = (chainLink: any) =>
  ({
    chainName: chainLink.chainConfig.name,
    externalAddress: chainLink.externalAddress,
    userAddress: chainLink.userAddress,
    proof: {
      plainText: chainLink.proof.plainText,
      signature: chainLink.proof.signature,
    },
    creationTime: new Date(`${chainLink.creationTime}Z`),
  } as ChainLink);

/**
 * Format an incoming application link data from the server into a format that is easier to parse by the app.
 * @param {any} applicationLink - Application link data retrieved from the server.
 * @return {ApplicationLink} - A formatted ApplicationLink object.
 */
export const convertGraphQLApplicationLink = (applicationLink: any) =>
  ({
    application: applicationLink.application,
    creationTime: new Date(Date.parse(applicationLink.creationTime)),
    state: applicationLinkStateFromJSON(applicationLink.state),
    username: applicationLink.username,
  } as ApplicationLink);

export const convertGraphQLProfile = (profile: any) => profile as DesmosProfile;
