import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HistoryList({ items, onSelect, onClear, theme }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.subtext }]}>
          Últimas buscas
        </Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={[styles.clear, { color: theme.subtext }]}>limpar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.cep}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => onSelect(item.cep)}
          >
            <Text style={[styles.itemCep, { color: theme.text }]}>
              {item.cep}
            </Text>
            <Text style={[styles.itemCity, { color: theme.subtext }]}>
              {item.city} - {item.uf}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clear: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  itemCep: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemCity: {
    fontSize: 13,
    flexShrink: 1,
    textAlign: 'right',
  },
});
