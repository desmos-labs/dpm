import React from "react";
import {HomeScreenBottomTabs} from "../types/navigation";
import Profile from "../screens/Profile";
import {Authorization} from "../screens/Authorization";
import {ScanQr} from "../screens/ScanQr";
import {HomeScreenBottomBar} from "../components/HomeScreenBottomBar";
import {Image} from "react-native";
import {useTranslation} from "react-i18next";

export const HomeScreens: React.FC = () => {
    const {t} = useTranslation();

    return <HomeScreenBottomTabs.Navigator
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
        <HomeScreenBottomTabs.Screen
            name="Profile"
            component={Profile}
            options={{
                title: t("profile"),
                tabBarIcon: ({focused, size}) => {
                    const image = focused ?
                        require("../assets/profile-button-selected.png") :
                        require("../assets/profile-button.png");
                    return <Image
                        style={{width: size, height: size}}
                        resizeMode={"center"}
                        source={image}
                    />
                }
            }}
        />
        <HomeScreenBottomTabs.Screen
            name="ScanQr"
            component={ScanQr}
            options={{
                tabBarIcon: ({size}) => (
                    <Image
                        style={{width: size, height: size}}
                        resizeMode={"cover"}
                        source={require("../assets/scan-qr-button.png")}
                    />
                ),
            }}
        />
        <HomeScreenBottomTabs.Screen
            name="Authorization"
            component={Authorization}
            options={{
                title: t("authorization"),
                tabBarIcon: ({focused, size}) => {
                    const image = focused ?
                        require("../assets/authorizaion-button-selected.png") :
                        require("../assets/authorizaion-button.png")
                    return <Image
                        style={{width: size, height: size}}
                        resizeMode={"center"}
                        source={image}
                    />
                }
            }}
        />
    </HomeScreenBottomTabs.Navigator>
}