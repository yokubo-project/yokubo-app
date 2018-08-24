import { observer } from "mobx-react";
import React from "react";
import { EmitterSubscription, Keyboard, ScrollView, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import { FormInput, FormValidationMessage, Header } from "react-native-elements";
import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import Button from "../../shared/components/Button";
import DatePicker from "../../shared/components/DatePicker";
import LoadingIndicatorModal from "../../shared/components/LoadingIndicatorModal";
import ModalButton from "../../shared/components/ModalButton";
import TextInputField from "../../shared/components/TextInputField";
import TextInputFieldWithLabel from "../../shared/components/TextInputFieldWithLabel";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import taskStore, { IItem } from "../../state/taskStore";
import DeleteItemModal from "./modals/DeleteItemModal";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    buttonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: theme.backgroundColor,
        marginBottom: 30
    } as ViewStyle,
    inputStyle: {
        color: theme.textInput.inputColor,
        fontSize: 18,
        flex: 1,
        borderWidth: 1,
        borderColor: theme.textInput.borderColor,
        borderRadius: 3,
        margin: 15,
        marginBottom: 0,
        padding: 8,
        backgroundColor: theme.textInput.backgroundColor
    }
});

interface IState {
    name: string;
    desc: string | null;
    fromDate: string;
    toDate: string;
    metrics: any;
    isDeleteItemModalVisible: boolean;
    inputNameError: string;
    inputDescError: string;
    inputDateError: string;
    inputMetricsError: string;
    inputGeneralError: string;
    isPatchingItemModalVisible: boolean;
    keyboardOpen: boolean;
    keyboardHeight: number;
}

interface IProps {
    navigation: NavigationScreenProp<{
        params: {
            taskUid: string;
            item: any;
        };
    } & {
        [prop: string]: any;
    }, any>;
}

@observer
export default class PatchItem extends React.Component<IProps, IState> {
    keyboardDidHideListener: EmitterSubscription;
    keyboardDidShowListener: EmitterSubscription;

    static navigationOptions = ({ navigation }: any) => {
        const itemName = navigation.getParam("itemName");

        return {
            title: itemName,
            headerRight: (
                <ModalButton
                    navigation={navigation}
                    getParameter="showDeleteModal"
                    ioniconName="md-trash"
                    ioniconColor="white"
                />
            )
        };
    }

    // tslint:disable-next-line:variable-name
    _showDeleteModal = () => {
        this.setState({ isDeleteItemModalVisible: true });
    }

