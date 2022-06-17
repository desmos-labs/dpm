import React, { useMemo } from 'react';
import { Image } from 'react-native';
import useIsCurrentThemeDark from '../hooks/useIsCurrentThemeDark';

type ImageProps = React.ComponentProps<typeof Image>;

export type DpmImages =
  | 'no-transaction'
  | 'no-profile'
  | 'success'
  | 'fail'
  | 'no-connection'
  | 'connect-chain'
  | 'connect-mnemonic'
  | 'connect-ledger'
  | 'password-success'
  | 'ledger';

export type Props = Omit<ImageProps, 'source'> & {
  source: DpmImages | ImageProps['source'];
};

export const DpmImage: React.FC<Props> = (props) => {
  const { source } = props;
  const darkTheme = useIsCurrentThemeDark();

  const imageSource = useMemo(() => {
    const typeOfSource = typeof source;

    if (typeOfSource === 'string') {
      switch (source as DpmImages) {
        case 'no-transaction':
          return darkTheme
            ? require('../assets/no-transaction-dark.png')
            : require('../assets/no-profile-light.png');
        case 'no-profile':
          return darkTheme
            ? require('../assets/no-profile-dark.png')
            : require('../assets/no-profile-light.png');
        case 'success':
          return darkTheme
            ? require('../assets/result-sucess-dark.png')
            : require('../assets/result-sucess-light.png');
        case 'password-success':
          return darkTheme
            ? require('../assets/result-password-success.png')
            : require('../assets/result-password-success.png');
        case 'fail':
          return darkTheme
            ? require('../assets/result-fail-dark.png')
            : require('../assets/result-fail-light.png');
        case 'no-connection':
          return darkTheme
            ? require('../assets/no-connection-dark.png')
            : require('../assets/no-connection-light.png');
        case 'connect-chain':
          return darkTheme
            ? require('../assets/connect_chain_dark.png')
            : require('../assets/connect_chain_light.png');
        case 'connect-mnemonic':
          return darkTheme
            ? require('../assets/connect_mnemonic_dark.png')
            : require('../assets/connect_mnemonic_light.png');
        case 'connect-ledger':
          return darkTheme
            ? require('../assets/connect_ledger_dark.png')
            : require('../assets/connect_ledger_light.png');
        case 'ledger':
          return require('../assets/ledger.png');
        default:
          return require('../assets/desmos-icon.png');
      }
    } else {
      return source;
    }
  }, [source, darkTheme]);

  return <Image {...props} source={imageSource} />;
};
