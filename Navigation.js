import * as React from "react";
import { Button, Text, View } from "react-native";
import { NavigationContainer, useLinkProps } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BillScreen from "./screens/BillScreen";
import ChoresScreen from "./screens/ChoresScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ShopScreen from "./screens/ShopScreen";
import SignupScreen from "./screens/SignupScreen";
import TodoScreen from "./screens/TodoScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ProfileScreen from "./screens/ProfileScreen";

import {} from "firebase";

import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome5 } from "@expo/vector-icons";
import { UserProvider } from "./context/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import OldBillScreen from "./screens/OldBillScreen";
import OldShopScreen from "./screens/OldShopScreen";
import SetProfile from "./screens/SetProfile";
import SetHomeScreen from "./screens/SetHomeScreen";

const BillStack = createStackNavigator();
function BillStackScreen() {
  return (
    <BillStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <BillStack.Screen name="BillScreen" component={BillScreen} />
      <BillStack.Screen name="OldBillScreen" component={OldBillScreen} />
    </BillStack.Navigator>
  );
}

const ShopStack = createStackNavigator();
function ShopStackScreen() {
  return (
    <ShopStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ShopStack.Screen name="ShopScreen" component={ShopScreen} />
      <ShopStack.Screen name="OldShopScreen" component={OldShopScreen} />
    </ShopStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="SetProfile" component={SetProfile} />
      <ProfileStack.Screen name="SetHomeScreen" component={SetHomeScreen} />
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function TabScreen() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#e91e63",
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          title: "Profil",
        }}
      />
      {/*
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          title: "Home",
        }}
      />*/}
      <Tab.Screen
        name="Bills"
        component={BillStackScreen}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="money-check-alt" size={24} color={color} />
          ),
          title: "Faturalar",
        }}
      />
      <Tab.Screen
        name="ChoresScreen"
        component={ChoresScreen}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="cleaning-services" size={24} color={color} />
          ),
          title: "İşler",
        }}
      />
      <Tab.Screen
        name="TodoScreen"
        component={TodoScreen}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="fact-check" size={24} color={color} />
          ),
          title: "Yapılacaklar",
        }}
      />
      <Tab.Screen
        name="Shops"
        component={ShopStackScreen}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="shopping-basket" size={24} color={color} />
          ),
          title: "Alışveriş Listesi",
        }}
      />
    </Tab.Navigator>
  );
}

const AuthStack = createStackNavigator();
function AuthStackScreen() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="SignupScreen" component={SignupScreen} />
      <AuthStack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen name="HomeScreen" component={HomeScreen} />
      <AuthStack.Screen name="TabScreen" component={TabScreen} />
    </AuthStack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      {UserProvider.isLoggedIn ? <TabScreen /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}
