import React from "react";
import { StyleSheet, View, ViewStyle, Text } from "react-native";
import { Header, FormInput, FormValidationMessage, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import DatePicker from "react-native-datepicker";

import activities from "../../state/activities";

const primaryColor1 = "green";

interface State {
    inputName: string;
    inputNameError: string;
    inputDate: string;
}

interface Props {
    uid: string;
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

export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            inputName: "",
            inputNameError: null,
            inputDate: null
        };
    }

    async createEntry() {
        activities.createEntry({
            uid: this.props.uid,
            name: this.state.inputName,
            datum: this.state.inputDate
        });
        Actions.pop();
    }

    parseName(value: any) {
        this.setState({
            inputName: value
        });
    }

    parseDate(value: any) {
        this.setState({
            inputDate: value
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
                        centerComponent={{ text: "New Entry", style: { color: "#fff", fontSize: 20 } }}
                        statusBarProps={{ barStyle: "dark-content", translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <Text>
                    {`Creating entry for, ${this.props.uid}`}
                </Text>

                {/* Form input for name */}
                <FormInput
                    inputStyle={styles.inputStyle}
                    placeholder="Enter entry name"
                    onChangeText={(e) => this.parseName(e)}
                    underlineColorAndroid={primaryColor1}
                    selectionColor="black" // cursor color
                />
                {this.showNameError()}

                {/* Form input for date */}
                <DatePicker
                    style={{ width: 300 }}
                    date={this.state.inputDate}
                    mode="datetime"
                    placeholder="Select date and time"
                    format="YYYY-MM-DD HH:mm"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={(date) => {
                        this.parseDate(date);
                    }}
                    customStyles={{
                        dateInput: {
                            borderWidth: 0,
                            marginLeft: 16,
                        },
                        dateText: {
                            fontSize: 20,
                            position: "absolute",
                            left: 0,
                            marginLeft: 0
                        },
                        placeholderText: {
                            fontSize: 20,
                            position: "absolute",
                            left: 0,
                            marginLeft: 0
                        }
                    }}
                />
                {/* Line: Because datepicker line is not customizable we draw a line manually */}
                <View
                    style={{
                        borderBottomColor: primaryColor1,
                        marginLeft: 20,
                        marginRight: 20,
                        borderBottomWidth: 1,
                    }}
                />

                <View style={styles.formContainer}>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"CREATE"}
                        onPress={() => { this.createEntry(); }}
                    />
                </View>

            </View>
        );
    }

}
