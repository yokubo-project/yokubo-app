import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Header, Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

const primaryColor1 = "green";

interface Props {
}

interface State {
    inputNameError: boolean,
    inputEmailError: boolean,
    inputPasswordError: boolean
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    } as ViewStyle,
    formContainer: {
        flex: 3,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    } as ViewStyle,
    spaceContainer: {
        flex: 3,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    } as ViewStyle,
    fullNameText: {
        textAlign: 'center',
        color: primaryColor1,
        marginBottom: 10,
    } as TextStyle,
    signUpText: {
        textAlign: 'center',
        color: primaryColor1,
        marginBottom: 10,
    } as TextStyle,
    forgotPwdText: {
        textAlign: 'center',
        color: primaryColor1,
    } as TextStyle,
    inputStyle: {
        color: 'black',
        fontSize: 20
    }
});
export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            inputNameError: false,
            inputEmailError: false,
            inputPasswordError: false
        };
    }


    checkName(value: any) {
        if (value.length < 10) {
            this.setState({
                inputNameError: false
            });
        } else {
            this.setState({
                inputNameError: true
            });
        }
    }

    showNameError() {
        if (this.state.inputNameError) {
            return <FormValidationMessage>Invalid Name</FormValidationMessage>;
        }
        return null;
    }


    checkEmail(value: any) {
        if (value.length < 10) {
            this.setState({
                inputEmailError: false
            });
        } else {
            this.setState({
                inputEmailError: true
            });
        }
    }

    showEmailError() {
        if (this.state.inputEmailError) {
            return <FormValidationMessage>Invalid Email</FormValidationMessage>;
        }
        return null;
    }

    checkPassword(value: any) {
        if (value.length < 10) {
            this.setState({
                inputPasswordError: false
            });
        } else {
            this.setState({
                inputPasswordError: true
            });
        }
    }

    showPasswordError() {
        if (this.state.inputPasswordError) {
            return <FormValidationMessage>Invalid Password</FormValidationMessage>;
        }
        return null;
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: 'row' }}
                        backgroundColor={primaryColor1}
                        leftComponent={{
                            icon: 'arrow-back',
                            color: '#fff',
                            underlayColor: 'transparent',
                            onPress: () => { Actions.pop() }
                        }}
                        centerComponent={{ text: 'Sign up to Bode', style: { color: '#fff', fontSize: 20 } }}
                        statusBarProps={{ barStyle: 'dark-content', translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <View style={styles.formContainer}>

                    {/* <FormLabel labelStyle={styles.labelStyle}>Name</FormLabel> */}
                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Enter your name"
                        onChangeText={(e) => this.checkName(e)}
                        underlineColorAndroid={primaryColor1}
                        selectionColor="black" // cursor color
                    // placeholderTextColor="blue"
                    />
                    {this.showNameError()}

                    {/* <FormLabel labelStyle={styles.labelStyle}>Name</FormLabel> */}
                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Email"
                        onChangeText={(e) => this.checkEmail(e)}
                        underlineColorAndroid={primaryColor1}
                        selectionColor="black" // cursor color
                    // placeholderTextColor="blue"
                    />
                    {this.showEmailError()}

                    {/* <FormLabel labelStyle={styles.labelStyle}>Name</FormLabel> */}
                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Password"
                        onChangeText={(e) => this.checkPassword(e)}
                        underlineColorAndroid={primaryColor1}
                        selectionColor="black" // cursor color
                    // placeholderTextColor="blue"
                    />
                    {this.showPasswordError()}

                    <Button
                        raised
                        buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                        textStyle={{ textAlign: 'center', fontSize: 18 }}
                        title={"SIGN UP"}
                        onPress={() => { console.log("SignUp was clicked..") }}
                    />

                    <Text style={styles.signUpText} onPress={() => { Actions.signIn() }}>
                        {"SIGN IN"}
                    </Text>

                </View>

                <View style={styles.spaceContainer}>

                </View>
            </View>
        );
    }


}