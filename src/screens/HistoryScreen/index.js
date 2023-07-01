import React, {useState, useEffect} from 'react';
import folderImg from '../../../assets/images/pngwing.com.png';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/core';
import storage from '@react-native-firebase/storage';

const HistoryScreen = () => {
  const [videoPath, setVideoPath] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const {userContact, userAuth} = route?.params;
  useEffect(() => {
    const reference = storage().ref(`${userAuth}/call/${userContact}`);
    const data = [];
    const fetchData = async () => {
      const folderList = await reference.listAll();
      for (const folderRef of folderList.prefixes) {
        const dataFolder = folderRef.fullPath;
        const dataFolderName =
          dataFolder.split('/')[dataFolder.split('/').length - 1];
        data.push(dataFolderName);
      }
      setVideoPath(data);
    };
    fetchData();
  }, []);

  const showDetail = folderName => {
    navigation.navigate('VideoPlay', {
      path: `${userAuth}/call/${userContact}/${folderName}`,
    });
  };

  return (
    <ScrollView>
      {videoPath.map((item, index) => (
        <Pressable onPress={() => showDetail(item)} key={index}>
          <View style={styles.folderContainer}>
            <Image source={folderImg} style={styles.folderImage} />
            <Text style={styles.folderName}>{item}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  video: {
    width: 200,
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  folderContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  folderImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  folderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
