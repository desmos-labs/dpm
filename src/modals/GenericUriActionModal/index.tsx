import React from 'react';
import { View } from 'react-native';
import { ModalComponentProps } from 'modals/ModalScreen';
import { GenericActionUri, UserAddressActionUri } from 'types/uri';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';

export type GenericUriActionModalParams = {
  /**
   * The received action.
   */
  readonly action: UserAddressActionUri | GenericActionUri;
};

/**
 * Component that shows a modal that let the user decide what to do
 * with the received {@link UserAddressActionUri} or {@link GenericActionUri}.
 */
const GenericUriActionModal: React.FC<ModalComponentProps<GenericUriActionModalParams>> = (
  props,
) => {
  const { closeModal, params } = props;
  const { action } = params;
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const sendToken = React.useCallback(() => {
    closeModal();
    navigation.navigate(ROUTES.SEND_TOKENS, {
      recipient: action.address,
      // @ts-ignore
      chainType: action.chainType,
    });
  }, [action, closeModal, navigation]);

  const showProfile = React.useCallback(() => {
    closeModal();
    navigation.navigate(ROUTES.PROFILE, {
      visitingProfile: action.address,
      // @ts-ignore
      chainType: action.chainType,
    });
  }, [action, closeModal, navigation]);

  return (
    <View>
      <Typography.H6>{t('select action')}</Typography.H6>

      <Spacer paddingVertical={8} />

      <Button mode={'text'} onPress={sendToken}>
        {t('send tokens')}
      </Button>
      <Spacer paddingVertical={4} />
      <Button mode={'text'} onPress={showProfile}>
        {t('show profile')}
      </Button>
    </View>
  );
};

export default GenericUriActionModal;
