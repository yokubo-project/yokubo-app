import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Header, FormInput, FormValidationMessage, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import activities from "../../state/activities";

const primaryColor1 = "green";

interface State {
    inputName: string;
    inputNameError: string;
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    formContainer: {
        flex: 2,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    inputStyle: {
        color: "black",
        fontSize: 20
    }
});

export default class Component extends React.Component<null, State> {

    constructor(props) {
        super(props);
        this.state = {
            inputName: "",
            inputNameError: null
        };
    }

    async createActivity() {
        await activities.createActivity({ name: this.state.inputName });
        Actions.pop();
    }

    parseName(value: any) {
        this.setState({
            inputName: value
        });
    }

    showNameError() {
        if (this.state.inputNameError) {
            return <FormValidationMessage>{this.state.inputNameError}</FormValidationMessage>;
        }
        return null;
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={primaryColor1}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: "New Activity", style: { color: "#fff", fontSize: 20 } }}
                        statusBarProps={{ barStyle: "dark-content", translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <FormInput
                    inputStyle={styles.inputStyle}
                    placeholder="Enter activity name"
                    onChangeText={(e) => this.parseName(e)}
                    underlineColorAndroid={primaryColor1}
                    selectionColor="black" // cursor color
                />
                {this.showNameError()}

                <View style={styles.formContainer}>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"CREATE"}
                        onPress={() => { this.createActivity(); }}
                    />
                </View>

            </View>
        );
    }

}
