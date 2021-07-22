import React, {useEffect, useState, useContext} from 'react';
import {DataTable, Provider} from 'react-native-paper';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {ViewScreenStyle} from '../globalStyles';
import {getCounters} from '../helpers/dataListHelpers';
import {FlatList, ScrollView, View, Image, Text, StatusBar} from 'react-native';
import {AuthContext} from '../App';
import ActionMenu from '../shared/ActionMenu';

const ViewCounter = ({navigation}) => {
  const [counters, setCounters] = useState([]);
  const {refreshToken} = useContext(AuthContext);
  const [page, setPage] = React.useState(0);
  const rowsList = [10, 15, 20];
  const [rows, onRowsChange] = React.useState(rowsList[0]);
  const [data, setData] = React.useState([]);
  const from = page * rows;
  const to = Math.min((page + 1) * rows, counters.length);
  var trimStart = page * rows;
  var trimEnd = trimStart + rows;
  const getCounterList = () => {
    getCounters(setCounters, refreshToken);
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCounters(setCounters, refreshToken);
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    var data = counters.slice(trimStart, trimEnd);
    setData(data);
  }, [page, rows, counters]);
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
            Counters
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
                    Name
                  </DataTable.Title>
                  <DataTable.Title
                    style={{width: 50, justifyContent: 'center'}}>
                    Image
                  </DataTable.Title>
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
                            {item.branchname}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[ViewScreenStyle.cellStyle, {width: 200}]}
                            numeric>
                            {item.name}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={[ViewScreenStyle.cellStyle, {width: 50}]}
                            numeric>
                            <Image
                              source={{uri: item.image}}
                              style={{width: 40, height: 40}}
                            />
                          </DataTable.Cell>
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
                              item={item}
                              navigation={navigation}
                              showEdit={true}
                              editRoute="EditCounter"
                              status={item.status}
                              showEnbDsb={true}
                              enbdsbRoute="enbdisbcounter"
                              // showDelete={true}
                              // deleteRoute="delete_counter"
                              getCounterList={getCounterList}
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
              numberOfPages={Math.ceil(counters.length / rows)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${counters.length}`}
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

export default ViewCounter;
