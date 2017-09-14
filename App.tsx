import React from "react";
import { Router, Stack, Scene } from "react-native-router-flux";
import firebase from "firebase";
import { Provider as MobxProvider } from "mobx-react";

import auth from "./src/state/auth";

import SignIn from "./src/components/routes/SignIn";
import SignUp from "./src/components/routes/SignUp";
import Home from "./src/components/routes/Home";
import Activities from "./src/components/routes/Activities";
import CreateActivity from "./src/components/routes/CreateActivity";

interface Props {
}

interface State {
}

export default class App extends React.Component<Props, State> {

    componentWillMount() {
        const config = {
            apiKey: "AIzaSyBT13XjrTxJHNl3-t-NbaiSVwQpQsrCz0M",
            authDomain: "bode-f2482.firebaseapp.com",
            databaseURL: "https://bode-f2482.firebaseio.com",
            projectId: "bode-f2482",
            storageBucket: "bode-f2482.appspot.com",
            messagingSenderId: "1014650752579"
        };

        firebase.initializeApp(config);
    }

    render() {
        return (
            <MobxProvider auth={auth}>
                <Router>
                    <Stack key="root">
                        <Scene key="activities" component={Activities} title="Activities" hideNavBar={true} />
                        <Scene key="home" component={Home} title="Home" hideNavBar={true} />
                        <Scene key="signIn" component={SignIn} title="Sign In" hideNavBar={true} />
                        <Scene key="signUp" component={SignUp} title="Sign Up" hideNavBar={true} />
                        <Scene key="createActivity" component={CreateActivity} title="New Activity" hideNavBar={true} />
                    </Stack>
                </Router>
            </MobxProvider>
        );
    }

}
