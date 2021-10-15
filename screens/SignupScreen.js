import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import InputTextField from "../components/InputTextField";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import firebase from "firebase";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";

const SignupScreen = ({ navigation }) => {
  const [isim, setIsim] = useState();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onSignUpPressed = async () => {
    Alert.alert(" ", " " + isim + " " + email + " " + password + " " + "✅");
    try {
      let response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      if (response && response.user) {
        Alert.alert("Kayıt Başarılı ", "✅");
        const userId = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref("users/" + userId)
          .update({ isim: isim });

        firebase
          .database()
          .ref("users/" + userId)
          .update({ uid: userId });

        firebase
          .database()
          .ref("users/" + userId)
          .update({ email: email });

        firebase
          .database()
          .ref("users/" + userId)
          .update({ password: password });

        navigation.reset({
          routes: [{ name: "HomeScreen" }],
        });
      }
    } catch (err) {
      alert(err);
    } /*
        ,
        });*/
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <View
          style={{
            marginTop: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="home-heart"
            size={100}
            color="#FF1654"
          />
          <Text
            style={[
              styles.text,
              { marginTop: 10, fontSize: 22, fontWeight: "500" },
            ]}
          >
            Ev Arkadaşım
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
          Kayıt Ol
        </Text>

        <View>
          <Text style={styles.inputTitle}> </Text>
          <TextInput
            placeholder={"İsim"}
            returnKeyType="next"
            style={styles.input}
            onChangeText={(isim) => setIsim(isim)}
          />
          <View
            style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }}
          />
        </View>

        <View>
          <Text style={styles.inputTitle}> </Text>
          <TextInput
            placeholder={"Mail"}
            returnKeyType="next"
            style={styles.input}
            onChangeText={(email) => setEmail(email)}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <View
            style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }}
          />
        </View>

        <View>
          <Text style={styles.inputTitle}> </Text>
          <TextInput
            placeholder={"Şifre"}
            returnKeyType="done"
            style={styles.input}
            onChangeText={(password) => setPassword(password)}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <View
            style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }}
          />
        </View>

        <TouchableOpacity
          style={styles.submitContainer}
          onPress={onSignUpPressed}
        >
          <Text
            style={[
              styles.text,
              {
                color: "#FFF",
                fontWeight: "600",
                fontSize: 16,
              },
            ]}
          >
            Kayıt
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 28,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity>
            <View style={styles.socialButton}>
              <Image
                source={require("../assets/facebook.png")}
                style={styles.socialLogo}
              />
              <Text style={styles.text}>Facebook</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../assets/google.png")}
              style={styles.socialLogo}
            />
            <Text style={styles.text}>Google</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text
            style={[
              styles.text,
              {
                fontSize: 14,
                color: "#ABB4BD",
                textAlign: "center",
                marginTop: 24,
              },
            ]}
          >
            Zaten Üye Misin?{" "}
            <Text style={[styles.text, styles.link]}>Giriş Yap.</Text>
          </Text>
        </TouchableOpacity>
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
});

export default SignupScreen;
