import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, List } from "react-native-elements";
import { HeaderBackButton, NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import BezierLineChart from "../../shared/components/BezierLineChart";
import ModalButton from "../../shared/components/ModalButton";
import NavigationButton from "../../shared/components/NavigationButton";
import { formatDuration } from "../../shared/helpers";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import taskStore, { IChartData, IFullItem, IFullTask } from "../../state/taskStore";
import FilterMetricsModal from "./modals/FilterMetricsModal";

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
    isFilterMetricsModalVisible: boolean;
    activeMetric: string;
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
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <ModalButton
                        navigation={navigation}
                        getParameter="showFilterMetricsModal"
                        ioniconName="md-funnel"
                        ioniconColor="white"
                        marginRight={5}
                    />
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
            task: activeTask,
            isFilterMetricsModalVisible: false,
            activeMetric: "count"
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            taskName: this.getHeaderText(),
            task: this.state.task,
            showFilterMetricsModal: this.showFilterMetricsModal
        });
    }

    getHeaderText() {
        return this.state.task.name.length > 12 ?
            `${this.state.task.name.slice(0, 12)}...` :
            this.state.task.name;
    }

    showFilterMetricsModal = () => this.setState({
        isFilterMetricsModalVisible: true
    })
    hideFilterMetricsModal = () => this.setState({
        isFilterMetricsModalVisible: false
    })
    filterMetrics = (metricKey: string) => {
        this.setState({
            activeMetric: metricKey,
            isFilterMetricsModalVisible: false
        });
    }

    renderCharts(stats: IChartData) {
        const renderedCharts = [];

        // if metric is duration transform ms to hours, else use raw value
        const dailyData = this.state.activeMetric === "duration" ?
            stats.days.slice(0, 6).map(day => day.dataset.filter(
                d => d.metricKey === this.state.activeMetric)[0].totalValue / (1000 * 60 * 60) // hours
            ) : stats.days.slice(0, 6).map(day => day.dataset.filter(d => d.metricKey === this.state.activeMetric)[0].totalValue);
        const weeklyData = this.state.activeMetric === "duration" ?
            stats.weeks.map(week => week.dataset.filter(
                d => d.metricKey === this.state.activeMetric)[0].totalValue / (1000 * 60 * 60) // hours
            ) : stats.weeks.map(week => week.dataset.filter(d => d.metricKey === this.state.activeMetric)[0].totalValue);
        const monthlyData = this.state.activeMetric === "duration" ?
            stats.months.map(month => month.dataset.filter(
                d => d.metricKey === this.state.activeMetric)[0].totalValue / (1000 * 60 * 60) // hours
            ) : stats.months.map(month => month.dataset.filter(d => d.metricKey === this.state.activeMetric)[0].totalValue);

        // if metric is duration or count perform translation, else use user defined values
        let chartConfig: {
            chartTitle: string;
            yAxisTitle: string;
            decimalPlaces: number;
            backgroundColors: {
                daily: string;
                weekly: string;
                monthly: string;
            };
        };
        if (this.state.activeMetric === "duration") {
            chartConfig = {
                chartTitle: i18n.t("itemChart.duration"),
                yAxisTitle: i18n.t("itemChart.hours"),
                decimalPlaces: 2,
                backgroundColors: theme.chartBackgrounds.duration
            };
        } else if (this.state.activeMetric === "count") {
            chartConfig = {
                chartTitle: i18n.t("itemChart.items"),
                yAxisTitle: i18n.t("itemChart.count"),
                decimalPlaces: 1,
                backgroundColors: theme.chartBackgrounds.count
            };
        } else {
            chartConfig = {
                chartTitle: stats.days[0].dataset.filter(d => d.metricKey === this.state.activeMetric)[0].metricName,
                yAxisTitle: stats.days[0].dataset.filter(d => d.metricKey === this.state.activeMetric)[0].metricUnit,
                decimalPlaces: 2,
                // tslint:disable-next-line:max-line-length
                backgroundColors: theme.chartBackgrounds[`metric${stats.days[0].dataset.findIndex(d => d.metricKey === this.state.activeMetric) - 1}`] ?
                    theme.chartBackgrounds[`metric${stats.days[0].dataset.findIndex(d => d.metricKey === this.state.activeMetric) - 1}`] :
                    theme.backgroundColor
            };
        }

        renderedCharts.push(
            <BezierLineChart
                key="durationDays"
                chartTitle={i18n.t("itemChart.days", { metricName: chartConfig.chartTitle, countDays: 7 })}
                xAxisTitle={i18n.t("itemChart.durationXAxisLabelDays")}
                yAxisTitle={chartConfig.yAxisTitle}
                noDataInfoText={i18n.t("itemChart.noDataInfoText")}
                labels={stats.days.slice(0, 6).map(day => moment(day.date).format("DD.MM.")).reverse()}
                data={dailyData}
                decimalPlaces={chartConfig.decimalPlaces}
                backgroundColor={chartConfig.backgroundColors.daily}
            />
        );

        renderedCharts.push(
            <BezierLineChart
                key="durationWeeks"
                chartTitle={i18n.t("itemChart.weeks", { metricName: chartConfig.chartTitle, countWeeks: 12 })}
                xAxisTitle={i18n.t("itemChart.durationXAxisLabelWeeks")}
                yAxisTitle={chartConfig.yAxisTitle}
                noDataInfoText={i18n.t("itemChart.noDataInfoText")}
                labels={stats.weeks.map(week => moment(week.daterange.start).isoWeek().toString()).reverse()}
                data={weeklyData}
                decimalPlaces={chartConfig.decimalPlaces}
                backgroundColor={chartConfig.backgroundColors.weekly}
            />
        );

        renderedCharts.push(
            <BezierLineChart
                key="durationMonths"
                chartTitle={i18n.t("itemChart.months", { metricName: chartConfig.chartTitle, countMonths: 12 })}
                xAxisTitle={i18n.t("itemChart.durationXAxisLabelMonths")}
                yAxisTitle={chartConfig.yAxisTitle}
                noDataInfoText={i18n.t("itemChart.noDataInfoText")}
                labels={stats.months.map(month => moment(month.daterange.start).format("MM")).reverse()}
                data={monthlyData}
                decimalPlaces={chartConfig.decimalPlaces}
                backgroundColor={chartConfig.backgroundColors.monthly}
            />
        );

        return renderedCharts;
    }

    render() {

        const metrics = this.state.task.metrics;

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
                <FilterMetricsModal
                    isVisible={this.state.isFilterMetricsModalVisible}
                    hide={() => this.hideFilterMetricsModal()}
                    metrics={this.state.task.metrics}
                    filterMetrics={(metricKey) => this.filterMetrics(metricKey)}
                />
            </ScrollView>
        );
    }

}
