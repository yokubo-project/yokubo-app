import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { theme } from "../styles";

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: theme.backgroundColor
    }
});

// tslint:disable-next-line:variable-name
const Spinner = () => {
    return (
        <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={theme.spinnerColor} />
        </View>
    );
};

export default Spinner;
