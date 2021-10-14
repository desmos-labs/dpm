import React, {useCallback, useEffect, useMemo} from "react";
import {FlatList, Image, ListRenderItemInfo, StyleProp, View, ViewStyle} from "react-native";
import {AccountScreensStackParams} from "../types/navigation";
import {StackScreenProps} from "@react-navigation/stack";
import {Button, Divider, Paragraph, StyledSafeAreaView, Subtitle, TopBar} from "../components";
import {useTranslation} from "react-i18next";
import useWalletConnectRequestApproveTs from "../hooks/useWalletConnectSessionApprove";
import useWalletConnectSessionReject from "../hooks/useWalletConnectSessionReject";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";
import useSelectedAccount from "../hooks/useSelectedAccount";
import useNavigateToAccountScreen from "../hooks/useNavigateToAccountScreen";
import useUnlockWallet from "../hooks/useUnlockWallet";
import {makeStyle} from "../theming";
import {format} from "date-fns"
import useShowModal from "../hooks/useShowModal";
import {SingleButtonModal} from "../modals/SingleButtonModal";

type Authorization = {
    title: string,
    limit?: string,
    expiration?: Date,
}

type Props = StackScreenProps<AccountScreensStackParams, "AuthorizeSession">;

export default function AuthorizeSession(props: Props) {
    const {sessionRequestDetails} = props.route.params
    const {t} = useTranslation()
    const styles = useStyles();
    const [approveStatus, approve] = useWalletConnectRequestApproveTs();
    const [rejectStatus, reject] = useWalletConnectSessionReject();
    const selectedAccount = useSelectedAccount();
    const currentChain = useCurrentChainInfo();
    const navigateToProfileScreen = useNavigateToAccountScreen();
    const unlockWallet = useUnlockWallet();
    const openModal = useShowModal();

    const appName = useMemo(() => {
        return sessionRequestDetails.peerMeta?.name ?? "Unknown app";
    }, [sessionRequestDetails])

    const dappIcon = useMemo(() => {
        const icons = sessionRequestDetails.peerMeta?.icons;
        if (icons !== undefined && icons.length > 0) {
            const iconUri = icons[0];
            if (icons.indexOf("http") === 0) {
                return {
                    uri: iconUri
                }
            } else {
                return require("../assets/desmos-icon-orange.png");
            }
        } else {
            return require("../assets/desmos-icon-orange.png");
        }
    }, [sessionRequestDetails])

    const onDeny = useCallback(() => {
        reject(sessionRequestDetails.sessionId);
    }, [reject, sessionRequestDetails]);

    const onGrant = useCallback(async () => {
        const wallet = await unlockWallet(selectedAccount.address);
        if (wallet !== null) {
            approve(sessionRequestDetails.sessionId, [selectedAccount.address], currentChain.chainId);
        }
    }, [approve, currentChain.chainId,
        selectedAccount.address, sessionRequestDetails.sessionId,
        unlockWallet])

    const authorizations: Authorization[] = useMemo(() => {
        // NOTE: At the moment we support only wallet connect so the authorizations
        // are always this
        return [
            {
                title: t("sign transactions"),
            },
        ]
    }, [t]);

    const showSuccessModal = useCallback(() => {
        openModal(SingleButtonModal, {
            image: require("../assets/success.png"),
            title: t("success"),
            message: t("app authorized", {app: appName}),
            actionLabel: t("go to authorization"),
            action: () => navigateToProfileScreen(true),
        })
    }, [t, navigateToProfileScreen, appName, openModal]);

    const showErrorModal = useCallback((errorMsg: string) => {
        openModal(SingleButtonModal, {
            title: t("error"),
            message: errorMsg,
            actionLabel: t("ok"),
        })
    }, [openModal, t]);

    const renderListItem = useCallback((info: ListRenderItemInfo<Authorization>) => {
        const {item, index} = info;
        const style: any[] = [styles.permissionItem];
        if (index === 0) {
            style.push(styles.borderTop)
        }
        if (index === authorizations.length - 1) {
            style.push(styles.borderBot)
        }
        return <AuthorizationListElement
            key={index.toString()}
            authorization={item}
            style={style}
        />
    }, [authorizations.length, styles.borderBot, styles.borderTop, styles.permissionItem])

    useEffect(() => {
        if (approveStatus.error) {
            showErrorModal(approveStatus.error.toString());
        } else if (approveStatus.approved) {
            showSuccessModal();
        }
    }, [approveStatus, showSuccessModal, showErrorModal]);

    useEffect(() => {
        if (rejectStatus.error) {
            showErrorModal(rejectStatus.error.toString());
        } else if(rejectStatus.rejected) {
            navigateToProfileScreen(true);
        }
    }, [rejectStatus, navigateToProfileScreen, showErrorModal])

    return <StyledSafeAreaView
        style={styles.root}
        topBar={<TopBar
            style={styles.topBar}
            stackProps={props}
            title={t("authorization")}
        />}
    >
        <View style={styles.dappDetails}>
            <Image
                style={styles.dappIcon}
                source={dappIcon}
                resizeMode="center"
            />
            <Paragraph
                style={styles.permissionMessage}
            >
                {t("the application requires the following authorizations", {
                    app: appName
                })}:
            </Paragraph>
            <FlatList
                style={styles.permissionList}
                data={authorizations}
                renderItem={renderListItem}
                ItemSeparatorComponent={Divider}
            />
        </View>
        <Paragraph
            style={styles.bottomMessage}
        >
            {t("note")}: {t("you will be able to revoke such authorizations inside your authorization page")}
        </Paragraph>
        <Button
            mode="contained"
            onPress={onGrant}
        >
            {t("grant")}
        </Button>
        <Button
            style={styles.denyButton}
            mode="contained"
            onPress={onDeny}
            accent
        >
            {t("deny")}
        </Button>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    root: {
        backgroundColor: "#E5E5E5",
    },
    topBar: {
        backgroundColor: "#E5E5E5",
    },
    dappDetails: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 10,
        flexBasis: 0,
    },
    dappIcon: {
        width: 60,
        height: 60,
    },
    permissionMessage: {
        marginTop: theme.spacing.m,
        textAlign: "center"
    },
    permissionList: {
        marginTop: theme.spacing.m,
        alignSelf: "flex-start",
        width: "100%",
    },
    borderTop: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    borderBot: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    permissionItem: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.s,
    },
    bottomMessage: {
        textAlign: "center",
        marginTop: theme.spacing.m,
        flexGrow: 1,
    },
    denyButton: {
        marginTop: theme.spacing.s,
    }
}))

type AuthorizationListElementProps = {
    authorization: Authorization,
    style: StyleProp<ViewStyle>
}

const AuthorizationListElement: React.FC<AuthorizationListElementProps> = (props) => {
    const {t} = useTranslation();
    const {authorization, style} = props

    const expiration = authorization.expiration ? format(authorization.expiration, "EEE MMM dd, yyyy") : t("never")

    return <View style={style}>
        <Subtitle bold>{authorization.title}</Subtitle>
        {authorization.limit && <Paragraph>{t("limit")}: {authorization.limit}</Paragraph>}
        <Paragraph>
            {t("expires on")}: {expiration}
        </Paragraph>

    </View>
}