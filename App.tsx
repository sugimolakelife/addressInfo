import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ListRenderItemInfo,
  SafeAreaView,
} from "react-native";
import axios from "axios";


const apiBaseURL = "https://zipcloud.ibsnet.co.jp/api/search";

export default function App() {

  const[zipCode,setZipCode] = useState<string>("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  
    //ボタンプッシュ
  const getAddress = async() => {
    // 読込中
    setIsLoading(true);

    try{
      const newAddress = await getAddressInfo(zipCode);
      if (newAddress === null) {
        alert("読み込み失敗");
      } else {
        setAddresses(newAddress);
      }
    }catch(error){
      alert(error);
    }
      setIsLoading(false);
  }

    const getAddressInfo = async (zipCode: string) => {
    const requestConfig = {
      baseURL: apiBaseURL,
      params: { zipcode: zipCode },
    };

    const responce = await axios(requestConfig);
    console.log(responce);
    const address = responce.data.results;
    return address;
  };

  const loadingView = <Text>Loading...</Text>;

  const renderAddressItem = ({ item }: ListRenderItemInfo<any>) => {
    return (
      <Text>
        {item.address1}
        {item.address2}
        {item.address3}
      </Text>
    );
  };

  const listContainerView = (
    <View>
      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={(item, index: any) => `${index}`}
      />
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userContainer}>
        <TextInput
          style={styles.inputText}
          onChangeText={(text) => setZipCode(text)}
          placeholder="郵便番号"
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            getAddress();
          }}
        >
          <Text style={styles.buttonText}>住所を取得</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {isLoading ? loadingView : listContainerView}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

//ここからスタイル

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#808080",
    alignItems: "center",
    justifyContent: "center",
  },

  userContainer: {
    flexDirection: "row",
    position: "absolute",
    top: "30%",
    justifyContent: "center",
  },

  inputText: {
    textAlign: "left",
    padding: 10,
    margin: 5,
    fontSize: 30,
    backgroundColor: "#fff",
    color: "#000",
    width: "50%",
    borderWidth: 3,
    borderColor: "#000000",
  },

  button: {
    alignItems: "center",
    backgroundColor: "#a197e2",
    padding: 10,
    justifyContent: "center",
    borderRadius: 30,
    margin: 5,
    borderWidth: 3,
    borderColor: "#000000",
  },

  buttonText: {
    fontSize: 20,
  },

  list: {
    position: "absolute",
    top: "40%",
    backgroundColor: "#fff",
    width: screenWidth * 0.8,
    borderWidth: 3,
    borderColor: "#000000",
    height: screenHeight * 0.5,
  },
});
