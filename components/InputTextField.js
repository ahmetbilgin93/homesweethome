import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

const InputTextField = (props) => {
  return (
    <View style={props.style}>
      <Text style={styles.inputTitle}>{props.title}</Text>
      <TextInput
        placeholder={props.placeholderText}
        secureTextEntry={props.isSecure}
        style={styles.input}
      />
      <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputTitle: {
    color: "#ABB4BD",
    fontSize: 14,
  },
  input: {
    paddingVertical: 12,
    color: "#1D2029",
    fontSize: 14,
  },
});

export default InputTextField;
