import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, List } from "react-native-elements";
import { HeaderBackButton, NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import BezierLineChart from "../../shared/components/BezierLineChart";
import NavigationButton from "../../shared/components/NavigationButton";
import { formatDuration } from "../../shared/helpers";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import taskStore, { IChartData, IFullItem, IFullTask } from "../../state/taskStore";

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
export default class ItemsCharts extends React.Component<IProps, IState> {

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

    renderCharts(stats: IChartData) {
        const renderedCharts = [];

        renderedCharts.push(
            <BezierLineChart
                key="durationDays"
                chartTitle={i18n.t("itemChart.durationDays", { countDays: 7 })}
                xAxisTitle={i18n.t("itemChart.durationXAxisLabelDays")}
                yAxisTitle={i18n.t("itemChart.durationYAxisLabel")}
                noDataInfoText={i18n.t("itemChart.noDataInfoText")}
                labels={stats.days.slice(0, 6).map(day => moment(day.date).format("DD.MM.")).reverse()}
                data={stats.days.slice(0, 6).map(day => day.totalValue / (1000 * 60 * 60)).reverse()} // hours
            />
        );

        renderedCharts.push(
            <BezierLineChart
                key="durationWeeks"
                chartTitle={i18n.t("itemChart.durationWeeks", { countWeeks: 12 })}
                xAxisTitle={i18n.t("itemChart.durationXAxisLabelWeeks")}
                yAxisTitle={i18n.t("itemChart.durationYAxisLabel")}
                noDataInfoText={i18n.t("itemChart.noDataInfoText")}
                labels={stats.weeks.map(week => moment(week.daterange.start).isoWeek().toString()).reverse()}
                data={stats.weeks.map(week => week.totalValue / (1000 * 60 * 60)).reverse()} // hours
            />
        );

        renderedCharts.push(
            <BezierLineChart
                key="durationMonths"
                chartTitle={i18n.t("itemChart.durationMonths", { countMonths: 12 })}
                xAxisTitle={i18n.t("itemChart.durationXAxisLabelMonths")}
                yAxisTitle={i18n.t("itemChart.durationYAxisLabel")}
                noDataInfoText={i18n.t("itemChart.noDataInfoText")}
                labels={stats.months.map(month => moment(month.daterange.start).format("MM")).reverse()}
                data={stats.months.map(month => month.totalValue / (1000 * 60 * 60)).reverse()} // hours
            />
        );

        return renderedCharts;
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
                    {this.renderCharts(this.state.task.chartData)}
                </List>
            </ScrollView>
        );
    }

}
