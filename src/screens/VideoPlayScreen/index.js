import React, {useState, useEffect} from 'react';
import {
  View,
  ActivityIndicator,
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
import Toast from 'react-native-toast-message';

const {width} = Dimensions.get('window');

const VideoPlayScreen = () => {
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
              Toast.show({
                type: 'error',
                text1: 'Thông báo',
                text2: 'Không tìm thấy kết quả nhận diện',
                position: 'top',
                visibilityTime: 3000, // Adjust the duration as needed
                autoHide: true,
              });
            }
          })
          .catch(error => {
            Toast.show({
              type: 'error',
              text1: 'Thông báo',
              text2: `Lỗi truy vấn dữ liệu: ${error} `,
              position: 'top',
              visibilityTime: 3000, // Adjust the duration as needed
              autoHide: true,
            });
          });
        setVideoPath(dataVid);
        setImagePath(dataImage);

        setIsLoading(false);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Thông báo',
          text2: `Thông báo lỗi: ${error} `,
          position: 'top',
          visibilityTime: 3000, // Adjust the duration as needed
          autoHide: true,
        });
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={{marginTop: 10}}>
        {videoPath.length > 0 ? (
          <Video
            source={videoPath[0].source}
            style={styles.video}
            resizeMode="cover"
            controls={true}
            paused={true}
            poster={imagePath.length > 0 ? imagePath[0].source.uri : ''}
          />
        ) : (
          <Text style={styles.errorToast}>
            Lỗi xử lý trong quá trình lấy video, bạn vui lòng thử lại sau
          </Text>
        )}
      </View>

      <Text>Kêt quả dự đoán:</Text>
      <Text>Phát hiện khuôn mặt {dataResult.result == 0 ? 'Thật' : 'Giả'}</Text>
      <Text>Khuôn mặt được dự đoán với tỷ lệ {dataResult.percent}%</Text>
      <Text>Frame từng khung hình</Text>
      {imagePath.length > 0 ? (
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
                  source={
                    item.source == null
                      ? 'https://firebasestorage.googleapis.com/v0/b/videocall1-51243.appspot.com/o/default-avatar.png?alt=media&token=582d1c2c-aff8-429d-b7ee-c3ba067b0320'
                      : item.source
                  }
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <Text style={{marginTop: 5}}>{item.title}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.errorToast}>
          Lỗi xử lý trong quá trình lấy hình ảnh, bạn vui lòng thử lại sau
        </Text>
      )}

      <Modal
        visible={isImageViewVisible}
        transparent={true}
        onRequestClose={() => setIsImageViewVisible(false)}>
        <ImageViewer
          imageUrls={imagePath}
          index={imageIndex}
          onSwipeDown={() => {}}
          onMove={() => {}}
          enableSwipeDown={true}
        />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorToast: {
    alignContent: 'center',
  },
  video: {
    width: width,
    height: 300,
  },
});

export default VideoPlayScreen;
