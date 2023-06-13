import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [hidePass, setHidePass] = useState(true);
  const [userAccount, setUserAccount] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const API_URL =
    Platform.OS === 'ios' ? 'http://localhost:8000' : 'http://10.0.2.2:8000';
  const signUp = async () => {
    try {
      const payload = {
        userDisplayName: userAccount,
        userName: username,
        userPassword: password,
      };
      console.log(payload);
      fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(() => {
          const uid = generateUID();
          firestore()
            .collection('Users')
            .doc(userAccount)
            .set({
              displayName: username,
              email: userAccount,
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/videocall1-51243.appspot.com/o/default-avatar.png?alt=media&token=582d1c2c-aff8-429d-b7ee-c3ba067b0320',
              uid: uid,
              providerId: 'password',
              keywords: generateKeywords(username?.toLowerCase() ?? ''),
              createdAt: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              console.log('User added!');
            });
        })
        .catch(err => {
          console.log(err);
        });
      redirectHome();
    } catch (e) {
      console.log(e);
      Alert.alert(e.name, `Error code: ${e.code}`);
    }
  };
  const generateUID = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';

    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uid += characters.charAt(randomIndex);
    }

    return uid;
  };
  const generateKeywords = displayName => {
    const name = displayName.split(' ').filter(word => word);

    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    for (let i = 0; i < length; i++) {
      flagArray[i] = false;
    }

    const createKeywords = name => {
      const arrName = [];
      let curName = '';
      name.split('').forEach(letter => {
        curName += letter;
        arrName.push(curName);
      });
      return arrName;
    };

    const findPermutation = k => {
      for (let i = 0; i < length; i++) {
        if (!flagArray[i]) {
          flagArray[i] = true;
          result[k] = name[i];

          if (k === length - 1) {
            stringArray.push(result.join(' '));
          }

          findPermutation(k + 1);
          flagArray[i] = false;
        }
      }
    };

    findPermutation(0);

    const keywords = stringArray.reduce((acc, cur) => {
      const words = createKeywords(cur);
      return [...acc, ...words];
    }, []);

    return keywords;
  };

  const redirectHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Login',
        },
      ],
    });
  };
  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.header}>
        <Text style={styles.message}>Đăng Ký!</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <View>
          <Text style={styles.title}>Tài khoản</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="username"
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Text style={styles.title}>Tên hiển thị</Text>
          <TextInput
            value={userAccount}
            onChangeText={setUserAccount}
            placeholder="username"
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Text style={styles.title}>Mật Khẩu</Text>
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
          <TouchableOpacity style={styles.buttonRegister}>
            <Text
              style={styles.registerButtonText}
              onPress={() => navigation.navigate('Login')}>
              Đã có tài khoản? Đăng nhập ngay
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={signUp}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};
export default RegisterScreen;

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
    justifyContent: 'space-between',
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
    marginBottom: 36,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButtonText: {
    color: '#a1a1a1',
  },
  icon: {
    position: 'absolute',
    right: 0,
  },
  password: {
    borderBottomWidth: 1,
  },
  passwordInput: {
    width: '100%',
  },
});
