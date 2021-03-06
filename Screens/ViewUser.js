import React, {useEffect, useState, useContext} from 'react';
import {DataTable, Provider} from 'react-native-paper';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {getUser} from '../helpers/dataListHelpers';
import {FlatList, ScrollView, View, Image, Text, StatusBar,RefreshControl} from 'react-native';
import {AuthContext} from '../App';
import ActionMenu from '../shared/ActionMenu';
import {ViewScreenStyle} from '../globalStyles';

const ViewUser = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const {refreshToken} = useContext(AuthContext);
  // const [refreshing, setRefreshing] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const rowsList = [10, 15, 20];
  const [rows, onRowsChange] = React.useState(rowsList[0]);
  const [data, setData] = React.useState([]);
  const from = page * rows;
  const to = Math.min((page + 1) * rows, users.length);
  var trimStart = page * rows;
  var trimEnd = trimStart + rows;
  const [refreshing, setRefreshing] = React.useState(false);
   
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getUser(setUsers, refreshToken);
    setRefreshing(false);
  }, []);
  const getUserList = () => {
    getUser(setUsers, refreshToken);
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getUser(setUsers, refreshToken);
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    var data = users?.slice(trimStart, trimEnd);
    setData(data);
  }, [page, rows, users]);

  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={ViewScreenStyle.container}>
        <View style={ViewScreenStyle.header}>
          <IconAnt
            name="menu-unfold"
            size={25}
            onPress={() => {
              navigation.openDrawer();
            }}
          />
          <Text style={{fontSize: 20, marginLeft: 30, fontWeight: 'bold'}}>
            Users
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
                    Name
                  </DataTable.Title>
                  {/* <DataTable.Title
                    style={{width: 50, justifyContent: 'center'}}>
                    Image
                  </DataTable.Title> */}
                  <DataTable.Title
                    style={{width: 200, justifyContent: 'center'}}>
                    Email
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 150, justifyContent: 'center'}}>
                    Mobile
                  </DataTable.Title>
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
                            style={[ViewScreenStyle.cellStyle, {width: 50}]}>
                            {index + 1}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[ViewScreenStyle.cellStyle, {width: 200}]}
                            numeric>
                            {item.name}
                          </DataTable.Cell>
                          {/* <DataTable.Cell
                            style={[ViewScreenStyle.cellStyle, {width: 50}]}
                            numeric>
                            <Image
                              source={{uri: item.image}}
                              style={{width: 40, height: 40}}
                            />
                          </DataTable.Cell> */}
                          <DataTable.Cell
                            style={[ViewScreenStyle.cellStyle, {width: 200}]}
                            numeric>
                            {item.email}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[ViewScreenStyle.cellStyle, {width: 150}]}
                            numeric>
                            {item.mobile}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[ViewScreenStyle.cellStyle, {width: 150}]}>
                            <ActionMenu
                              navigation={navigation}
                              item={item}
                              showTrans={true}
                              transactionRoute="UserTransaction"
                              showEnbDsb={true}
                              enbdsbRoute="enbdisbu"
                              status={item.status}
                              getUserList={getUserList}
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
              numberOfPages={Math.ceil(users?.length / rows)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${users?.length}`}
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

export default ViewUser;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     paddingHorizontal: 15,
//     marginVertical: 10,
//     flexDirection: 'row',
//   },
//   cellStyle: {
//     borderRightWidth: 1,
//     justifyContent: 'center',
//     borderRightColor: '#D3D3D3',
//   },
// });
