import { applicationLinkStateFromJSON } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links';
import { ApplicationLink } from 'types/desmos';

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
  }) as ApplicationLink;
