import React, {useState, useEffect} from 'react';
import {
  Button,
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {Voximplant} from 'react-native-voximplant';
import dummyContacts from '../../../assets/data/contacts.json';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ListItem, Avatar} from 'react-native-elements';

const ContactsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(dummyContacts);

  const navigation = useNavigation();
  const voximplant = Voximplant.getInstance();

  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      navigation.navigate('IncomingCall', {call: incomingCallEvent.call});
    });

    return () => {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  }, []);

  useEffect(() => {
    const newContacts = dummyContacts.filter(contact =>
      contact.user_display_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
    setFilteredContacts(newContacts);
  }, [searchTerm]);

  const callUser = user => {
    navigation.navigate('Calling', {user});
  };

  return (
    <View style={styles.page}>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
        placeholder="Search..."
      />

      <FlatList
        data={filteredContacts}
        renderItem={({item}) => (
          <View styles={{flex: 1}}>
            <ListItem key={item.user_id} bottomDivider>
              <Avatar rounded size="large" source={{uri: item.avatarUrl}} />
              <ListItem.Content>
                <ListItem.Title>{item.user_name}</ListItem.Title>
                <ListItem.Subtitle>{item.user_display_name}</ListItem.Subtitle>
              </ListItem.Content>
              <Pressable
                onPress={() => callUser(item)}
                style={styles.iconButton}>
                <MaterialIcons name="video-call" size={30} color={'white'} />
              </Pressable>
            </ListItem>
          </View>
        )}
        keyExtractor={user => user.user_id.toString()}
        // renderItem={getUserItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 15,
    backgroundColor: 'white',
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    marginVertical: 10,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  viewContact: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 10,
  },
  textInformation: {
    color: '#26A69A',
    marginTop: 5,
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 50,
  },
});

export default ContactsScreen;
