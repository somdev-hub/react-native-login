import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useSelector, useDispatch } from "react-redux";

const Login = () => {
  const screenWidth = Dimensions.get("window").width;
  const dispatch = useDispatch();
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: ""
  });
  const navigator = useNavigation();
  const handleSubmit = () => {
    axios
      .post(
        "https://new-api-staging.rydeu.com/login",
        {
          ...credentials,
          type: "customer"
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        console.log(res.data.data.token);
        SecureStore.setItemAsync("token", res.data.data.token);
        dispatch({ type: "login/login", payload: res.data.data.user.account });
        if (res.data.data.token) {
          navigator.navigate("Home");
        } else {
          alert("Invalid Credentials");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "white",
          width: screenWidth * 0.8,
          elevation: 1,
          padding: 10,
          paddingVertical: 20
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          Welcome
        </Text>
        <Text style={{ textAlign: "center" }}>Please login to get started</Text>
        <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
          <View style={{ marginTop: 15 }}>
            <Text>Email</Text>
            <TextInput
              onChangeText={(text) =>
                setCredentials({ ...credentials, email: text })
              }
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "grey",
                padding: 3,
                marginTop: 10,
                paddingHorizontal: 10
              }}
              placeholder="Enter your email"
            />
          </View>
          <View style={{ marginTop: 15 }}>
            <Text>Password</Text>
            <TextInput
              onChangeText={(text) =>
                setCredentials({ ...credentials, password: text })
              }
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "grey",
                padding: 3,
                marginTop: 10,
                paddingHorizontal: 10
              }}
              placeholder="Enter your password"
            />
          </View>
          <Text
            style={{
              textAlign: "right",
              marginTop: 10,
              color: "blue"
            }}
          >
            Forget password
          </Text>
          <TouchableOpacity onPress={handleSubmit}>
            <View
              style={{
                backgroundColor: "blue",
                padding: 10,
                borderRadius: 5,
                marginTop: 20
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Login;
