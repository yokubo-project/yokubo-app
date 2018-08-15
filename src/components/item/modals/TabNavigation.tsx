import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";

import { theme } from "../../../shared/styles";
import ItemsList from "../ItemsList";
import ItemsStats from "../ItemsStats";
import PatchItem from "../PatchItem";

// tslint:disable-next-line:variable-name
const ItemsListStack = createStackNavigator(
    {
        ItemsList
        // PatchItem
    },
    {
        initialRouteName: "ItemsList",
        navigationOptions: {
            headerStyle: {
                backgroundColor: theme.headerBackgroundColor
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                fontWeight: "bold"
            }
        }
    }
);
// tslint:disable-next-line:variable-name
const ItemsStatsStack = createStackNavigator(
    {
        ItemsStats
        // PatchItem
    },
    {
        initialRouteName: "ItemsStats",
        navigationOptions: {
            headerStyle: {
                backgroundColor: theme.headerBackgroundColor
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                fontWeight: "bold"
            }
        }
    }
);

// tslint:disable-next-line:variable-name
const Tab = createBottomTabNavigator(
    {
        ItemsListStack,
        ItemsStatsStack
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === "ItemsListStack") {
                    iconName = "md-list";
                } else if (routeName === "ItemsStatsStack") {
                    iconName = "md-stats";
                }

                return <Ionicons name={iconName} size={35} color={tintColor} />;
            }
        }),
        tabBarOptions: {
            activeTintColor: "#333333",
            inactiveTintColor: "#a9a9a9",
            showLabel: false
        }
    });

export default Tab;
