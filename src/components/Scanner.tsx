import * as React from "react";
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';

export interface ScannerValidation {
    error: Error | null;
    result: any | null;
}

interface ScannerProps {
    //onValidate: (data: string) => ScannerValidation;
    onScan: (data: any) => void;
    onError: (error: Error) => void;
    onClose: () => void;
}

interface ScannerState {
    delay: number | false;
}

class Scanner extends React.Component<ScannerProps, ScannerState> {
    public state = {
        delay: 300,
    };

    public stopRecording = async () => {
        await this.setState({ delay: false });
    };

    public handleScan = (data: BarCodeReadEvent) => {
        console.log(data.data);
        // if (data) {
        //     const { result, error } = this.props.onValidate(data);
        //     if (result) {
        //         this.stopRecording();
        //         this.props.onScan(result);
        //     } else {
        //         this.handleError(error);
        //     }
        // }
    };

    public handleError = (error: Error | null) => {
        if (error) {
            this.props.onError(error);
        }
    };

    public onClose = async () => {
        try {
            await this.stopRecording();
            this.props.onClose();
        } catch (error) {
            this.handleError(error);
        }
    };

    public componentWillUnmount() {
        this.stopRecording();
    }
    public render() {
        return <QRCodeScanner
            onRead={this.handleScan}
            showMarker={true}
        />
    }
}

export default Scanner;