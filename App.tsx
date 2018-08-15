import { observer } from "mobx-react";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";

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
import Items from "./src/components/item/Items";
import PatchItem from "./src/components/item/PatchItem";

import Tab from "./src/components/item/modals/TabNavigation";

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#333333"
    },
    rehydrationText: {
        color: theme.textColor
    }
});

// tslint:disable-next-line:variable-name
const Spinner = () => {
    return (
        <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={theme.spinnerColor} />
            <Text style={styles.rehydrationText}>Signing in...</Text>
        </View>
    );
};
@observer
class App extends React.Component<null, null> {

    render() {
        if (authStore.isRehydrated === false) {
            return (
                <Spinner />
            );
        }

        return <RootStack />;
    }

}

// tslint:disable-next-line:variable-name
const RootStack = createStackNavigator(
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
        Tab: {
            screen: Tab,
            headerMode: "none",
            navigationOptions: {
                header: null
            }
        },
        Items,
        CreateItem,
        PatchItem
    },
    {
        initialRouteName: authStore.isAuthenticated === true ? "Tasks" : "Home",
        navigationOptions: {
            headerStyle: {
                backgroundColor: theme.headerBackgroundColor
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                fontWeight: "bold"
            }
        }

    }
);

export default App;
