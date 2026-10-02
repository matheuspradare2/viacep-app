import axios from 'axios';

const api = axios.create({
  baseURL: 'https://viacep.com.br/ws',
  timeout: 10000,
});

// busca endereço pelo cep (só os 8 dígitos)
// a viacep responde { erro: true } quando o cep não existe
export async function fetchAddressByCep(cep) {
  const response = await api.get(`/${cep}/json/`);
  if (response.data.erro) {
    return null;
  }
  return response.data;
}

// busca inversa: uf/cidade/rua retorna uma lista de até 50 endereços
// cidade e rua precisam ter no mínimo 3 letras (regra da api)
export async function fetchCepsByAddress(state, city, street) {
  const response = await api.get(
    `/${encodeURIComponent(state)}/${encodeURIComponent(city)}/${encodeURIComponent(street)}/json/`
  );
  return response.data;
}
