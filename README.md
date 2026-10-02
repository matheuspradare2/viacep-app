# ViaCEP App

App de consulta de CEP feito em React Native com Expo, usando Axios para consumir a API do ViaCEP.

Projeto da disciplina de Frameworks Front-End e Mobile (Uninassau).

## O que ele faz

- Busca endereço pelo CEP, com máscara e validação
- Busca inversa: UF + cidade + rua retorna uma lista de CEPs
- Histórico das últimas 5 buscas
- Modo claro/escuro (segue o tema do celular e dá pra alternar no botão)
- Tema e histórico ficam salvos no aparelho (AsyncStorage)

## Como rodar

Precisa do Node.js instalado e do app Expo Go no celular.

```
npm install
npx expo start
```

Depois é só escanear o QR code com o Expo Go. Se o celular não conectar na mesma rede, dá pra usar `npx expo start --tunnel`.

## Organização

```
src/
  screens/      telas do app
  components/   componentes reutilizáveis
  services/     API (axios) e armazenamento local
  theme/        cores dos temas claro e escuro
  utils/        funções de máscara e validação de CEP
```
