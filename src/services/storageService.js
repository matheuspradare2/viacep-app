import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@viacep:isDark';
const HISTORY_KEY = '@viacep:history';

// tudo com try/catch: se o storage falhar o app continua funcionando

export async function saveTheme(isDark) {
  try {
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  } catch (error) {}
}

// retorna null na primeira vez (aí vale o tema do sistema)
export async function loadTheme() {
  try {
    const stored = await AsyncStorage.getItem(THEME_KEY);
    return stored !== null ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
}

export async function saveHistory(history) {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {}
}

export async function loadHistory() {
  try {
    const stored = await AsyncStorage.getItem(HISTORY_KEY);
    return stored !== null ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}
