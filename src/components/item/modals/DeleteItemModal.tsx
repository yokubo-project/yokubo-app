import React from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { FormInput, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";
import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import Button from "../../../shared/components/Button";
import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";
import taskStore, { IFullItem } from "../../../state/taskStore";

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

interface IState {
    inputGeneralError: string;
}

interface IProps {
    navigation: NavigationScreenProp<any, any>;
    isVisible: boolean;
    taskUid: string;
    item: IFullItem;
    hide(): void;
}

export default class Component extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            inputGeneralError: null
        };
    }

    async deleteItem() {
        await taskStore.deleteItem(this.props.taskUid, this.props.item.uid);
        if (taskStore.error !== null) {
            switch (taskStore.error) {
                default:
                    this.setState({
                        inputGeneralError: "An unexpected error happened"
                    });
            }
        } else {
            this.setState({
                inputGeneralError: null
            });
            this.props.navigation.goBack();
        }
    }

    closeModal() {
        this.setState({
            inputGeneralError: null
        });
        this.props.hide();
    }

    showGeneralError() {
        if (this.state.inputGeneralError) {
            return <FormValidationMessage>{this.state.inputGeneralError}</FormValidationMessage>;
        }

        return null;
    }

    render() {
        if (this.props.item === null) {
            return null;
        }

        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.closeModal()}
                onBackButtonPress={() => this.closeModal()}
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
                        {i18n.t("deleteItem.deleteHint", { itemName: this.props.item.name })}
                    </Text>

                    <Button
                        title={i18n.t("deleteItem.deleteButton")}
                        onPress={() => { this.deleteItem(); }}
                    />
                </View>
            </Modal>
        );
    }

}
