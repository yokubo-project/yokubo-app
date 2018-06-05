import React from "react";
import { FlatList, Image, Linking, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Button, FormInput, FormValidationMessage, Header, List, ListItem } from "react-native-elements";
import Modal from "react-native-modal";
import { Actions } from "react-native-router-flux";

import * as Config from "../../config";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import authStore from "../../state/authStore";
import DeleteUserModal from "./modals/DeleteUserModal";
import LogoutModal from "./modals/LogoutModal";
import ResetPwdModal from "./modals/ResetPwdModal";
import UpdateProfileModal from "./modals/UpdateProfileModal";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
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
        marginLeft: 0
    }
});

// tslint:disable-next-line:no-empty-interface
interface IProps { }
interface IState {
    isProfileModalVisible: boolean;
    isResetPwdModalVisible: boolean;
    isLogoutModalVisible: boolean;
    isDeleteUserModalVisible: boolean;
}

export default class Component extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isProfileModalVisible: false,
            isResetPwdModalVisible: false,
            isLogoutModalVisible: false,
            isDeleteUserModalVisible: false
        };
    }

    showDeleteUserModal = () => this.setState({ isDeleteUserModalVisible: true });
    hideDeleteUserModal = () => this.setState({ isDeleteUserModalVisible: false });
    showProfileModal = () => this.setState({ isProfileModalVisible: true });
    hideProfileModal = () => this.setState({ isProfileModalVisible: false });
    showResetPwdModal = () => this.setState({ isResetPwdModalVisible: true });
    hideResetPwdModal = () => this.setState({ isResetPwdModalVisible: false });
    showLogoutModal = () => this.setState({ isLogoutModalVisible: true });
    hideLogoutModal = () => this.setState({ isLogoutModalVisible: false });

    // tslint:disable-next-line:max-func-body-length
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
                        centerComponent={{
                            text: i18n.t("profile.header"),
                            style: { color: "#fff", fontSize: 20, fontWeight: "bold" }
                        } as any}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>
                <ScrollView style={styles.listContainer}>
                    <View style={{ paddingTop: 30 }}>
                        <Text
                            style={{
                                backgroundColor: theme.backgroundColor,
                                color: theme.textColor,
                                fontSize: 25,
                                paddingTop: 5,
                                paddingBottom: 10,
                                textAlign: "center"
                            }}
                        >
                            {authStore.profile.name}
                        </Text>
                        <Text
                            style={{
                                backgroundColor: theme.backgroundColor,
                                color: theme.textColor,
                                fontSize: 18,
                                paddingTop: 5,
                                paddingBottom: 10,
                                textAlign: "center"
                            }}
                        >
                            {authStore.username}
                        </Text>
                    </View>
                    <List containerStyle={{ marginBottom: 20, borderTopWidth: 0, marginLeft: 0, paddingLeft: 0 }}>
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.updateProfile")}
                            titleStyle={{ color: theme.textColor, fontSize: 18 }}
                            onPress={() => this.showProfileModal()}
                            hideChevron={true}
                            underlayColor={theme.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.changePassword")}
                            titleStyle={{ color: theme.textColor, fontSize: 18 }}
                            onPress={() => this.showResetPwdModal()}
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
                            onPress={() => this.showLogoutModal()}
                            hideChevron={true}
                            underlayColor={theme.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.deleteUser")}
                            titleStyle={{ color: theme.textColor, fontSize: 18 }}
                            onPress={() => this.showDeleteUserModal()}
                            hideChevron={true}
                            underlayColor={theme.underlayColor}
                        />
                    </List>
                </ScrollView>

                <UpdateProfileModal
                    isVisible={this.state.isProfileModalVisible}
                    hide={() => this.hideProfileModal()}
                />
                <ResetPwdModal
                    isVisible={this.state.isResetPwdModalVisible}
                    hide={() => this.hideResetPwdModal()}
                />
                <LogoutModal
                    isVisible={this.state.isLogoutModalVisible}
                    hide={() => this.hideLogoutModal()}
                />
                <DeleteUserModal
                    isVisible={this.state.isDeleteUserModalVisible}
                    hide={() => this.hideDeleteUserModal()}
                />
            </View>
        );
    }

}
