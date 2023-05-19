import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Navigation from "./src/navigation";
import { MenuProvider } from 'react-native-popup-menu';

function App(): JSX.Element {
  return (
    <MenuProvider>
      <StatusBar barStyle={'dark-content'} />
      <Navigation />
    </MenuProvider>

  );
}

const styles = StyleSheet.create({

});

export default App;
