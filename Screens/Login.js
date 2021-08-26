import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';
import {AuthContext} from '../App';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {signIn, refreshToken} = useContext(AuthContext);
  const loginHandler = async () => {
    const setToken = async token => {
      let userToken;

      try {
        userToken = await AsyncStorage.setItem('token', token);
      } catch (e) {
        alert('seting token failed');
      }
    };
    const setType = async type => {
      let userType;

      try {
        userType = await AsyncStorage.setItem('type', type);
      } catch (e) {
        alert('seting type failed');
      }
    };
    const setID = async ID => {
      let userID;

      try {
        userID = await AsyncStorage.setItem('ID', ID.toString());
      } catch (e) {
        alert('seting ID failed');
      }
    };
    const getAppid = async () => {
      let app_id;
      try {
        app_id = await AsyncStorage.getItem('app_id');
        return app_id;
      } catch (e) {
        alert('geting token failed');
      }
    };

    if (/\S+@\S+\.\S+/.test(email)) {
      const appid = await getAppid();
      console.log('get-token', appid);
      axios
        .post('http://143.110.244.110/tija/frontuser/loginadmin', {
          email: email,
          password: password,
          appid: appid,
        })
        .then(res => res.data)
        .then(res => {
          if (res[0].success == false) {
            Snackbar.show({
              text: res[0].message,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'red',
              action: {
                text: 'dissmiss',
                textColor: 'green',
                onPress: () => {
                  /* Do something. */
                },
              },
            });
          } else {
            const token = res[0].auth_key;
            const type = res[0].type;
            const id = res[0].id;
            console.log(token);
            setToken(token);
            setType(type);
            setID(id);
            signIn({token});
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            const clearAll = async () => {
              try {
                await AsyncStorage.clear();

                refreshToken({token: null});
              } catch (e) {
                refreshToken({token: null});
                alert(e);
              }
            };

            clearAll();
          }
          alert(error);
        });
    } else {
      Snackbar.show({
        text: 'Invalid Eamil',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
        action: {
          text: 'dissmiss',
          textColor: 'green',
          onPress: () => {
            /* Do something. */
          },
        },
      });
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ECF5BD" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <LinearGradient
          colors={['#ECF5BD', '#F5AC4F']}
          style={styles.linearGradient}>
          <View style={styles.container}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>Tija Admin</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  autoCapitalize="none"
                />
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  value={password}
                  onChangeText={text => setPassword(text)}
                />
              </View>
              <TouchableOpacity style={styles.btn} onPress={loginHandler}>
                <Text style={styles.btnText}>Login</Text>
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}>
                {/* <View style={styles.separator}>
                  <View style={styles.separatorLine}></View>

                  <View style={styles.separatorLine}></View>
                </View> */}
                <View style={{marginVertical: 20}}>
                  <Text style={[styles.agreeText, {marginHorizontal: 60}]}>
                    By continuing , you agree to our
                  </Text>
                  <Text style={[styles.agreeText, {marginHorizontal: 20}]}>
                    Term and Service, Privacy Policy, Content Policy
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logo: {height: '70%', alignItems: 'center', justifyContent: 'center'},
  inputContainer: {
    height: '30%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  inputBox: {
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: '#353839',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: 'white',
    shadowOpacity: 0.5,
    shadowRadius: 0.2,
    shadowOffset: {width: -1, height: -1},
    elevation: 5,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Montserrat-Light',
  },

  inputBox: {width: '100%'},
  countryCode: {
    fontSize: 18,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontFamily: 'Montserrat-Light',
  },
  input: {
    backgroundColor: 'white',
    height: 50,
    letterSpacing: 3,
    color: '#151515',
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 10,
  },
  logoText: {
    fontFamily: 'MajorMonoDisplay-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    fontSize: 100,
    color: 'white',
  },
  logoSubText: {
    fontFamily: 'AmaticSC-Regular',
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    letterSpacing: 8,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  separatorLine: {
    backgroundColor: '#b2b2b2',
    width: '30%',
    height: 1,
  },
  agreeText: {
    color: 'white',
    fontFamily: 'Montserrat-Light',
    fontSize: 10,
    marginBottom: 5,
  },
});
