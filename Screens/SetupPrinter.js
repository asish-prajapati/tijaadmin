import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Button,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {AuthContext, StateContext} from '../App';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';

const SetupPrinter = () => {
  const {state} = useContext(StateContext);
  const [loading, setLoading] = useState(false);
  const {loadPairedDs, setBt, setBoundAddress, setBoundName} =
    useContext(AuthContext);

  const _renderRow = rows => {
    let items = [];
    for (let i in rows) {
      let row = rows[i];
      if (row.address) {
        items.push(
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 5,
              marginVertical: 2,
              backgroundColor:
                state.boundAddress == row.address ? 'green' : 'grey',
            }}
            key={new Date().getTime() + i}
            onPress={() => {
              //   this.setState({
              //     loading: true,
              //   });
              setLoading(true);
              BluetoothManager.connect(row.address).then(
                s => {
                  console.log(`connected${row.address}`);
                  setBoundAddress(row.address);
                  setBoundName(row.name);
                  setLoading(false);
                  //   this.setState({
                  //       loading:false,
                  //       boundAddress:row.address,
                  //       name:row.name || "UNKNOWN"
                  //   })
                },
                e => {
                  //   this.setState({
                  //       loading:false
                  //   })
                  setLoading(false);
                  alert(e);
                },
              );
            }}>
            <Text>{row.name || 'UNKNOWN'}</Text>
            <Text>{row.address}</Text>
          </TouchableOpacity>,
        );
      }
    }
    return items;
  };

  return (
    <View style={{paddingHorizontal: 20}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text>Connected Device : </Text>
        <Text>{state.boundAddress}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text>Connected Device Name :</Text>
        <Text>
          {!state.boundName ? 'No device Connected' : state.boundName}
        </Text>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text>BlueTooth : </Text>
        <Text>{state.bleOpened ? 'ON' : 'OFF'}</Text>
      </View>
      <Switch
        value={state.bleOpened}
        onValueChange={v => {
          //   this.setState({
          //     loading: true,
          //   });
          setLoading(true);
          if (!v) {
            BluetoothManager.disableBluetooth().then(
              () => {
                setBt(false);
                loadPairedDs([]);
                setBoundName('');
                setLoading(false);
                // this.setState({
                //     bleOpend:false,
                //     loading:false,
                //     foundDs:[],
                //     pairedDs:[]
                // });
              },
              err => {
                alert(err);
              },
            );
          } else {
            BluetoothManager.enableBluetooth().then(
              r => {
                var paired = [];
                if (r && r.length > 0) {
                  for (var i = 0; i < r.length; i++) {
                    try {
                      paired.push(JSON.parse(r[i]));
                    } catch (e) {
                      //ignore
                    }
                  }
                }
                console.log(paired);
                loadPairedDs(paired);
                setBt(true);
                setLoading(false);
                // this.setState({
                //     bleOpend:true,
                //     loading:false,
                //     pairedDs:paired
                // })
              },
              err => {
                // this.setState({
                //   loading: false,
                // });
                setLoading(false);
                alert(err);
              },
            );
          }
        }}
      />

      <Text>paired device</Text>
      {loading ? <ActivityIndicator animating={true} /> : null}
      {/* <View style={{flex: 1, flexDirection: 'column'}}> */}
      <ScrollView style={{marginBottom: 10}}>
        {_renderRow(state.pairedDs)}
      </ScrollView>

      <Button
        onPress={async () => {
          //   await BluetoothEscposPrinter.printBarCode(
          //     '123456789012',
          //     BluetoothEscposPrinter.BARCODETYPE.JAN13,
          //     3,
          //     120,
          //     0,
          //     2,
          //   );
          //   await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
          await BluetoothEscposPrinter.printPic(logo, {width: 200, left: 40});
        }}
        title="Test Printer"
      />
    </View>
  );
};

const logo =
  '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';

export default SetupPrinter;
