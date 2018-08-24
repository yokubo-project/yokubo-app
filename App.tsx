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
import PatchItem from "./src/components/item/PatchItem";

import ItemTabNavigation from "./src/components/item/TabNavigation";

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
@observer
class App extends React.Component<null, null> {

    render() {
        if (authStore.isRehydrated === false) {
            return (
                <Spinner />
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
