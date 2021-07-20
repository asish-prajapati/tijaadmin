import React from 'react';
import {View, Text, ScrollView, FlatList, StyleSheet} from 'react-native';
import IconM from 'react-native-vector-icons//MaterialIcons';
import {DataTable} from 'react-native-paper';

export default function SingleCounterOrder({navigation, route}) {
  const {products} = route.params;
  return (
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
          Counter Order Detail
        </Text>
      </View>
      <DataTable>
        <ScrollView horizontal>
          <View>
            <DataTable.Header>
              <DataTable.Title style={{width: 50, justifyContent: 'center'}}>
                SNo.
              </DataTable.Title>
              <DataTable.Title style={{width: 200, justifyContent: 'center'}}>
                Product Name
              </DataTable.Title>
              <DataTable.Title style={{width: 100, justifyContent: 'center'}}>
                Price
              </DataTable.Title>
              <DataTable.Title style={{width: 100, justifyContent: 'center'}}>
                Quantity
              </DataTable.Title>
              <DataTable.Title style={{width: 250, justifyContent: 'center'}}>
                Description
              </DataTable.Title>
            </DataTable.Header>
            <FlatList
              data={products}
              keyExtractor={(item, index) => index}
              renderItem={({item, index, separators}) => {
                return (
                  <View>
                    <DataTable.Row>
                      <DataTable.Cell style={[styles.cellStyle, {width: 50}]}>
                        {index + 1}
                      </DataTable.Cell>
                      <DataTable.Cell style={[styles.cellStyle, {width: 200}]}>
                        {item.name}
                      </DataTable.Cell>
                      <DataTable.Cell style={[styles.cellStyle, {width: 100}]}>
                        {item.price}
                      </DataTable.Cell>
                      <DataTable.Cell style={[styles.cellStyle, {width: 100}]}>
                        {item.order_quantity}
                      </DataTable.Cell>
                      <DataTable.Cell style={[styles.cellStyle, {width: 250}]}>
                        {item.description}
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
  cellStyle: {
    borderRightWidth: 1,
    justifyContent: 'center',
    borderRightColor: '#D3D3D3',
  },
});
