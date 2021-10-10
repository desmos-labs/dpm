import React from "react";
import {BottomTabBarProps, BottomTabNavigationOptions} from "@react-navigation/bottom-tabs";
import {Text, TouchableOpacity, View} from "react-native";
import {makeStyle} from "../theming";
import Colors from "../constants/colors";
import {TabActions} from "@react-navigation/native";

export const HomeScreenBottomBar: React.FC<BottomTabBarProps> = (props) => {
    const styles = useStyles();

    return <View style={styles.root}>
        {props.state.routes.map((route, index) => {
            const options: BottomTabNavigationOptions = props.descriptors[route.key]["options"];
            const focused = props.state.index === index;
            const color = focused ? Colors.DesmosOrange : "#ADADAD";
            const size = options.title === undefined ? 32 : 22;
            const textStyle = focused ?
                [styles.btnText, styles.btnTextSelected] : styles.btnText;

            const onPress = () => {
                const action = TabActions.jumpTo(route.name);
                props.navigation.dispatch(action);
            }
            return <TouchableOpacity
                key={route.key}
                style={styles.btn}
                onPress={onPress}
            >
                {options.tabBarIcon && options.tabBarIcon({
                    focused,
                    color,
                    size
                })}
                {options.title && <Text style={textStyle}>
                    {options.title}
                </Text>}
            </TouchableOpacity>
        })}
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        elevation: 9,
        justifyContent: "space-around",
        padding: theme.spacing.s,
    },
    btn: {
        alignItems: "center",
        flex: 1,
    },
    btnText: {
        fontSize: 9,
        lineHeight: 11,
        color: '#9d9d9d',
        textTransform: "capitalize"
    },
    btnTextSelected: {
        color: theme.colors.primary,
    },
}));