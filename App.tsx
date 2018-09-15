import { observer } from "mobx-react";
import React from "react";
import { ActivityIndicator, NetInfo, StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";
import Sentry from "sentry-expo";

import * as Config from "./src/config";

import { theme } from "./src/shared/styles";
import authStore from "./src/state/authStore";

import ForgotPwd from "./src/components/auth/ForgotPwd";
import Home from "./src/components/auth/Home";
import LogoutModal from "./src/components/auth/modals/LogoutModal";
import Profile from "./src/components/auth/Profile";
import SignIn from "./src/components/auth/SignIn";
import SignUp from "./src/components/auth/SignUp";

import CreateTask from "./src/components/task/CreateTask";
import PatchTask from "./src/components/task/PatchTask";
import Tasks from "./src/components/task/Tasks";

import CreateItem from "./src/components/item/CreateItem";
import PatchItem from "./src/components/item/PatchItem";

import ItemTabNavigation from "./src/components/item/TabNavigation";
import i18n from "./src/shared/i18n";

Sentry.enableInExpoDevelopment = true;
Sentry.config(Config.SENTRY_ENDPOINT).install();

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: theme.backgroundColor
    }
});

// tslint:disable-next-line:variable-name
const Spinner = () => {
    return (
        <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={theme.spinnerColor} />
        </View>
    );
};

interface IState {
    connectionStatus: "offline" | "online" | "unknown";
}
@observer
class App extends React.Component<null, IState> {

    state: IState = {
        connectionStatus: "online"
    };

    async componentDidMount() {
        const connectionInfo = await NetInfo.getConnectionInfo();
        this.handleConnectivityChange(connectionInfo);

        NetInfo.addEventListener(
            "connectionChange",
            this.handleConnectivityChange
        );
    }

    handleConnectivityChange = (connectionInfo: any) => {
        if (connectionInfo.type === "none") {
            this.setState({
                connectionStatus: "offline"
            });
        } else if (connectionInfo.type === "unknown") {
            this.setState({
                connectionStatus: "unknown"
            });
        } else {
            this.setState({
                connectionStatus: "online"
            });
        }
    }

    render() {
        if (authStore.isRehydrated === false) {
            return (
                <Spinner />
            );
        }

        if (this.state.connectionStatus !== "online") {
            return (
                <View style={{ height: 125, backgroundColor: "red" }}>
                    <Text style={{ paddingTop: 40, color: "white", textAlign: "center", fontSize: 20 }}>
                        {i18n.t("app.noInternetConnection")}
                    </Text>
                </View>
            );
        }

        // tslint:disable-next-line:variable-name
        const RootStack = createRootStack("Home");

        return <RootStack />;
    }

}

// tslint:disable-next-line:variable-name
const createRootStack = (initialScreen: string) => {
    return createStackNavigator(
        {
            Home,
            SignIn,
            SignUp,
            Profile,
            ForgotPwd,
            LogoutModal,
            Tasks,
            CreateTask,
            PatchTask,
            ItemTabNavigation: {
                screen: ItemTabNavigation,
                headerMode: "none",
                navigationOptions: {
                    header: null
                }
            },
            CreateItem,
            PatchItem
        },
        {
            initialRouteName: initialScreen,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: theme.headerBackgroundColor
                },
                headerTintColor: "white",
                headerTitleStyle: {
                    fontWeight: "bold"
                }
            }

        }
    );
};

export default App;
