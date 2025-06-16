import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DadosAmbientais {
  id: string;
  temperatura: string;
  umidade: string;
  pressao: string;
  qualidadeAr: string;
  dataHora: string;
}

const dados_ambientais = () => {
  const [temperatura, setTemperatura] = useState('')
  const [umidade, setUmidade] = useState('')
  const [pressao, setPressao] = useState('')
  const [qualidadeAr, setQualidadeAr] = useState('')
  const [salvando, setSalvando] = useState(false)
  const navigation = useNavigation();

  // Chave para o AsyncStorage
  const STORAGE_KEY = '@dados_ambientais'

  // Carregar dados salvos ao inicializar o componente
  useEffect(() => {
    carregarDadosSalvos()
  }, [])

  const carregarDadosSalvos = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY)
      if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos)
        console.log('Dados carregados:', dados)
        // Você pode usar esses dados para mostrar histórico ou pré-preencher campos
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const salvarDados = async (novosDados: DadosAmbientais) => {
    try {
      // Buscar dados existentes
      const dadosExistentes = await AsyncStorage.getItem(STORAGE_KEY)
      let listaDados: DadosAmbientais[] = []

      if (dadosExistentes) {
        listaDados = JSON.parse(dadosExistentes)
      }

      // Adicionar novos dados à lista
      listaDados.push(novosDados)

      // Manter apenas os últimos 50 registros para não sobrecarregar o storage
      if (listaDados.length > 50) {
        listaDados = listaDados.slice(-50)
      }

      // Salvar no AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaDados))
      
      return true
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      return false
    }
  }

  const validarDados = () => {
    if (!temperatura.trim()) {
      Alert.alert('Erro', 'Por favor, informe a temperatura')
      return false
    }
    if (!umidade.trim()) {
      Alert.alert('Erro', 'Por favor, informe a umidade')
      return false
    }
    if (!pressao.trim()) {
      Alert.alert('Erro', 'Por favor, informe a pressão atmosférica')
      return false
    }
    if (!qualidadeAr.trim()) {
      Alert.alert('Erro', 'Por favor, informe a qualidade do ar')
      return false
    }

    // Validações numéricas
    const tempNum = parseFloat(temperatura)
    const umidNum = parseFloat(umidade)
    const pressaoNum = parseFloat(pressao)
    const qualidadeNum = parseFloat(qualidadeAr)

    if (isNaN(tempNum)) {
      Alert.alert('Erro', 'Temperatura deve ser um número válido')
      return false
    }
    if (isNaN(umidNum) || umidNum < 0 || umidNum > 100) {
      Alert.alert('Erro', 'Umidade deve ser um número entre 0 e 100')
      return false
    }
    if (isNaN(pressaoNum) || pressaoNum < 800 || pressaoNum > 1200) {
      Alert.alert('Erro', 'Pressão deve ser um número entre 800 e 1200 hPa')
      return false
    }
    if (isNaN(qualidadeNum) || qualidadeNum < 0 || qualidadeNum > 500) {
      Alert.alert('Erro', 'Qualidade do ar deve ser um número entre 0 e 500')
      return false
    }

    return true
  }

  const handleSalvar = async () => {
    if (!validarDados()) {
      return
    }

    setSalvando(true)

    try {
      const novosDados: DadosAmbientais = {
        id: Date.now().toString(), // ID único baseado no timestamp
        temperatura,
        umidade,
        pressao,
        qualidadeAr,
        dataHora: new Date().toISOString()
      }

      const sucesso = await salvarDados(novosDados)

      if (sucesso) {
        Alert.alert(
          'Sucesso!', 
          'Dados ambientais salvos com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Limpar campos após salvar
                setTemperatura('')
                setUmidade('')
                setPressao('')
                setQualidadeAr('')
              }
            }
          ]
        )
        console.log('Dados salvos:', novosDados)
      } else {
        Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao salvar os dados.')
    } finally {
      setSalvando(false)
    }
  }

  // Função para limpar todos os dados (útil para desenvolvimento/teste)
  const limparTodosDados = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY)
      Alert.alert('Sucesso', 'Todos os dados foram removidos!')
    } catch (error) {
      console.error('Erro ao limpar dados:', error)
      Alert.alert('Erro', 'Não foi possível limpar os dados.')
    }
  }

  // Função para mostrar dados salvos (para debug)
  const mostrarDadosSalvos = async () => {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_KEY)
      if (dados) {
        const listaDados = JSON.parse(dados)
        Alert.alert(
          'Dados Salvos', 
          `Total de registros: ${listaDados.length}\n\nÚltimo registro:\n${JSON.stringify(listaDados[listaDados.length - 1], null, 2)}`
        )
      } else {
        Alert.alert('Info', 'Nenhum dado encontrado no storage.')
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  const HandleDados = () => {
    navigation.navigate('DADOS' as never);
  }
  const HandleAcoes = () => {
    navigation.navigate('ACOES' as never);
  }
  const HandleVisualizacoes = () => {
    navigation.navigate('VISUALIZACAO' as never);
  }
  const HandleHistorico = () => {
    navigation.navigate('HISTORICO' as never);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Dados Ambientais</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Temperatura (°C)</Text>
          <TextInput
            style={styles.input}
            value={temperatura}
            onChangeText={setTemperatura}
            placeholder="Ex: 25.5"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Umidade (%)</Text>
          <TextInput
            style={styles.input}
            value={umidade}
            onChangeText={setUmidade}
            placeholder="Ex: 60"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pressão Atmosférica (hPa)</Text>
          <TextInput
            style={styles.input}
            value={pressao}
            onChangeText={setPressao}
            placeholder="Ex: 1013.25"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Qualidade do Ar (AQI)</Text>
          <TextInput
            style={styles.input}
            value={qualidadeAr}
            onChangeText={setQualidadeAr}
            placeholder="Ex: 50"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, salvando && styles.saveButtonDisabled]} 
          onPress={handleSalvar}
          disabled={salvando}
        >
          <Text style={styles.saveButtonText}>
            {salvando ? 'Salvando...' : 'Salvar Dados'}
          </Text>
        </TouchableOpacity>

        {/* Botões de debug - remover em produção */}
        <View style={styles.debugContainer}>
          <TouchableOpacity style={styles.debugButton} onPress={mostrarDadosSalvos}>
            <Text style={styles.debugButtonText}>Ver Dados Salvos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.debugButton} onPress={limparTodosDados}>
            <Text style={styles.debugButtonText}>Limpar Dados</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomMenu}>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => HandleDados()}
        >
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={[styles.menuText, styles.activeMenuText]}>DADOS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => HandleAcoes()}
        >
          <Text style={styles.menuIcon}>⚡</Text>
          <Text style={styles.menuText}>AÇÕES</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => HandleVisualizacoes()}
        >
          <Text style={styles.menuIcon}>👁️</Text>
          <Text style={styles.menuText}>VISUAL</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => HandleHistorico()}
        >
          <Text style={styles.menuIcon}>📋</Text>
          <Text style={styles.menuText}>HISTÓRICO</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default dados_ambientais

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  debugContainer: {
    marginTop: 30,
    gap: 10,
  },
  debugButton: {
    backgroundColor: '#666',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  menuText: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  activeMenuText: {
    color: '#007AFF',
  },
})
