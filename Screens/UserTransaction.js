import React, {useEffect, useState, useContext} from 'react';
import {get_transaction} from '../helpers/dataListHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconM from 'react-native-vector-icons/MaterialIcons';
import {Provider, DataTable} from 'react-native-paper';

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

  const [page, setPage] = React.useState(0);
  const rowsList = [10, 15, 20];
  const [rows, onRowsChange] = React.useState(rowsList[0]);
  const [data, setData] = React.useState([]);
  const from = page * rows;
  const to = Math.min((page + 1) * rows, transaction.length);
  var trimStart = page * rows;
  var trimEnd = trimStart + rows;
  const {refreshToken} = useContext(AuthContext);

  useEffect(async () => {
    let response = await get_transaction(userId, refreshToken);

    setTransaction(response[0].transaction);
  }, [userId]);

  React.useEffect(() => {
    var data = transaction.slice(trimStart, trimEnd);
    setData(data);
  }, [page, rows, transaction]);

  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <IconM
            name="arrow-back"
            size={25}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={{fontSize: 20, marginLeft: 30, fontWeight: 'bold'}}>
            User Transaction
          </Text>
        </View>
        <Provider>
          <DataTable style={{flex: 1}}>
            <ScrollView horizontal>
              <View>
                <DataTable.Header>
                  <DataTable.Title
                    style={{width: 50, justifyContent: 'center'}}>
                    SNo.
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 250, justifyContent: 'center'}}>
                    Transaction Id
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 100, justifyContent: 'center'}}>
                    Amount
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 250, justifyContent: 'center'}}>
                    Date
                  </DataTable.Title>
                </DataTable.Header>
                <FlatList
                  data={data}
                  keyExtractor={(item, index) => index}
                  renderItem={({item, index, separators}) => {
                    return (
                      <View>
                        <DataTable.Row>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 50}]}>
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
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(transaction.length / rows)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${transaction.length}`}
              showFastPaginationControls
              numberOfItemsPerPageList={rowsList}
              numberOfItemsPerPage={rows}
              onItemsPerPageChange={onRowsChange}
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </Provider>
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
