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
import { Avatar, Card, Divider, Appbar, DataTable } from "react-native-paper";
import firebase from "firebase";
import { LogBox } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ListItem, Icon, Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";

const ChoresScreen = ({ navigation, route }) => {
  var hi;
  const uid = firebase.auth().currentUser.uid;
  const [modalVisible, setModalVisible] = useState(false);
  const [homeid, setHomeid] = useState();
  const [homename, setHomename] = useState();
  const [name, setName] = useState();
  const [gun, setGun] = useState();
  const [path, setPath] = useState();
  const [d, setD] = useState();
  const [m, setM] = useState();
  const [y, setY] = useState();
  var year = new Date().getFullYear(); //Current Year

  const [aktif, setAktif] = useState();
  const [mv, setMv] = useState(false);

  const [gorev, setGorev] = useState();
  const [kisi, setKisi] = useState();
  const [ok, setOk] = useState();

  const [ggorev, setGgorev] = useState([]);
  const [gkisi, setGkisi] = useState([]);
  const [gok, setGok] = useState([]);
  const [gid, setGid] = useState([]);

  //tarih ayarlayan
  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    /*var gunsonucu = date + "." + month + "." + year;
    var todb = date + "" + month + "" + year;*/
    setD(date);
    setM(month);
    setY(year);
    //setGun(gunsonucu);
  }, [year]);

  //günleri değiştiren
  useEffect(() => {
    let gunsonucu = d + "." + m + "." + y;
    setGun(gunsonucu);
    let gs = d + "" + m + "" + y;
    setPath(gs);
  }, [d]);

  //kullanıcı bilgisi
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

  //homeid
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

  useEffect(() => {
    let g1 = [];
    let g2 = [];
    let g3 = [];
    console.log("seçili mi?" + path);
    console.log("Seçili mi2?" + homeid);

    firebase
      .database()
      .ref("homes/" + homeid + "/chores/" + path)
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          console.log(child.val().gorev);
          console.log(homeid);
          console.log(hi);
          g1.push(child.val().gorev);
          g2.push(child.val().kisi);
          g3.push(child.val().gid);
        });
        setGgorev(g1);
        setGkisi(g2);
        setGid(g3);
      });
  }, [path]);

  useEffect(() => {
    let g1 = [];
    let g2 = [];
    let g3 = [];
    let go = [];
    console.log("seçili mi?" + path);
    console.log("Seçili mi2?" + homeid);

    firebase
      .database()
      .ref("homes/" + homeid + "/chores/" + path)
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          console.log(child.val().gorev);
          console.log(homeid);
          console.log(hi);
          g1.push(child.val().gorev);
          g2.push(child.val().kisi);
          g3.push(child.val().gid);
          go.push(child.val().ok);
        });
        setGgorev(g1);
        setGkisi(g2);
        setGid(g3);
        setGok(go);
      });
  }, [homeid]);

  const tomorrow = () => {
    if (d >= 30) {
      if (d == 30) {
        if (m == 2 || m == 4 || m == 6 || m == 9 || m == 11) {
          setD(1);
          let month = m + 1;
          setM(month);
        }
      }
      if (d == 31) {
        if (
          m == 1 ||
          m == 3 ||
          m == 5 ||
          m == 7 ||
          m == 8 ||
          m == 10 ||
          m == 12
        ) {
          setD(1);
          let month = m + 1;
          setM(month);
        }
      }
    } else {
      let date = d + 1;
      setD(date);
    }
  };

  const yesterday = () => {
    if (d == 1) {
      if (m == 2 || m == 4 || m == 6 || m == 9 || m == 11) {
        setD(31);
        let month = m - 1;
        setM(month);
      }
      if (
        m == 1 ||
        m == 3 ||
        m == 5 ||
        m == 7 ||
        m == 8 ||
        m == 10 ||
        m == 12
      ) {
        setD(30);
        let month = m - 1;
        setM(month);
      }
    } else {
      let date = d - 1;
      setD(date);
    }
  };

  const addNew = () => {
    const newRef = firebase
      .database()
      .ref("homes/" + homeid + "/chores/" + path)
      .push();
    console.log("Gneretad: ", newRef.key);

    newRef
      .set({
        gorev: gorev,
        kisi: kisi,
        gid: newRef.key,
        ok: 0,
      })
      .then(() => {
        setGgorev([...ggorev, gorev]);
        setGkisi([...gkisi, kisi]);
        setGid([...gid, newRef.key]);
        setGok([...gok, 0]);
      });

    setModalVisible(!modalVisible);
  };

  const okey = (index) => {
    let n = [...gok];
    n[index] = 1;
    setGok(n);
    let sil = gid[index];
    firebase
      .database()
      .ref("homes/" + homeid + "/chores/" + path + "/" + sil)
      .update({ ok: 1 });

    console.log(gok[index]);
  };

  const complete = (index) => {
    let i1 = [...ggorev];
    let i2 = [...gkisi];
    let i3 = [...gid];
    let i4 = [...gok];

    i1.splice(index, 1);
    i2.splice(index, 1);
    i3.splice(index, 1);
    i4.splice(index, 1);

    setGgorev(i1);
    setGkisi(i2);
    setGok(i4);

    let sil = gid[index];

    setGid(i3);

    firebase
      .database()
      .ref("homes/" + homeid + "/chores/" + path + "/" + sil)
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
            Görevler
          </Text>
        </View>
        <View style={styles.dateArea}>
          <TouchableOpacity onPress={yesterday}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#FF1654" />
          </TouchableOpacity>

          <Text style={styles.dateText}>{gun}</Text>
          <TouchableOpacity onPress={tomorrow}>
            <MaterialIcons name="arrow-forward-ios" size={22} color="#FF1654" />
          </TouchableOpacity>
        </View>

        {ggorev &&
          ggorev.map((item, index) => {
            return (
              <ListItem.Swipeable
                bottomDivider={true}
                leftContent={
                  <Button
                    title="Tamamla"
                    icon={{ name: "check", color: "white" }}
                    buttonStyle={{
                      minHeight: "100%",
                      backgroundColor: "green",
                    }}
                    onPress={() => okey(index)}
                  />
                }
                rightContent={
                  <Button
                    title="Sil"
                    icon={{ name: "delete", color: "white" }}
                    buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                    onPress={() => complete(index)}
                  />
                }
                key={index}
              >
                <ListItem.Content>
                  <ListItem.Title style={{ color: "green" }}>
                    {gok[index] == 1 ? "TAMAMLANDI!" : ""}
                  </ListItem.Title>
                  <ListItem.Title>{item}</ListItem.Title>
                  <ListItem.Subtitle>{gkisi[index]}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem.Swipeable>
            );
          })}

        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Text style={styles.addNew}>
            <Ionicons
              name="add-circle"
              size={17}
              color="#FF1654"
              style={{ paddingTop: 15 }}
            />
            {"   "}
            Yeni Görev Ekle
          </Text>
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
            <Text style={styles.mText}>Yeni Görev Ekle</Text>
            <TextInput
              style={styles.modalText}
              placeholder={"Görev Tanımı"}
              onChangeText={(gorevtext) => setGorev(gorevtext)}
            />
            <TextInput
              style={styles.modalText}
              placeholder={"Yapacak Kişi"}
              onChangeText={(kisitext) => setKisi(kisitext)}
            />
            <TextInput style={styles.modalText} value={gun} editable={false} />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={addNew}
            >
              <Text style={styles.textStyle}>Görev</Text>
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
  addNew: {
    marginVertical: 30,
    marginTop: 50,
    color: "#FF1654",
    marginLeft: 13,
  },
  viewOld: {
    marginBottom: 25,
    color: "#FF1654",
    marginLeft: 13,
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
  dateArea: {
    textAlign: "center",
    alignItems: "stretch",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 40,
  },
  dateText: {
    color: "#FF1654",
    fontSize: 18,
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
    width: 200,
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
export default ChoresScreen;
