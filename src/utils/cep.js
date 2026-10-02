// remove tudo que não for número
export function cleanCep(text) {
  return text.replace(/\D/g, '');
}

// aplica a máscara 00000-000 enquanto digita
export function formatCep(text) {
  const digits = cleanCep(text).slice(0, 8);
  if (digits.length > 5) {
    return digits.slice(0, 5) + '-' + digits.slice(5);
  }
  return digits;
}

export function isValidCep(text) {
  return cleanCep(text).length === 8;
}
