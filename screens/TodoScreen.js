import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { Avatar, Card, Divider, Appbar, DataTable } from "react-native-paper";
import firebase from "firebase";
import { LogBox } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import Task from "../components/Task";
import { Ionicons } from "@expo/vector-icons";

export default function TodoScreen() {
  var hi;
  const uid = firebase.auth().currentUser.uid;
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [tid, setTid] = useState([]);
  const [homeid, setHomeid] = useState();
  const [homename, setHomename] = useState();
  const [name, setName] = useState();

  //Kullanıcı bilgisi al
  useEffect(() => {
    var hi;
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

  //Homeid al
  useEffect(() => {
    firebase
      .database()
      .ref("users/" + uid + "/active")
      .once("value")
      .then((snapshot) => {
        const hn = snapshot.child("hname").val();
        setHomename(hn);
        console.log("SEÇİYORUZ: " + snapshot.child("hid").val());
        hi = snapshot.child("hid").val();
        console.log("SEÇTİK : " + hi);
        setHomeid(hi);
      });
  }, []);

  //listeyi çek
  useEffect(() => {
    let t1 = [];
    let t2 = [];
    console.log("seçili mi?" + hi);
    console.log("Seçili mi2?" + homeid);

    firebase
      .database()
      .ref("homes/" + homeid + "/todos")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          console.log(child.val().task);
          console.log(homeid);
          console.log(hi);
          t1.push(child.val().task);
          t2.push(child.val().tid);
        });
        setTaskItems(t1);
        setTid(t2);
      });
  }, [homeid]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    console.log(task);

    const newRef = firebase
      .database()
      .ref("homes/" + homeid + "/todos")
      .push();
    console.log("Gneretad: ", newRef.key);

    newRef
      .set({
        task: task,
        tid: newRef.key,
      })
      .then(() => {
        setTaskItems([...taskItems, task]);
        setTid([...tid, newRef.key]);
        setTask(null);
      });
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    let i2 = [...tid];
    itemsCopy.splice(index, 1);
    i2.splice(index, 1);
    setTaskItems(itemsCopy);
    let sil = tid[index];
    setTid(i2);
    firebase
      .database()
      .ref("homes/" + homeid + "/todos/" + sil)
      .remove();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: 30 }}>
        <View
          style={{
            marginTop: 60,
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
            Yapılacaklar Listesi
          </Text>
        </View>
        <View style={styles.addTodoArea}>
          <TextInput
            style={styles.input}
            placeholder={"Yeni Giriş"}
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity
            style={styles.addWrapper}
            onPress={() => handleAddTask()}
          >
            <Entypo name="add-to-list" size={30} color="#FF1654" />
          </TouchableOpacity>
        </View>

        <View style={styles.items}>
          {taskItems.map((item, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                <Task text={item} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  taskWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  addWrapper: {
    paddingTop: 2,
  },
  addText: {
    color: "#FF1654",
    fontSize: 25,
  },
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
    paddingVertical: 2,
    color: "#1D2029",
    fontSize: 14,
    borderBottomColor: "#FF1654",
    borderBottomWidth: 1,
    width: 250,
  },
  addTodoArea: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
});
