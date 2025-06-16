import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import { useNavigation } from '@react-navigation/native';

const welcome = () => {
  const navigation = useNavigation();
  const handleLogin = () => {
    navigation.navigate('LOGIN' as never);
  };
  const handleSignup = () => {
    navigation.navigate('SIGNUP' as never);
  };2
  return (
    <View style={styles.container}>
      <Image source={require("../assets/white_on_trans.png")} style = {styles.banner}/>
      <Text style={styles.title}> Global Solution - Desenvolvimento de Aplicativo Mobile para Monitoramento de Riscos de
Deslizamentos</Text>
      <Text style={styles.subtitle}>Integrantes: Rafael Bisi Succi Ferreira & RM 550716 | Giovanna Condrade Pereira & RM 552242  | Siraj Yousseff Yousseff & RM 551792 </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.LoginButtonWrapper
          ,{backgroundColor: colors.gray},
        ]}
         onPress={handleLogin}
        >
          <Text style={styles.LoginbuttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.LoginButtonWrapper]} onPress={handleSignup}>
          <Text style={styles.RegistrebuttonText}>Registre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  logo: {
    height: 30,
    width: 140,
    marginVertical: 40
  },
  banner: {
    marginVertical: 10,
    height: 250,
    width: 231,
  },
  title: {
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 20,
    marginVertical: 20,
    color: colors.white,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    color: colors.white,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.white,
    width: " 85%",
    height: 60,
    borderRadius: 100,
  },
  LoginbuttonText: {
    color: colors.white,
    fontSize: 18,
  },
  LoginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width:"50%",
    borderRadius: 98,
  },
  RegistrebuttonText: {
    color: colors.white,
    fontSize: 18,
  },
})