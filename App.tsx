import React from 'react';
import {
  StatusBar,
  StyleSheet
} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import StackNavigator from './src/navigation/StackNavigator';
import Toast from 'react-native-toast-message';

function App(): JSX.Element {
  return (
    <>
      <MenuProvider>
        <StatusBar barStyle={'dark-content'} />
        <StackNavigator />
      </MenuProvider>
      <Toast />
    </>

  );
}

const styles = StyleSheet.create({

});

export default App;
