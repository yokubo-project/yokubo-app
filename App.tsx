import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Router, Stack, Scene } from 'react-native-router-flux';

import Login from "./src/components/routes/Login";
import Home from "./src/components/routes/Home";

import { Header, Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

const primaryColor1 = "green";

interface Props {
}

interface State {
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    } as ViewStyle,
    navItem: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
});

export default class App extends React.Component<Props, State> {

    render() {
        return (
            <Router>
                <Stack key="root">
                    <Scene key="home" component={Home} title="Home" hideNavBar={true} />
                    <Scene key="login" component={Login} title="Login" hideNavBar={true} />
                </Stack>
            </Router>
        )
    }

}