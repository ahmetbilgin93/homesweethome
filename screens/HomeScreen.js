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

LogBox.ignoreLogs(["Setting a timer"]);

const HomeScreen = ({ navigation }) => {
  const uid = firebase.auth().currentUser.uid;

  const [name, setName] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [mVisible, setMVisible] = useState(false);

  const [home, setHome] = useState();
  const [pass, setPass] = useState();

  const [kod, setKod] = useState();
  const [sif, setSif] = useState();
  const [psw, setPsw] = useState();
  const [ism, setIsm] = useState();

  const [hl, setHL] = useState([]);
  const [hid, setHid] = useState([]);
  const [hp, setHP] = useState([]);

  const ref = firebase.database().ref("users/" + uid + "/homes");

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

  useEffect(() => {
    let h1 = [];
    let h2 = [];
    let h3 = [];
    ref.once("value").then((snapshot) => {
      snapshot.forEach((child) => {
        console.log(child.val().homeName);
        h1.push(child.val().homeName);
        h2.push(child.val().password);
        h3.push(child.val().homeId);
        /*setHL([...hl, child.val().homeName]);
        setHP([...hp, child.val().password]);
        setHid([...hid, child.val().homeId]);*/
      });
      setHL(h1);
      setHP(h2);
      setHid(h3);
      console.log(hl);
      console.log(hp);
      console.log(hid);
    });
    h1 = [...hl];
  }, []);

  const addNewHome = () => {
    const newRef = firebase
      .database()
      .ref("users/" + uid + "/homes")
      .push();
    console.log("Gneretad: ", newRef.key);

    newRef
      .set({
        password: pass,
        homeName: home,
        homeId: newRef.key,
      })
      .then(() =>
        firebase
          .database()
          .ref("homes/" + newRef.key + "/users/" + uid)
          .set({
            id: uid,
            isim: name,
            total: 0,
          })
          .then(() =>
            firebase
              .database()
              .ref("homes/" + newRef.key)
              .update({
                password: pass,
                name: home,
                id: newRef.key,
                total: 1,
              })
          )
      );

    ref.once("value").then((snapshot) => {
      snapshot.forEach((child) => {
        setHL([...hl, child.val().homeName]);
        setHP([...hp, child.val().password]);
        setHid([...hid, child.val().homeId]);
      });
      console.log(hl);
      console.log(hp);
      console.log(hid);
    });

    setModalVisible(!modalVisible);
  };

  const addNewUser = () => {
    var p;
    var t;
    firebase
      .database()
      .ref("homes/" + kod)
      .once("value")
      .then((snapshot) => {
        p = snapshot.child("name").val();
        // t = snapshot.child("total").val();
        //t = t+1;
        if (sif == snapshot.child("password").val()) {
          console.log("Her şey yolunda  ");
          firebase
            .database()
            .ref("users/" + uid + "/homes/" + kod)
            .set({
              password: sif,
              homeName: p,
              homeId: kod,
            })
            .then(() => {
              firebase
                .database()
                .ref("homes/" + kod + "/users/" + uid)
                .set({
                  id: uid,
                  isim: name,
                  password: sif,
                  total: 0,
                });
            });

          firebase
            .database()
            .ref("homes/" + kod + "/total")
            .transaction(function (add) {
              return add + 1;
            });

          ref.once("value").then((snapshot) => {
            snapshot.forEach((child) => {
              setHL([...hl, child.val().homeName]);
              setHP([...hp, child.val().password]);
              setHid([...hid, child.val().homeId]);
            });
            console.log(hl);
            console.log(hp);
            console.log(hid);
          });
        } else {
          console.log("Bir şeyler ters gitti  " + psw + "  " + sif);
        }
      });
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
            {name}, Hoş Geldin!
          </Text>
        </View>

        <Text
          style={[
            styles.text,
            {
              color: "#ABB4BD",
              fontSize: 15,
              textAlign: "center",
              marginVertical: 20,
            },
          ]}
        >
          Uygulamaya girmek için ev seçimi yapınız
        </Text>
        <View>
          {hl &&
            hl.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    firebase
                      .database()
                      .ref("users/" + uid + "/active")
                      .set({
                        hid: hid[index],
                        hname: item,
                      })
                      .then(() => navigation.navigate("TabScreen"))
                  }
                >
                  <View style={[styles.homes, { borderStyle: "solid" }]}>
                    <Text style={styles.homeText}>{item}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>

        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.homes}>
            <Text style={styles.homeText}>Yeni Ev Oluştur</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMVisible(!mVisible)}>
          <View style={styles.homes}>
            <Text style={styles.homeText}>Bir Eve Katıl</Text>
          </View>
        </TouchableOpacity>
      </View>
      {
        //Yeni Ev Modal Tasarımı
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.mText}>Yeni Ev Ekle</Text>
            <TextInput
              style={styles.modalText}
              placeholder={"Evin İsmi"}
              onChangeText={(htext) => setHome(htext)}
            />
            <TextInput
              style={styles.modalText}
              placeholder={"Şifresi"}
              onChangeText={(hpass) => setPass(hpass)}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={addNewHome}
            >
              <Text style={styles.textStyle}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {
        //Eve Katıl Modal Tasarımı
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={mVisible}
        onRequestClose={() => {
          setMVisible(!mVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.mText}>Bir Eve Katıl</Text>
            <TextInput
              style={styles.modalText}
              placeholder={"Evin Kodu"}
              onChangeText={(ko) => setKod(ko)}
            />
            <TextInput
              style={styles.modalText}
              placeholder={"Şifresi"}
              onChangeText={(s) => setSif(s)}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => addNewUser()}
            >
              <Text style={styles.textStyle}>Katıl</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderColor: "#FF1654",
    borderRadius: 12,
    borderWidth: 0.8,
    borderStyle: "dashed",
    padding: 5,
    marginVertical: 7,
    shadowColor: "rgba(255, 22, 84, 0.24)",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  homeText: {
    color: "#FF1654",
    paddingVertical: 40,
    textAlign: "center",
    fontSize: 20,
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
});

export default HomeScreen;
