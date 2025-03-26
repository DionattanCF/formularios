-- Cria a tabela de procurações se não existir
CREATE TABLE IF NOT EXISTS procuracoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo_procuracao TEXT,
  nome_completo TEXT,
  data_nascimento TEXT,
  nome_mae TEXT,
  atividade_profissional TEXT,
  estado_civil TEXT,
  naturalidade TEXT,
  celular TEXT,
  rg TEXT,
  cpf TEXT,
  titulo_eleitoral TEXT,
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  finalidade TEXT,
  data_procuracao TEXT,
  consentimento INTEGER,
  timestamp TEXT,
  
  -- Campos específicos de Pessoa Jurídica
  cnpj_empresa TEXT,
  razao_social TEXT,
  nome_fantasia TEXT,
  cargo_empresa TEXT,
  email_empresa TEXT,
  
  -- Campos específicos de Coligação
  nome_coligacao TEXT,
  email_coligacao TEXT,
  endereco_coligacao TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 