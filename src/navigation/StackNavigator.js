import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import CallScreen from '../screens/CallScreen';
import ContactsScreen from '../screens/ContactsScreen';
import CallingScreen from '../screens/CallingScreen';
import IncomingCallScreen from '../screens/IncomingCallScreen';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/Wellcome';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BottomTabNavigator from './TabNavigator';
import HistoryScreen from '../screens/HistoryScreen';
import VideoPlayScreen from '../screens/VideoPlayScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            headerTintColor: '#38a69d',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Contacts" component={BottomTabNavigator} />

        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="VideoPlay" component={VideoPlayScreen} />
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="Calling" component={CallingScreen} />
          <Stack.Screen name="IncomingCall" component={IncomingCallScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
