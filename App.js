import React, {useEffect, useState} from 'react';
import {View, Text as TextRN, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './Screens/Login';
import DrawerNavigator from './navigation/DrawerNavigator';
import Loading from './Screens/Loading';
import SingleOrder from './Screens/SingleOrder';
import SingleCounterOrder from './Screens/SingleCounterOrder';
import UserTransaction from './Screens/UserTransaction';
import AwesomeAlert from 'react-native-awesome-alerts';

const AuthContext = React.createContext();
const StateContext = React.createContext();
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
  const [alertA, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
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
    console.log('Message handled in the background!', remoteMessage);
  });
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // alert(remoteMessage.notification.body);
      setAlert(true);
      setAlertMsg(remoteMessage.notification.body);
      console.log(remoteMessage.notification.body);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
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
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }, []);
  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <StateContext.Provider value={{state}}>
          <AwesomeAlert
            show={alertA}
            showProgress={false}
            title="Wohooo!"
            message={alertMsg}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            confirmText="Accept"
            onConfirmPressed={() => {
              setAlert(false);
            }}
            cancelText="OK!"
            cancelButtonColor="#DD6B55"
            onCancelPressed={() => setAlert(false)}
          />
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="Drawer">
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
