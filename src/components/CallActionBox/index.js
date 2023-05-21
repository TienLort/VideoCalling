import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Text, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import ShortUniqueId from 'short-unique-id';
import storage from '@react-native-firebase/storage';
import ScreenRecorder from 'react-native-screen-mic-recorder';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const CallActionBox = ({onHangupPress}) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isRecord, setIsRecord] = useState(false);
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
    getData(uri);
    setIsRecord(currentValue => !currentValue);
  };
  const getData = url => {
    storage()
      .ref(`upload/VideoCall-${uid()}`)
      .putFile(url)
      .catch(error => {
        console.log(error);
      });
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
