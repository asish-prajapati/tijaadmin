import React, {useEffect, useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFs from 'react-native-vector-icons/FontAwesome5';
import IconMi from 'react-native-vector-icons/MaterialIcons';
import {getDash} from '../helpers/dashboardHelpers';
import {AuthContext, StateContext} from '../App';
import Loading from './Loading';

export default function Dashboard({navigation}) {
  const {refreshToken, loadingTrue} = useContext(AuthContext);
  const {state} = useContext(StateContext);

  const [dashData, setDashData] = useState({
    branch: 0,
    counter: 0,
    user: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uType, setUtype] = useState('');
  const Card = props => {
    const {title, count, iconname, navigationRoute} = props;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          navigationRoute && navigation.navigate(navigationRoute);
        }}>
        <View
          style={{
            backgroundColor: 'white',
            paddingVertical: 1,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            elevation: 4,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: 'coral',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {title}
          </Text>
        </View>
        <View style={{justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <View>
              <View style={{justifyContent: 'space-around'}}>
                <Text
                  style={{
                    fontSize: 40,
                    color: 'white',
                    fontWeight: 'bold',
                    marginLeft: 10,
                  }}>
                  {count}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: 10,
                  padding: 2,
                  marginBottom: 10,
                  width: 60,
                }}>
                <Text style={{color: 'coral'}}>OPEN</Text>
                <IconMi name="keyboard-arrow-right" size={20} />
              </View>
            </View>
            <IconFs
              name={iconname}
              color="white"
              size={50}
              style={{marginRight: 5, textAlignVertical: 'center'}}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        let userType = await AsyncStorage.getItem('type');
        await setUtype(userType);
        let dataObj = await getDash(refreshToken);
        setDashData({
          branch: dataObj.totalbranch,
          counter: dataObj.totalcounter,
          user: dataObj.totalusers,
          orders: dataObj.totalorder,
          // counterOrders:dataObj.totalcounterorder
        });
        setLoading(false);
      } catch {
        alert('Error in Dashboard api');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <View style={styles.container}>
            <View style={styles.header}>
              <IconAnt
                name="menu-unfold"
                size={25}
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
              <Text style={{fontSize: 20, marginLeft: 30, fontWeight: 'bold'}}>
                DashBoard
              </Text>
            </View>
            <View style={styles.content}>
              {uType == 'ADM' ? (
                dashData.branch > 0 ? (
                  <Card
                    title="Total Branch"
                    count={dashData.branch}
                    iconname="code-branch"
                    navigationRoute="ViewBranch"
                  />
                ) : (
                  <Card
                    title="Total Branch"
                    count={0}
                    iconname="code-branch"
                    navigationRoute="ViewBranch"
                  />
                )
              ) : null}
              {uType == 'ADM' || uType == 'branch' ? (
                dashData.counter > 0 ? (
                  <Card
                    title="Total Counter"
                    count={dashData.counter}
                    iconname="address-card"
                    navigationRoute="ViewCounter"
                  />
                ) : (
                  <Card
                    title="Total Counter"
                    count={0}
                    iconname="address-card"
                    navigationRoute="ViewCounter"
                  />
                )
              ) : null}
              {uType == 'ADM' ? (
                dashData.user > 0 ? (
                  <Card
                    title="Total User"
                    count={dashData.user}
                    iconname="users"
                    navigationRoute="ViewUser"
                  />
                ) : (
                  <Card
                    title="Total User"
                    count={0}
                    iconname="users"
                    navigationRoute="ViewUser"
                  />
                )
              ) : null}
              {dashData.orders > 0 ? (
                <Card
                  title="Total Orders"
                  count={dashData.orders}
                  iconname="shopping-cart"
                  navigationRoute={
                    uType == 'counter' ? 'CounterOrder' : 'ViewOrder'
                  }
                />
              ) : (
                <Card
                  title="Total Orders"
                  count={0}
                  iconname="shopping-cart"
                  navigationRoute="ViewOrder"
                />
              )}
            </View>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
  },
  content: {
    // paddingHorizontal: 5,
    paddingVertical: 30,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: '40%',
    height: 110,
    backgroundColor: 'coral',
    marginHorizontal: 10,
    justifyContent: 'space-between',
    borderRadius: 5,
    paddingHorizontal: 5,
    elevation: 5,
    marginVertical: 5,
  },
});
