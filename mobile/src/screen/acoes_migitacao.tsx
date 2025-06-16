import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

interface AcaoMitigacao {
  id: number
  titulo: string
  descricao: string
  prioridade: 'alta' | 'media' | 'baixa'
  categoria: 'preventiva' | 'emergencia' | 'monitoramento'
  concluida: boolean
  icon: string
}

const acoes_migitacao = () => {
  const navigation = useNavigation();
  const [acoes, setAcoes] = useState<AcaoMitigacao[]>([
    {
      id: 1,
      titulo: 'Drenagem Superficial',
      descricao: 'Instalar sistemas de drenagem para evitar acúmulo de água no terreno',
      prioridade: 'alta',
      categoria: 'preventiva',
      concluida: false,
      icon: 'water-outline'
    },
    {
      id: 2,
      titulo: 'Monitoramento de Chuvas',
      descricao: 'Acompanhar índices pluviométricos e alertas meteorológicos',
      prioridade: 'alta',
      categoria: 'monitoramento',
      concluida: false,
      icon: 'rainy-outline'
    },
    {
      id: 3,
      titulo: 'Contenção de Encostas',
      descricao: 'Construir muros de arrimo e estruturas de contenção',
      prioridade: 'alta',
      categoria: 'preventiva',
      concluida: false,
      icon: 'construct-outline'
    },
    {
      id: 4,
      titulo: 'Revegetação',
      descricao: 'Plantar vegetação adequada para estabilizar o solo',
      prioridade: 'media',
      categoria: 'preventiva',
      concluida: false,
      icon: 'leaf-outline'
    },
    {
      id: 5,
      titulo: 'Plano de Evacuação',
      descricao: 'Estabelecer rotas de fuga e pontos de encontro seguros',
      prioridade: 'alta',
      categoria: 'emergencia',
      concluida: false,
      icon: 'exit-outline'
    },
    {
      id: 6,
      titulo: 'Kit de Emergência',
      descricao: 'Preparar kit com itens essenciais para situações de emergência',
      prioridade: 'media',
      categoria: 'emergencia',
      concluida: false,
      icon: 'medical-outline'
    },
    {
      id: 7,
      titulo: 'Inspeção Regular',
      descricao: 'Realizar vistorias periódicas em áreas de risco',
      prioridade: 'media',
      categoria: 'monitoramento',
      concluida: false,
      icon: 'search-outline'
    },
    {
      id: 8,
      titulo: 'Treinamento da Comunidade',
      descricao: 'Capacitar moradores sobre prevenção e resposta a deslizamentos',
      prioridade: 'media',
      categoria: 'preventiva',
      concluida: false,
      icon: 'people-outline'
    }
  ])

  const toggleAcao = (id: number) => {
    setAcoes(prevAcoes => 
      prevAcoes.map(acao => 
        acao.id === id ? { ...acao, concluida: !acao.concluida } : acao
      )
    )
  }

  const mostrarDetalhes = (acao: AcaoMitigacao) => {
    Alert.alert(
      acao.titulo,
      `${acao.descricao}\n\nPrioridade: ${acao.prioridade.toUpperCase()}\nCategoria: ${acao.categoria}`,
      [{ text: 'OK' }]
    )
  }

  const getPrioridadeCor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return '#FF4444'
      case 'media': return '#FFA500'
      case 'baixa': return '#4CAF50'
      default: return '#666'
    }
  }

  const getCategoriaCor = (categoria: string) => {
    switch (categoria) {
      case 'preventiva': return '#2196F3'
      case 'emergencia': return '#FF5722'
      case 'monitoramento': return '#9C27B0'
      default: return '#666'
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

  const acoesCompletadas = acoes.filter(acao => acao.concluida).length
  const progressoPercentual = Math.round((acoesCompletadas / acoes.length) * 100)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Ações de Mitigação</Text>
        <Text style={styles.subtitulo}>Prevenção de Deslizamentos</Text>
        
        <View style={styles.progressoContainer}>
          <Text style={styles.progressoTexto}>
            Progresso: {acoesCompletadas}/{acoes.length} ({progressoPercentual}%)
          </Text>
          <View style={styles.progressoBar}>
            <View 
              style={[
                styles.progressoFill, 
                { width: `${progressoPercentual}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {acoes.map((acao) => (
          <TouchableOpacity
            key={acao.id}
            style={[
              styles.acaoCard,
              acao.concluida && styles.acaoCardConcluida
            ]}
            onPress={() => mostrarDetalhes(acao)}
          >
            <View style={styles.acaoHeader}>
              <View style={styles.acaoIconContainer}>
                <Ionicons 
                  name={acao.icon as any} 
                  size={24} 
                  color={acao.concluida ? '#4CAF50' : '#333'} 
                />
              </View>
              
              <View style={styles.acaoInfo}>
                <Text style={[
                  styles.acaoTitulo,
                  acao.concluida && styles.acaoTituloConcluida
                ]}>
                  {acao.titulo}
                </Text>
                <Text style={[
                  styles.acaoDescricao,
                  acao.concluida && styles.acaoDescricaoConcluida
                ]}>
                  {acao.descricao}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleAcao(acao.id)}
              >
                <Ionicons
                  name={acao.concluida ? 'checkmark-circle' : 'ellipse-outline'}
                  size={28}
                  color={acao.concluida ? '#4CAF50' : '#CCC'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.acaoFooter}>
              <View style={[
                styles.prioridadeTag,
                { backgroundColor: getPrioridadeCor(acao.prioridade) }
              ]}>
                <Text style={styles.tagTexto}>
                  {acao.prioridade.toUpperCase()}
                </Text>
              </View>

              <View style={[
                styles.categoriaTag,
                { backgroundColor: getCategoriaCor(acao.categoria) }
              ]}>
                <Text style={styles.tagTexto}>
                  {acao.categoria.toUpperCase()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
          <Text style={[styles.menuText, styles.activeMenuText]}>AÇÕES</Text>
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

export default acoes_migitacao

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
  progressoContainer: {
    marginTop: 20,
  },
  progressoTexto: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressoBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressoFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
    marginBottom: 80, // Espaço para o menu inferior
  },
  acaoCard: {
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
  acaoCardConcluida: {
    backgroundColor: '#F8F8F8',
    opacity: 0.8,
  },
  acaoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  acaoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  acaoInfo: {
    flex: 1,
    marginRight: 12,
  },
  acaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  acaoTituloConcluida: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  acaoDescricao: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  acaoDescricaoConcluida: {
    color: '#AAA',
  },
  checkbox: {
    padding: 4,
  },
  acaoFooter: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  prioridadeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoriaTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagTexto: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
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
