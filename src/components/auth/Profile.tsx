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
    isProfileModalVisible: boolean;
    isResetPwdModalVisible: boolean;
    isLogoutModalVisible: boolean;
    inputDeleteUserPwd: string;
    inputCurrentPwd: string;
    inputNewPwd: string;
    inputName: string;
    inputEmail: string;
    inputPwdError: string;
    inputResetPwdNewPwdError: string;
    inputResetPwdCurrentPwdError: string;
    inputNameError: string;
    inputEmailError: string;
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
            isProfileModalVisible: false,
            isResetPwdModalVisible: false,
            isLogoutModalVisible: false,
            inputDeleteUserPwd: "",
            inputCurrentPwd: "",
            inputNewPwd: "",
            inputName: "",
            inputEmail: "",
            inputPwdError: null,
            inputResetPwdCurrentPwdError: null,
            inputResetPwdNewPwdError: null,
            inputNameError: null,
            inputEmailError: null,
            inputGeneralError: null
        };
    }

    componentWillMount() {
        authStore.getProfile();
    }

    async signOut() {
        this._hideLogoutModal();
        await authStore.signOut();
        Actions.home();
    }

    async deleteUser() {
        await authStore.deleteUser(this.state.inputDeleteUserPwd);
        if (authStore.error !== null) {
            switch (authStore.error) {
                case "PasswordsDontMatch":
                    this.setState({
                        inputPwdError: "Wrong password",
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputPwdError: null,
                        inputGeneralError: "An unexpected error happened"
                    });
            }
        } else {
            this.setState({
                inputPwdError: null,
                inputGeneralError: null
            });
            this._hideDeleteUserModal();
            Actions.home();
        }
    }

    async patchProfile() {
        const email = this.state.inputEmail !== "" ? this.state.inputEmail : authStore.username;
        const name = this.state.inputName !== "" ? this.state.inputName : authStore.profile.name;

        if (name.length < 3) {
            this.setState({
                inputNameError: "Name must have at least 3 characters",
                inputEmailError: null,
                inputPwdError: null,
                inputGeneralError: null
            });
            return;
        } else if (email.length < 5) {
            this.setState({
                inputNameError: null,
                inputEmailError: "Email must have at least 5 characters",
                inputPwdError: null,
                inputGeneralError: null
            });
            return;
        }

        await authStore.patchProfile(email, name);
        if (authStore.error !== null) {
            switch (authStore.error) {
                case "UserAlreadyExists":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: "Email already exists",
                        inputGeneralError: null
                    });
                    break;
                case "InvalidUsername":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: "Email already exists",
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputNameError: null,
                        inputEmailError: null,
                        inputGeneralError: "An unexpected error happened"
                    });
            }
        } else {
            this.setState({
                inputNameError: null,
                inputEmailError: null,
                inputGeneralError: null
            });
            this._hideProfileModal();
        }
    }

    async resetPwd() {
        const currentPwd = this.state.inputCurrentPwd;
        const newPwd = this.state.inputNewPwd;

        if (newPwd.length < 6) {
            this.setState({
                inputResetPwdNewPwdError: "Password must have at least 6 characters",
                inputGeneralError: null
            });
            return;
        }

        await authStore.resetPwd(currentPwd, newPwd);
        if (authStore.error !== null) {
            switch (authStore.error) {
                case "PasswordsDontMatch":
                    this.setState({
                        inputResetPwdNewPwdError: null,
                        inputResetPwdCurrentPwdError: "The password entered does not match your curent password",
                        inputGeneralError: null
                    });
                    break;
                case "PasswordWeak":
                    this.setState({
                        inputResetPwdNewPwdError: "New password is to weak",
                        inputResetPwdCurrentPwdError: null,
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputResetPwdNewPwdError: null,
                        inputResetPwdCurrentPwdError: null,
                        inputGeneralError: "An unexpected error happened"
                    });
            }
        } else {
            this.setState({
                inputResetPwdNewPwdError: null,
                inputResetPwdCurrentPwdError: null,
                inputGeneralError: null
            });
            this._hideResetPwdModal();
        }
    }

    showPwdError() {
        if (this.state.inputPwdError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputPwdError}</FormValidationMessage>;
        }
        return null;
    }

    showEmailError() {
        if (this.state.inputEmailError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputEmailError}</FormValidationMessage>;
        }
        return null;
    }

    showNameError() {
        if (this.state.inputNameError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputNameError}</FormValidationMessage>;
        }
        return null;
    }

    showResetPwdNewPwdError() {
        if (this.state.inputResetPwdNewPwdError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputResetPwdNewPwdError}</FormValidationMessage>;
        }
        return null;
    }

    showResetPwdCurrentPwdError() {
        if (this.state.inputResetPwdCurrentPwdError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputResetPwdCurrentPwdError}</FormValidationMessage>;
        }
        return null;
    }

    showGeneralError() {
        if (this.state.inputGeneralError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputGeneralError}</FormValidationMessage>;
        }
        return null;
    }

    _showDeleteUserModal = () => this.setState({ isDeleteUserModalVisible: true });
    _hideDeleteUserModal = () => this.setState({
        isDeleteUserModalVisible: false,
        inputPwdError: null,
        inputGeneralError: null
    })
    _showProfileModal = () => this.setState({ isProfileModalVisible: true });
    _hideProfileModal = () => this.setState({
        isProfileModalVisible: false,
        inputNameError: null,
        inputEmailError: null,
        inputGeneralError: null
    })
    _showResetPwdModal = () => this.setState({ isResetPwdModalVisible: true });
    _hideResetPwdModal = () => this.setState({
        isResetPwdModalVisible: false,
        inputResetPwdNewPwdError: null,
        inputGeneralError: null
    })
    _showLogoutModal = () => this.setState({ isLogoutModalVisible: true });
    _hideLogoutModal = () => this.setState({ isLogoutModalVisible: false });

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
                            onPress={() => this._showProfileModal()}
                            hideChevron={true}
                            underlayColor={underlayColor}
                        />
                        <ListItem
                            style={styles.listElement}
                            title={"Change Password"}
                            titleStyle={{ color: textColor, fontSize: 18 }}
                            onPress={() => this._showResetPwdModal()}
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
                            onPress={() => this._showLogoutModal()}
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
                            onChangeText={(value) => this.setState({ inputDeleteUserPwd: value })}
                            underlineColorAndroid={textColor}
                            selectionColor={inputTextColor} // cursor color
                            secureTextEntry={true}
                        />
                        {this.showPwdError()}

                        <Button
                            raised
                            buttonStyle={{ backgroundColor, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={"Delete User"}
                            onPress={() => { this.deleteUser(); }}
                        />
                        {this.showGeneralError()}

                    </View>
                </Modal>

                <Modal
                    isVisible={this.state.isProfileModalVisible}
                    onBackdropPress={this._hideProfileModal}
                    onBackButtonPress={this._hideProfileModal}
                >
                    <View style={styles.modalContent}>
                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            defaultValue={authStore.profile.name}
                            placeholder={"Name"}
                            onChangeText={(value) => this.setState({ inputName: value })}
                            underlineColorAndroid={textColor}
                            selectionColor={inputTextColor} // cursor color
                        />
                        {this.showNameError()}

                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            defaultValue={authStore.username}
                            placeholder={"Email"}
                            onChangeText={(value) => this.setState({ inputEmail: value })}
                            underlineColorAndroid={textColor}
                            selectionColor={inputTextColor} // cursor color
                        />
                        {this.showEmailError()}

                        <Button
                            raised
                            buttonStyle={{ backgroundColor, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={"Update Profile"}
                            onPress={() => { this.patchProfile(); }}
                        />
                        {this.showGeneralError()}
                    </View>
                </Modal>

                <Modal
                    isVisible={this.state.isResetPwdModalVisible}
                    onBackdropPress={this._hideResetPwdModal}
                    onBackButtonPress={this._hideResetPwdModal}
                >
                    <View style={styles.modalContent}>
                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            placeholder="Current Password"
                            onChangeText={(value) => this.setState({ inputCurrentPwd: value })}
                            underlineColorAndroid={textColor}
                            selectionColor={inputTextColor} // cursor color
                            secureTextEntry={true}
                        />
                        {this.showResetPwdCurrentPwdError()}

                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            placeholder="New Password"
                            onChangeText={(value) => this.setState({ inputNewPwd: value })}
                            underlineColorAndroid={textColor}
                            selectionColor={inputTextColor} // cursor color
                            secureTextEntry={true}
                        />
                        {this.showResetPwdNewPwdError()}

                        <Button
                            raised
                            buttonStyle={{ backgroundColor, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={"Reset Password"}
                            onPress={() => { this.resetPwd(); }}
                        />
                        {this.showGeneralError()}
                    </View>
                </Modal>

                <Modal
                    isVisible={this.state.isLogoutModalVisible}
                    onBackdropPress={this._hideLogoutModal}
                    onBackButtonPress={this._hideLogoutModal}
                >
                    <View style={styles.modalContent}>
                        <Text style={{ color: inputTextColor, fontSize: 15, textAlign: "center", marginBottom: 20 }}>Are you sure you want to logut?</Text>
                        <Button
                            raised
                            buttonStyle={{ backgroundColor, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={"Yes, logout"}
                            onPress={() => { this.signOut(); }}
                        />
                    </View>
                </Modal>

            </View>
        );
    }

}
