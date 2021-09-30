import {StyledSafeAreaView} from "../components";
import {makeStyle} from "../theming";
import {IconButton} from "react-native-paper";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, AppDrawerParams} from "../types/navigation";
import React, {useCallback, useMemo} from 'react';
import {ProfileHeader} from "../components/ProfileHeader";
import {CompositeScreenProps} from "@react-navigation/native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import useFetchProfile from "../hooks/useFetchProfile";


type Props = CompositeScreenProps<StackScreenProps<AccountScreensStackParams, "Account">,
    DrawerScreenProps<AppDrawerParams>>;

export default function Account(props: Props): JSX.Element {

    const {navigation} = props;
    const classes = useStyles();
    const account = props.route.params.account;
    const profile = useFetchProfile(account.address);

    const drawerIconButton = useMemo(() => {
        return <IconButton icon="menu" color="#fff" onPress={() => {
            navigation.openDrawer();
        }}/>
    }, [navigation]);

    const editProfile = useCallback(() => {
        navigation.navigate({
            name: "EditProfile",
            params: {
                account,
                currentProfile: profile,
            }
        })
    }, [navigation, profile, account]);

    return <StyledSafeAreaView
        style={classes.root}
    >
        <ProfileHeader
            accountAddress={account.address}
            profile={profile}
            openProfileEdit={editProfile}
            topLeftElement={drawerIconButton}
        />

    </StyledSafeAreaView>
}

const useStyles = makeStyle(_ => ({
    root: {
        padding: 0,
    },
}))