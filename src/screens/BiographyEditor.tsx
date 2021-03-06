import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, TextInput, TextStyle } from 'react-native';
import { Button, StyledSafeAreaView, TopBar } from '../components';
import useProfileValidators from '../hooks/useProfileValidators';
import { makeStyle } from '../theming';
import { AccountScreensStackParams } from '../types/navigation';
import { Typography } from '../components/typography';

export type Props = StackScreenProps<AccountScreensStackParams, 'BiographyEditor'>;

export const BiographyEditor: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { navigation, route } = props;
  const styles = useStyles();
  const { bioValidationParams } = useProfileValidators();
  const [bio, setBio] = useState(route.params.bio);
  const [charCount, setCharCount] = useState(bioValidationParams.maxLength - (bio?.length ?? 0));
  const charCountWarning = charCount <= 20;

  const onDonePressed = useCallback(() => {
    navigation.navigate({
      name: 'EditProfile',
      params: {
        bio: bio === undefined ? null : bio,
      },
      merge: true,
    });
  }, [navigation, bio]);

  const onTextChange = useCallback(
    (text: string) => {
      const allowedChars = bioValidationParams.maxLength - text.length;
      if (text.length === 0) {
        setBio(undefined);
        setCharCount(allowedChars);
      } else if (allowedChars >= 0) {
        setBio(text);
        setCharCount(allowedChars);
      } else {
        setBio(() => text.substring(0, bioValidationParams.maxLength));
        setCharCount(0);
      }
    },
    [bioValidationParams.maxLength]
  );

  const charCountStyle = useMemo(() => {
    if (charCountWarning) {
      return StyleSheet.compose(styles.charCount as StyleProp<TextStyle>, styles.charCountWarning);
    }
    return styles.charCount;
  }, [styles, charCountWarning]);

  return (
    <StyledSafeAreaView
      topBar={
        <TopBar
          stackProps={props}
          title={t('bio')}
          rightElement={
            <Button mode="text" onPress={onDonePressed}>
              {t('done')}
            </Button>
          }
        />
      }
      divider
    >
      <TextInput
        value={bio}
        style={styles.input}
        multiline
        onChangeText={onTextChange}
        placeholder={t('add a bio to your profile')}
      />
      <Typography.Body style={charCountStyle}>{charCount}</Typography.Body>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  input: {
    flexGrow: 1,
    textAlignVertical: 'top',
    color: theme.colors.font['1'],
    maxHeight: '85%',
  },
  charCount: {
    alignSelf: 'flex-end',
    right: 0,
    color: theme.colors.font['3'],
  },
  charCountWarning: {
    color: theme.colors.primary,
  },
}));
