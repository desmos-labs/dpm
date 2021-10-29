import React, {useEffect, useRef, useState} from "react";
import {DrawerLayout} from "react-native-gesture-handler";
import {useTheme} from "react-native-paper";
import {Dimensions, ScaledSize} from "react-native";
import {DrawerStateProvider} from "../contexts/AppDrawerContex";

export type Props = {
    /**
     * Content that will be rendered inside the drawer.
     */
    renderContent: () => React.ReactNode
    /**
     * Drawer with in percentage of the screen width.
     * 0.5 means 50%, 1 means 100%.
     * default: 0.8
     */
    width?: number,
    /**
     * Tells if the drawer should be displayed on the left
     * or right side of the screen.
     * default: left
     */
    drawerPosition?: "left" | "right",
    /**
     * Specifies the way the drawer will be displayed.
     * When set to front the drawer will slide in and out along with the gesture
     * and will display on top of the content view.
     * When back is used the drawer displays behind the content view and
     * can be revealed with gesture of pulling the content view to the side.
     * Finally slide option makes the drawer appear like it is attached to the
     * side of the content view; when you pull both content view and drawer will
     * follow the gesture.
     * default: front
     */
    drawerType?: "front" | "back" | "slide",
}

type ScreenDimension = {
    window: ScaledSize,
    screen: ScaledSize,
}

export const AppDrawer: React.FC<Props> = (props) => {
    const {children, renderContent, drawerType, drawerPosition, width} = props;
    const drawerRef = useRef<DrawerLayout>(null);
    const theme = useTheme();
    const [dimensions, setDimensions] = useState<ScreenDimension>({
        window: Dimensions.get("window"),
        screen: Dimensions.get("screen")
    });

    useEffect(() => {
        Dimensions.addEventListener("change", setDimensions);
        return () => Dimensions.removeEventListener("change", setDimensions);
    }, []);

    return <DrawerStateProvider drawerRef={drawerRef}>
        <DrawerLayout
            ref={drawerRef}
            drawerType={drawerType}
            drawerPosition={drawerPosition}
            drawerWidth={dimensions.window.width * (width ?? 0.8)}
            drawerBackgroundColor={theme.colors.background}
            renderNavigationView={renderContent}
        >
            {children}
        </DrawerLayout>
    </DrawerStateProvider>
}