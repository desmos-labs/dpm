import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ProfileHeader } from '../ProfileHeader';
import { LabeledValue } from '../LabeledValue';
import { Divider } from '../Divider';
import { MsgSaveProfile } from '@desmoslabs/proto/desmos/profiles/v1beta1/msgs_profile';
import { MsgSaveProfileEncodeObject } from '@desmoslabs/sdk-core';
import { AminoMsgSaveProfile } from '@desmoslabs/sdk-core';

export type SaveProfileMessageProps = {
	protobufObject?: MsgSaveProfile;
	encodeObject?: MsgSaveProfileEncodeObject['value'];
	aminoMessage?: AminoMsgSaveProfile['value'];
};

export const SaveProfileMessage: React.FC<SaveProfileMessageProps> = ({
	protobufObject,
	encodeObject,
	aminoMessage,
}) => {
	const { t } = useTranslation();

	const profilePicture = useMemo(() => {
		const profilePicture =
			protobufObject?.profilePicture ??
			encodeObject?.profilePicture ??
			aminoMessage?.profile_picture;
		if (
			profilePicture?.indexOf('http://') === 0 ||
			profilePicture?.indexOf('https://') === 0
		) {
			return profilePicture;
		} else {
			return undefined;
		}
	}, [
		encodeObject?.profilePicture,
		protobufObject?.profilePicture,
		aminoMessage?.profile_picture,
	]);

	const coverPicture = useMemo(() => {
		const coverPicture =
			protobufObject?.coverPicture ??
			encodeObject?.coverPicture ??
			aminoMessage?.cover_picture;

		if (
			coverPicture?.indexOf('http://') === 0 ||
			coverPicture?.indexOf('https://') === 0
		) {
			return coverPicture;
		} else {
			return undefined;
		}
	}, [
		encodeObject?.coverPicture,
		protobufObject?.coverPicture,
		aminoMessage?.cover_picture,
	]);

	return (
		<View>
			<ProfileHeader
				profilePictureUri={profilePicture}
				coverPictureUri={coverPicture}
			/>
			<LabeledValue
				label={t('dtag')}
				value={protobufObject?.dtag ?? encodeObject?.dtag ?? aminoMessage?.dtag}
			/>
			<Divider />
			<LabeledValue
				label={t('nickname')}
				value={
					protobufObject?.nickname ??
					encodeObject?.nickname ??
					aminoMessage?.dtag
				}
			/>
			<Divider />
			<LabeledValue
				label={t('bio')}
				value={protobufObject?.bio ?? encodeObject?.bio ?? aminoMessage?.bio}
			/>
		</View>
	);
};
