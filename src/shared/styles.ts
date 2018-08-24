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
    }
};
