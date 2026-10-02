import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

// lista de resultados da busca por endereço
export default function ResultsList({ results, onSelect, theme }) {
  return (
    <FlatList
      style={styles.list}
      data={results}
      keyExtractor={(item) => item.cep}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.item,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={() => onSelect(item)}
        >
          <Text style={[styles.street, { color: theme.text }]}>
            {item.logradouro ? item.logradouro : '(sem logradouro)'}
          </Text>
          <Text style={[styles.details, { color: theme.subtext }]}>
            {item.bairro} · {item.cep}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    marginTop: 16,
    maxHeight: 280, // pra lista rolar sem tomar a tela toda
  },
  item: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  street: {
    fontSize: 15,
    fontWeight: '600',
  },
  details: {
    fontSize: 13,
    marginTop: 2,
  },
});
