// =============================================================
// src/screens/HomeScreen.js
// Tela principal do aplicativo.
//
// É aqui que mora a "inteligência": os ESTADOS (useState), o
// carregamento das preferências salvas (useEffect) e as funções
// de ação. Os componentes em src/components só exibem.
//
// A tela tem DOIS MODOS de busca (alternados pelo seletor):
//   'cep'     → digita o CEP e recebe o endereço
//   'address' → digita UF/cidade/rua e recebe uma lista de CEPs
// =============================================================

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

// Nossas peças, cada uma vinda da sua pasta
import AddressCard from '../components/AddressCard';
import HistoryList from '../components/HistoryList';
import ResultsList from '../components/ResultsList';
import SearchModeToggle from '../components/SearchModeToggle';
import ThemeToggle from '../components/ThemeToggle';
import { fetchAddressByCep, fetchCepsByAddress } from '../services/viaCepService';
import {
  loadHistory,
  loadTheme,
  saveHistory,
  saveTheme,
} from '../services/storageService';
import { themes } from '../theme/colors';
import { cleanCep, formatCep, isValidCep } from '../utils/cep';

const HISTORY_LIMIT = 5; // quantas buscas recentes guardamos

export default function HomeScreen() {
  // --- Tema -------------------------------------------------
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const theme = isDark ? themes.dark : themes.light; // paleta ativa

  // --- Estados da busca por CEP -----------------------------
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState(null);
  const [history, setHistory] = useState([]);

  // --- Estados da busca inversa (endereço → CEPs) -----------
  const [stateInput, setStateInput] = useState('');   // UF (2 letras)
  const [cityInput, setCityInput] = useState('');
  const [streetInput, setStreetInput] = useState('');
  const [results, setResults] = useState([]);

  // --- Estados compartilhados -------------------------------
  const [mode, setMode] = useState('cep'); // 'cep' ou 'address'
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Carregar o que foi salvo no aparelho -----------------
  // useEffect com [] roda UMA vez, quando a tela abre.
  // É o lugar certo para buscar dados persistidos.
  useEffect(() => {
    async function loadSavedData() {
      const savedTheme = await loadTheme();
      if (savedTheme !== null) {
        // null = primeira vez; aí vale o tema do sistema
        setIsDark(savedTheme);
      }
      setHistory(await loadHistory());
    }

    loadSavedData();
  }, []);

  // Alterna o tema E persiste a escolha
  function handleToggleTheme() {
    const newValue = !isDark;
    setIsDark(newValue);
    saveTheme(newValue); // sem await: não precisamos esperar para seguir
  }

  // Adiciona uma busca ao histórico (sem repetir, máximo de 5)
  function addToHistory(addressData) {
    const entry = {
      cep: addressData.cep,
      city: addressData.localidade,
      uf: addressData.uf,
    };

    // Remove o mesmo CEP se já estava na lista (evita duplicado),
    // coloca o novo no topo e corta no limite
    const updated = [
      entry,
      ...history.filter((item) => item.cep !== entry.cep),
    ].slice(0, HISTORY_LIMIT);

    setHistory(updated);
    saveHistory(updated); // persiste no aparelho
  }

  function handleClearHistory() {
    setHistory([]);
    saveHistory([]);
  }

  // --- Busca por CEP ----------------------------------------
  // Núcleo reaproveitado: recebe os dígitos direto (a chamada pode
  // vir do botão Buscar, do histórico ou da lista de resultados)
  async function searchCep(cepDigits) {
    Keyboard.dismiss();
    setIsLoading(true);
    setErrorMessage('');
    setAddress(null);

    try {
      const result = await fetchAddressByCep(cepDigits);

      if (result === null) {
        setErrorMessage('CEP não encontrado.');
      } else {
        setAddress(result);
        addToHistory(result); // toda busca com sucesso vira histórico
      }
    } catch (error) {
      setErrorMessage('Falha na consulta. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  }

  // Botão Buscar do modo CEP: valida antes de chamar o núcleo
  function handleSearch() {
    if (!isValidCep(zipCode)) {
      setErrorMessage('CEP inválido: digite os 8 números.');
      setAddress(null);
      return;
    }
    searchCep(cleanCep(zipCode));
  }

  // Toque em um item do histórico: preenche o campo e rebusca
  function handleSelectHistory(cep) {
    setMode('cep');
    setZipCode(formatCep(cep));
    searchCep(cleanCep(cep));
  }

  // --- Busca inversa ----------------------------------------
  async function handleReverseSearch() {
    // Regras da própria ViaCEP: UF com 2 letras, cidade e rua com 3+
    if (stateInput.trim().length !== 2) {
      setErrorMessage('Informe a UF com 2 letras (ex.: AL).');
      return;
    }
    if (cityInput.trim().length < 3 || streetInput.trim().length < 3) {
      setErrorMessage('Cidade e rua precisam de pelo menos 3 letras.');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setErrorMessage('');
    setResults([]);

    try {
      const found = await fetchCepsByAddress(
        stateInput.trim(),
        cityInput.trim(),
        streetInput.trim()
      );

      if (found.length === 0) {
        setErrorMessage('Nenhum endereço encontrado.');
      } else {
        setResults(found);
      }
    } catch (error) {
      setErrorMessage('Falha na consulta. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  }

  // Toque em um resultado da busca inversa: vira a busca por CEP
  function handleSelectResult(item) {
    setMode('cep');
    setZipCode(formatCep(cleanCep(item.cep)));
    setAddress(item);
    addToHistory(item);
    setResults([]);
  }

  // Botão Limpar: zera o modo atual
  function handleClear() {
    setZipCode('');
    setStateInput('');
    setCityInput('');
    setStreetInput('');
    setAddress(null);
    setResults([]);
    setErrorMessage('');
  }

  // Troca de modo: limpa mensagens para não confundir as telas
  function handleChangeMode(newMode) {
    setMode(newMode);
    setErrorMessage('');
  }

  // --- Interface --------------------------------------------
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ThemeToggle isDark={isDark} onToggle={handleToggleTheme} theme={theme} />

      <Text style={[styles.title, { color: theme.text }]}>Consulta de CEP</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        Busque pelo CEP ou pelo endereço (ViaCEP + Axios)
      </Text>

      <SearchModeToggle mode={mode} onChange={handleChangeMode} theme={theme} />

      {/* ----- Modo 1: busca por CEP ----- */}
      {mode === 'cep' && (
        <TextInput
          style={[
            styles.input,
            styles.cepInput,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="00000-000"
          placeholderTextColor={theme.subtext}
          keyboardType="numeric"
          value={zipCode}
          onChangeText={(text) => setZipCode(formatCep(text))}
          maxLength={9}
        />
      )}

      {/* ----- Modo 2: busca por endereço ----- */}
      {mode === 'address' && (
        <View style={styles.addressForm}>
          <View style={styles.addressRow}>
            <TextInput
              style={[
                styles.input,
                styles.stateInput,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="UF"
              placeholderTextColor={theme.subtext}
              autoCapitalize="characters"
              maxLength={2}
              value={stateInput}
              onChangeText={setStateInput}
            />
            <TextInput
              style={[
                styles.input,
                styles.cityInput,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Cidade"
              placeholderTextColor={theme.subtext}
              value={cityInput}
              onChangeText={setCityInput}
            />
          </View>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Rua / logradouro"
            placeholderTextColor={theme.subtext}
            value={streetInput}
            onChangeText={setStreetInput}
          />
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={mode === 'cep' ? handleSearch : handleReverseSearch}
        >
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            { backgroundColor: theme.secondary, borderColor: theme.border },
          ]}
          onPress={handleClear}
        >
          <Text style={[styles.buttonText, { color: theme.secondaryText }]}>
            Limpar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Renderização condicional: cada bloco aparece só quando faz sentido */}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={styles.loading}
        />
      )}

      {errorMessage !== '' && (
        <Text style={[styles.error, { color: theme.error }]}>
          {errorMessage}
        </Text>
      )}

      {/* Resultado da busca por CEP */}
      {mode === 'cep' && address && (
        <AddressCard address={address} theme={theme} />
      )}

      {/* Histórico: só no modo CEP e quando não há resultado na tela */}
      {mode === 'cep' && !address && !isLoading && (
        <HistoryList
          items={history}
          onSelect={handleSelectHistory}
          onClear={handleClearHistory}
          theme={theme}
        />
      )}

      {/* Resultados da busca inversa */}
      {mode === 'address' && results.length > 0 && (
        <ResultsList
          results={results}
          onSelect={handleSelectResult}
          theme={theme}
        />
      )}
    </View>
  );
}

// Estilos de LAYOUT — as cores chegam do tema, aplicadas lá em cima
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',     // centraliza na horizontal
    justifyContent: 'center', // centraliza na vertical
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  cepInput: {
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 2,
  },
  addressForm: {
    width: '100%',
    gap: 10,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stateInput: {
    width: 70,               // UF é curtinho
    textAlign: 'center',
  },
  cityInput: {
    flex: 1,                 // a cidade ocupa o resto da linha
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 32,
  },
  error: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
