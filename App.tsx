import React from "react";
import { Router, Stack, Scene } from "react-native-router-flux";
import firebase from "firebase";
import { Provider as MobxProvider } from "mobx-react";

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

export default class App extends React.Component<Props, State> {

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
                <Router>
                    <Stack key="root">
                        <Scene key="home" component={Home} title="Home" hideNavBar={true} />
                        <Scene key="signIn" component={SignIn} title="Sign In" hideNavBar={true} />
                        <Scene key="signUp" component={SignUp} title="Sign Up" hideNavBar={true} />
                        <Scene key="tasks" component={Tasks} title="Tasks" hideNavBar={true} />
                        <Scene key="createTask" component={CreateTask} title="New Task" hideNavBar={true} />
                        <Scene key="items" component={Items} title="Items" hideNavBar={true} />
                        <Scene key="createItem" component={CreateItem} title="New Item" hideNavBar={true} />
                    </Stack>
                </Router>
            </MobxProvider>
        );
    }

}