    // tslint:disable-next-line:member-ordering
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: this.props.navigation.state.params.item.name,
            desc: this.props.navigation.state.params.item.desc,
            fromDate: this.props.navigation.state.params.item.period[0],
            toDate: this.props.navigation.state.params.item.period[1],
            metrics: JSON.parse(JSON.stringify(this.props.navigation.state.params.item.metricQuantities)),
            isDeleteItemModalVisible: false,
            inputNameError: null,
            inputDescError: null,
            inputDateError: null,
            inputMetricsError: null,
            inputGeneralError: null,
            isPatchingItemModalVisible: false,
            keyboardOpen: false,
            keyboardHeight: 0
        };
    }

    componentDidMount() {
        const item = this.props.navigation.state.params.item;

        this.props.navigation.setParams({
            itemName: item.name.length > 15 ? `${item.name.slice(0, 15)}...` : `${item.name}`,
            showDeleteModal: this._showDeleteModal
        });

        this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    // tslint:disable-next-line:function-name
    _keyboardDidShow(event: any) {
        this.setState({
            keyboardOpen: true,
            keyboardHeight: event.endCoordinates.height || 200
        });
    }

    // tslint:disable-next-line:function-name
    _keyboardDidHide() {
        this.setState({ keyboardOpen: false });
    }

    async patchItem() {
        const name = this.state.name;
        const desc = this.state.desc;
        const fromDate = this.state.fromDate;
        const toDate = this.state.toDate;

        if (name.length < 3) {
            this.setState({
                inputNameError: i18n.t("patchItem.descToShort"),
                inputDateError: null,
                inputMetricsError: null,
                inputGeneralError: null
            });

            return;
        } else if (fromDate === null || toDate === null || fromDate === toDate) {
            this.setState({
                inputNameError: null,
                inputDateError: i18n.t("patchItem.invalidDateRange"),
                inputMetricsError: null,
                inputGeneralError: null
            });

            return;
        } else if (this.state.metrics.some(metric => !metric.quantity ? true : false)) {
            this.setState({
                inputNameError: null,
                inputDateError: null,
                inputMetricsError: i18n.t("patchItem.incompleteMetrics"),
                inputGeneralError: null
            });

            return;
        }

        const metrics = this.state.metrics.map(metric => {
            return {
                uid: metric.uid,
                quantity: metric.quantity
            };
        });

        this.setState({ isPatchingItemModalVisible: true });
        await taskStore.patchItem(this.props.navigation.state.params.taskUid, this.props.navigation.state.params.item.uid, {
            name,
            desc,
            period: [fromDate, toDate],
            metrics
        });
        if (taskStore.error !== null) {
            switch (taskStore.error) {
                case "InvalidTimePeriod":
                    this.setState({
                        inputNameError: null,
                        inputDateError: i18n.t("patchItem.invalidDateRange"),
                        inputMetricsError: null,
                        inputGeneralError: null,
                        isPatchingItemModalVisible: false
                    });
                    break;
                default:
                    this.setState({
                        inputNameError: null,
                        inputDateError: null,
                        inputMetricsError: null,
                        inputGeneralError: i18n.t("patchItem.unexpectedError"),
                        isPatchingItemModalVisible: false
                    });
            }
        } else {
            this.props.navigation.goBack();
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

    passMetricToState(metricUid: string, value: string) {
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
                        <TextInputFieldWithLabel
                            key={metric.uid}
                            label={metric.metric.unit}
                            placeholder={metric.metric.name}
                            defaultValue={metric.quantity.toString()}
                            keyboardType="numeric"
                            onChangeText={(e) => this.passMetricToState(metric.uid, e)}
                        />
                    );
                })}
            </View>
        );
    }

    showDeleteItemModal = () => this.setState({
        isDeleteItemModalVisible: true
    })
    hideDeleteItemModal = () => this.setState({
        isDeleteItemModalVisible: false
    })

    // tslint:disable-next-line:max-func-body-length
    render() {
        return (
            <ScrollView
                style={styles.mainContainer}
                // tslint:disable-next-line:jsx-no-string-ref
                ref="scroll"
                keyboardDismissMode="none"
                keyboardShouldPersistTaps="handled"
            >
                <TextInputField
                    defaultValue={this.state.name}
                    placeholder={this.state.name}
                    onChangeText={(value) => this.setState({ name: value })}
                />
                {this.showNameError()}

                <DatePicker
                    date={this.state.fromDate}
                    placeholder={this.state.fromDate}
                    confirmBtnText={i18n.t("patchItem.datePickerConfirm")}
                    cancelBtnText={i18n.t("patchItem.datePickerCancel")}
                    onDateChange={(date) => this.setState({ fromDate: date })}
                />
                <DatePicker
                    date={this.state.toDate}
                    placeholder={this.state.toDate}
                    confirmBtnText={i18n.t("patchItem.datePickerConfirm")}
                    cancelBtnText={i18n.t("patchItem.datePickerCancel")}
                    onDateChange={(date) => this.setState({ toDate: date })}
                />
                {this.showDateError()}

                {this.renderMetrices(this.state.metrics)}
                {this.showMetricsError()}

                <TextInput
                    style={styles.inputStyle}
                    defaultValue={this.state.desc}
                    placeholder={this.state.desc}
                    placeholderTextColor={theme.textInput.placeholderTextColor}
                    onChangeText={(value) => this.setState({ desc: value })}
                    selectionColor={theme.textInput.selectionColor} // cursor color
                    underlineColorAndroid="transparent"
                    multiline={true}
                    numberOfLines={3}
                    // tslint:disable-next-line:no-console max-line-length
                    onFocus={async () => {
                        setTimeout(
                            () => {
                                (this.refs.scroll as any).scrollToEnd({ animated: true });
                            },
                            250);
                    }}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title={i18n.t("patchItem.updateItemButton")}
                        onPress={() => { this.patchItem(); }}
                    />
                </View>
                {this.showGeneralError()}

                {/*
                    Workaround: rendering of an empty view with the hight of the keyboard
                    in order to make all form fields visible to the user
                */}
                <View style={{ height: this.state.keyboardOpen ? this.state.keyboardHeight : 0 }} />

                <DeleteItemModal
                    navigation={this.props.navigation}
                    isVisible={this.state.isDeleteItemModalVisible}
                    hide={() => this.hideDeleteItemModal()}
                    taskUid={this.props.navigation.state.params.taskUid}
                    item={this.props.navigation.state.params.item}
                />

                <LoadingIndicatorModal
                    isVisible={this.state.isPatchingItemModalVisible}
                    loadingText={i18n.t("patchItem.loadingIndicator")}
                />
            </ScrollView>
        );
    }

}
