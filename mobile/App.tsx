import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import welcome from './src/screen/welcome';
import LoginScreen from './src/screen/LoginScreen';
import SignupScreen from './src/screen/Register';
import dados_ambientais from './src/screen/dados_ambientais';
import acoes_migitacao from './src/screen/acoes_migitacao';
import visualizacao_riscos from './src/screen/visualizacao_riscos';
import historico_monitoramento from './src/screen/historico_monitoramento';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions= {{headerShown: false}} initialRouteName="HOME">
        <Stack.Screen name="HOME" component={welcome} />
        <Stack.Screen name="LOGIN" component={LoginScreen} />
        <Stack.Screen name="SIGNUP" component={SignupScreen} />
        <Stack.Screen name="DADOS" component={dados_ambientais} />
        <Stack.Screen name="ACOES" component={acoes_migitacao} />
        <Stack.Screen name="VISUALIZACAO" component={visualizacao_riscos} />
        <Stack.Screen name="HISTORICO" component={historico_monitoramento} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App

const styles = StyleSheet.create({})