import React from 'react';
import DpmImage from 'components/DPMImage';
import { DPMImages } from 'types/images';
import Typography from 'components/Typography';
import Button from 'components/Button';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface Props {
  readonly canEdit: boolean;
  readonly createNewLink: () => any;
}

const NoChainLinks: React.FC<Props> = ({ canEdit, createNewLink }) => {
  const styles = useStyles();
  const { t } = useTranslation('chainLinks');

  return canEdit ? (
    <View style={styles.noConnectionsContainer}>
      {/* No connection icon */}
      <DpmImage
        style={styles.noConnectionImage}
        resizeMode="cover"
        source={DPMImages.NoConnection}
      />

      {/* Option to connect a chain */}
      <Typography.Body>{t('connect your chain account')}</Typography.Body>
      <Button style={styles.connectChainButton} onPress={createNewLink} mode="outlined">
        {t('connect chain')}
      </Button>
    </View>
  ) : null;
};

export default NoChainLinks;
