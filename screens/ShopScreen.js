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

const ShopScreen = ({ navigation }) => {
  var hi;
  var i;
  const [etki, setEtki] = useState(0);
  const uid = firebase.auth().currentUser.uid;
  const [modalVisible, setModalVisible] = useState(false);
  const [homeid, setHomeid] = useState();
  const [homename, setHomename] = useState();
  const [name, setName] = useState();

  const [aktif, setAktif] = useState();
  const [mv, setMv] = useState(false);

  const [urun, setUrun] = useState();
  const [oncelik, setOncelik] = useState();

  const [surun, setSurun] = useState([]);
  const [soncelik, setSoncelik] = useState([]);
  const [sid, setSid] = useState([]);

  const [alan, setAlan] = useState();
  const [ucret, setUcret] = useState();

  const [bname, setBname] = useState([]);
  const [btotal, setBtotal] = useState([]);
  const [bid, setBid] = useState([]);
  const [total, setTotal] = useState();

  const [bhesap, setBhesap] = useState();
  const [balacak, setBalacak] = useState();
  const [bverecek, setBverecek] = useState();

  const [modalborc, setModalborc] = useState(false);

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
    let s1 = [];
    let s2 = [];
    let s3 = [];
    console.log("seçili mi?" + hi);
    console.log("Seçili mi2?" + homeid);

    firebase
      .database()
      .ref("homes/" + homeid + "/shoplist")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          console.log(child.val().urun);
          console.log(homeid);
          console.log(hi);
          s1.push(child.val().urun);
          s2.push(child.val().oncelik);
          s3.push(child.val().sid);
        });
        setSurun(s1);
        setSoncelik(s2);
        setSid(s3);
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

  //borç listesi çek
  useEffect(() => {
    let u1 = [];
    let u2 = [];
    let u3 = [];

    console.log("Girdi buraya başlıyoruz");

    firebase
      .database()
      .ref("homes/" + homeid + "/users")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          u1.push(child.val().isim);
          console.log("ismi çektim: " + child.val().isim);
          u2.push(child.val().total);
          console.log(child.val().total);
          u3.push(child.val().id);
          console.log(child.val().id);
          console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        });
        setBname(u1);
        setBtotal(u2);
        setBid(u3);
      });
  }, [etki]);

  const relist = () => {
    let u1 = [];
    let u2 = [];
    let u3 = [];

    console.log("Girdi buraya başlıyoruz");

    firebase
      .database()
      .ref("homes/" + homeid + "/users")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          u1.push(child.val().isim);
          console.log("ismi çektim: " + child.val().isim);
          u2.push(child.val().total);
          console.log(child.val().total);
          u3.push(child.val().id);
          console.log(child.val().id);
          console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        });
        setBname(u1);
        setBtotal(u2);
        setBid(u3);
      });

    let x1 = [];
    let x2 = [];
    let x3 = [];
    for (let i = 0; i < total; i++) {
      for (let j = i + 1; j < total; j++) {
        x1.push(bname[i]);
        x2.push(bname[j]);
        let y = btotal[i] / total - btotal[j] / total;
        x3.push(y);
      }
    }
    setBverecek(x2);
    setBalacak(x1);
    setBhesap(x3);
  };

  const hesapla = () => {
    relist();
    console.log(btotal);
    /*
    let x1 = [];
    let x2 = [];
    let x3 = [];
    for (let i = 0; i < total; i++) {
      for (let j = i + 1; j < total; j++) {
        x1.push(bname[i]);
        x2.push(bname[j]);
        let y = btotal[i] / total - btotal[j] / total;
        x3.push(y);
      }
    }
    setBverecek(x2);
    setBalacak(x1);
    setBhesap(x3);*/

    setModalborc(!modalborc);
    setModalborc(!modalborc);
    setModalborc(!modalborc);
  };

  const addNew = () => {
    const newRef = firebase
      .database()
      .ref("homes/" + homeid + "/shoplist")
      .push();
    console.log("Gneretad: ", newRef.key);

    newRef
      .set({
        urun: urun,
        oncelik: oncelik,
        sid: newRef.key,
      })
      .then(() => {
        setSurun([...surun, urun]);
        setSoncelik([...soncelik, oncelik]);
        setSid([...sid, newRef.key]);
      });
    let abc = etki;
    abc++;
    setEtki(abc);
    setModalVisible(!modalVisible);
    relist();
  };

  const selectItem = (index) => {
    let abc = etki;
    abc++;
    setEtki(abc);
    relist();
    setAktif(index);
    i = index;
    setMv(!mv);
    console.log(index);
    console.log(aktif);
    console.log(i);
  };

  const complete = (index) => {
    let i1 = [...surun];
    let i2 = [...soncelik];
    let i3 = [...sid];
    relist();

    firebase
      .database()
      .ref("homes/" + homeid + "/archive/shoplist/" + sid[index])
      .set({
        sid: sid[index],
        urun: surun[index],
        alan: name,
        fiyat: ucret,
      });

    firebase
      .database()
      .ref("homes/" + homeid + "/users/" + uid)
      .once("value")
      .then((snapshot) => {
        var nf = snapshot.child("total").val();
        nf = nf / 1 + ucret / 1;
        firebase
          .database()
          .ref("homes/" + homeid + "/users/" + uid)
          .update({
            total: nf,
          });
      });

    i1.splice(index, 1);
    i2.splice(index, 1);
    i3.splice(index, 1);

    setSurun(i1);
    setSoncelik(i2);

    let sil = sid[index];

    setSid(i3);

    firebase
      .database()
      .ref("homes/" + homeid + "/shoplist/" + sil)
      .remove();

    setMv(!mv);
    relist();
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
            Alışveriş Listesi
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
            Yeni Ürün Ekle
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("OldShopScreen")}>
          <Text style={styles.viewOld}>
            <Entypo name="archive" size={18} color="#FF1654" />
            {"   "}Geçmişte Alınanları Görüntüle
          </Text>
        </TouchableOpacity>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Ürün İsmi</DataTable.Title>
            <DataTable.Title numeric>Önceliği</DataTable.Title>
          </DataTable.Header>

          {surun &&
            surun.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    selectItem(index);
                  }}
                >
                  <DataTable.Row>
                    <DataTable.Cell>{item}</DataTable.Cell>
                    <DataTable.Cell numeric>{soncelik[index]}</DataTable.Cell>
                  </DataTable.Row>
                </TouchableOpacity>
              );
            })}
        </DataTable>
        <TouchableOpacity onPress={() => hesapla()}>
          <View style={styles.borcDurumu}>
            <Text style={styles.borcText}>Güncel Borç Durumunu Görüntüle</Text>
          </View>
        </TouchableOpacity>
      </View>
      {
        //Yeni Shoplist Modal Tasarımı
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
            <Text style={styles.mText}>Listeye Yeni Ürün Ekle</Text>
            <TextInput
              style={styles.modalText}
              placeholder={"Ürün İsmi"}
              onChangeText={(urun) => setUrun(urun)}
            />
            <TextInput
              style={styles.modalText}
              placeholder={"Öncelik Durumu"}
              onChangeText={(oncelik) => setOncelik(oncelik)}
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
        //Ürün Detay
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
            <Text style={styles.mText}>{surun[aktif]}</Text>

            <TextInput
              style={styles.modalText}
              placeholder={"Ödediğin Fiyat"}
              onChangeText={(u) => setUcret(u)}
            />

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => complete(aktif)}
            >
              <Text style={styles.textStyle}>Satın Alındı</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {
        //Borç Durumu
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalborc}
        onRequestClose={() => {
          setModalborc(!modalborc);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.mText}>Borç Durumu</Text>

            {bverecek &&
              bverecek.map((item, index) => {
                return (
                  <Text key={index} style={styles.modalT}>
                    {item} kişisinin {balacak[index]} kişisene {bhesap[index]}{" "}
                    TL borcu var.
                  </Text>
                );
              })}

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalborc(!modalborc)}
            >
              <Text style={styles.textStyle}>Hesabı Sıfırla</Text>
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
export default ShopScreen;
