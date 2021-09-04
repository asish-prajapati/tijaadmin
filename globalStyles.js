import {StyleSheet} from 'react-native';

const CreateScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 10,
    flex: 1,
  },
  textInput: {
    marginBottom: 10,
  },
  title: {fontSize: 20, marginLeft: 30, fontWeight: 'bold'},
  btnWrapper: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'coral',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 3,
    marginBottom: 10,
  },
});

const ViewScreenStyle = StyleSheet.create({
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

export {CreateScreenStyle, ViewScreenStyle};
