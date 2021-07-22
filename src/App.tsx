import React from 'react';
import {StatusBar} from 'react-native';
import {RecoilRoot} from "recoil";
import Colors from "./constants/colors";
import Navigator from "./navigation";

export default function App(): JSX.Element {
    return <RecoilRoot>
        <StatusBar hidden={false} backgroundColor={Colors.DesmosOrange}/>
        <Navigator/>
    </RecoilRoot>;
}
