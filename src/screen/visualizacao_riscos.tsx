import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window')

interface RiscoArea {
  id: number
  nome: string
  nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico'
  probabilidade: number
  ultimaAvaliacao: string
  fatoresRisco: string[]
  populacaoAfetada: number
}

const visualizacao_riscos = () => {
  const navigation = useNavigation();
  const [areas] = useState<RiscoArea[]>([
    {
      id: 1,
      nome: 'Encosta Norte - Setor A',
      nivelRisco: 'critico',
      probabilidade: 85,
      ultimaAvaliacao: '2024-01-15',
      fatoresRisco: ['Chuvas intensas', 'Solo saturado', 'Desmatamento'],
      populacaoAfetada: 120
    },
    {
      id: 2,
      nome: 'Morro do Sol',
      nivelRisco: 'alto',
      probabilidade: 72,
      ultimaAvaliacao: '2024-01-14',
      fatoresRisco: ['Erosão', 'Construções irregulares'],
      populacaoAfetada: 85
    },
    {
      id: 3,
      nome: 'Vale Verde',
      nivelRisco: 'medio',
      probabilidade: 45,
      ultimaAvaliacao: '2024-01-13',
      fatoresRisco: ['Drenagem inadequada'],
      populacaoAfetada: 60
    },
    {
      id: 4,
      nome: 'Colina Oeste',
      nivelRisco: 'baixo',
      probabilidade: 25,
      ultimaAvaliacao: '2024-01-12',
      fatoresRisco: ['Monitoramento preventivo'],
      populacaoAfetada: 30
    }
  ])

  const [filtroRisco, setFiltroRisco] = useState<string>('todos')

  const HandleDados = () => {
    navigation.navigate('DADOS' as never);
  }

  const HandleAcoes = () => {
    navigation.navigate('ACOES' as never);
  }

  const HandleVisualizacoes = () => {
    navigation.navigate('VISUALIZACOES' as never);
  }

  const HandleHistorico = () => {
    navigation.navigate('HISTORICO' as never);
  }

  const getRiscoCor = (nivel: string) => {
    switch (nivel) {
      case 'baixo': return '#4CAF50'
      case 'medio': return '#FFA500'
      case 'alto': return '#FF5722'
      case 'critico': return '#D32F2F'
      default: return '#666'
    }
  }

  const getRiscoIcon = (nivel: string) => {
    switch (nivel) {
      case 'baixo': return 'checkmark-circle'
      case 'medio': return 'warning'
      case 'alto': return 'alert-circle'
      case 'critico': return 'close-circle'
      default: return 'help-circle'
    }
  }

  const areasFiltradas = filtroRisco === 'todos' 
    ? areas 
    : areas.filter(area => area.nivelRisco === filtroRisco)

  const estatisticas = {
    total: areas.length,
    critico: areas.filter(a => a.nivelRisco === 'critico').length,
    alto: areas.filter(a => a.nivelRisco === 'alto').length,
    medio: areas.filter(a => a.nivelRisco === 'medio').length,
    baixo: areas.filter(a => a.nivelRisco === 'baixo').length,
    populacaoTotal: areas.reduce((sum, area) => sum + area.populacaoAfetada, 0)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Visualização de Riscos</Text>
        <Text style={styles.subtitulo}>Monitoramento de Deslizamentos</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Painel de Estatísticas */}
        <View style={styles.estatisticasContainer}>
          <Text style={styles.sectionTitle}>Resumo Geral</Text>
          
          <View style={styles.estatisticasGrid}>
            <View style={styles.estatCard}>
              <Text style={styles.estatNumero}>{estatisticas.total}</Text>
              <Text style={styles.estatLabel}>Áreas Monitoradas</Text>
            </View>
            <View style={styles.estatCard}>
              <Text style={styles.estatNumero}>{estatisticas.populacaoTotal}</Text>
              <Text style={styles.estatLabel}>População Afetada</Text>
            </View>
          </View>

          <View style={styles.riscoDistribuicao}>
            <View style={[styles.riscoBar, { backgroundColor: '#D32F2F', flex: estatisticas.critico }]}>
              <Text style={styles.riscoBarText}>{estatisticas.critico}</Text>
            </View>
            <View style={[styles.riscoBar, { backgroundColor: '#FF5722', flex: estatisticas.alto }]}>
              <Text style={styles.riscoBarText}>{estatisticas.alto}</Text>
            </View>
            <View style={[styles.riscoBar, { backgroundColor: '#FFA500', flex: estatisticas.medio }]}>
              <Text style={styles.riscoBarText}>{estatisticas.medio}</Text>
            </View>
            <View style={[styles.riscoBar, { backgroundColor: '#4CAF50', flex: estatisticas.baixo }]}>
              <Text style={styles.riscoBarText}>{estatisticas.baixo}</Text>
            </View>
          </View>

          <View style={styles.legendaContainer}>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaCor, { backgroundColor: '#D32F2F' }]} />
              <Text style={styles.legendaTexto}>Crítico</Text>
            </View>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaCor, { backgroundColor: '#FF5722' }]} />
              <Text style={styles.legendaTexto}>Alto</Text>
            </View>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaCor, { backgroundColor: '#FFA500' }]} />
              <Text style={styles.legendaTexto}>Médio</Text>
            </View>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaCor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendaTexto}>Baixo</Text>
            </View>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtrosContainer}>
          <Text style={styles.sectionTitle}>Filtrar por Risco</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filtrosRow}>
              {['todos', 'critico', 'alto', 'medio', 'baixo'].map((filtro) => (
                <TouchableOpacity
                  key={filtro}
                  style={[
                    styles.filtroButton,
                    filtroRisco === filtro && styles.filtroButtonActive,
                    filtro !== 'todos' && { backgroundColor: getRiscoCor(filtro) + '20' }
                  ]}
                  onPress={() => setFiltroRisco(filtro)}
                >
                  <Text style={[
                    styles.filtroText,
                    filtroRisco === filtro && styles.filtroTextActive
                  ]}>
                    {filtro.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Lista de Áreas de Risco */}
        <View style={styles.areasContainer}>
          <Text style={styles.sectionTitle}>
            Áreas de Risco ({areasFiltradas.length})
          </Text>
          
          {areasFiltradas.map((area) => (
            <View key={area.id} style={styles.areaCard}>
              <View style={styles.areaHeader}>
                <View style={styles.areaInfo}>
                  <Text style={styles.areaNome}>{area.nome}</Text>
                  <Text style={styles.areaData}>
                    Última avaliação: {area.ultimaAvaliacao}
                  </Text>
                </View>
                
                <View style={[
                  styles.riscoIndicador,
                  { backgroundColor: getRiscoCor(area.nivelRisco) }
                ]}>
                  <Ionicons
                    name={getRiscoIcon(area.nivelRisco) as any}
                    size={24}
                    color="#FFF"
                  />
                </View>
              </View>

              <View style={styles.probabilidadeContainer}>
                <Text style={styles.probabilidadeLabel}>
                  Probabilidade de Deslizamento
                </Text>
                <View style={styles.probabilidadeBar}>
                  <View 
                    style={[
                      styles.probabilidadeFill,
                      { 
                        width: `${area.probabilidade}%`,
                        backgroundColor: getRiscoCor(area.nivelRisco)
                      }
                    ]}
                  />
                </View>
                <Text style={styles.probabilidadeTexto}>
                  {area.probabilidade}%
                </Text>
              </View>

              <View style={styles.areaDetalhes}>
                <View style={styles.detalheItem}>
                  <Ionicons name="people" size={16} color="#666" />
                  <Text style={styles.detalheTexto}>
                    {area.populacaoAfetada} pessoas
                  </Text>
                </View>
                
                <View style={styles.fatoresContainer}>
                  <Text style={styles.fatoresLabel}>Fatores de Risco:</Text>
                  {area.fatoresRisco.map((fator, index) => (
                    <View key={index} style={styles.fatorTag}>
                      <Text style={styles.fatorTexto}>{fator}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
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
          <Text style={styles.menuText}>AÇÕES</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => HandleVisualizacoes()}
        >
          <Text style={styles.menuIcon}>👁️</Text>
          <Text style={[styles.menuText, styles.activeMenuText]}>VISUAL</Text>
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

export default visualizacao_riscos

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  scrollView: {
    flex: 1,
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
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
  estatisticasGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  estatCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  estatNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  estatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  riscoDistribuicao: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  riscoBar: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 30,
  },
  riscoBarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  legendaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendaCor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendaTexto: {
    fontSize: 12,
    color: '#666',
  },
  filtrosContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4  },
  filtrosRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filtroButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filtroText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  filtroTextActive: {
    color: '#FFF',
  },
  areasContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  areaCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  areaInfo: {
    flex: 1,
    marginRight: 12,
  },
  areaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  areaData: {
    fontSize: 12,
    color: '#666',
  },
  riscoIndicador: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  probabilidadeContainer: {
    marginBottom: 12,
  },
  probabilidadeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  probabilidadeBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  probabilidadeFill: {
    height: '100%',
    borderRadius: 4,
  },
  probabilidadeTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  areaDetalhes: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  detalheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detalheTexto: {
    fontSize: 14,
    color: '#666',
  },
  fatoresContainer: {
    marginTop: 8,
  },
  fatoresLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  fatorTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  fatorTexto: {
    fontSize: 12,
    color: '#666',
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

