import {useNavigation} from '@react-navigation/core';
import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Entypo from 'react-native-vector-icons/Entypo';
import {Voximplant} from 'react-native-voximplant';
import {APP_NAME, ACC_NAME} from '../../Constants';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const voximplant = Voximplant.getInstance();
  const navigation = useNavigation();

  useEffect(() => {
    const connect = async () => {
      const status = await voximplant.getClientState();
      if (status === Voximplant.ClientState.DISCONNECTED) {
        await voximplant.connect();
      } else if (status === Voximplant.ClientState.LOGGED_IN) {
        redirectHome();
      }
    };

    connect();
  }, []);

  const signIn = async () => {
    try {
      const fqUsername = `${username}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
      await voximplant.login(fqUsername, password);

      redirectHome();
    } catch (e) {
      console.log(e);
      Alert.alert(e.name, `Error code: ${e.code}`);
    }
  };

  const redirectHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Contacts',
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.header}>
        <Text style={styles.message}>Đăng nhập!</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Tài Khoản</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="username"
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Text style={styles.title}>Mật khẩu</Text>
        <View style={styles.password}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="* * * * *"
            style={styles.passwordInput}
            autoCorrect={false}
            secureTextEntry={hidePass ? true : false}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setHidePass(!hidePass)}>
            {hidePass ? (
              <Entypo name="eye" size={25} />
            ) : (
              <Entypo name="eye-with-line" size={25} />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={signIn}>
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRegister}>
          <Text
            style={styles.registerButtonText}
            onPress={() => navigation.navigate('Register')}>
            Chưa có tài khoản? Đăng ký ngay
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38a69d',
  },
  header: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  containerForm: {
    backgroundColor: '#FFF',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#38a69d',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: 'center',
  },
  registerButtonText: {
    color: '#a1a1a1',
  },
  password: {
    borderBottomWidth: 1,
  },
  passwordInput: {
    width: '100%',
  },
  icon: {
    position: 'absolute',
    right: 0,
  },
});
