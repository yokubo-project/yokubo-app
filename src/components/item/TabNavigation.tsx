import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";

import { theme } from "../../shared/styles";
import ItemsList from "./ItemsList";
import ItemsStats from "./ItemsStats";

// tslint:disable-next-line:variable-name
const ItemsListStack = createStackNavigator(
    {
        ItemsList
    },
    {
        initialRouteName: "ItemsList",
        navigationOptions: {
            headerStyle: {
                backgroundColor: theme.headerBackgroundColor
            },
            headerTintColor: theme.tabBar.headerTintColor,
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
    },
    {
        initialRouteName: "ItemsStats",
        navigationOptions: {
            headerStyle: {
                backgroundColor: theme.headerBackgroundColor
            },
            headerTintColor: theme.tabBar.headerTintColor,
            headerTitleStyle: {
                fontWeight: "bold"
            }
        }
    }
);

// tslint:disable-next-line:variable-name
const TabNavigation = createBottomTabNavigator(
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
            activeTintColor: theme.tabBar.tabBarActiveColor,
            inactiveTintColor: theme.tabBar.tabBarInactiveColor,
            showLabel: false
        }
    });

export default TabNavigation;
