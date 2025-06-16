import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { use } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../utils/colors'    
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
    const navigation = useNavigation();
    const [secureEntery, setSecureEntry] = React.useState(true);
    const handleGoback = () => {
      navigation.navigate('HOME' as never);
    }
    const handleLogin = () => {
    navigation.navigate('LOGIN' as never);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoback}>
        <Feather name="arrow-left-circle" size={30} color={colors.black} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
            <Text style={styles.textHeading}>Vamos</Text>
            <Text style={styles.textHeading}>Começar?</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
            <Feather name="mail" size={25} color={colors.gray} />
            <TextInput style={styles.input} placeholder='Coloque seu e-mail' placeholderTextColor={colors.gray} />
        </View>
        <View style={styles.inputContainer}>
            <Feather name="smartphone" size={25} color={colors.gray} />
            <TextInput style={styles.input} placeholder='Coloque seu telefone' placeholderTextColor={colors.gray} />
        </View>
        <View style={styles.inputContainer}>
            <Feather name="lock" size={25} color={colors.gray} />
            <TextInput style={styles.input} placeholder='Coloque sua senha' placeholderTextColor={colors.gray} secureTextEntry={secureEntery} />
            <TouchableOpacity onPress={() => setSecureEntry(!secureEntery)}>
                <Feather name="eye" size={20} color={colors.gray} />
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Crie sua conta</Text>
        </TouchableOpacity>
        <Text style={styles.continueText}> Ou Continue Com</Text>
        <TouchableOpacity style={styles.googleButton}>
            <AntDesign name="google" size={30} color={colors.black} />
            <Text style={styles.googleButtonText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.footerText}>
            <Text style={styles.continueText}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.RegistreseText}>Faça o Login</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
export default SignupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
    },
    backButtonWrapper: {
       height: 30,
       width: 30,
       backgroundColor: colors.white,
       borderRadius: 100,
       justifyContent: 'center',
       alignItems: 'center',
    },
    textContainer: {
      marginVertical: 20,
    },
    textHeading: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.black,
    },
    formContainer: {
      marginTop: 20,
    },
    inputContainer: {
      borderWidth: 1,
      borderColor: colors.gray,
      borderRadius: 100,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginVertical: 10,
    },
    input: {
      flex: 1,
      paddingHorizontal: 10,
      width: '100%',
    },
    TextInput: {
      flex: 1,
      paddingHorizontal: 10,
      fontFamily: 'Roboto-Regular',
    },
    forgotPasswordText : {
      color: colors.black,
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'right',
    },
    loginButton: {
      backgroundColor: colors.black,
      borderRadius: 100,
      padding: 15,
      marginVertical: 20,
    },
    loginButtonText: {
      color: colors.white,
      fontSize: 18,
      textAlign: 'center',
    },
    continueText: {
      textAlign: 'center',
      color: colors.gray,
      fontSize: 13,
    },
     googleButton: {
      backgroundColor: colors.white,
      borderRadius: 100,
      padding: 15,
      marginVertical: 15,
      borderWidth: 2,
      borderColor: colors.black,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',	
    },
    googleButtonText: {
      color: colors.black,
      fontWeight: 'bold',
      fontSize: 18,
      marginLeft: 10,
    },
    RegistreseText: {
      color: colors.black,
      fontSize: 13,
      textAlign: 'center',
      fontWeight: 'bold',
      marginLeft: 5,
    },
    footerText: {
      flexDirection: 'row',
      justifyContent: 'center',
    }
})