import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../apiConfig';
const createFormData = (photo, body = {}) => {
  const data = new FormData();
  if (photo) {
    data.append('image', {
      name: photo.assets[0].fileName,
      type: photo.assets[0].type,
      uri: photo.assets[0].uri,
    });
  }

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

const create_branch = async (imagefile, body) => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios({
      method: 'POST',
      url: `${baseUrl}create_branch`,
      data: createFormData(imagefile, body),

      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    response = await response.data;
    console.log(response);
    return response;
  } catch (e) {
    alert(e);
  }
};

const create_category = async (imagefile, body) => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios({
      method: 'POST',
      url: `${baseUrl}create_category`,
      data: createFormData(imagefile, body),
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    response = await response.data;
    return response;
  } catch (e) {
    alert(e);
  }
};

const create_counter = async (imagefile, body) => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios({
      method: 'POST',
      url: `${baseUrl}create_counter`,
      data: createFormData(imagefile, body),
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    response = await response.data;
    return response;
  } catch (e) {
    alert(e);
  }
};

const create_product = async (imagefile, body) => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios({
      method: 'POST',
      url: `${baseUrl}create_product`,
      data: createFormData(imagefile, body),

      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    response = await response.data;
    return response;
  } catch (e) {
    alert(e);
  }
};

const sell_product = async (body,setLoading) => {
  let userToken = await AsyncStorage.getItem('token');
  console.log(userToken);
  
  try {
    let response = await axios.post(
      `${baseUrl}create_guestsell`,
      body ,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    response = await response.data;
    return response;
    // console.log(response)
  } catch (e) {
    alert(e);
    setLoading(false)
    
  }
};

const getBranch = async (setUtype, setBranchList, setBranch) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');
  console.log("bye")
  console.log(userID)
  setUtype(userType);
  if (userType == 'ADM') {
    axios
      .get(`${baseUrl}viewbranch`, {
        headers: {Authorization: `Bearer ${userToken}`},
      })

      .then(res => {
        res = res.data[0].branch;
        let blist = res.map(item => {
          return {id: item.id, name: item.name};
        });
        setBranchList(blist);
      })
      .catch(err => console.log('getbranch', 'something went wrong' + err));
  }
  if (userType == 'branch') {
    setBranch(userID);
  }

};

const getBranchAndCat = async (
  setUtype,
  setBranchList,
  setBranch,
  setCatList,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');
  
  console.log(userID)
  setUtype(userType);
  if (userType == 'ADM') {
    axios
      .get(`${baseUrl}viewbranch`, {
        headers: {Authorization: `Bearer ${userToken}`},
      })

      .then(res => {
        res = res.data[0].branch;
        let blist = res.map(item => {
          return {id: item.id, name: item.name};
        });
        setBranchList(blist);
      })
      .catch(err => console.log('getbranch', 'something went wrong' + err));
  }
  if (userType == 'branch') {
    console.log(userID)
    setBranch(userID);
    axios
      .get(`${baseUrl}viewcategory`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        res = res.data[0].category;
        let catsData = res.filter(item => item.branch_id == userID);
        let cats = catsData.map(item => {
          return {id: item.id, name: item.name};
        });
        setCatList(cats);
      })
      .catch(e => alert(e));
  }
};
const getBranchAndCatForEditProduct = async (
  setUtype,
  setBranchList,
  setBranch,
  setCategory,
  setCatList,
  category_id,
  branch_id,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');
  console.log(userID)
  setUtype(userType);
  if (userType == 'ADM') {
    axios
      .get(`${baseUrl}viewbranch`, {
        headers: {Authorization: `Bearer ${userToken}`},
      })

      .then(res => {
        res = res.data[0].branch;
        let blist = res.map(item => {
          return {id: item.id, name: item.name};
        });
        setBranchList(blist);
        setBranch(branch_id);
      })
      .catch(err => console.log('viewbranch', 'something went wrong' + err));
    axios
      .get(`${baseUrl}viewcategory`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        res = res.data[0].category;
        let catsData = res.filter(item => item.branch_id == branch_id);
        let cats = catsData.map(item => {
          return {id: item.id, name: item.name};
        });
        setCatList(cats);
        setCategory(category_id);
      })
      .catch(err => console.log('viewcategry', 'something went wrong' + err));
  }
  if (userType == 'branch') {
    setBranch(userID);
    axios
      .get(`${baseUrl}viewcategory`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        res = res.data[0].category;
        let catsData = res.filter(item => item.branch_id == userID);
        let cats = catsData.map(item => {
          return {id: item.id, name: item.name};
        });
        setCatList(cats);
      });
  }
};

const onBranchChange = async (branchid, setBranch, setCatList) => {
  setBranch(branchid);
  let userToken = await AsyncStorage.getItem('token');
  let data = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  try {
    let response = await axios.get(
      `${baseUrl}viewcategory`,
      data,
    );
    response = await response.data;
    res = response[0].category;
    let catsData = res.filter(item => item.branch_id == branchid);
    let cats = catsData.map(item => {
      return {id: item.id, name: item.name};
    });
    setCatList(cats);
  } catch (e) {
    alert(e);
  }
};
const onCatChange = async (category_id, setCategory, setProductList) => {
  setCategory(category_id);
  let userToken = await AsyncStorage.getItem('token');
  let data = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  try {
    let response = await axios.get(
      `${baseUrl}viewproduct`,
      data,
    );
    response = await response.data;
    let res = response[0].product;
    let catsData = res.filter(item => {
      console.log(item.category_id, category_id);

      return item.category_id == category_id;
    });
    let cats = catsData.map(item => {
      return {id: item.id, name: item.name};
    });

    setProductList(cats);
  } catch (e) {
    alert(e);
  }
  // res = response[0].category;
  // let catsData = res.filter(item => item.branch_id == branchid);
  // let cats = catsData.map(item => {
  //   return {id: item.id, name: item.name};
  // });
  // setCatList(cats);
};

const editBranch = async (id, imagefile, body) => {
  let userToken;
  userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios({
      method: 'POST',
      url: `${baseUrl}edit_branch/${id}`,
      data: createFormData(imagefile, body),

      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (e) {
    alert(e);
  }
};

export {
  getBranch,
  getBranchAndCat,
  createFormData,
  create_branch,
  create_category,
  create_counter,
  create_product,
  onBranchChange,
  onCatChange,
  getBranchAndCatForEditProduct,
  sell_product,
  editBranch,
};
