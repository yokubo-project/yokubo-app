const colors = {
    primary: "#00a3ee",
    secondary: "#a7b3c3",
    light: "#f8fbfd"
    // primary: "#248f24",
    // secondary: "#b0c2a7",
    // light: "#fcfffc"
};

export const theme = {
    backgroundColor: "white",
    headerBackgroundColor: colors.primary,
    spinnerColor: colors.primary,
    borderColor: colors.primary,
    textInput: {
        placeholderTextColor: colors.secondary,
        selectionColor: colors.primary,
        inputColor: "black",
        borderColor: colors.secondary,
        backgroundColor: colors.light
    },
    button: {
        backgroundColor: colors.primary
    },
    text: {
        primaryColor: colors.secondary,
        linkColor: colors.primary
    },
    listItem: {
        underlayColor: colors.light,
        primaryColor: colors.secondary,
        borderColor: colors.secondary,
        backgroundColor: "white"
    },
    tabBar: {
        headerTintColor: "white",
        tabBarInactiveColor: colors.secondary,
        tabBarActiveColor: colors.primary
    },
    chartBackgrounds: {
        duration: {
            daily: "#4CAF50",
            weekly: "#43A047",
            monthly: "#388E3C"
        },
        count: {
            daily: "#2196F3",
            weekly: "#1E88E5",
            monthly: "#1976D2"
        },
        metric1: {
            daily: "#FF9800",
            weekly: "#FB8C00",
            monthly: "#F57C00"
        },
        metric2: {
            daily: "#E91E63",
            weekly: "#D81B60",
            monthly: "#C2185B"
        },
        metric3: {
            daily: "#F44336",
            weekly: "#E53935",
            monthly: "#D32F2F"
        }
    }
};
