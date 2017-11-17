import React from "react";
import { Router, Stack, Scene, Actions } from "react-native-router-flux";
import firebase from "firebase";
import { Provider as MobxProvider, observer } from "mobx-react";
import { Text, View } from "react-native";

import auth from "./src/state/auth";

import SignIn from "./src/components/auth/SignIn";
import SignUp from "./src/components/auth/SignUp";
import Home from "./src/components/auth/Home";

import Tasks from "./src/components/task/Tasks";
import CreateTask from "./src/components/task/CreateTask";

import Items from "./src/components/item/Items";
import CreateItem from "./src/components/item/CreateItem";

interface Props {
}

interface State {
}

const NotFound = () => <Text>404 ... Page not found!</Text>;
const Spinner = () => <View />;

class App extends React.Component<Props, State> {

    componentWillMount() {

        // This is a temporary fix to get rid of Timeout warning
        // issued by firebase https://github.com/firebase/firebase-js-sdk/issues/97
        (console as any).ignoredYellowBox = [
            "Setting a timer"
        ];

    }

    render() {
        return (
            <MobxProvider auth={auth}>
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
                    <Scene key="isAuth" component={Home} title="isAuth" hideNavBar={true} onEnter={this.isSignedIn} success={() => { Actions.tasks(); }} failure={() => { Actions.signIn(); }} />
                    <Scene key="home" component={Home} title="Home" hideNavBar={true} />
                    <Scene key="signIn" component={SignIn} title="Sign In" hideNavBar={true} />
                    <Scene key="signUp" component={SignUp} title="Sign Up" hideNavBar={true} />
                    <Scene key="tasks" component={Tasks} title="Tasks" hideNavBar={true} />
                    <Scene key="createTask" component={CreateTask} title="New Task" hideNavBar={true} />
                    <Scene key="items" component={Items} title="Items" hideNavBar={true} />
                    <Scene key="createItem" component={CreateItem} title="New Item" hideNavBar={true} />
                </Stack>
            </Router>
        );
    }
}

export default App;
