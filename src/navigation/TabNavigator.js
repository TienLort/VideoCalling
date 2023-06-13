import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ColorfulTabBar} from 'react-navigation-tabbar-collection';
import Icon from 'react-native-vector-icons/AntDesign';
import ProfileScreen from '../screens/ProfileScreen';
import ContactsScreen from '../screens/ContactsScreen';
import {useRoute} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const route = useRoute();
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <ColorfulTabBar {...props} />}>
      <Tab.Screen
        name="Contacts1"
        component={ContactsScreen}
        options={{
          title: 'Home',
          icon: ({focused, color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
          color: 'primary',
        }}
        initialParams={{username: route.params?.username}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Storage',
          icon: ({focused, color, size}) => (
            <Icon name="folderopen" size={size} color={color} />
          ),
          color: 'success',
        }}
        initialParams={{username: route.params?.username}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
