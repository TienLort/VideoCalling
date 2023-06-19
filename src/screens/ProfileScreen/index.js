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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ListItem, Image} from 'react-native-elements';
import storage from '@react-native-firebase/storage';
const ProfileScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [callContacts, setCallContacts] = useState([]);
  const route = useRoute();
  const {params} = route;
  const param1 = params?.username;
  const reference = storage().ref(`${param1.username}/call`);
  const navigation = useNavigation();

  useEffect(() => {
    const data = [];
    const fetchData = async () => {
      // You can await here
      const folderList = await reference.listAll();
      folderList.prefixes.forEach(folder => {
        firestore()
          .collection('Users')
          .where('displayName', '==', `${folder.name}`)
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
                contact => contact.username !== param1.username,
              );
              setCallContacts(newContacts1);
            });
          });
      });
    };
    fetchData();
  }, []);

  const showDetail = username => {
    navigation.navigate('History', {
      userContact: username,
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
        data={callContacts}
        renderItem={({item}) => (
          <View styles={{flex: 1}}>
            <ListItem key={item.displayName} style={styles.listItem}>
              <Image
                rounded
                source={{
                  uri:
                    item.photoURL == null
                      ? 'https://firebasestorage.googleapis.com/v0/b/videocall1-51243.appspot.com/o/default-avatar.png?alt=media&token=582d1c2c-aff8-429d-b7ee-c3ba067b0320'
                      : item.photoURL,
                }}
                style={{width: 150, height: 150}}
              />
              <View styles={{flex: 1}}>
                <ListItem.Content>
                  <ListItem.Title>{item.email}</ListItem.Title>
                  <ListItem.Subtitle>{item.displayName}</ListItem.Subtitle>
                </ListItem.Content>
                <Pressable
                  onPress={() => showDetail(item.displayName)}
                  style={styles.iconButton}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    Start
                  </Text>
                </Pressable>
              </View>
            </ListItem>
          </View>
        )}
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
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 50,
  },
  listItem: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});

export default ProfileScreen;
