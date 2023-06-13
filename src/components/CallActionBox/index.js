import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Text, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import ShortUniqueId from 'short-unique-id';
import storage from '@react-native-firebase/storage';
import ScreenRecorder from 'react-native-screen-mic-recorder';
import {captureScreen} from 'react-native-view-shot';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const CallActionBox = ({onHangupPress, userAuth, userCall}) => {
  console.log('userAuth1: ' + userAuth, userCall);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isRecord, setIsRecord] = useState(false);
  const API_URL =
    Platform.OS === 'ios' ? 'http://localhost:8000' : 'http://10.0.2.2:8000';

  const uid = new ShortUniqueId({length: 4});
  const onReverseCamera = () => {
    console.warn('onReverseCamera');
  };

  const onToggleCamera = () => {
    setIsCameraOn(currentValue => !currentValue);
  };

  const onToggleMicrophone = () => {
    setIsMicOn(currentValue => !currentValue);
  };
  const options = {
    mic: false, // defaults to true
  };

  const recordScreen = async () => {
    const recordingStatus = await ScreenRecorder.startRecording(options).catch(
      error => {
        console.warn(error); // handle native error
      },
    );

    if (recordingStatus === 'started') {
      Alert.alert('Start record');
    }
    if (recordingStatus === 'userDeniedPermission')
      Alert.alert('Plesae grant permission in order to record screen');

    setIsRecord(currentValue => !currentValue);
  };

  const stopRecord = async () => {
    const uri = await ScreenRecorder.stopRecording().catch(
      error => console.warn(error), // handle native error
    );
    Alert.alert(uri);
    console.log(uri);
    pushData(uri, 'Video');
    setIsRecord(currentValue => !currentValue);
  };
  const pushData = async (url, type) => {
    const uidNow = uid();
    storage()
      .ref(
        `${userAuth}/call/${userCall}/${type}Call-${uidNow}/${type}Call-${uidNow}`,
      )
      .putFile(url)
      .catch(error => {
        console.log(error);
      });
    try {
      const payload = {
        urlUpload: `${userAuth}/call/${userCall}/${type}Call-${uidNow}/${type}Call-${uidNow}`,
        type: 'video',
      };
      console.log(payload);

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
          console.log(deepFakeData);
        } else {
          // Xử lý khi gọi findface API không thành công
          console.error('Call to findface API failed.');
        }
      }, 3000); // Thực hiện sau 3 giây (3000 miliseconds)
    } catch (e) {
      console.log(e);
      Alert.alert(e.name, `Error code: ${e.code}`);
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
