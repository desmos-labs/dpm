import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from './selection.json';
import React from "react";
import MaterialCommunityIcon from "react-native-paper/src/components/MaterialCommunityIcon";

const desmosIcons = [
    "authorization", "profile", "back", "camera", "settings",
    "edit", "more", "delete", "show", "hide", "arrow-right",
    "menu",
]

const CustomIcon = createIconSetFromIcoMoon(icoMoonConfig);

export type Props  = {
    name: string;
    color: string;
    size: number;
    direction?: 'rtl' | 'ltr';
    allowFontScaling?: boolean;
};

export const DesmosIcon: React.FC<Props> = (props) => {
    if (desmosIcons.indexOf(props.name) >= 0) {
        return <CustomIcon
            {...props}
            // Our icons have less padding so make it a little bit smallet
            // to keep a size similar to MaterialCommunityIcon
            size={props.size - 4}
        />
    } else {
        return <MaterialCommunityIcon
            {...props}
            direction={props.direction ?? 'ltr'}
        />
    }
}