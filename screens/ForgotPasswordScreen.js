import React from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";
import { color } from "react-native-reanimated";

const ForgotPasswordScreen = ({ navigation }) => {
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View>
      <Appbar.Header style={(backgroundcolor = "#FF1654")}>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Parola Unuttunuz mu" />
      </Appbar.Header>
    </View>
  );
};
export default ForgotPasswordScreen;
