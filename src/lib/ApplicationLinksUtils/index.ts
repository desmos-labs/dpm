import {
  discordApplicationIcon,
  domainApplicationIcon,
  githubApplicationIcon,
  twitterApplicationIcon,
  youtubeApplicationIcon,
} from 'assets/images';
import { ApplicationLink } from 'types/desmos';

// TODO: Move these inside DesmJS
export enum ExternalApplications {
  DISCORD = 'discord',
  DOMAIN = 'domain',
  GITHUB = 'github',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
}

export const isApplicationSupported = (link: ApplicationLink) =>
  Object.values<string>(ExternalApplications).includes(link.application);

export interface ApplicationData {
  readonly image: any;
  readonly url: string;
}

/**
 * Get the application data for the given link.
 * @throws an error if the given link's application is not supported.
 * @param link {ApplicationLink} - Link for which to get the data.
 */
export const getApplicationData = (link: ApplicationLink): ApplicationData => {
  switch (link.application) {
    case ExternalApplications.DISCORD:
      return {
        image: discordApplicationIcon,
        url: `https://discord.com/channels/@me/${link.username}`,
      };

    case ExternalApplications.DOMAIN:
      try {
        // Disable es lint since we create a URL object to validate the domain url.
        // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
        const { protocol } = new URL(link.username);
        return {
          image: domainApplicationIcon,
          url: link.username,
        };
      } catch (e) {
        return {
          image: domainApplicationIcon,
          url: `https://${link.username}`,
        };
      }

    case ExternalApplications.GITHUB:
      return {
        image: githubApplicationIcon,
        url: `https://github.com/${link.username}`,
      };

    case ExternalApplications.TWITTER:
      return {
        image: twitterApplicationIcon,
        url: `https://twitter.com/${link.username}`,
      };

    case ExternalApplications.YOUTUBE:
      return {
        image: youtubeApplicationIcon,
        url: `https://youtube.com/${link.username}`,
      };

    default:
      throw new Error(`Unsupported application: ${link.application}`);
  }
};
