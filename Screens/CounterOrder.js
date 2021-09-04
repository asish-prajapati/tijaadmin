import React, {useEffect, useState, useContext} from 'react';
import ActionMenuCOrder from '../shared/ActionMenuCOrder';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {Button, DataTable, Provider} from 'react-native-paper';
import {
  FlatList,
  ScrollView,
  View,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';

import {AuthContext} from '../App';
import {getCounterOrders} from '../helpers/dataListHelpers';

const CounterOrder = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const {refreshToken} = useContext(AuthContext);
  const [page, setPage] = React.useState(0);
  const rowsList = [10, 15, 20];
  const [rows, onRowsChange] = React.useState(rowsList[0]);
  const [data, setData] = React.useState([]);
  const from = page * rows;
  const to = Math.min((page + 1) * rows, orders.length);
  var trimStart = page * rows;
  var trimEnd = trimStart + rows;
  const getCOrdersList = () => {
    getCounterOrders(setOrders, refreshToken);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCounterOrders(setOrders, refreshToken);
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    var data = orders.slice(trimStart, trimEnd);
    setData(data);
  }, [page, rows, orders]);
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
                    style={{width: 150, justifyContent: 'center'}}>
                    Product Name
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 250, justifyContent: 'center'}}>
                    Action
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 200, justifyContent: 'center'}}>
                    Order Id
                  </DataTable.Title>

                  <DataTable.Title
                    style={{width: 100, justifyContent: 'center'}}>
                    Price
                  </DataTable.Title>

                  <DataTable.Title
                    style={{width: 200, justifyContent: 'center'}}>
                    Quantity
                  </DataTable.Title>

                  <DataTable.Title
                    style={{width: 300, justifyContent: 'center'}}>
                    Description
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
                            style={[styles.cellStyle, {width: 150}]}>
                            {item.name}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 250}]}>
                            <ActionMenuCOrder
                              order_id={item.id}
                              status={item.status}
                              getCOrdersList={getCOrdersList}
                            />
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 200}]}>
                            {item.order_id}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 100}]}>
                            {item.price}
                          </DataTable.Cell>

                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 200}]}
                            numeric>
                            {item.quantity}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 300}]}>
                            {item.description}
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
              numberOfPages={Math.ceil(orders.length / rows)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${orders.length}`}
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
