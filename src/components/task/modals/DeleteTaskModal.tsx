import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Modal from "react-native-modal";

import Button from "../../../shared/components/Button";
import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import taskStore, { IFullTask } from "../../../state/taskStore";

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
    task: IFullTask;
    visible: boolean;
    hideVisibility(): void;
    deleteTask(): void;
}
export default class DeleteTask extends React.Component<IProps, null> {

    render() {
        return (
            <Modal
                isVisible={this.props.visible}
                onBackdropPress={() => this.props.hideVisibility()}
                onBackButtonPress={() => this.props.hideVisibility()}
            >
                <View style={styles.modalContent}>
                    <Text
                        style={{
                            color: theme.text.primaryColor,
                            fontSize: 18,
                            textAlign: "center",
                            marginBottom: 20
                        }}
                    >
                        {i18n.t("deleteTask.deleteHint", { taskName: this.props.task.name })}
                    </Text>

                    <Button
                        title={i18n.t("deleteTask.deleteButton")}
                        onPress={() => { this.props.deleteTask(); }}
                    />
                </View>
            </Modal>
        );
    }

}
