import React from "react";
import { StyleSheet, ActivityIndicator, Text, View } from "react-native";
import { Router, Stack, Scene, Actions } from "react-native-router-flux";
import { Provider as MobxProvider, observer } from "mobx-react";

import authStore from "./src/state/authStore";
import taskStore from "./src/state/taskStore";

import Home from "./src/components/auth/Home";
import SignIn from "./src/components/auth/SignIn";
import SignUp from "./src/components/auth/SignUp";
import ForgotPwd from "./src/components/auth/ForgotPwd";
import Profile from "./src/components/auth/Profile";

import Tasks from "./src/components/task/Tasks";
import CreateTask from "./src/components/task/CreateTask";
import PatchTask from "./src/components/task/PatchTask";

import Items from "./src/components/item/Items";
import CreateItem from "./src/components/item/CreateItem";
import PatchItem from "./src/components/item/PatchItem";


interface Props {
}

interface State {
}

const spinnerColor = "#00F2D2";

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#333333",
    },
    rehydrationText: {
        color: "#00F2D2",
    }
});

const Spinner = () => {
    return (
        <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={spinnerColor} />
            <Text style={styles.rehydrationText}>Rehydration is taking place...</Text>
        </View>
    );
};

class App extends React.Component<Props, State> {

    render() {
        return (
            <MobxProvider authStore={authStore} taskStore={taskStore}>
                <Routes />
            </MobxProvider>
        );
    }

}


@observer
class Routes extends React.Component<null, null> {

    isSignedIn() {
        if (!authStore.isAuthenticated) {
            return false;
        } else {
            return true;
        }
    }

    toLoginPage() {
        Actions.signIn();
    }

    render() {
        if (authStore.isRehydrated === false) {
            return (
                <Spinner />
            );
        }

        return (
            <Router>
                <Stack key="root">
                    <Scene
                        key="isAuth"
                        component={Home}
                        title="isAuth"
                        hideNavBar={true}
                        onEnter={this.isSignedIn}
                        success={() => { Actions.tasks(); }}
                        failure={() => { Actions.home(); }}
                    />
                    <Scene key="home" component={Home} title="Home" hideNavBar={true} />
                    <Scene key="signIn" component={SignIn} title="Sign In" hideNavBar={true} />
                    <Scene key="signUp" component={SignUp} title="Sign Up" hideNavBar={true} />
                    <Scene key="forgotPwd" component={ForgotPwd} title="Forgot Password" hideNavBar={true} />
                    <Scene key="profile" component={Profile} title="Profile" hideNavBar={true} />
                    <Scene key="tasks" component={Tasks} title="Tasks" hideNavBar={true} type="reset" />
                    <Scene key="createTask" component={CreateTask} title="New Task" hideNavBar={true} />
                    <Scene key="patchTask" component={PatchTask} title="Update Task" hideNavBar={true} />
                    <Scene key="items" component={Items} title="Items" hideNavBar={true} />
                    <Scene key="createItem" component={CreateItem} title="New Item" hideNavBar={true} />
                    <Scene key="patchItem" component={PatchItem} title="Patch Item" hideNavBar={true} panHandlers={null} />
                </Stack>
            </Router>
        );
    }
}

export default App;
