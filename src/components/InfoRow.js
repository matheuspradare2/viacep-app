import { StyleSheet, Text, View } from 'react-native';

export default function InfoRow({ label, value, theme }) {
  return (
    <View style={[styles.row, { borderBottomColor: theme.divider }]}>
      <Text style={[styles.label, { color: theme.subtext }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>
        {value ? value : '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'right',
  },
});
