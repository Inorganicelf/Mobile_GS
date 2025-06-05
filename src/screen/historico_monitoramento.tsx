import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'

interface DadosAmbientais {
  id: string;
  temperatura: string;
  umidade: string;
  pressao: string;
  qualidadeAr: string;
  dataHora: string;
}

const historico_monitoramento = () => {
  const [dados, setDados] = useState<DadosAmbientais[]>([])
  const [carregando, setCarregando] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filtroOrdem, setFiltroOrdem] = useState<'recente' | 'antigo'>('recente')
  const navigation = useNavigation()

  const STORAGE_KEY = '@dados_ambientais'

  // Recarregar dados quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      carregarDados()
    }, [])
  )

  const carregarDados = async () => {
    try {
      setCarregando(true)
      const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY)
      
      if (dadosSalvos) {
        const listaDados: DadosAmbientais[] = JSON.parse(dadosSalvos)
        
        // Ordenar dados
        const dadosOrdenados = listaDados.sort((a, b) => {
          const dataA = new Date(a.dataHora).getTime()
          const dataB = new Date(b.dataHora).getTime()
          return filtroOrdem === 'recente' ? dataB - dataA : dataA - dataB
        })
        
        setDados(dadosOrdenados)
      } else {
        setDados([])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      Alert.alert('Erro', 'Não foi possível carregar o histórico.')
    } finally {
      setCarregando(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await carregarDados()
    setRefreshing(false)
  }

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO)
    return {
      data: data.toLocaleDateString('pt-BR'),
      hora: data.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  const getQualidadeArStatus = (aqi: string) => {
    const valor = parseInt(aqi)
    if (valor <= 50) return { status: 'Boa', cor: '#4CAF50' }
    if (valor <= 100) return { status: 'Moderada', cor: '#FFA500' }
    if (valor <= 150) return { status: 'Insalubre', cor: '#FF5722' }
    return { status: 'Perigosa', cor: '#D32F2F' }
  }

  const getTemperaturaStatus = (temp: string) => {
    const valor = parseFloat(temp)
    if (valor < 15) return { status: 'Frio', cor: '#2196F3' }
    if (valor <= 25) return { status: 'Agradável', cor: '#4CAF50' }
    if (valor <= 35) return { status: 'Quente', cor: '#FFA500' }
    return { status: 'Muito Quente', cor: '#D32F2F' }
  }

  const excluirRegistro = (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const novosDados = dados.filter(item => item.id !== id)
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosDados))
              setDados(novosDados)
              Alert.alert('Sucesso', 'Registro excluído com sucesso!')
            } catch (error) {
              console.error('Erro ao excluir:', error)
              Alert.alert('Erro', 'Não foi possível excluir o registro.')
            }
          }
        }
      ]
    )
  }

  const limparHistorico = () => {
    Alert.alert(
      'Limpar Histórico',
      'Deseja realmente excluir todos os registros? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar Tudo', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY)
              setDados([])
              Alert.alert('Sucesso', 'Histórico limpo com sucesso!')
            } catch (error) {
              console.error('Erro ao limpar:', error)
              Alert.alert('Erro', 'Não foi possível limpar o histórico.')
            }
          }
        }
      ]
    )
  }

  const alternarOrdem = () => {
    const novaOrdem = filtroOrdem === 'recente' ? 'antigo' : 'recente'
    setFiltroOrdem(novaOrdem)
    
    const dadosOrdenados = [...dados].sort((a, b) => {
      const dataA = new Date(a.dataHora).getTime()
      const dataB = new Date(b.dataHora).getTime()
      return novaOrdem === 'recente' ? dataB - dataA : dataA - dataB
    })
    
    setDados(dadosOrdenados)
  }

  const HandleDados = () => {
    navigation.navigate('DADOS' as never)
  }
  const HandleAcoes = () => {
    navigation.navigate('ACOES' as never)
  }
  const HandleVisualizacoes = () => {
    navigation.navigate('VISUALIZACAO' as never)
  }
  const HandleHistorico = () => {
    console.log('Já na tela de Histórico')
  }

  const calcularEstatisticas = () => {
    if (dados.length === 0) return null

    const temperaturas = dados.map(d => parseFloat(d.temperatura))
    const umidades = dados.map(d => parseFloat(d.umidade))
    const pressoes = dados.map(d => parseFloat(d.pressao))
    const qualidades = dados.map(d => parseFloat(d.qualidadeAr))

    return {
      tempMedia: (temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length).toFixed(1),
      umidadeMedia: (umidades.reduce((a, b) => a + b, 0) / umidades.length).toFixed(1),
      pressaoMedia: (pressoes.reduce((a, b) => a + b, 0) / pressoes.length).toFixed(1),
      qualidadeMedia: (qualidades.reduce((a, b) => a + b, 0) / qualidades.length).toFixed(0),
      totalRegistros: dados.length
    }
  }

  const estatisticas = calcularEstatisticas()

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Histórico de Monitoramento</Text>
        <Text style={styles.subtitulo}>
          {dados.length} registro{dados.length !== 1 ? 's' : ''} encontrado{dados.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {dados.length > 0 && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.ordenarButton} onPress={alternarOrdem}>
            <Ionicons 
              name={filtroOrdem === 'recente' ? 'arrow-down' : 'arrow-up'} 
              size={16} 
              color="#2196F3" 
            />
            <Text style={styles.ordenarText}>
              {filtroOrdem === 'recente' ? 'Mais Recentes' : 'Mais Antigos'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.limparButton} onPress={limparHistorico}>
            <Ionicons name="trash-outline" size={16} color="#D32F2F" />
            <Text style={styles.limparText}>Limpar</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.mainScrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={true}
      >
        {estatisticas && (
          <View style={styles.estatisticasContainer}>
            <Text style={styles.estatisticasTitle}>Médias Gerais</Text>
            <ScrollView 
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              style={styles.estatisticasScrollView}
              contentContainerStyle={styles.estatisticasScrollContent}
            >
              <View style={styles.estatCard}>
                <Text style={styles.estatValor}>{estatisticas.tempMedia}°C</Text>
                <Text style={styles.estatLabel}>Temperatura</Text>
              </View>
              <View style={styles.estatCard}>
                <Text style={styles.estatValor}>{estatisticas.umidadeMedia}%</Text>
                <Text style={styles.estatLabel}>Umidade</Text>
              </View>
              <View style={styles.estatCard}>
                <Text style={styles.estatValor}>{estatisticas.pressaoMedia}</Text>
                <Text style={styles.estatLabel}>Pressão</Text>
              </View>
              <View style={styles.estatCard}>
                <Text style={styles.estatValor}>{estatisticas.qualidadeMedia}</Text>
                <Text style={styles.estatLabel}>Qualidade</Text>
              </View>
            </ScrollView>
          </View>
        )}

        {dados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#CCC" />
            <Text style={styles.emptyTitle}>Nenhum registro encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Os dados ambientais que você salvar aparecerão aqui
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => HandleDados()}
            >
              <Text style={styles.addButtonText}>Adicionar Dados</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.dadosContainer}>
            {dados.map((item, index) => {
              const { data, hora } = formatarData(item.dataHora)
              const qualidadeStatus = getQualidadeArStatus(item.qualidadeAr)
              const temperaturaStatus = getTemperaturaStatus(item.temperatura)

              return (
                <View key={item.id} style={styles.registroCard}>
                  <View style={styles.registroHeader}>
                    <View style={styles.dataContainer}>
                      <Text style={styles.dataText}>{data}</Text>
                      <Text style={styles.horaText}>{hora}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => excluirRegistro(item.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView 
                    horizontal={true}
                    showsHorizontalScrollIndicator={true}
                    style={styles.dadosScrollView}
                    contentContainerStyle={styles.dadosScrollContent}
                  >
                    <View style={styles.dadoItem}>
                      <View style={styles.dadoHeader}>
                        <Ionicons name="thermometer-outline" size={20} color="#FF5722" />
                        <Text style={styles.dadoLabel}>Temperatura</Text>
                      </View>
                      <Text style={styles.dadoValor}>{item.temperatura}°C</Text>
                      <View style={[styles.statusTag, { backgroundColor: temperaturaStatus.cor }]}>
                        <Text style={styles.statusText}>{temperaturaStatus.status}</Text>
                      </View>
                    </View>

                    <View style={styles.dadoItem}>
                      <View style={styles.dadoHeader}>
                        <Ionicons name="water-outline" size={20} color="#2196F3" />
                        <Text style={styles.dadoLabel}>Umidade</Text>
                      </View>
                      <Text style={styles.dadoValor}>{item.umidade}%</Text>
                    </View>

                    <View style={styles.dadoItem}>
                      <View style={styles.dadoHeader}>
                        <Ionicons name="speedometer-outline" size={20} color="#9C27B0" />
                        <Text style={styles.dadoLabel}>Pressão</Text>
                      </View>
                      <Text style={styles.dadoValor}>{item.pressao} hPa</Text>
                    </View>

                    <View style={styles.dadoItem}>
                      <View style={styles.dadoHeader}>
                        <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
                        <Text style={styles.dadoLabel}>Qualidade do Ar</Text>
                      </View>
                      <Text style={styles.dadoValor}>{item.qualidadeAr} AQI</Text>
                      <View style={[styles.statusTag, { backgroundColor: qualidadeStatus.cor }]}>
                        <Text style={styles.statusText}>{qualidadeStatus.status}</Text>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => HandleDados()}
        >
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuText}>DADOS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => HandleAcoes()}
        >
          <Text style={styles.menuIcon}>⚡</Text>
          <Text style={styles.menuText}></Text>
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
          <Text style={[styles.menuText, styles.activeMenuText]}>HISTÓRICO</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default historico_monitoramento

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
    marginTop: 5,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  ordenarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
  },
  ordenarText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  limparButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
  },
  limparText: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '600',
  },
  mainScrollView: {
    flex: 1,
    marginBottom: 80,
  },
  estatisticasContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  estatisticasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  estatisticasScrollView: {
    maxHeight: 120,
  },
  estatisticasScrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  estatCard: {
    width: 120,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  estatValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  estatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  dadosContainer: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 24,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registroCard: {
    backgroundColor: '#FFF',
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dataContainer: {
    alignItems: 'flex-start',
  },
  dataText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  horaText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
  },
  dadosScrollView: {
    maxHeight: 150,
  },
  dadosScrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  dadoItem: {
    width: 140,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  dadoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dadoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  dadoValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    color: '#FFF',
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
    fontWeight: 'bold',
    color: '#666',
  },
  activeMenuText: {
    color: '#2196F3',
  },
})
