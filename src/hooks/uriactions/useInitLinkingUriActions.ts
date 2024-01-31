import { setCachedUriAction, parseNativeActionUri } from 'lib/UriActions';
import React from 'react';
import { Linking } from 'react-native';

/**
 * Hook that initialize the logic to handle the
 * actions received from the Linking library.
 */
const useInitLinkingUriActions = () => {
  const handleLinkingUrl = React.useCallback((url: string | null) => {
    if (url) {
      const action = parseNativeActionUri(url);
      if (action) {
        setCachedUriAction(action);
      }
    }
  }, []);

  React.useEffect(() => {
    // Handle the uri that has triggered the app open.
    Linking.getInitialURL().then(handleLinkingUrl);

    // Handle the uri received while the app was
    // in the background.
    const listener = Linking.addEventListener('url', ({ url }) => {
      handleLinkingUrl(url);
    });

    return () => listener.remove();
  }, [handleLinkingUrl]);
};

export default useInitLinkingUriActions;
