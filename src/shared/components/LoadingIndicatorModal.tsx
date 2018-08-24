import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

import { theme } from "../styles";

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: theme.backgroundColor,
        justifyContent: "center",
        alignItems: "stretch",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    }
});

interface IProps {
    isVisible: boolean;
    loadingText: string;
}

export default class LoadingIndicatorModal extends React.Component<IProps, null> {

    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}
            >
                <View style={styles.modalContent}>
                    <View
                        style={{
                            marginTop: 15,
                            marginLeft: 15,
                            marginBottom: 15,
                            marginRight: 15,
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}
                    >
                        <ActivityIndicator size="large" color={theme.spinnerColor} />
                        <Text
                            style={{ color: theme.spinnerColor, fontSize: 20, textAlign: "center", paddingTop: 5, paddingLeft: 10 }}
                        >
                            {this.props.loadingText}
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }

}
