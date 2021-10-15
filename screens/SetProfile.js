import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Avatar, Card, Divider, Appbar } from "react-native-paper";
import firebase from "firebase";
import { LogBox } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

LogBox.ignoreLogs(["Setting a timer"]);

const SetProfile = ({ navigation, route }) => {
  const uid = firebase.auth().currentUser.uid;
  const [homename, setHomename] = useState();
  const [homeid, setHomeid] = useState();
  const [name, setName] = useState();

  firebase
    .database()
    .ref("users/" + uid + "/active")
    .once("value")
    .then((snapshot) => {
      const hn = snapshot.child("hname").val();
      setHomename(hn);
      const hi = snapshot.child("hid").val();
      setHomeid(hi);
    });

  useEffect(() => {
    const onValueChange = firebase
      .database()
      .ref(`/users/${uid}`)
      .on("value", (snapshot) => {
        console.log("User data: ", snapshot.child("isim").val());
        const isim = snapshot.child("isim").val();
        setName(isim);
        console.log(name);
      });
    return () =>
      firebase.database().ref(`/users/${uid}`).off("value", onValueChange);
  }, [uid]);

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: 30 }}>
        <View
          style={{
            marginTop: 60,
            marginBottom: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              styles.text,
              { marginTop: 10, fontSize: 22, fontWeight: "500" },
            ]}
          >
            Profil Ayarları
          </Text>
          <Text
            style={[
              styles.text,
              {
                color: "#ABB4BD",
                fontSize: 13,
                textAlign: "center",
                marginVertical: 30,
              },
            ]}
          >
            Yapılacak değişiklikler için şifre onayı gereklidir.
          </Text>
        </View>
        <View style={styles.borcDurumu}>
          <TouchableOpacity>
            <Text style={styles.borcText}>İsim Değişikliği</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.borcDurumu}>
          <TouchableOpacity>
            <Text style={styles.borcText}>Şifre Değişikliği</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  text: {
    color: "#1D2029",
  },
  socialButton: {
    flexDirection: "row",
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(171, 180, 189, 0.65)",
    borderRadius: 4,
    backgroundColor: "#fff",
    shadowColor: "rgba(171, 180, 189, 0.35)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
  },
  socialLogo: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  link: {
    color: "#FF1654",
    fontSize: 14,
    fontWeight: "500",
  },
  submitContainer: {
    backgroundColor: "#FF1654",
    fontSize: 16,
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    shadowColor: "rgba(255, 22, 84, 0.24)",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
  },
  inputTitle: {
    color: "#ABB4BD",
    fontSize: 14,
  },
  input: {
    paddingVertical: 12,
    color: "#1D2029",
    fontSize: 14,
  },
  homes: {
    borderColor: "#fff",
    backgroundColor: "#FF1654",
    opacity: 1,
    borderRadius: 12,
    /*borderWidth: 1,
          borderStyle: "solid",*/
    padding: 5,
    marginVertical: 3,
    /*shadowColor: "rgba(0, 0, 0, 1)",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 5,
          elevation: 5,*/
  },
  homeText: {
    color: "#FFF",
    paddingVertical: 30,
    textAlign: "center",
    fontSize: 22,
    opacity: 1,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0.7, height: 0.7 },
    textShadowRadius: 0.5,
    shadowOpacity: 0.8,
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    width: 250,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D8D8",
    padding: 5,
    textAlign: "left",
  },
  mText: {
    marginBottom: 25,
    marginTop: -10,
    textAlign: "center",
    padding: 5,
    width: 250,
    fontSize: 22,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 22,
  },
  modalView: {
    margin: 100,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 55,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 250,
    marginTop: 25,
  },
  buttonClose: {
    backgroundColor: "#FF1654",
  },
  borcDurumu: {
    alignItems: "center",
    textAlign: "center",
    marginTop: 40,
    marginVertical: 20,
    marginHorizontal: 13,
    borderStyle: "solid",
    borderColor: "#FF1654",
    borderRadius: 50,
    borderWidth: 1,
    paddingVertical: 10,
  },
  borcText: {
    textAlign: "center",
    color: "#FF1654",
  },
});

export default SetProfile;
