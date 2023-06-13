import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useRoute} from '@react-navigation/core';
import storage from '@react-native-firebase/storage';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');

const VideoPlayScreen = () => {
  // Render each video item
  const [videoPath, setVideoPath] = useState([]);
  const [imagePath, setImagePath] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataResult, setDataResult] = useState(true);
  const route = useRoute();
  const {path} = route?.params;
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reference = storage().ref(path);
        const folderList = await reference.listAll();
        const dataVid = [];
        const dataImage = [];

        await Promise.all(
          folderList.items.map(async folder => {
            const url = await storage().ref(folder.fullPath).getDownloadURL();
            if (folder.fullPath.split('/').pop().includes('VideoCall')) {
              dataVid.push({
                id: folder.fullPath.split('/').pop(),
                source: {
                  uri: url,
                },
                thumbnail:
                  'https://firebasestorage.googleapis.com/v0/b/videocall1-51243.appspot.com/o/default-avatar.png?alt=media&token=582d1c2c-aff8-429d-b7ee-c3ba067b0320',
              });
            } else {
              dataImage.push({
                title: folder.fullPath.split('/').pop(),
                url: url,
                source: {
                  uri: url,
                },
                width: width,
                freeHeight: true,
              });
            }
          }),
        );
        firestore()
          .collection('Results')
          .doc(path.split('/')[path.split('/').length - 1])
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot.exists) {
              const data = documentSnapshot.data();
              if (data.result === 0) {
                data.percent = (1 - data.percent) * 100;
                data.percent = data.percent.toFixed(2);
              } else if (data.result === 1) {
                data.percent = (data.percent * 100).toFixed(2);
              }
              setDataResult(data);
            } else {
              console.log('Sai me r');
            }
          })
          .catch(error => {
            console.log('Lỗi khi truy vấn dữ liệu:', error);
          });
        setVideoPath(dataVid);
        setImagePath(dataImage);

        setIsLoading(false); // Đặt isLoading thành false khi dữ liệu đã được tải xong
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>; // Hiển thị thông báo Loading trong quá trình tải dữ liệu
  }
  console.log(dataResult);
  return (
    <ScrollView>
      <View style={{marginTop: 10}}>
        <Video
          source={videoPath[0].source}
          style={styles.video}
          resizeMode="cover"
          controls={true}
          paused={true}
          poster={imagePath[0].source.uri}
        />
      </View>
      <Text>Kêt quả dự đoán:</Text>
      <Text>Phát hiện khuôn mặt {dataResult.result == 0 ? 'Thật' : 'Giả'}</Text>
      <Text>Khuôn mặt được dự đoán với tỷ lệ {dataResult.percent}%</Text>
      <Text>Frame từng khung hình</Text>
      {/* <FlatList
        data={imagePath}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({item, index}) => {
          return (
            <View style={{marginTop: 10}}>
              <TouchableOpacity
                key={item.title}
                onPress={() => {
                  setImageIndex(index);
                  setIsImageViewVisible(true);
                }}>
                <Image
                  style={{width: 200, height: 200}}
                  source={item.source}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          );
        }}
        numColumns={2}
        contentContainerStyle={{padding: 10}}
      /> */}
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {imagePath.map((item, index) => (
          <View style={{marginTop: 10, width: '50%', padding: 5}} key={index}>
            <TouchableOpacity
              key={item.title}
              onPress={() => {
                setImageIndex(index);
                setIsImageViewVisible(true);
              }}>
              <Image
                style={{width: '100%', aspectRatio: 1}}
                source={item.source}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <Text style={{marginTop: 5}}>{item.title}</Text>
          </View>
        ))}
      </View>
      <Modal
        visible={isImageViewVisible}
        transparent={true}
        onRequestClose={() => setIsImageViewVisible(false)}>
        <ImageViewer
          imageUrls={imagePath}
          index={imageIndex}
          onSwipeDown={() => {
            console.log('onSwipeDown');
          }}
          onMove={data => console.log(data)}
          enableSwipeDown={true}
        />
      </Modal>
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
    width: width,
    height: 300,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default VideoPlayScreen;
