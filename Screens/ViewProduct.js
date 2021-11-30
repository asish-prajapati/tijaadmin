import React, {useEffect, useState, useContext} from 'react';
import {DataTable, Provider} from 'react-native-paper';
import IconAnt from 'react-native-vector-icons/AntDesign';
import ActionMenu from '../shared/ActionMenu';
import Switch from '../shared/Switch';

import {
  FlatList,
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  StatusBar
  ,RefreshControl
} from 'react-native';
import {AuthContext} from '../App';
import {getProducts} from '../helpers/dataListHelpers';

const ViewProduct = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const {refreshToken} = useContext(AuthContext);
  const [page, setPage] = React.useState(0);
  const rowsList = [10, 15, 20];
  const [rows, onRowsChange] = React.useState(rowsList[0]);
  const [data, setData] = React.useState([]);
  const from = page * rows;
  const to = Math.min((page + 1) * rows, products.length);
  var trimStart = page * rows;
  var trimEnd = trimStart + rows;
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getProducts(setProducts, refreshToken);
    setRefreshing(false);
  }, []);

  const getProductList = () => {
    getProducts(setProducts, refreshToken);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProducts(setProducts, refreshToken);
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    var data = products.slice(trimStart, trimEnd);
    setData(data);
  }, [page, rows, products]);
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
            Products
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
                    style={{
                      width: 200,
                      justifyContent: 'center',
                    }}>
                    Branch Name
                  </DataTable.Title>
                  <DataTable.Title
                    style={{
                      width: 200,
                      justifyContent: 'center',
                    }}>
                    Category Name
                  </DataTable.Title>
                  <DataTable.Title
                    style={{
                      width: 100,
                      justifyContent: 'center',
                    }}>
                    Stock Status
                  </DataTable.Title>
                  <DataTable.Title
                    style={{
                      width: 200,
                      justifyContent: 'center',
                    }}>
                    Name
                  </DataTable.Title>
                  <DataTable.Title
                    style={{
                      width: 300,
                      justifyContent: 'center',
                    }}>
                    Description
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 50, justifyContent: 'center'}}>
                    Price
                  </DataTable.Title>
                  {/* <DataTable.Title
                    style={{width: 50, justifyContent: 'center'}}>
                    Image
                  </DataTable.Title> */}

                  <DataTable.Title
                    style={{width: 150, justifyContent: 'center'}}>
                    Action
                  </DataTable.Title>
                </DataTable.Header>
                <FlatList
                  data={data}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  renderItem={({item, index, separators}) => {
                    return (
                      <>
                        <DataTable.Row>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 50}]}>
                            {index + 1}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 200}]}
                            numeric>
                            {item.branchname}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 200}]}>
                            {item.categoryname}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 100}]}>
                            <Switch status={item.status} id={item.id} />
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 200}]}
                            numeric>
                            {item.name}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 300}]}
                            numeric>
                            {item.description}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 50}]}
                            numeric>
                            {item.price}
                          </DataTable.Cell>

                          {/* <DataTable.Cell
                            style={[styles.cellStyle, {width: 50}]}
                            numeric>
                            <Image
                              source={{uri: item.image}}
                              style={{width: 40, height: 40}}
                            />
                          </DataTable.Cell> */}

                          <DataTable.Cell
                            style={[styles.cellStyle, {width: 150}]}>
                            <ActionMenu
                              item={item}
                              navigation={navigation}
                              showEdit={true}
                              editRoute="EditProduct"
                              status={item.status}
                              showEnbDsb={true}
                              enbdsbRoute="enbdisbproduct"
                              getProductList={getProductList}
                            />
                          </DataTable.Cell>
                        </DataTable.Row>
                      </>
                    );
                  }}
                />
              </View>
            </ScrollView>

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(products.length / rows)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${products.length}`}
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

export default ViewProduct;

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
