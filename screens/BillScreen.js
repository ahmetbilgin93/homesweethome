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

LogBox.ignoreLogs(["Setting a timer"]);

const BillScreen = ({ navigation }) => {
  var hi;
  var i;
  const uid = firebase.auth().currentUser.uid;
  const [modalVisible, setModalVisible] = useState(false);
  const [homeid, setHomeid] = useState();
  const [homename, setHomename] = useState();
  const [name, setName] = useState();
  const [total, setTotal] = useState();

  const [aktif, setAktif] = useState();
  const [mv, setMv] = useState(false);

  const [tutar, setTutar] = useState();
  const [son, setSon] = useState();
  const [tur, setTur] = useState();

  const [ftutar, setFtutar] = useState([]);
  const [fson, setFson] = useState([]);
  const [ftur, setFtur] = useState([]);
  const [fid, setFid] = useState([]);

  useEffect(() => {
    let f1 = [];
    let f2 = [];
    let f3 = [];
    let f4 = [];
    console.log("seçili mi?" + hi);
    console.log("Seçili mi2?" + homeid);

    firebase
      .database()
      .ref("homes/" + homeid + "/bills")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          console.log(child.val().tur);
          console.log(homeid);
          console.log(hi);
          f1.push(child.val().tutar);
          f2.push(child.val().son);
          f3.push(child.val().tur);
          f4.push(child.val().fid);
        });
        setFtutar(f1);
        setFson(f2);
        setFtur(f3);
        setFid(f4);
      });

    firebase
      .database()
      .ref("homes/" + homeid)
      .once("value")
      .then((snapshot) => {
        const t = snapshot.child("total").val();
        setTotal(t);
        console.log("Total kişi sayısı: " + total);
      });
  }, [homeid]);

  //Kullanıcı id'si al
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

  //useefectsiz home id
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

  //home id al
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

  const addNew = () => {
    const newRef = firebase
      .database()
      .ref("homes/" + homeid + "/bills")
      .push();
    console.log("Gneretad: ", newRef.key);

    newRef
      .set({
        tutar: tutar,
        son: son,
        tur: tur,
        fid: newRef.key,
      })
      .then(() => {
        setFtutar([...ftutar, tutar]);
        setFtur([...ftur, tur]);
        setFson([...fson, son]);
        setFid([...fid, newRef.key]);
      });

    setModalVisible(!modalVisible);
  };

  const selectItem = (index) => {
    setAktif(index);
    i = index;
    setMv(!mv);
    console.log(index);
    console.log(aktif);
    console.log(i);
  };

  const complete = (index) => {
    let i1 = [...ftutar];
    let i2 = [...ftur];
    let i3 = [...fson];
    let i4 = [...fid];

    firebase
      .database()
      .ref("homes/" + homeid + "/archive/bills/" + fid[index])
      .set({
        fid: fid[index],
        son: fson[index],
        tur: ftur[index],
        tutar: ftutar[index],
      });

    i1.splice(index, 1);
    i2.splice(index, 1);
    i3.splice(index, 1);
    i4.splice(index, 1);

    setFtutar(i1);
    setFtur(i2);
    setFson(i3);

    let sil = fid[index];

    setFid(i4);

    firebase
      .database()
      .ref("homes/" + homeid + "/bills/" + sil)
      .remove();

    setMv(!mv);
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
            Fatura Sepeti
          </Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Text style={styles.addNew}>
            <MaterialCommunityIcons
              name="plus-box-multiple-outline"
              size={18}
              color="#FF1654"
            />
            {"   "}
            Yeni Fatura Ekle
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("OldBillScreen")}>
          <Text style={styles.viewOld}>
            <Entypo name="archive" size={18} color="#FF1654" />
            {"   "}Geçmiş Faturaları Görüntüle
          </Text>
        </TouchableOpacity>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Türü</DataTable.Title>
            <DataTable.Title>Son Ödeme</DataTable.Title>
            <DataTable.Title numeric>Toplam</DataTable.Title>
            <DataTable.Title numeric>Kişi Başı</DataTable.Title>
          </DataTable.Header>

          {ftur &&
            ftur.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    selectItem(index);
                  }}
                >
                  <DataTable.Row>
                    <DataTable.Cell>{item}</DataTable.Cell>
                    <DataTable.Cell>{fson[index]}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {(ftutar[index] / 1).toFixed(2) + " TL"}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {(ftutar[index] / total).toFixed(2) + " TL"}
                    </DataTable.Cell>
                  </DataTable.Row>
                </TouchableOpacity>
              );
            })}
        </DataTable>
      </View>
      {
        //Yeni Fatura Modal Tasarımı
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
            <Text style={styles.mText}>Yeni Fatura Girişi</Text>
            <TextInput
              style={styles.modalText}
              placeholder={"Fatura Türü"}
              onChangeText={(turtext) => setTur(turtext)}
            />
            <TextInput
              style={styles.modalText}
              placeholder={"Son Ödeme Tarihi"}
              onChangeText={(sontext) => setSon(sontext)}
            />
            <TextInput
              style={styles.modalText}
              placeholder={"Toplam Fatura Tutarı"}
              onChangeText={(tutartext) => setTutar(tutartext)}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={addNew}
            >
              <Text style={styles.textStyle}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {
        //Fatura Detay
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={mv}
        onRequestClose={() => {
          setMv(!mv);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.mText}>{ftur[aktif]} Faturası</Text>
            <Text style={styles.modalT}>Son Ödeme Tarihi: {fson[aktif]}</Text>
            <Text style={styles.modalT}>
              Toplam Tutar: {(ftutar[aktif] / 1).toFixed(2) + " TL"}
            </Text>
            <Text style={styles.modalT}>
              Kişi Başı Tutar: {(ftutar[aktif] / total).toFixed(2) + " TL"}
            </Text>

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => complete(aktif)}
            >
              <Text style={styles.textStyle}>Ödenen Faturalara Taşı</Text>
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
  modalT: {
    marginBottom: 25,
    textAlign: "center",
    width: 250,
    padding: 5,
    textAlign: "left",
  },
});

export default BillScreen;
