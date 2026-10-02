import { StyleSheet, View } from 'react-native';
import InfoRow from './InfoRow';

// os campos vêm com esses nomes direto da api (logradouro, bairro etc)
export default function AddressCard({ address, theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <InfoRow label="CEP" value={address.cep} theme={theme} />
      <InfoRow label="Logradouro" value={address.logradouro} theme={theme} />
      <InfoRow label="Complemento" value={address.complemento} theme={theme} />
      <InfoRow label="Bairro" value={address.bairro} theme={theme} />
      <InfoRow
        label="Cidade"
        value={`${address.localidade} - ${address.uf}`}
        theme={theme}
      />
      <InfoRow label="DDD" value={address.ddd} theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    gap: 12,
    elevation: 3, // sombra no android
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
