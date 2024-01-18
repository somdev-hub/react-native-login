import Login from "./screens/Login";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";

const Stack = createStackNavigator();

const StackNavigator = () => {
  const navigator = useNavigation();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.login.isLogin);
  const user = useSelector((state) => state.login.user);
  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        navigator.navigate("Home");
      } else {
        navigator.navigate("Login");
      }
    };
    checkToken();
  }, []);
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          headerTitle: `Welcome ${user.firstName} ${user.lastName}`,
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <PaperProvider>
      <Provider store={store}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </Provider>
    </PaperProvider>
  );
}
