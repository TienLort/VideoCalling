import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import CallActionBox from '../../components/CallActionBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/core';
import {Voximplant} from 'react-native-voximplant';
import {Svg, Rect} from 'react-native-svg';

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [callStatus, setCallStatus] = useState('Initializing...');
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const svgRef = useRef(null);
  const {user, call: incomingCall, isIncomingCall, userAuth} = route?.params;
  const voximplant = Voximplant.getInstance();
  const call = useRef(incomingCall);
  const endpoint = useRef(null);
  const goBack = () => {
    navigation.pop();
  };

  useEffect(() => {
    const getPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const recordAudioGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
      const cameraGranted =
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
      if (!cameraGranted || !recordAudioGranted) {
        Alert.alert('Permissions not granted');
      } else {
        setPermissionGranted(true);
      }
    };

    if (Platform.OS === 'android') {
      getPermissions();
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) {
      return;
    }
    const detectFaces = async () => {
      // const detectFaces = async frame => {
      try {
        // Xử lý frame hình ảnh để nhận diện khuôn mặt

        // Ví dụ: Sử dụng OpenCV để nhận diện khuôn mặt
        // const detectedFaces = await OpenCV.detectFaces(frame);
        console.log('Vao Day');
        // Vẽ ô vuông đỏ trên video
        // drawBoundingBoxes(detectedFaces);
        drawBoundingBoxes();
      } catch (error) {
        console.log('Error detecting faces:', error);
      }
    };

    const drawBoundingBoxes = () => {
      // const drawBoundingBoxes = faces => {
      // const svgWidth = videoRef.current.clientWidth;
      // const svgHeight = videoRef.current.clientHeight;
      const svgWidth = 120;
      const svgHeight = 120;
      console.log('Vao Day lan 2');
      // Xóa các ô vuông đã vẽ trước đó
      svgRef.current && svgRef.current.clear();

      // Vẽ ô vuông đỏ cho mỗi khuôn mặt được nhận diện
      // faces.forEach(face => {
      // const {x, y, width, height} = face;

      const rectProps = {
        // x: (x / videoRef.current.videoWidth) * svgWidth,
        // y: (y / videoRef.current.videoHeight) * svgHeight,
        // width: (width / videoRef.current.videoWidth) * svgWidth,
        // height: (height / videoRef.current.videoHeight) * svgHeight,
        x: 120,
        y: 120,
        width: 120,
        height: 120,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 2,
      };

      svgRef.current && svgRef.current.add(<Rect {...rectProps} />);
    };
    // });

    const handleVideoStream = () => {
      // const handleVideoStream = event => {
      // const frame = event.frameBuffer; // Lấy frame hình ảnh từ video stream

      // Gọi hàm nhận diện khuôn mặt cho mỗi frame
      detectFaces();
      // detectFaces(frame);
    };

    const callSettings = {
      video: {
        sendVideo: true,
        receiveVideo: true,
      },
    };

    const makeCall = async () => {
      call.current = await voximplant.call(user.username, callSettings);
      subscribeToCallEvents();
    };

    const answerCall = async () => {
      subscribeToCallEvents();
      endpoint.current = call.current.getEndpoints()[0];
      subscribeToEndpointEvent();
      call.current.answer(callSettings);
    };

    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, callEvent => {
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setCallStatus('Calling...');
      });
      call.current.on(Voximplant.CallEvents.Connected, callEvent => {
        handleVideoStream();
        setCallStatus('Connected');
      });
      call.current.on(Voximplant.CallEvents.Disconnected, callEvent => {
        navigation.navigate('Contacts');
      });
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        callEvent => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        },
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });
    };

    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );
    };

    const showError = reason => {
      Alert.alert('Call failed', `Reason: ${reason}`, [
        {
          text: 'Ok',
          onPress: navigation.navigate('Contacts'),
        },
      ]);
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return () => {
      call.current.off(Voximplant.CallEvents.Failed);
      call.current.off(Voximplant.CallEvents.ProgressToneStart);
      call.current.off(Voximplant.CallEvents.Connected);
      call.current.off(Voximplant.CallEvents.Disconnected);
    };
  }, [permissionGranted]);

  const onHangupPress = () => {
    call.current.hangup();
  };

  return (
    <View style={styles.page}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" color="white" size={25} />
      </Pressable>

      <Voximplant.VideoView
        videoStreamId={remoteVideoStreamId}
        style={styles.remoteVideo}
      />

      <Voximplant.VideoView
        videoStreamId={localVideoStreamId}
        style={styles.localVideo}
      />
      <Svg
        ref={svgRef}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: '100%',
          height: '100%',
        }}
      />
      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{user?.userAccount}</Text>
        <Text style={styles.phoneNumber}>{callStatus}</Text>
      </View>

      <CallActionBox
        onHangupPress={onHangupPress}
        userAuth={userAuth}
        userCall={user.username}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    height: '100%',
    backgroundColor: '#7b4e80',
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  localVideo: {
    width: 100,
    height: 150,
    backgroundColor: '#ffff6e',

    borderRadius: 10,

    position: 'absolute',
    right: 10,
    top: 100,
  },
  remoteVideo: {
    backgroundColor: '#7b4e80',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 50,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    zIndex: 10,
  },
});

export default CallingScreen;
