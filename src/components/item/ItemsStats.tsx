import { observer } from "mobx-react";
import * as moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, List } from "react-native-elements";
import { HeaderBackButton } from "react-navigation";

import NavigationButton from "../../shared/components/NavigationButton";
import { formatDuration } from "../../shared/helpers";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import taskStore, { IFullTask } from "../../state/taskStore";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    scrollViewContainer: {
        flexGrow: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    listElement: {
        backgroundColor: theme.backgroundColor,
        paddingTop: 12,
        paddingBottom: 12,
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderColor: "gray",
        marginLeft: 0
    },
    listText: {
        // ...material.body1,
        color: theme.inputTextColor,
        fontSize: 14,
        marginLeft: 10
    },
    metricTextHeader: {
        color: theme.textColor,
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 15
    },
    metricText: {
        color: theme.inputTextColor,
        fontSize: 14,
        marginLeft: 15
    }
});

interface IState {
    task: IFullTask;
}

interface IProps {
    task: IFullTask;
    headerText: string;
    navigation: any;
}

@observer
export default class ItemStats extends React.Component<IProps, IState> {

    static navigationOptions = ({ navigation }: any) => {
        const taskName = navigation.getParam("taskName");
        const task = navigation.getParam("task");

        return {
            headerLeft: (
                <HeaderBackButton
                    tintColor="white"
                    onPress={() => { navigation.navigate("Tasks"); }}
                />
            ),
            title: taskName,
            headerRight: (
                <View>
                    <NavigationButton
                        navigation={navigation}
                        additionalProps={{ task }}
                        navigateToScreen="CreateItem"
                        ioniconName="md-add"
                        ioniconColor="white"
                    />
                </View>
            )
        };
    }

    // tslint:disable-next-line:member-ordering
    constructor(props: IProps) {
        super(props);

        const activeTask = taskStore.getActiveTask();
        this.state = {
            task: activeTask
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            taskName: this.getHeaderText(),
            task: this.state.task
        });
    }

    getHeaderText() {
        return this.state.task.name.length > 12 ?
            `${this.state.task.name.slice(0, 12)}...` :
            this.state.task.name;
    }

    renderEntryStatictics(entries: any) {
        const metrices = [];
        let timespan: any = null;
        entries.forEach(entry => {
            const ms = entry.duration * 1000;

            if (timespan !== null) {
                timespan.totalValue += ms;
                timespan.minValue = ms < timespan.minValue ? ms : timespan.minValue;
                timespan.maxValue = ms > timespan.maxValue ? ms : timespan.maxValue;
            } else {
                timespan = {
                    metricKey: "duration",
                    metricName: "Duration",
                    totalValue: ms,
                    metricUnit: "ms",
                    minValue: ms,
                    maxValue: ms
                };
            }

            if (entry.metricQuantities.length > 0) {
                entry.metricQuantities.forEach(metric => {
                    const metricObject = metrices.filter(metricOb => metricOb.metricName === metric.metric.name);
                    if (metricObject.length > 0) {
                        metricObject[0].totalValue += parseFloat(metric.quantity);
                        metricObject[0].minValue =
                            parseFloat(metric.quantity) < metricObject[0].minValue ? parseFloat(metric.quantity) : metricObject[0].minValue;
                        metricObject[0].maxValue =
                            parseFloat(metric.quantity) > metricObject[0].maxValue ? parseFloat(metric.quantity) : metricObject[0].maxValue;
                    } else {
                        metrices.push({
                            metricKey: metric.uid,
                            metricName: metric.metric.name,
                            totalValue: parseFloat(metric.quantity),
                            metricUnit: metric.metric.unit,
                            minValue: parseFloat(metric.quantity),
                            maxValue: parseFloat(metric.quantity)
                        });
                    }
                });
            }
        });

        const renderedMetrices = metrices.map(metric => (
            <View key={metric.metricKey} style={styles.listElement}>
                <Text style={styles.metricTextHeader}>{metric.metricName}</Text>
                <Text style={styles.metricText}>{i18n.t("itemStats.total")}: {metric.totalValue} {metric.metricUnit}</Text>
                <Text style={styles.metricText}>
                    {i18n.t("itemStats.average")}: {(metric.totalValue / entries.length).toFixed(2)} {metric.metricUnit}
                </Text>
                <Text style={styles.metricText}>{i18n.t("itemStats.min")}:  {metric.minValue} {metric.metricUnit}</Text>
                <Text style={styles.metricText}>{i18n.t("itemStats.max")}:  {metric.maxValue} {metric.metricUnit}</Text>
            </View>
        ));

        renderedMetrices.unshift(
            <View key={"duration"} style={styles.listElement}>
                <Text style={styles.metricTextHeader}>{timespan.metricName}</Text>
                <Text style={styles.metricText}>
                    {i18n.t("itemStats.total")}:
                    {Math.floor(moment.duration(timespan.totalValue).asHours()) + moment.utc(timespan.totalValue).format("[h] mm[m] ss[s]")}
                </Text>
                <Text style={styles.metricText}>
                    {i18n.t("itemStats.average")}:
                    {
                        Math.floor(moment.duration(
                            timespan.totalValue / entries.length).asHours()) + moment.utc(timespan.totalValue / entries.length
                            ).format("[h] mm[m] ss[s]")
                    }
                </Text>
                <Text style={styles.metricText}>
                    {i18n.t("itemStats.min")}:
                    {Math.floor(moment.duration(timespan.minValue).asHours()) + moment.utc(timespan.minValue).format("[h] mm[m] ss[s]")}
                </Text>
                <Text style={styles.metricText}>
                    {i18n.t("itemStats.max")}:
                    {Math.floor(moment.duration(timespan.maxValue).asHours()) + moment.utc(timespan.maxValue).format("[h] mm[m] ss[s]")}
                </Text>
            </View>);

        renderedMetrices.unshift(
            <View key={"count"} style={styles.listElement}>
                <Text style={styles.metricTextHeader}>{i18n.t("itemStats.items")}</Text>
                <Text style={styles.metricText}>{i18n.t("itemStats.total")}: {entries.length}</Text>
            </View>);

        return renderedMetrices;
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <ScrollView style={styles.scrollViewContainer}>
                    <List containerStyle={{ marginBottom: 20, borderTopWidth: 0, marginLeft: 0, paddingLeft: 0, marginTop: 0 }}>
                        {this.renderEntryStatictics(this.state.task.items)}
                    </List>
                </ScrollView>
            </View>
        );
    }

}
