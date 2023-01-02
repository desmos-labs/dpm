import React, { useMemo } from 'react';
import { Image } from 'react-native';
import useIsCurrentThemeDark from 'hooks/useIsCurrentThemeDark';
import {DpmImages} from 'types/images';

type ImageProps = React.ComponentProps<typeof Image>;

export type DPMImageProps = Omit<ImageProps, 'source'> & {
  source: DpmImages | ImageProps['source'];
};

const DpmImage: React.FC<DPMImageProps> = (props) => {
  const { source } = props;
  const darkTheme = useIsCurrentThemeDark();

  const imageSource = useMemo(() => {
    const typeOfSource = typeof source;

    if (typeOfSource === 'string') {
      switch (source as DpmImages) {
        case 'no-transaction':
          return darkTheme
            ? require('assets/images/noTransaction-dark.png')
            : require('assets/images/noProfile-light.png');
        case 'no-profile':
          return darkTheme
            ? require('assets/images/noProfile-dark.png')
            : require('assets/images/noProfile-light.png');
        case 'success':
          return darkTheme
            ? require('assets/images/resultSucess-dark.png')
            : require('assets/images/resultSucess-light.png');
        case 'password-success':
          return darkTheme
            ? require('assets/images/resultPasswordSuccess.png')
            : require('assets/images/resultPasswordSuccess.png');
        case 'fail':
          return darkTheme
            ? require('assets/images/resultFail-dark.png')
            : require('assets/images/resultFail-light.png');
        case 'no-connection':
          return darkTheme
            ? require('assets/images/noConnection-dark.png')
            : require('assets/images/noConnection-light.png');
        case 'connect-chain':
          return darkTheme
            ? require('assets/images/connectChain-dark.png')
            : require('assets/images/connectChain-light.png');
        case 'connect-mnemonic':
          return darkTheme
            ? require('assets/images/connectMnemonic-dark.png')
            : require('assets/images/connectMnemonic-light.png');
        case 'connect-ledger':
          return darkTheme
            ? require('assets/images/connectLedger-dark.png')
            : require('assets/images/connectLedger-light.png');
        case 'ledger':
          return require('assets/images/ledger.png');
        default:
          return require('assets/images/desmosIcon-white.png');
      }
    } else {
      return source;
    }
  }, [source, darkTheme]);

  return <Image {...props} source={imageSource} />;
};

export default DpmImage;
