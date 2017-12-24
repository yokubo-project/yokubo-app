import React from "react";
import { Router, Stack, Scene, Actions } from "react-native-router-flux";
import { StyleSheet, ActivityIndicator } from "react-native";
import firebase from "firebase";
import { Provider as MobxProvider, observer } from "mobx-react";
import { Text, View } from "react-native";

import auth from "./src/state/auth";
import taskState from "./src/state/taskState";

import SignIn from "./src/components/auth/SignIn";
import SignUp from "./src/components/auth/SignUp";
import Home from "./src/components/auth/Home";

import Tasks from "./src/components/task/Tasks";
import CreateTask from "./src/components/task/CreateTask";
import PatchTask from "./src/components/task/PatchTask";

import Items from "./src/components/item/Items";
import CreateItem from "./src/components/item/CreateItem";
import PatchItem from "./src/components/item/PatchItem";

const primaryColor1 = "green";

interface Props {
}

interface State {
}

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    }
});

const Spinner = () => {
    return (
        <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={primaryColor1} />
            <Text>Rehydration is taking place...</Text>
        </View>
    );
};

class App extends React.Component<Props, State> {

    render() {
        return (
            <MobxProvider auth={auth} taskState={taskState}>
                <Routes />
            </MobxProvider>
        );
    }

}


@observer
class Routes extends React.Component<null, null> {

    isSignedIn() {
        if (!auth.isAuthenticated) {
            return false;
        } else {
            return true;
        }
    }

    toLoginPage() {
        Actions.signIn();
    }

    render() {

        if (auth.isRehydrated === false) {
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
                        failure={() => { Actions.signIn(); }}
                    />
                    <Scene key="home" component={Home} title="Home" hideNavBar={true} />
                    <Scene key="signIn" component={SignIn} title="Sign In" hideNavBar={true} />
                    <Scene key="signUp" component={SignUp} title="Sign Up" hideNavBar={true} />
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
