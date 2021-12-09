import { NavigationContainer } from '@react-navigation/native';
import React, { Component, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';

class App extends Component {


  render() {

    return (
        <NavigationContainer>
          <AppNavigator navigation={this.props.navigation} />
        </NavigationContainer>
    );
  }
}
export default App
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
