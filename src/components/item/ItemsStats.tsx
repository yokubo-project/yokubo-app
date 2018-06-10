import { observer } from "mobx-react";
import * as moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, List } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import { formatDuration } from "../../shared/helpers";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import { IFullTask } from "../../state/taskStore";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    headerContainer: {
        height: 90,
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
    handleOnAddIconClick(): void;
}

@observer
export default class Component extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            task: this.props.task
        };
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
                        centerComponent={{ text: this.props.headerText, style: { color: "#fff", fontSize: 20, fontWeight: "bold" } } as any}
                        rightComponent={{
                            icon: "add",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { this.props.handleOnAddIconClick(); }
                        } as any}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>

                <ScrollView style={styles.scrollViewContainer}>
                    <List containerStyle={{ marginBottom: 20, borderTopWidth: 0, marginLeft: 0, paddingLeft: 0, marginTop: 0 }}>
                        {this.renderEntryStatictics(this.state.task.items)}
                    </List>
                </ScrollView>
            </View>
        );
    }

}
