import React from 'react';
import {Authorization} from 'types/authorization';
import {StyleProp, View, ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';
import Typography from 'components/Typography';

type AuthorizationListElementProps = {
  authorization: Authorization;
  style: StyleProp<ViewStyle>;
};

const AuthorizationListElement: React.FC<AuthorizationListElementProps> = (props) => {
  const { t } = useTranslation();
  const { authorization, style } = props;

  const expiration = authorization.expiration
    ? format(authorization.expiration, 'EEE MMM dd, yyyy')
    : t('never');

  return (
    <View style={style}>
      <Typography.Subtitle>{authorization.title}</Typography.Subtitle>

      {authorization.limit && (
        <Typography.Body>
          {t('limit')}: {authorization.limit}
        </Typography.Body>
      )}
      <Typography.Body>
        {t('expires on')}: {expiration}
      </Typography.Body>
    </View>
  );
};

export default AuthorizationListElement;
