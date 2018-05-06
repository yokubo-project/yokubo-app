import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, View, ViewStyle, Text } from "react-native";
import { Header, FormInput, FormValidationMessage, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import DatePicker from "react-native-datepicker";

import taskStore from "../../state/taskStore";
import { IFullTask } from "../../state/taskStore";
import { theme } from "../../shared/styles";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    formContainer: {
        flex: 2,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    metricInputStyle: {
        color: theme.inputTextColor,
        fontSize: 20,
        width: "100%", // combining width: 100% and minWidth: 50% results in FormInput taking up 50% of screen on vertical axis
        minWidth: "50%",
    },
    inputStyle: {
        color: theme.inputTextColor,
        fontSize: 20,
        width: "100%", // combining width: 100% and minWidth: 50% results in FormInput taking up 50% of screen on vertical axis
        minWidth: "50%",
    },
    unitStyle: {
        textAlign: "left",
        color: theme.inputTextColor,
        fontSize: 20,
        marginLeft: 0,
        paddingTop: 12,
    }
});

interface State {
    name: string;
    nameError: string;
    fromDate: string;
    toDate: string;
    metrics: any;
}

interface Props {
    task: IFullTask;
}
@observer
export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            nameError: null,
            fromDate: null,
            toDate: null,
            metrics: this.props.task.metrics
        };
    }

    async createItem() {
        const mymetrics = this.state.metrics.map(metric => {
            return {
                TaskMetricUid: metric.uid,
                quantity: metric.quantity
            };
        });

        taskStore.createItem(this.props.task.uid, {
            name: this.state.name,
            desc: "Desc",
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

    renderMetrices(metrices: any) {
        return (
            <View>
                {metrices.map(metric => {
                    return (
                        <View key={metric.uid} style={{ flexDirection: "row" }}>
                            <FormInput
                                inputStyle={styles.metricInputStyle}
                                placeholder={metric.name}
                                keyboardType="numeric"
                                onChangeText={(e) => this.passMetricToState(metric.uid, e)}
                                underlineColorAndroid={theme.textColor}
                                selectionColor={theme.inputTextColor} // cursor color
                            />
                            <Text style={styles.unitStyle}>{metric.unit}</Text>
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
                        backgroundColor={theme.backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: "Add Item", style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>

                {/* Form input for name */}
                <FormInput
                    inputStyle={styles.inputStyle}
                    placeholder="Description"
                    onChangeText={(value) => this.setState({ name: value })}
                    underlineColorAndroid={theme.textColor}
                    selectionColor={theme.inputTextColor} // cursor color
                />
                {this.showNameError()}

                {/* Form input for date */}
                <DatePicker
                    style={{ width: 300 }}
                    date={this.state.fromDate}
                    mode="datetime"
                    placeholder="Start Date"
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
                            color: theme.inputTextColor
                        },
                        placeholderText: {
                            fontSize: 20,
                            position: "absolute",
                            left: 0,
                            marginLeft: 0
                        },
                        // dateTouchBody: {borderColor:"red", borderWidth:3} 
                    }}
                />
                {/* Line: Because datepicker line is not customizable we draw a line manually */}
                <View
                    style={{
                        borderBottomColor: theme.textColor,
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
                    placeholder="End Date"
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
                            color: theme.inputTextColor
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
                        borderBottomColor: theme.textColor,
                        marginLeft: 20,
                        marginRight: 20,
                        borderBottomWidth: 1,
                    }}
                />

                {this.renderMetrices(this.props.task.metrics)}

                <View style={styles.formContainer}>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"ADD ITEM"}
                        onPress={() => { this.createItem(); }}
                    />
                </View>
            </View>
        );
    }

}
