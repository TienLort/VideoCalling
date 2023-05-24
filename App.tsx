import React from 'react';
import {
  StatusBar,
  StyleSheet
} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { MenuProvider } from 'react-native-popup-menu';
import BottomTabNavigator from './src/navigation/TabNavigator';
import StackNavigator from './src/navigation/StackNavigator';

function App(): JSX.Element {
  return (
    <MenuProvider>
      <StatusBar barStyle={'dark-content'} />
      <StackNavigator />
    </MenuProvider>
  );
}

const styles = StyleSheet.create({

});

export default App;
