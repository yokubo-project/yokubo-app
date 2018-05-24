import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, View, ViewStyle, Text } from "react-native";
import { Header, FormInput, FormValidationMessage, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import DatePicker from "react-native-datepicker";

import taskStore from "../../state/taskStore";
import { IFullTask } from "../../state/taskStore";
import { theme } from "../../shared/styles";
import LoadingIndicatorModal from "../../shared/modals/LoadingIndicatorModal";
import i18n from "../../shared/i18n";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    headerContainer: {
        height: 90,
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    formContainer: {
        flex: 1,
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
    fromDate: string;
    toDate: string;
    metrics: any;
    inputNameError: string;
    inputDateError: string;
    inputMetricsError: string;
    inputGeneralError: string;
    isCreatingItemModalVisible: boolean;
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
            fromDate: null,
            toDate: null,
            metrics: JSON.parse(JSON.stringify(this.props.task.metrics)),
            inputNameError: null,
            inputDateError: null,
            inputMetricsError: null,
            inputGeneralError: null,
            isCreatingItemModalVisible: false
        };
    }

    async createItem() {
        const name = this.state.name;
        const fromDate = this.state.fromDate;
        const toDate = this.state.toDate;

        if (name.length < 3) {
            this.setState({
                inputNameError: i18n.t("createItem.descToShort"),
                inputDateError: null,
                inputMetricsError: null,
                inputGeneralError: null
            });
            return;
        } else if (fromDate === null || toDate === null || fromDate === toDate) {
            this.setState({
                inputNameError: null,
                inputDateError: i18n.t("createItem.invalidDateRange"),
                inputMetricsError: null,
                inputGeneralError: null
            });
            return;
        } else if (this.state.metrics.some(metric => !metric.quantity ? true : false)) {
            this.setState({
                inputNameError: null,
                inputDateError: null,
                inputMetricsError: i18n.t("createItem.incompleteMetrics"),
                inputGeneralError: null
            });
            return;
        }

        const metrics = this.state.metrics.map(metric => {
            return {
                TaskMetricUid: metric.uid,
                quantity: metric.quantity
            };
        });

        this.setState({ isCreatingItemModalVisible: true });
        await taskStore.createItem(this.props.task.uid, {
            name,
            desc: "Desc",
            period: [fromDate, toDate],
            metrics
        });
        if (taskStore.error !== null) {
            switch (taskStore.error) {
                case "InvalidTimePeriod":
                    this.setState({
                        inputNameError: null,
                        inputDateError: i18n.t("createItem.invalidDateRange"),
                        inputGeneralError: null,
                        inputMetricsError: null,
                        isCreatingItemModalVisible: false
                    });
                    break;
                default:
                    this.setState({
                        inputNameError: null,
                        inputDateError: null,
                        inputMetricsError: null,
                        inputGeneralError: i18n.t("createItem.unexpectedError"),
                        isCreatingItemModalVisible: false
                    });
            }
        } else {
            Actions.pop();
        }
    }

    showNameError() {
        if (this.state.inputNameError) {
            return <FormValidationMessage>{this.state.inputNameError}</FormValidationMessage>;
        }
        return null;
    }

    showDateError() {
        if (this.state.inputDateError) {
            return <FormValidationMessage>{this.state.inputDateError}</FormValidationMessage>;
        }
        return null;
    }

    showMetricsError() {
        if (this.state.inputMetricsError) {
            return <FormValidationMessage>{this.state.inputMetricsError}</FormValidationMessage>;
        }
        return null;
    }

    showGeneralError() {
        if (this.state.inputGeneralError) {
            return <FormValidationMessage>{this.state.inputGeneralError}</FormValidationMessage>;
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
                        } as any}
                        centerComponent={{ text: i18n.t("createItem.header"), style: { color: "#fff", fontSize: 20, fontWeight: "bold" } } as any}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>

                {/* Form input for name */}
                <FormInput
                    inputStyle={styles.inputStyle}
                    placeholder={i18n.t("createItem.descPlaceholder")}
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
                    placeholder={i18n.t("createItem.datePickerStartPlaceholder")}
                    format="YYYY-MM-DD HH:mm"
                    confirmBtnText={i18n.t("createItem.datePickerConfirm")}
                    cancelBtnText={i18n.t("createItem.datePickerCancel")}
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
                    placeholder={i18n.t("createItem.datePickerEndPlaceholder")}
                    format="YYYY-MM-DD HH:mm"
                    confirmBtnText={i18n.t("createItem.datePickerCancel")}
                    cancelBtnText={i18n.t("createItem.datePickerCancel")}
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
                {this.showDateError()}

                {this.renderMetrices(this.props.task.metrics)}
                {this.showMetricsError()}

                <View style={styles.formContainer}>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={i18n.t("createItem.createItemButton")}
                        onPress={() => { this.createItem(); }}
                    />
                </View>
                {this.showGeneralError()}

                <LoadingIndicatorModal
                    isVisible={this.state.isCreatingItemModalVisible}
                    loadingText={i18n.t("createItem.loadingIndicator")}
                />
            </View>
        );
    }

}
