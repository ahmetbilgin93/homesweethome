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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onLoginPressed = async () => {
    firebase
      .database()
      .ref("users/id/isim")
      .once("value")
      .then((snapshot) => {
        const isim = snapshot.val();
        console.log(isim);
      });
    try {
      let response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      if (response && response.user) {
        Alert.alert("Giriş Başarılı! ✅", "İyi Çalışmalar");
        navigation.reset({
          routes: [{ name: "HomeScreen" }],
        });
      }
    } catch (err) {
      alert(err);
    }
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
          Kayıtlı Kullanıcı Girişi
        </Text>

        <View>
          <Text style={styles.inputTitle}>E-mail Adresi</Text>
          <TextInput
            style={styles.input}
            title="Email"
            returnKeyType="next"
            onChangeText={(email) => setEmail(email.trim())}
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
          <Text style={[styles.inputTitle, { marginTop: 30 }]}>Şifre</Text>
          <TextInput
            style={styles.input}
            title="Şifre"
            returnKeyType="done"
            onChangeText={(password) => setPassword(password.trim())}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <View
            style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text style={[styles.text, styles.link, { textAlign: "right" }]}>
            Şifreni mi unuttun?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitContainer}
          onPress={onLoginPressed}
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
            Giriş
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
        <TouchableOpacity onPress={() => navigation.replace("SignupScreen")}>
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
            Üyeliğin yok mu?{" "}
            <Text style={[styles.text, styles.link]}>Kayıt Ol.</Text>
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

export default LoginScreen;
