import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import storage from '@react-native-firebase/storage';
import ScreenRecorder from 'react-native-screen-mic-recorder';
import Toast from 'react-native-toast-message';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const CallActionBox = ({
  onHangupPress,
  userAuth,
  userCall,
  onMuteCall,
  onToggleVideoSend,
}) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const API_URL =
    Platform.OS === 'ios' ? 'http://localhost:8000' : 'http://10.0.2.2:8000';

  const getCurrentTimestamp = () => {
    return Math.floor(Date.now() / 1000);
  };
  const onReverseCamera = () => {
    console.warn('onReverseCamera');
  };

  const onToggleCamera = () => {
    onToggleVideoSend(!isCameraOn);
    setIsCameraOn(currentValue => !currentValue);
  };

  const onToggleMicrophone = () => {
    onMuteCall(!isMicOn);

    setIsMicOn(currentValue => !currentValue);
  };
  const options = {
    mic: false, // defaults to true
  };

  const recordScreen = async () => {
    const recordingStatus = await ScreenRecorder.startRecording(options).catch(
      error => {
        Toast.show({
          type: 'error',
          text1: 'Thông báo',
          text2: `Thông báo lỗi : ${error}`,
          position: 'top',
          visibilityTime: 3000, // Adjust the duration as needed
          autoHide: true,
        });
      },
    );

    if (recordingStatus === 'userDeniedPermission')
      Toast.show({
        type: 'info',
        text1: 'Thông báo',
        text2: 'Vui lòng cấp quyền để ghi lại màn hình',
        position: 'top',
        visibilityTime: 3000, // Adjust the duration as needed
        autoHide: true,
      });
  };

  const stopRecord = async () => {
    const uri = await ScreenRecorder.stopRecording().catch(
      error => {
        Toast.show({
          type: 'error',
          text1: 'Thông báo',
          text2: `Thông báo lỗi : ${error}`,
          position: 'top',
          visibilityTime: 3000, // Adjust the duration as needed
          autoHide: true,
        });
      }, // handle native error
    );
    Toast.show({
      type: 'info',
      text1: 'Thông báo',
      text2: 'Khuôn mặt đã được tải lên, vui lòng đợi 1p để xác minh',
      position: 'top',
      visibilityTime: 3000, // Adjust the duration as needed
      autoHide: true,
    });

    pushData(uri, 'Video');
  };
  const pushData = async (url, type) => {
    const uidNow = getCurrentTimestamp();
    storage()
      .ref(
        `${userAuth}/call/${userCall}/${type}Call-${uidNow}/${type}Call-${uidNow}`,
      )
      .putFile(url)
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Thông báo',
          text2: `Thông báo lỗi :${error}`,
          position: 'top',
          visibilityTime: 3000, // Adjust the duration as needed
          autoHide: true,
        });
      });
    try {
      const payload = {
        urlUpload: `${userAuth}/call/${userCall}/${type}Call-${uidNow}/${type}Call-${uidNow}`,
        type: 'video',
      };

      setTimeout(async () => {
        const findFaceResponse = await fetch(`${API_URL}/api/findface`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (findFaceResponse.ok) {
          const deepFakeResponse = await fetch(`${API_URL}/api/deepfake`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          // Xử lý dữ liệu trả về từ deepfake API
          const deepFakeData = await deepFakeResponse.json();
          Toast.show({
            type: 'success',
            text1: 'Thông báo',
            text2: 'Xác thực hoàn tất, bạn có thể kiểm tra tại profile',
            position: 'top',
            visibilityTime: 3000, // Adjust the duration as needed
            autoHide: true,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Thông báo',
            text2: 'Lỗi hệ thống trong nhận diện khuôn mặt giả!',
            position: 'top',
            visibilityTime: 3000, // Adjust the duration as needed
            autoHide: true,
          });
        }
      }, 10000); // Thực hiện sau 3 giây (3000 miliseconds)
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: e.name,
        text2: `Error code: ${e.code}`,
        position: 'top',
        visibilityTime: 3000, // Adjust the duration as needed
        autoHide: true,
      });
    }
  };
  return (
    <View style={styles.buttonsContainer}>
      <Pressable onPress={onReverseCamera} style={styles.iconButton}>
        <Ionicons name="ios-camera-reverse" size={30} color={'white'} />
      </Pressable>

      <Pressable onPress={onToggleCamera} style={styles.iconButton}>
        <MaterialIcons
          name={isCameraOn ? 'camera-off' : 'camera'}
          size={30}
          color={'white'}
        />
      </Pressable>

      <Pressable onPress={onToggleMicrophone} style={styles.iconButton}>
        <MaterialIcons
          name={isMicOn ? 'microphone-off' : 'microphone'}
          size={30}
          color={'white'}
        />
      </Pressable>

      <Pressable style={styles.iconButton}>
        <Menu>
          <MenuTrigger>
            <Entypo name="dots-three-vertical" size={30} color={'white'} />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={recordScreen}>
              <MaterialIcons
                name={isMicOn ? 'microphone-off' : 'microphone'}
                size={30}
                color={'white'}
              />
              <Text style={{color: 'red'}}>Start Record</Text>
            </MenuOption>
            <MenuOption onSelect={stopRecord} text="Stop Record" />
          </MenuOptions>
        </Menu>
      </Pressable>
      <Pressable
        onPress={onHangupPress}
        style={[styles.iconButton, {backgroundColor: 'red'}]}>
        <MaterialIcons name="phone-hangup" size={30} color={'white'} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: '#333333',
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 50,
  },
});

export default CallActionBox;
