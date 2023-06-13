import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/core';
import storage from '@react-native-firebase/storage';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';

const HistoryScreen = () => {
  // Render each video item
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoPath, setVideoPath] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const {userContact, userAuth} = route?.params;
  useEffect(() => {
    const reference = storage().ref(`${userAuth}/call/${userContact}`);
    const data = [];
    const fetchData = async () => {
      // You can await here
      const folderList = await reference.listAll();
      for (const folderRef of folderList.prefixes) {
        const dataFolder = folderRef.fullPath;
        const dataFolderName =
          dataFolder.split('/')[dataFolder.split('/').length - 1];
        data.push(dataFolderName);
      }
      setVideoPath(data);

      // folderList.items.forEach(async folder => {
      //   console.log(folder);
      //   const url = await storage().ref(folder.fullPath).getDownloadURL();
      //   // console.log(url);
      //   data.push({
      //     id: folder.fullPath.split('/').pop(),
      //     url: url,
      //     thumbnail:
      //       'https://firebasestorage.googleapis.com/v0/b/videocall1-51243.appspot.com/o/default-avatar.png?alt=media&token=582d1c2c-aff8-429d-b7ee-c3ba067b0320',
      //   });
      //   setVideoPath(data);
      // });
    };
    fetchData();
  }, []);

  const showDetail = folderName => {
    navigation.navigate('VideoPlay', {
      path: `${userAuth}/call/${userContact}/${folderName}`,
    });
  };

  return (
    <View>
      {/* <FlatList
        data={videoPath}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({item, index}) => {
          // <TouchableOpacity onPress={() => handleTogglePlay(item)}>
          //   <View style={styles.videoContainer}>
          //     {currentVideo === item.id ? (
          //       <View>
          //         <Video
          //           source={{
          //             uri: item.url,
          //           }}
          //           style={styles.video}
          //           resizeMode="cover"
          //           repeat={true}
          //           paused={false}
          //         />
          //       </View>
          //     ) : (
          //       <Image
          //         source={{uri: item.thumbnail}}
          //         style={styles.thumbnail}
          //       />
          //     )}
          //   </View>
          // </TouchableOpacity>
          return (
            <ScrollView style={{marginTop: 10}}>
              <VideoPlayer
                video={{uri: item.url}}
                autoplay={false}
                defaultMuted={true}
                showDuration={true}
                controlsTimeout={3000}
                disableControlsAutoHide={true}
                videoWidth={1400}
                videoHeight={1000}
                tapAnywhereToPause={true}
                thumbnail={{
                  uri: 'https://fastly.picsum.photos/id/989/536/354.jpg?hmac=VxcXpy_SClu7tyi7VoEqlxnyZqgNcMYdWO8gB28XxZQ',
                }}
              />
            </ScrollView>
          );
        }}
        contentContainerStyle={{padding: 10}}
      /> */}
      {videoPath.map((item, index) => (
        <Pressable onPress={() => showDetail(item)} key={index}>
          <Text>{item}</Text>
        </Pressable>
      ))}
    </View>
    // numColumns={2}
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
});

export default HistoryScreen;
