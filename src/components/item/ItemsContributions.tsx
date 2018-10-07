import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";
import { Header, List } from "react-native-elements";
import { HeaderBackButton, NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import ContributionChart from "../../shared/components/ContributionChart";
import ModalButton from "../../shared/components/ModalButton";
import NavigationButton from "../../shared/components/NavigationButton";
import { formatDuration } from "../../shared/helpers";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import taskStore, { IChartData, IContributionData, IFullItem, IFullTask } from "../../state/taskStore";
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
}

interface IProps {
    navigation: NavigationScreenProp<any, any>;
}

@observer
export default class ItemsContributions extends React.Component<IProps, IState> {

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

    renderContributions(contributionData: IContributionData) {
        const renderedCharts = [];

        contributionData.quarters.forEach(quarter => {
            const commitsData = quarter.dataset.map(e => {
                return {
                    date: moment(e.date).format("YYYY-MM-DD"),
                    // count: e.count
                    count: 3
                };
            });

            renderedCharts.push(
                <ContributionChart
                    key={quarter.daterange.start.toString()}
                    // tslint:disable-next-line:max-line-length
                    chartTitle={`${moment(quarter.daterange.start).quarter()}.${i18n.t("itemContribution.quarter")} ${moment(quarter.daterange.start).year()}`}
                    values={commitsData}
                    endDate={quarter.daterange.end}
                    numDays={moment(quarter.daterange.end).diff(moment(quarter.daterange.start), "days")}
                />
            );
        });

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
                    {this.renderContributions(this.state.task.contributionData)}
                </List>
            </ScrollView>
        );
    }

}
