import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  DeviceEventEmitter,
  NativeEventEmitter,
  Switch,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  // createNavigationContainerRef,
} from '@react-navigation/native';

import Login from './Screens/Login';
import DrawerNavigator from './navigation/DrawerNavigator';
import Loading from './Screens/Loading';
import SetupPrinter from './Screens/SetupPrinter';
import SingleOrder from './Screens/SingleOrder';
import InternetConnection from './Screens/InternetConnection';

import SingleCounterOrder from './Screens/SingleCounterOrder';
import UserTransaction from './Screens/UserTransaction';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  acceptFromNotification,
  acceptCounterFromNotification,
  cancleFromNotification,
} from './helpers/notificationHelpers';

const AuthContext = React.createContext();
const StateContext = React.createContext();
// const navigationRef = createNavigationContainerRef();
const Stack = createStackNavigator();

function App() {
  _listeners = [];
  const initialState = {
    isLoading: true,
    userToken: null,
    devices: null,
    pairedDs: [],
    foundDs: [],
    bleOpened: false,
    loading: true,
    boundAddress: '',
    boundName: '',
    debugMsg: '',
    isTablet: false,
  };
  const reducer = (prevState, action) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
        };
      case 'LOADING_TRUE':
        return {
          ...prevState,
          isLoading: true,
        };
      case 'BLEOPENED':
        return {
          ...prevState,
          bleOpened: action.bleOpened,
        };
      case 'SET_DEVICES':
        return {
          ...prevState,
          devices: action.devices,
        };
      case 'SET_PAIRED':
        return {
          ...prevState,
          pairedDs: action.pairedDs,
        };
      case 'SET_FOUND':
        return {
          ...prevState,
          foundDs: action.foundDs,
        };
      case 'SET_BOUNDADDRESS':
        return {
          ...prevState,
          boundAddress: action.boundAddress,
        };
      case 'SET_BOUND_NAME':
        return {
          ...prevState,
          boundName: action.boundName,
        };
      case 'ISTABLET':
        return {
          ...prevState,
          isTablet: action.isTablet,
        };
    }
  };
  // const navigation = useNavigation();
  const [alertType1, setAlertType1] = useState(false);
  const [alertType2, setAlertType2] = useState(false);
  const [alertType3, setAlertType3] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertLeftText, setAlertLeftText] = useState('');
  const [initialRoute, setInitialRoute] = useState('Drawer');
  const [alertRightText, setAlertRightText] = useState('');
  const [orderid, setorderid] = useState('');
  const [id, setid] = useState('')
  const [action1Type, setAction1Type] = useState('');
  const [action2Type, setAction2Type] = useState('');
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [offline, setOfflineStatus] = useState(false);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      console.log('Connection type - ', state.type);
      console.log('Is connected? - ', state.isConnected);
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
    });

    return () => removeNetInfoSubscription();
  }, []);
  //btprinterStates
  // const [devices, setDevices] = useState(null);
  // const [pairedDs, setPairedDs] = useState([]);
  // const [foundDs, setFoundDs] = useState([]);
  // const [bleOpened, setBleOpened] = useState(false);
  // const [boundAddress, setBoundAddress] = useState('hvjhjj');
  const _deviceAlreadPaired = rsp => {
    var ds = null;
    if (typeof rsp.devices == 'object') {
      ds = rsp.devices;
    } else {
      try {
        ds = JSON.parse(rsp.devices);
      } catch (e) {}
    }
    if (ds && ds.length) {
      let pared = [];
      pared = pared.concat(ds || []);
      dispatch({type: 'SET_PAIRED', pairedDs: pared});
      // this.setState({
      //     pairedDs:pared
      // });
    }
  };

  const _deviceFoundEvent = rsp => {
    //alert(JSON.stringify(rsp))
    var r = null;
    try {
      if (typeof rsp.device == 'object') {
        r = rsp.device;
      } else {
        r = JSON.parse(rsp.device);
      }
    } catch (e) {
      //alert(e.message);
      //ignore
    }
    //alert('f')
    if (r) {
      let found = [];
      if (found.findIndex) {
        let duplicated = found.findIndex(function (x) {
          return x.address == r.address;
        });
        //CHECK DEPLICATED HERE...
        if (duplicated == -1) {
          found.push(r);
          dispatch({type: 'SET_FOUND', foundDs: found});
          // this.setState({
          //     foundDs: found
          // });
        }
      }
    }
  };
  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        dispatch({type: 'SIGN_IN', token: data.token});
      },
      signOut: async () =>
      {
      dispatch({type: 'SIGN_OUT'})
    //  await AsyncStorage.clear()
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('id')


      },
      refreshToken: async data => {
        dispatch({type: 'RESTORE_TOKEN', token: data.token});
      },
      loadingTrue: () => {
        dispatch({type: 'LOADING_TRUE'});
      },
      loadPairedDs: async pairedDslist => {
        dispatch({type: 'SET_PAIRED', pairedDs: pairedDslist});
      },
      setBt: async bt => {
        dispatch({type: 'BLEOPENED', bleOpened: bt});
      },
      setBoundAddress: async boundAddress => {
        dispatch({type: 'SET_BOUNDADDRESS', boundAddress: boundAddress});
      },
      setBoundName: async boundName => {
        dispatch({type: 'SET_BOUND_NAME', boundName: boundName});
      },
    }),
    [],
  );
  useEffect(() => {
    const isTablet = DeviceInfo.isTablet();
    dispatch({type: 'ISTABLET', isTablet: isTablet});
  }, []);

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        dispatch({type: 'BLEOPENED', bleOpened: Boolean(enabled)});
        if (enabled == true) {
          console.log('enabled');
        } else {
          console.log('disabled');
        }
      },
      err => {
        print(err);
      },
    );

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      _listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          rsp => {
            _deviceAlreadPaired(rsp);
          },
        ),
      );
      _listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          rsp => {
            _deviceFoundEvent(rsp);
          },
        ),
      );
      _listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            dispatch({type: 'SET_BOUNDADDRESS', boundAddress: ''});

            // this.setState({
            //   name: '',
            //   boundAddress: '',
            // });
          },
        ),
      );
    } else if (Platform.OS === 'android') {
      console.log('android');
      _listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          rsp => {
            console.log(res.devices);
            console.log('paired');

            _deviceAlreadPaired(rsp);
          },
        ),
      );
      _listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          rsp => {
            _deviceFoundEvent(rsp);
          },
        ),
      );
      _listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            dispatch({type: 'SET_BOUNDADDRESS', boundAddress: ''});
            // this.setState({
            //   name: '',
            //   boundAddress: '',
            // });
          },
        ),
      );
      _listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
          () => {
            ToastAndroid.show(
              'Device Not Support Bluetooth !',
              ToastAndroid.LONG,
            );
          },
        ),
      );
    }
  }, []);

  useEffect(() => {
    const startAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('token');
      } catch (e) {
        alert('restoring token failed');
      }
      if (userToken !== null) {
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      } else {
        dispatch({type: 'RESTORE_TOKEN', token: null});
      }
    };

    startAsync();
  }, []);

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(async app_id => {
        let fcmtoken;
        console.log(app_id);
        fcmtoken = await AsyncStorage.setItem('app_id', app_id);
      })
      .catch(e => {
        alert(e);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh(async app_id => {
      let fcmtoken;
      fcmtoken = await AsyncStorage.setItem('app_id', app_id);
    });
  }, []);
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(
      'Message handled in the background!',
      remoteMessage.data['action'],
    );
    setInitialRoute('ViewOrder');
  });
  const handleAction1 = async () => {
    if (action1Type == 'handle1') {
      console.log('clicked for accept branch/admin');
      console.log(orderid);
      let response = acceptFromNotification(orderid);
      console.log(response);
      setInitialRoute('ViewOrder');
      // if (navigationRef.isReady()) {
      //   navigationRef.navigate('ViewOrder');
      // }
    } else if (action1Type == 'handle2') {
      console.log('clicked for Accept counter');
      let response = await acceptCounterFromNotification(id,orderid);
      console.log(response);
      setInitialRoute('ViewOrder');

      // if (navigationRef.isReady()) {
      //   navigationRef.navigate('ViewOrder');
      // }
    }
  };
  const handleAction2 = async () => {
    let response = await cancleFromNotification(orderid);
    console.log(response);
  };
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      let alertType = remoteMessage.data['type'];
      let action1 = remoteMessage.data['action1'];
      let action2 = remoteMessage.data['action2'];
      let orderid = remoteMessage.data['orderId'];
      let id = remoteMessage.data['id']
      let msg = remoteMessage.notification.body;
      let title = remoteMessage.notification.title;

      if (alertType == 'type1' && action1 == 1) {
        setAlertType1(true);
        setAlertLeftText('Accept');
        setorderid(orderid);
        setid(id)
        setAction1Type('handle1');
        setAlertMsg(msg);
        setAlertTitle(title);
      } else if (alertType == 'type2' && action1 == 1) {
        setAlertType2(true);
        setAlertLeftText('Accept');
        setorderid(orderid);
        setid(id)

        setAlertMsg(msg);
        setAlertTitle(title);
        setAction1Type('handle2');
      } else if (alertType == 'type3') {
        setAlertMsg(msg);
        setAlertTitle(title);
        setAlertType3(true);
      }

      setAlertMsg(remoteMessage.notification.body);
      // setAlertLeftText(remoteMessage.data['accept']);
      // // setAlertLeftUrl(remoteMessage.data['']);
      // setAlertRightText(remoteMessage.data['cancle']);
      console.log(remoteMessage);
      setInitialRoute('ViewOrder');
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.data['action'],
      );
      setInitialRoute('ViewOrder');
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute('ViewOrder');
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }, []);
  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <StateContext.Provider value={{state}}>
          <AwesomeAlert
            show={alertType1}
            showProgress={false}
            title={alertTitle}
            message={alertMsg}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            confirmText={alertLeftText}
            onConfirmPressed={() => {
              handleAction1();
              setAlertType1(false);
            }}
            cancelText="Cancle"
            cancelButtonColor="#DD6B55"
            onCancelPressed={() => {
              handleAction2();
              setAlertType1(false);
            }}
          />
          <AwesomeAlert
            show={alertType2}
            showProgress={false}
            title={alertTitle}
            message={alertMsg}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText={alertLeftText}
            onConfirmPressed={() => {
              handleAction1();
              setAlertType2(false);
            }}
            cancelText={alertRightText}
            cancelButtonColor="#DD6B55"
            onCancelPressed={() => setAlertType2(false)}
          />
          <AwesomeAlert
            show={alertType3}
            showProgress={false}
            title={alertTitle}
            message={alertMsg}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText="ok"
            onConfirmPressed={() => {
              setAlertType3(false);
            }}
            cancelButtonColor="#DD6B55"
            onCancelPressed={() => setAlertType3(false)}
          />
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName={initialRoute}>
            {offline ? (
              <Stack.Screen
                name="InternetConnection"
                component={InternetConnection}
              />
            ) : state.isLoading ? (
              <Stack.Screen name="Loading" component={Loading} />
            ) : !state.userToken ? (
              <Stack.Screen name="Login" component={Login} />
            ) : (
              <>
                <Stack.Screen name="Drawer" component={DrawerNavigator} />
                <Stack.Screen name="SingleOrder" component={SingleOrder} />
                <Stack.Screen
                  name="SingleCounterOrder"
                  component={SingleCounterOrder}
                />
                <Stack.Screen
                  name="UserTransaction"
                  component={UserTransaction}
                />
                <Stack.Screen name="SetupPrinter" component={SetupPrinter} />
              </>
            )}
          </Stack.Navigator>
        </StateContext.Provider>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}

export {App as default, AuthContext, StateContext};
