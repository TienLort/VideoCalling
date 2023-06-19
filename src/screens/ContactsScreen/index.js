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
import firestore from '@react-native-firebase/firestore';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Voximplant} from 'react-native-voximplant';
import storage from '@react-native-firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ListItem, Avatar} from 'react-native-elements';

const ContactsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const route = useRoute();
  const {params} = route;
  const param1 = params?.username;
  console.log('vao param nay', params);
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
    const data = [];
    firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          data.push(documentSnapshot.data());
          const newContacts = data.filter(contact =>
            contact.displayName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
          );
          const newContacts1 = newContacts.filter(
            contact => contact.displayName !== param1.username,
          );
          setFilteredContacts(newContacts1);
        });
      });
  }, [searchTerm]);

  const callUser = user => {
    console.log('user o contact', user);
    navigation.navigate('Calling', {
      user,
      userAuth: param1.username,
    });
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
            <ListItem key={item.username} bottomDivider>
              <Avatar
                rounded
                size="large"
                source={{
                  uri:
                    item.photoURL == null
                      ? 'https://firebasestorage.googleapis.com/v0/b/videocall1-51243.appspot.com/o/default-avatar.png?alt=media&token=582d1c2c-aff8-429d-b7ee-c3ba067b0320'
                      : item.photoURL,
                }}
              />
              <ListItem.Content>
                <ListItem.Title>{item.email}</ListItem.Title>
                <ListItem.Subtitle>{item.displayName}</ListItem.Subtitle>
              </ListItem.Content>
              <Pressable
                onPress={() => callUser(item)}
                style={styles.iconButton}>
                <MaterialIcons name="video-call" size={30} color={'white'} />
              </Pressable>
            </ListItem>
          </View>
        )}
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
