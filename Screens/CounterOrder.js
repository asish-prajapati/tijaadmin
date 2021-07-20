import React, {useEffect, useState, useContext} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {Button, DataTable} from 'react-native-paper';
import axios from 'axios';
import {
  FlatList,
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';

import {AuthContext} from '../App';
import {getCounterOrders} from '../helpers/dataListHelpers';

const CounterOrder = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const {refreshToken} = useContext(AuthContext);

  useEffect(() => {
    getCounterOrders(setOrders, refreshToken);
  }, []);
  return (
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
            Counter Orders
          </Text>
        </View>
        <DataTable>
          <ScrollView horizontal>
            <View>
              <DataTable.Header>
                <DataTable.Title style={{width: 50, justifyContent: 'center'}}>
                  SNo.
                </DataTable.Title>
                <DataTable.Title style={{width: 100, justifyContent: 'center'}}>
                  View Product
                </DataTable.Title>
                <DataTable.Title style={{width: 200, justifyContent: 'center'}}>
                  Branch Name
                </DataTable.Title>

                <DataTable.Title style={{width: 100, justifyContent: 'center'}}>
                  Order Status
                </DataTable.Title>
                <DataTable.Title style={{width: 250, justifyContent: 'center'}}>
                  order id
                </DataTable.Title>
                <DataTable.Title style={{width: 250, justifyContent: 'center'}}>
                  Payment id
                </DataTable.Title>
                <DataTable.Title style={{width: 200, justifyContent: 'center'}}>
                  username
                </DataTable.Title>
                <DataTable.Title style={{width: 100, justifyContent: 'center'}}>
                  mobile
                </DataTable.Title>
              </DataTable.Header>
              <FlatList
                data={orders}
                keyExtractor={(item, index) => index}
                renderItem={({item, index, separators}) => {
                  return (
                    <View>
                      <DataTable.Row>
                        <DataTable.Cell style={[styles.cellStyle, {width: 50}]}>
                          {index + 1}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cellStyle, {width: 100}]}>
                          <Button
                            mode="contained"
                            color="coral"
                            onPress={() => {
                              navigation.navigate('SingleCounterOrder', {
                                products: item.products,
                              });
                            }}>
                            View
                          </Button>
                        </DataTable.Cell>

                        <DataTable.Cell
                          style={[styles.cellStyle, {width: 200}]}
                          numeric>
                          {item.branchname}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cellStyle, {width: 100}]}>
                          {item.status}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cellStyle, {width: 250}]}>
                          {item.order_id}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cellStyle, {width: 250}]}>
                          {item.payment_id}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cellStyle, {width: 200}]}>
                          {item.username}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cellStyle, {width: 100}]}>
                          {item.mobile}
                        </DataTable.Cell>
                      </DataTable.Row>
                    </View>
                  );
                }}
              />
            </View>
          </ScrollView>
        </DataTable>
      </View>
    </>
  );
};

export default CounterOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
  },
  cellStyle: {
    borderRightWidth: 1,
    justifyContent: 'center',
    borderRightColor: '#D3D3D3',
  },
});
