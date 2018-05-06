import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, View, ViewStyle, Text } from "react-native";
import { Header, FormInput, FormValidationMessage, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import DatePicker from "react-native-datepicker";

import taskStore from "../../state/taskStore";
import { IItem } from "../../state/taskStore";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

interface State {
    name: string;
    nameError: string;
    fromDate: string;
    toDate: string;
    metrics: any;
}

interface Props {
    taskUid: string;
    item: any; // TODO Typing
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: backgroundColor,
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor
    } as ViewStyle,
    formContainer: {
        flex: 2,
        justifyContent: "space-around",
        backgroundColor
    } as ViewStyle,
    metricInputStyle: {
        color: inputTextColor,
        fontSize: 20,
        width: "100%", // combining width: 100% and minWidth: 50% results in FormInput taking up 50% of screen on vertical axis
        minWidth: "50%",
    },
    inputStyle: {
        color: inputTextColor,
        fontSize: 20,
        width: "100%", // combining width: 100% and minWidth: 50% results in FormInput taking up 50% of screen on vertical axis
        minWidth: "50%",
    },
    unitStyle: {
        textAlign: "left",
        color: inputTextColor,
        fontSize: 20,
        marginLeft: 0,
        paddingTop: 12,
    }
});

@observer
export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.item.name,
            nameError: null,
            fromDate: this.props.item.period[0],
            toDate: this.props.item.period[1],
            metrics: this.props.item.metricQuantities
        };
    }

    async patchItem() {
        const mymetrics = this.state.metrics.map(metric => {
            return {
                uid: metric.uid,
                quantity: metric.quantity
            };
        });

        taskStore.patchItem(this.props.taskUid, this.props.item.uid, {
            name: this.state.name,
            period: [this.state.fromDate, this.state.toDate],
            metrics: mymetrics
        });
        Actions.pop();
    }

    showNameError() {
        if (this.state.nameError) {
            return <FormValidationMessage>{this.state.nameError}</FormValidationMessage>;
        }
        return null;
    }

    passMetricToState(metricUid, value) {
        const inputMetricEntries = this.state.metrics;
        const metricRes = inputMetricEntries.filter(metric => metric.uid === metricUid)[0];
        metricRes.quantity = value;

        this.setState({
            metrics: inputMetricEntries
        });
    }

    handleOnDeleteItemClick(itemUid) {
        taskStore.deleteItem(this.props.taskUid, itemUid);
        Actions.pop();
    }

    renderMetrices(metrices: any) {
        return (
            <View>
                {metrices.map(metric => {
                    return (
                        <View key={metric.uid} style={{ flexDirection: "row" }}>
                            <FormInput
                                inputStyle={styles.metricInputStyle}
                                defaultValue={metric.quantity.toString()}
                                keyboardType="numeric"
                                onChangeText={(e) => this.passMetricToState(metric.uid, e)}
                                underlineColorAndroid={textColor}
                                selectionColor={inputTextColor} // cursor color
                            />
                            <Text style={styles.unitStyle}>{metric.metric.unit}</Text>
                        </View>
                    );
                })}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        rightComponent={{
                            icon: "delete",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { this.handleOnDeleteItemClick(this.props.item.uid); }
                        }}
                        centerComponent={{ text: "Update Item", style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>

                {/* Form input for name */}
                <FormInput
                    inputStyle={styles.inputStyle}
                    defaultValue={this.state.name}
                    onChangeText={(value) => this.setState({ name: value })}
                    underlineColorAndroid={textColor}
                    selectionColor={inputTextColor} // cursor color
                />
                {this.showNameError()}

                {/* Form input for date */}
                <DatePicker
                    style={{ width: 300 }}
                    date={this.state.fromDate}
                    mode="datetime"
                    format="YYYY-MM-DD HH:mm"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={(date) => this.setState({ fromDate: date })}
                    customStyles={{
                        dateInput: {
                            borderWidth: 0,
                            marginLeft: 16,
                        },
                        dateText: {
                            fontSize: 20,
                            position: "absolute",
                            left: 0,
                            marginLeft: 0,
                            color: inputTextColor
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
                        borderBottomColor: textColor,
                        marginLeft: 20,
                        marginRight: 20,
                        borderBottomWidth: 1,
                    }}
                />

                {/* Form input for date */}
                <DatePicker
                    style={{ width: 300 }}
                    date={this.state.toDate}
                    mode="datetime"
                    format="YYYY-MM-DD HH:mm"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={(date) => this.setState({ toDate: date })}
                    customStyles={{
                        dateInput: {
                            borderWidth: 0,
                            marginLeft: 16,
                        },
                        dateText: {
                            fontSize: 20,
                            position: "absolute",
                            left: 0,
                            marginLeft: 0,
                            color: inputTextColor
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
                        borderBottomColor: textColor,
                        marginLeft: 20,
                        marginRight: 20,
                        borderBottomWidth: 1,
                    }}
                />

                {this.renderMetrices(this.state.metrics)}

                <View style={styles.formContainer}>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"UPDATE ITEM"}
                        onPress={() => { this.patchItem(); }}
                    />
                </View>
            </View>
        );
    }

}
