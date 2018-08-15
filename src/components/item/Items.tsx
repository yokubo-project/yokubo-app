import { observer } from "mobx-react";
import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, Icon } from "react-native-elements";
import TabNavigator from "react-native-tab-navigator";

import NavigationButton from "../../shared/components/NavigationButton";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import { IFullTask } from "../../state/taskStore";
import ItemsList from "./ItemsList";
import ItemsStats from "./ItemsStats";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    welcomeScreenContainer: {
        flexGrow: 1,
        backgroundColor: theme.backgroundColor,
        justifyContent: "center",
        alignItems: "center"
    } as ViewStyle,
    welcomeScreen: {
        flex: 1,
        color: theme.textColor,
        textAlign: "center",
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 20
    } as TextStyle
});

interface IState {
    selectedTab: string;
}

interface IProps {
    navigation: any;
    task: IFullTask;
}
@observer
export default class Items extends React.Component<IProps, IState> {

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.welcomeScreenContainer}>
                    <Text style={styles.welcomeScreen}>
                        {i18n.t("items.welcome", { taskName: this.props.navigation.state.params.task.name })} {"\n"}
                        {i18n.t("items.getStarted")}
                    </Text>
                </View>
            </View>
        );
    }

}
