import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Header, Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

interface Props {
}
 
interface State {
  inputUsernameError: boolean,
  inputPasswordError: boolean
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#F5FCFF',
  } as ViewStyle,
  signUpText: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  } as TextStyle,
  forgotPwdText: {
    marginBottom: 20,
    backgroundColor: 'green',
    color: 'orange'
  },
  inputStyle: {
    color: 'black',
    fontSize: 20
  }
});
 
export default class App extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      inputUsernameError: false,
      inputPasswordError: false
    };
  }


  checkUsername(value: any) {
    if (value.length < 10) {
      this.setState({
        inputUsernameError: false
      });
    } else {
      this.setState({
        inputUsernameError: true
      });
    }
  }

  showUsernameError() {
    if (this.state.inputUsernameError) {
      return <FormValidationMessage>Invalid Email</FormValidationMessage>;
    }
    return null;
  }

  checkPassword(value: any) {
    if (value.length < 10) {
      this.setState({
        inputPasswordError: false
      });
    } else {
      this.setState({
        inputPasswordError: true
      });
    }
  }

  showPasswordError() {
    if (this.state.inputPasswordError) {
      return <FormValidationMessage>Invalid Password</FormValidationMessage>;
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>

        <Header
          innerContainerStyles={{flexDirection: 'row'}}
          backgroundColor='#f40057'
          leftComponent={{ icon: 'arrow-back', color: '#fff', underlayColor: 'transparent', onPress: () => {console.log("Left comp was clicked..")} }}
          centerComponent={{ text: 'Sign in to Bode', style: { color: '#fff', fontSize: 20 }  }} 
          statusBarProps={{ barStyle: 'dark-content', translucent: true }}
          outerContainerStyles={{ borderBottomColor:'#85106a',borderBottomWidth:1 }}          
        />

        {/* <FormLabel labelStyle={styles.labelStyle}>Name</FormLabel> */}
        <FormInput 
          inputStyle={styles.inputStyle} 
          placeholder="Email" 
          onChangeText={(e) => this.checkUsername(e)}
          underlineColorAndroid="blue"
          selectionColor="blue" // cursor color
          // placeholderTextColor="blue"
        />
        {this.showUsernameError()}

        {/* <FormLabel labelStyle={styles.labelStyle}>Name</FormLabel> */}
        <FormInput 
          inputStyle={styles.inputStyle} 
          placeholder="Password" 
          onChangeText={(e) => this.checkPassword(e)}
          underlineColorAndroid="blue"
          selectionColor="blue" // cursor color
          // placeholderTextColor="blue"
        />
        {this.showPasswordError()}

        <Button
          raised
          icon={{name: 'home', size: 32}}
          buttonStyle={{backgroundColor: 'red', borderRadius: 10}}
          textStyle={{textAlign: 'center'}}
          title={`Welcome to\nReact Native Elements`}
          onPress={() => {console.log("Button was clicked..")}}
        />

        <Text style={styles.signUpText}>
          {"SIGN UP FOR BODE"}
        </Text>

        <Text style={styles.forgotPwdText}>
          {"FORGOT YOUR PASSWORD?"}
        </Text>        
      </View>
    );
  }

}