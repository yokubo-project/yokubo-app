import React from "react";
import { StyleSheet, View, ViewStyle, Text, Image } from "react-native";
import { Header, FormInput, FormValidationMessage, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import auth from "../../state/auth";
import taskState from "../../state/taskState";

const primaryColor1 = "green";

interface State {
}

interface Props {
    taskUid: string;
    visible: boolean;
    hideVisibility: () => void;
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    formContainer: {
        flex: 2,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    inputStyle: {
        marginRight: 100,
        color: "black",
        fontSize: 20
    },
    modalInputStyle: {
        color: "black",
        fontSize: 20
    },
    modalContent: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "stretch",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    modalButtonStyle: {
        // flex: 1
    }
});

export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);
    }

    async deleteTask() {
        taskState.deleteTask(this.props.taskUid);
        Actions.pop();
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <Modal
                    isVisible={this.props.visible}
                    onBackdropPress={() => this.props.hideVisibility()}
                    onBackButtonPress={() => this.props.hideVisibility()}
                >
                    <View style={styles.modalContent}>
                        <Text>Are you sure you want delete this task?</Text>
                        <Button
                            inputStyle={styles.modalButtonStyle}
                            raised
                            buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={"Yes"}
                            onPress={() => { this.deleteTask(); }}
                        />
                    </View>
                </Modal>
            
            </View>
        );
    }

}
