import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ThemeToggle({ isDark, onToggle, theme }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
      onPress={onToggle}
    >
      <Text style={styles.icon}>{isDark ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
});
