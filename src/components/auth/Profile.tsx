import React from "react";
import { StyleSheet, Text, View, ScrollView, ViewStyle, TextStyle, Image, FlatList, Linking } from "react-native";
import { Header, List, ListItem, FormInput, Button, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import authStore from "../../state/authStore";
import ResetPwdModal from "./modals/ResetPwdModal";
import DeleteUserModal from "./modals/DeleteUserModal";
import UpdateProfileModal from "./modals/UpdateProfileModal";
import LogoutModal from "./modals/LogoutModal";
import { theme } from "../../shared/styles";
import i18n from "../../shared/i18n";
import * as Config from "../../config";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    headerContainer: {
        height: 90,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    listContainer: {
        flexGrow: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    listElement: {
        backgroundColor: theme.backgroundColor,
        paddingTop: 12,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderBottomWidth: 0,
        borderColor: "gray",
        marginLeft: 0,
    }
});

interface State {
    isProfileModalVisible: boolean;
    isResetPwdModalVisible: boolean;
    isLogoutModalVisible: boolean;
    isDeleteUserModalVisible: boolean;
}

export default class Component extends React.Component<null, State> {

    constructor(props) {
        super(props);
        this.state = {
            isProfileModalVisible: false,
            isResetPwdModalVisible: false,
            isLogoutModalVisible: false,
            isDeleteUserModalVisible: false,
        };
    }

    _showDeleteUserModal = () => this.setState({ isDeleteUserModalVisible: true });
    _hideDeleteUserModal = () => this.setState({ isDeleteUserModalVisible: false });
    _showProfileModal = () => this.setState({ isProfileModalVisible: true });
    _hideProfileModal = () => this.setState({ isProfileModalVisible: false });
    _showResetPwdModal = () => this.setState({ isResetPwdModalVisible: true });
    _hideResetPwdModal = () => this.setState({ isResetPwdModalVisible: false });
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
                        backgroundColor={theme.backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        } as any}
                        centerComponent={{ text: i18n.t("profile.header"), style: { color: "#fff", fontSize: 20, fontWeight: "bold" } } as any}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>
                <ScrollView style={styles.listContainer}>
                    <View style={{ paddingTop: 30 }}>
                        <Text style={{
                            backgroundColor: theme.backgroundColor,
                            color: theme.textColor,
                            fontSize: 25,
                            paddingTop: 5,
                            paddingBottom: 10,
                            textAlign: "center"
                        }}>
                            {authStore.profile.name}
                        </Text>
                        <Text style={{
                            backgroundColor: theme.backgroundColor,
                            color: theme.textColor,
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
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.updateProfile")}
                            titleStyle={{ color: theme.textColor, fontSize: 18 }}
                            onPress={() => this._showProfileModal()}
                            hideChevron={true}
                            underlayColor={theme.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.changePassword")}
                            titleStyle={{ color: theme.textColor, fontSize: 18 }}
                            onPress={() => this._showResetPwdModal()}
                            hideChevron={true}
                            underlayColor={theme.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.privacy")}
                            titleStyle={{ color: theme.textColor, fontSize: 18 }}
                            onPress={() => Linking.openURL(`${Config.BASE_URL}/views/v1/privacy`)}
                            hideChevron={true}
                            underlayColor={theme.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.imprint")}
                            titleStyle={{ color: theme.textColor, fontSize: 18 }}
                            onPress={() => Linking.openURL(`${Config.BASE_URL}/views/v1/imprint`)}
                            hideChevron={true}
                            underlayColor={theme.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.logout")}
                            titleStyle={{ color: theme.textColor, fontSize: 18 }}
                            onPress={() => this._showLogoutModal()}
                            hideChevron={true}
                            underlayColor={theme.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.deleteUser")}
                            titleStyle={{ color: theme.textColor, fontSize: 18 }}
                            onPress={() => this._showDeleteUserModal()}
                            hideChevron={true}
                            underlayColor={theme.underlayColor}
                        />
                    </List>
                </ScrollView>

                <UpdateProfileModal
                    isVisible={this.state.isProfileModalVisible}
                    hide={() => this._hideProfileModal()}
                />
                <ResetPwdModal
                    isVisible={this.state.isResetPwdModalVisible}
                    hide={() => this._hideResetPwdModal()}
                />
                <LogoutModal
                    isVisible={this.state.isLogoutModalVisible}
                    hide={() => this._hideLogoutModal()}
                />
                <DeleteUserModal
                    isVisible={this.state.isDeleteUserModalVisible}
                    hide={() => this._hideDeleteUserModal()}
                />
            </View>
        );
    }

}
