import React from "react";
import { StyleSheet, Text, View, ScrollView, ViewStyle, TextStyle, Image, FlatList, Linking } from "react-native";
import { Header, List, ListItem, FormInput, Button, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import authStore from "../../state/authStore";

const backgroundColor = "#333333";
const textColor = "white";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";
const underlayColor = "#202020";

interface State {
    isDeleteUserModalVisible: boolean;
    inputPassword: string;
    inputPasswordError: string;
    inputGeneralError: string;
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: backgroundColor,
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor
    } as ViewStyle,
    listContainer: {
        flexGrow: 7,
        backgroundColor,
    } as ViewStyle,
    listElement: {
        backgroundColor,
        paddingTop: 12,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderColor: "gray",
        marginLeft: 0,
    },
    modalInputStyle: {
        color: inputTextColor,
        fontSize: 20,
        marginBottom: 10
    },
    modalContent: {
        backgroundColor,
        justifyContent: "center",
        alignItems: "stretch",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
});

export default class Component extends React.Component<null, State> {

    constructor(props) {
        super(props);
        this.state = {
            isDeleteUserModalVisible: false,
            inputPassword: "",
            inputPasswordError: null,
            inputGeneralError: null
        };
    }

    componentWillMount() {
        authStore.getProfile();
    }

    async signOut() {
        await authStore.signOut();
        Actions.home();
    }

    async deleteUser() {
        await authStore.deleteUser(this.state.inputPassword);
        if (authStore.error !== null) {
            switch (authStore.error) {
                case "PasswordsDontMatch":
                    this.setState({
                        inputPasswordError: "Wrong password",
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputPasswordError: null,
                        inputGeneralError: "An unexpected error happened"
                    });
            }
        } else {
            this.setState({
                inputPasswordError: null,
                inputGeneralError: null
            });
            this._hideDeleteUserModal();
            Actions.home();
        }
    }

    showPasswordError() {
        if (this.state.inputPasswordError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputPasswordError}</FormValidationMessage>;
        }
        return null;
    }

    _showDeleteUserModal = () => this.setState({ isDeleteUserModalVisible: true });
    _hideDeleteUserModal = () => this.setState({ isDeleteUserModalVisible: false });

    render() {
        if (authStore.profile === null) {
            return null;
        }

        return (
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: "Profile", style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>
                <ScrollView style={styles.listContainer}>
                    <View style={{ paddingTop: 30 }}>
                        <Text style={{
                            backgroundColor,
                            color: textColor,
                            fontSize: 25,
                            paddingTop: 5,
                            paddingBottom: 10,
                            textAlign: "center"
                        }}>
                            {authStore.profile.name}
                        </Text>
                        <Text style={{
                            backgroundColor,
                            color: textColor,
                            fontSize: 18,
                            paddingTop: 5,
                            paddingBottom: 10,
                            textAlign: "center"
                        }}>
                            {authStore.username}
                        </Text>
                    </View>
                    <List containerStyle={{ marginBottom: 20, borderTopWidth: 0, marginLeft: 0, paddingLeft: 0 }}>
                        <ListItem
                            style={styles.listElement}
                            title={"Update Profile"}
                            titleStyle={{ color: textColor, fontSize: 18 }}
                            onPress={() => console.log("asdf")}
                            hideChevron={true}
                            underlayColor={underlayColor}
                        />
                        <ListItem
                            style={styles.listElement}
                            title={"Change Password"}
                            titleStyle={{ color: textColor, fontSize: 18 }}
                            onPress={() => console.log("asdf")}
                            hideChevron={true}
                            underlayColor={underlayColor}
                        />
                        <ListItem
                            style={styles.listElement}
                            title={"Privacy"}
                            titleStyle={{ color: textColor, fontSize: 18 }}
                            onPress={() => Linking.openURL("https://www.yokubo.org/views/v1/privacy")}
                            hideChevron={true}
                            underlayColor={underlayColor}
                        />
                        <ListItem
                            style={styles.listElement}
                            title={"Impress"}
                            titleStyle={{ color: textColor, fontSize: 18 }}
                            onPress={() => Linking.openURL("https://www.yokubo.org/views/v1/impress")}
                            hideChevron={true}
                            underlayColor={underlayColor}
                        />
                        <ListItem
                            style={styles.listElement}
                            title={"Logout"}
                            titleStyle={{ color: textColor, fontSize: 18 }}
                            onPress={() => this.signOut()}
                            hideChevron={true}
                            underlayColor={underlayColor}
                        />
                        <ListItem
                            style={styles.listElement}
                            title={"Delete User"}
                            titleStyle={{ color: textColor, fontSize: 18 }}
                            onPress={() => this._showDeleteUserModal()}
                            hideChevron={true}
                            underlayColor={underlayColor}
                        />
                    </List>
                </ScrollView>

                <Modal
                    isVisible={this.state.isDeleteUserModalVisible}
                    onBackdropPress={this._hideDeleteUserModal}
                    onBackButtonPress={this._hideDeleteUserModal}
                >
                    <View style={styles.modalContent}>
                        <Text style={{ color: inputTextColor, fontSize: 15, textAlign: "center", marginBottom: 20 }}>Please enter your current password in order to delete your user. Note that deleting your user is irreversibly and all data associated with your account will be lost.</Text>
                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            placeholder="Current Password"
                            onChangeText={(value) => this.setState({ inputPassword: value })}
                            underlineColorAndroid={textColor}
                            selectionColor={inputTextColor} // cursor color
                            secureTextEntry={true}
                        />
                        {this.showPasswordError()}

                        <Button
                            raised
                            buttonStyle={{ backgroundColor, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={"Delete User"}
                            onPress={() => { this.deleteUser(); }}
                        />
                    </View>
                </Modal>
            </View>
        );
    }

}
