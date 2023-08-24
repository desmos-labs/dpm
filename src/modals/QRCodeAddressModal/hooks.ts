import React from 'react';
import { ChainType } from 'types/chains';
import { generateUriActionUrl } from 'lib/UriActions';
import { UriActionType } from 'types/uri';

/**
 * Hook to generate the url that another user can use to view the profile or send
 * some tokens torward the user that generated it.
 * @param address - The address of the user.
 * @param chainType - The chain type of the user.
 */
export const useGenerateQrCodeUrl = (address: string, chainType: ChainType) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error>();
  const [url, setUrl] = React.useState<string>();

  const generateUrl = React.useCallback(async () => {
    setLoading(true);
    setUrl(undefined);
    setError(undefined);

    const generationResult = await generateUriActionUrl({
      type: UriActionType.Generic,
      address,
      chainType,
    });
    if (generationResult.isOk()) {
      setUrl(generationResult.value);
    } else {
      setError(generationResult.error);
    }

    setLoading(false);
  }, [address, chainType]);

  React.useEffect(() => {
    generateUrl();
  }, [generateUrl]);

  return {
    loading,
    url,
    error,
    regenerate: generateUrl,
  };
};
