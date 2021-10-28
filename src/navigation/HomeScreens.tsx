import React from "react";
import {AccountScreensStackParams, HomeScreensDrawer, HomeScreensBottomTabs} from "../types/navigation";
import {Authorization} from "../screens/Authorization";
import {ScanQr} from "../screens/ScanQr";
import {HomeScreenBottomBar} from "../components/HomeScreenBottomBar";
import {DesmosIcon} from "../components";
import {Image} from "react-native";
import {useTranslation} from "react-i18next";
import {StackScreenProps} from "@react-navigation/stack";
import {AppDrawerContent} from "../components/AppDrawerContent";
import {Home} from "../screens/Home";


type HomeDrawerMenuProps = StackScreenProps<AccountScreensStackParams, "HomeScreens">

export const HomeScreens: React.FC<HomeDrawerMenuProps> = () => {
    return <HomeScreensDrawer.Navigator
        screenOptions={{
            headerShown: false,
        }}
        drawerContent={props => <AppDrawerContent {...props} />}
    >
        <HomeScreensDrawer.Screen
            name="HomeScreen"
            component={HomeScreenBottomTabScreens}
        />
    </HomeScreensDrawer.Navigator>
}

const HomeScreenBottomTabScreens: React.FC = () => {
    const {t} = useTranslation();

    return <HomeScreensBottomTabs.Navigator
        screenOptions={{
            headerShown: false,
        }}
        tabBar={props => {
            const currentRoute = props.state.routes[props.state.index]
            if (currentRoute.name === "ScanQr") {
                return null;
            } else {
                return <HomeScreenBottomBar {...props} />
            }
        }}
    >
        <HomeScreensBottomTabs.Screen
            name="Home"
            component={Home}
            options={{
                title: t("profile"),
                tabBarIcon: ({color, size}) => {
                    return <DesmosIcon
                        name="profile"
                        size={size}
                        color={color}
                    />
                }
            }}
        />
        <HomeScreensBottomTabs.Screen
            name="ScanQr"
            component={ScanQr}
            options={{
                tabBarIcon: ({size}) => (
                    <Image
                        style={{width: size, height: size}}
                        resizeMode={"contain"}
                        source={require("../assets/scan-qr-button.png")}
                    />
                ),
            }}
        />
        <HomeScreensBottomTabs.Screen
            name="Authorization"
            component={Authorization}
            options={{
                title: t("authorization"),
                tabBarIcon: ({color,  size}) => {
                    return <DesmosIcon
                        name="authorization"
                        size={size}
                        color={color}
                    />
                }
            }}
        />
    </HomeScreensBottomTabs.Navigator>
}
