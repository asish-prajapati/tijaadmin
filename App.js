import React, {useEffect, useState} from 'react';
import {View, Text as TextRN, StyleSheet} from 'react-native';

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
import SingleOrder from './Screens/SingleOrder';
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
  const initialState = {
    isLoading: true,
    userToken: null,
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
  const [action1Type, setAction1Type] = useState('');
  const [action2Type, setAction2Type] = useState('');
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        dispatch({type: 'SIGN_IN', token: data.token});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      refreshToken: async data => {
        dispatch({type: 'RESTORE_TOKEN', token: data.token});
      },
      loadingTrue: () => {
        dispatch({type: 'LOADING_TRUE'});
      },
    }),
    [],
  );

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
      let response = await acceptCounterFromNotification(orderid);
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
      let msg = remoteMessage.notification.body;
      let title = remoteMessage.notification.title;

      if (alertType == 'type1' && action1 == 1) {
        setAlertType1(true);
        setAlertLeftText('Accept');
        setorderid(orderid);
        setAction1Type('handle1');
        setAlertMsg(msg);
        setAlertTitle(title);
      } else if (alertType == 'type2' && action1 == 1) {
        setAlertType2(true);
        setAlertLeftText('Accept');
        setorderid(orderid);
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
            {state.isLoading ? (
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
              </>
            )}
          </Stack.Navigator>
        </StateContext.Provider>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}

export {App as default, AuthContext, StateContext};
