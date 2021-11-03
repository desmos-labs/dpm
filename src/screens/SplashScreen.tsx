import React from "react";
import {ImageBackground, StyleSheet} from "react-native";

export const SplashScreen: React.FC = (_props) => {
    return <ImageBackground
        style={styles.root}
        source={require("../assets/home-background-light.png")}
        resizeMode="cover"
    >
    </ImageBackground>
}

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center"
    },
})