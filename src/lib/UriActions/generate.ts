import axios from 'axios';
import { UriAction, UriActionType } from 'types/uri';
import { err, Result, ResultAsync } from 'neverthrow';
import { actionUriFromRecord } from 'lib/UriActions/parsing';
import { fromBase64 } from '@cosmjs/encoding';

const axiosInstance = axios.create({
  baseURL: 'http://57.128.144.235:33000/deep-links',
});

/**
 * Functions that generates a deep link from an {@link UriAction}.
 * @param uriAction - The action that will be used to generate the deep link.
 */
export const generateUriActionUrl = async (
  uriAction: UriAction,
): Promise<Result<string, Error>> => {
  switch (uriAction.type) {
    case UriActionType.Generic:
      return ResultAsync.fromPromise(
        axiosInstance
          .get(`${uriAction.address}?chain_type=${uriAction.chainType}`)
          .then((r) => r.data.deep_link as string),
        (e) => (e as Error) ?? Error('Error while generating uri'),
      );
    // TODO: Support the rest of the actions after we have the api documentation.
    default:
      return err(Error(`Unsupported URI action type: ${uriAction.type}`));
  }
};

/**
 * Function that resolves the {@link UriAction} from a give url.
 * @param url - The url from which the action will be resolved.
 */
export const resolveUriActionFromUrl = async (
  url: string,
): Promise<Result<UriAction | undefined, Error>> =>
  ResultAsync.fromPromise(
    axiosInstance
      .get(`config?url=${url}`)
      .then((r) => {
        const decodedData = Buffer.from(fromBase64(r.data.config.custom_data)).toString();
        const customData = JSON.parse(decodedData);
        return customData as Record<string, any>;
      })
      .then(actionUriFromRecord),
    (e) => (e as Error) ?? Error('Error while resolving uri'),
  );
