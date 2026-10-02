import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// alterna entre buscar por cep ou por endereço
export default function SearchModeToggle({ mode, onChange, theme }) {
  function Option({ value, label }) {
    const isActive = mode === value;

    return (
      <TouchableOpacity
        style={[
          styles.option,
          { backgroundColor: isActive ? theme.primary : 'transparent' },
        ]}
        onPress={() => onChange(value)}
      >
        <Text
          style={[styles.label, { color: isActive ? '#FFFFFF' : theme.subtext }]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Option value="cep" label="Por CEP" />
      <Option value="address" label="Por endereço" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  option: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
