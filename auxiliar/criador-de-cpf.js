function gerarCPF() {
  // Função auxiliar para gerar um número aleatório entre min e max (inclusive)
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Gera os 9 primeiros dígitos do CPF
  let cpf = '';
  for (let i = 0; i < 9; i++) {
    cpf += randomInt(0, 9);
  }

  // Calcula o primeiro dígito verificador (DV1)
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  let dv1 = resto < 2 ? 0 : 11 - resto;

  // Adiciona o primeiro dígito verificador ao CPF
  cpf += dv1;

  // Calcula o segundo dígito verificador (DV2)
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  let dv2 = resto < 2 ? 0 : 11 - resto;

  // Adiciona o segundo dígito verificador ao CPF
  cpf += dv2;

  // Retorna o CPF formatado
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

console.log(gerarCPF());