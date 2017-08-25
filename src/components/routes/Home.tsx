import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    } as ViewStyle,
})

export default class Component extends React.Component<null, null> {

    render() {
        return (
            <View style={styles.mainContainer}>
                <Text onPress={() => { Actions.login() }}>
                    Home
                 </Text>
            </View>
        )
    }

}