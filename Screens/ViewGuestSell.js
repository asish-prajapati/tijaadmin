import React, {useEffect, useState, useContext} from 'react';
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
import {getGuestOrders} from '../helpers/dataListHelpers';
import ActionMenuGSOrder from '../shared/ActionMenuGSOrder';

const ViewGuestSell = ({navigation}) => {
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
  const getGuestOrdersList = () => {
    getGuestOrders(setOrders, refreshToken);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getGuestOrders(setOrders, refreshToken);
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
            Guest Sell
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
                    View Product
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 300, justifyContent: 'center'}}>
                    Action
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 100, justifyContent: 'center'}}>
                    Total Price
                  </DataTable.Title>
                  <DataTable.Title
                    style={{
                      width: 200,
                      justifyContent: 'center',
                    }}>
                    Branch Name
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 150, justifyContent: 'center'}}>
                    Order Status
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 200, justifyContent: 'center'}}>
                    order id
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 200, justifyContent: 'center'}}>
                    Payment id
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 200, justifyContent: 'center'}}>
                    username
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 150, justifyContent: 'center'}}>
                    mobile
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
                            <Button
                              mode="contained"
                              color="coral"
                              onPress={() => {
                                navigation.navigate('SingleOrder', {
                                  products: item.products,
                                });
                              }}>
                              View
                            </Button>
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 300}]}>
                            <ActionMenuGSOrder
                              id={item.id}
                              status={item.status}
                              getGuestOrdersList={getGuestOrdersList}
                            />
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 100}]}
                            numeric>
                            {item.productprice}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 200}]}
                            numeric>
                            {item.branchname}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 150}]}>
                            {item.status}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 200}]}>
                            {item.order_id}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 200}]}>
                            {item.payment_id}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 200}]}>
                            {item.username}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 150}]}>
                            {item.mobile}
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

export default ViewGuestSell;

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
