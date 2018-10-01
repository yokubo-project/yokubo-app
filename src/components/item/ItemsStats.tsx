import { observer } from "mobx-react";
import * as moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, List } from "react-native-elements";
import { HeaderBackButton, NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import NavigationButton from "../../shared/components/NavigationButton";
import { formatDuration } from "../../shared/helpers";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import taskStore, { IFullTask, IStats } from "../../state/taskStore";
import MetricInfoModal from "../task/modals/MetricInfoModal";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    listElement: {
        backgroundColor: theme.backgroundColor,
        paddingTop: 12,
        paddingBottom: 12,
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderColor: theme.listItem.borderColor,
        marginLeft: 0
    },
    listText: {
        // ...material.body1,
        color: theme.text.primaryColor,
        fontSize: 14,
        marginLeft: 10
    },
    metricTextHeader: {
        color: theme.text.linkColor,
        fontSize: 18,
        marginLeft: 15
    },
    metricText: {
        color: theme.text.primaryColor,
        fontSize: 14,
        marginLeft: 15
    },
    welcomeScreen: {
        flex: 1,
        color: theme.text.primaryColor,
        textAlign: "center",
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 20
    } as TextStyle
});

interface IState {
    task: IFullTask;
}

interface IProps {
    navigation: NavigationScreenProp<any, any>;
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
                        marginRight={15}
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

    renderStats(stats: IStats[]) {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const renderedStats = stats.map(metric => {
            if (metric.metricKey === "duration") {
                return (
                    <View key={metric.metricKey}>
                        <View style={styles.listElement}>
                            <Text style={styles.metricTextHeader}>{i18n.t("itemStats.items")}</Text>
                            <Text style={styles.metricText}>{i18n.t("itemStats.total")}: {metric.totalItems}</Text>
                        </View>
                        <View style={styles.listElement}>
                            <Text style={styles.metricTextHeader}>{metric.metricName}</Text>
                            <Text style={styles.metricText}>
                                {i18n.t("itemStats.total")}:&nbsp;
                            {
                                    Math.floor(moment.duration(metric.totalValue).asHours()) +
                                    moment.utc(metric.totalValue).format("[h] mm[m] ss[s]")
                                }
                            </Text>
                            <Text style={styles.metricText}>
                                {i18n.t("itemStats.average")}:&nbsp;
                            {
                                    Math.floor(moment.duration(metric.averageValue).asHours()) +
                                    moment.utc(metric.averageValue).format("[h] mm[m] ss[s]")
                                }
                            </Text>
                            <Text style={styles.metricText}>
                                {i18n.t("itemStats.min")}:&nbsp;
                            {
                                    Math.floor(moment.duration(metric.minValue).asHours()) +
                                    moment.utc(metric.minValue).format("[h] mm[m] ss[s]")
                                }
                            </Text>
                            <Text style={styles.metricText}>
                                {i18n.t("itemStats.max")}:&nbsp;
                            {
                                    Math.floor(moment.duration(metric.maxValue).asHours()) +
                                    moment.utc(metric.maxValue).format("[h] mm[m] ss[s]")
                                }
                            </Text>
                        </View>
                    </View>
                );
            }

            return (
                <View key={metric.metricKey} style={styles.listElement}>
                    <Text style={styles.metricTextHeader}>{metric.metricName}</Text>
                    <Text style={styles.metricText}>{i18n.t("itemStats.total")}: {metric.totalValue} {metric.metricUnit}</Text>
                    <Text style={styles.metricText}>{i18n.t("itemStats.average")}: {metric.averageValue} {metric.metricUnit}</Text>
                    <Text style={styles.metricText}>{i18n.t("itemStats.min")}: {metric.minValue} {metric.metricUnit}</Text>
                    <Text style={styles.metricText}>{i18n.t("itemStats.max")}: {metric.maxValue} {metric.metricUnit}</Text>
                </View>
            );
        });

        return renderedStats;
    }

    render() {

        if (this.state.task.items.length === 0) {
            return (
                <View style={styles.mainContainer}>
                    <Text style={styles.welcomeScreen}>
                        {i18n.t("items.welcome", { taskName: this.state.task.name })} {"\n"}
                        {i18n.t("items.getStarted")}
                    </Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.mainContainer}>
                <List
                    containerStyle={{
                        marginBottom: 20,
                        borderTopWidth: 0,
                        marginLeft: 0,
                        paddingLeft: 0,
                        marginTop: 0
                    }}
                >
                    {this.renderStats(this.state.task.stats)}
                </List>
            </ScrollView>
        );
    }

}
