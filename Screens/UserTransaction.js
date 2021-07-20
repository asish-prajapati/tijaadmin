import React, {useEffect, useState, useContext} from 'react';
import {get_transaction} from '../helpers/dataListHelpers';
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

const UserTransaction = ({navigation, route}) => {
  const {userId} = route.params;
  const [transaction, setTransaction] = useState([]);

  const {refreshToken} = useContext(AuthContext);

  useEffect(async () => {
    let response = await get_transaction(userId, refreshToken);

    setTransaction(response[0].transaction);
  }, [userId]);

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
            Orders
          </Text>
        </View>
        <DataTable>
          <ScrollView horizontal>
            <View>
              <DataTable.Header>
                <DataTable.Title style={{width: 50, justifyContent: 'center'}}>
                  SNo.
                </DataTable.Title>
                <DataTable.Title style={{width: 250, justifyContent: 'center'}}>
                  Transaction Id
                </DataTable.Title>
                <DataTable.Title style={{width: 100, justifyContent: 'center'}}>
                  Amount
                </DataTable.Title>
                <DataTable.Title style={{width: 250, justifyContent: 'center'}}>
                  Date
                </DataTable.Title>
              </DataTable.Header>
              <FlatList
                data={transaction}
                keyExtractor={(item, index) => index}
                renderItem={({item, index, separators}) => {
                  return (
                    <View>
                      <DataTable.Row>
                        <DataTable.Cell style={[styles.cellStyle, {width: 50}]}>
                          {index + 1}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cellStyle, {width: 200}]}>
                          {item.payment_id}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cellStyle, {width: 100}]}>
                          {item.price}
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cellStyle, {width: 250}]}
                          numeric>
                          {item.created_at}
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

export default UserTransaction;

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
