import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";
import { List, ListItem } from "react-native-elements";
import { NavigationScreenProp, NavigationScreenProps, withNavigation } from "react-navigation";

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
    listContainer: {
        flexGrow: 1
    } as ViewStyle,
    listElement: {
        backgroundColor: theme.listItem.backgroundColor,
        paddingTop: 12,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderBottomWidth: 0,
        borderColor: theme.listItem.borderColor,
        marginLeft: 0
    }
});

interface IProps {
    navigation: NavigationScreenProp<any, any>;
}

interface IState {
    isProfileModalVisible: boolean;
    isResetPwdModalVisible: boolean;
    isLogoutModalVisible: boolean;
    isDeleteUserModalVisible: boolean;
}

class Profile extends React.Component<IProps, IState> {

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            title: i18n.t("profile.header")
        };
    }

    // tslint:disable-next-line:member-ordering
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
                <ScrollView style={styles.listContainer}>
                    <View style={{ paddingTop: 30 }}>
                        <Text
                            style={{
                                color: theme.text.primaryColor,
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
                                color: theme.text.primaryColor,
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
                            titleStyle={{ color: theme.listItem.primaryColor, fontSize: 18 }}
                            onPress={() => this.showProfileModal()}
                            hideChevron={true}
                            underlayColor={theme.listItem.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.changePassword")}
                            titleStyle={{ color: theme.listItem.primaryColor, fontSize: 18 }}
                            onPress={() => this.showResetPwdModal()}
                            hideChevron={true}
                            underlayColor={theme.listItem.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.privacy")}
                            titleStyle={{ color: theme.listItem.primaryColor, fontSize: 18 }}
                            onPress={() => Linking.openURL(`${Config.BASE_URL}/views/v1/privacy`)}
                            hideChevron={true}
                            underlayColor={theme.listItem.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.imprint")}
                            titleStyle={{ color: theme.listItem.primaryColor, fontSize: 18 }}
                            onPress={() => Linking.openURL(`${Config.BASE_URL}/views/v1/imprint`)}
                            hideChevron={true}
                            underlayColor={theme.listItem.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.logout")}
                            titleStyle={{ color: theme.listItem.primaryColor, fontSize: 18 }}
                            onPress={() => this.showLogoutModal()}
                            hideChevron={true}
                            underlayColor={theme.listItem.underlayColor}
                        />
                        <ListItem
                            containerStyle={styles.listElement}
                            title={i18n.t("profile.deleteUser")}
                            titleStyle={{ color: theme.listItem.primaryColor, fontSize: 18 }}
                            onPress={() => this.showDeleteUserModal()}
                            hideChevron={true}
                            underlayColor={theme.listItem.underlayColor}
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
                    navigation={this.props.navigation}
                    isVisible={this.state.isLogoutModalVisible}
                    hide={() => this.hideLogoutModal()}
                />
                <DeleteUserModal
                    navigation={this.props.navigation}
                    isVisible={this.state.isDeleteUserModalVisible}
                    hide={() => this.hideDeleteUserModal()}
                />
            </View>
        );
    }

}

export default withNavigation(Profile);
