import React, {useEffect} from 'react';
import {View, Text as TextRN, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './Screens/Login';
import DrawerNavigator from './navigation/DrawerNavigator';
import Loading from './Screens/Loading';
import SingleOrder from './Screens/SingleOrder';
import SingleCounterOrder from './Screens/SingleCounterOrder';
import UserTransaction from './Screens/UserTransaction';

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
  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <StateContext.Provider value={{state}}>
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
