import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import InputTextField from "./components/InputTextField.js";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Navigation from "./Navigation";
import { UserProvider } from "./context/UserContext";
import { FirebaseProvider } from "./context/FirebaseContext";

export default function App() {
  return (
    <FirebaseProvider>
      <UserProvider>
        <Navigation />
      </UserProvider>
    </FirebaseProvider>
  );
}
