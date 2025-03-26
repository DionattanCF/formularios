/**
 * Worker para receber dados do formulário de procuração e salvar no D1
 */

// Headers para permitir CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Responde às requisições OPTIONS (preflight CORS)
function handleOptions(request) {
  return new Response(null, {
    headers: corsHeaders,
  });
}

// Cria a tabela se ela não existir
async function setupDatabase(env) {
  await env.DB.prepare(`
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
    )
  `).run();
}

// Insere os dados na tabela procuracoes
async function inserirProcuracao(env, data) {
  const stmt = env.DB.prepare(`
    INSERT INTO procuracoes (
      tipo_procuracao, nome_completo, data_nascimento, nome_mae, 
      atividade_profissional, estado_civil, naturalidade, celular, 
      rg, cpf, titulo_eleitoral, cep, logradouro, numero, 
      complemento, bairro, cidade, estado, finalidade, 
      data_procuracao, consentimento, timestamp,
      cnpj_empresa, razao_social, nome_fantasia, cargo_empresa, email_empresa,
      nome_coligacao, email_coligacao, endereco_coligacao
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?
    )
  `).bind(
    data.tipoProcuracao || null,
    data.nomeCompleto || null,
    data.dataNascimento || null,
    data.nomeMae || null,
    data.atividadeProfissional || null,
    data.estadoCivil || null,
    data.naturalidade || null,
    data.celular || null,
    data.rg || null,
    data.cpf || null,
    data.tituloEleitoral || null,
    data.cep || null,
    data.logradouro || null,
    data.numero || null,
    data.complemento || null,
    data.bairro || null,
    data.cidade || null,
    data.estado || null,
    data.finalidade || null,
    data.dataProcuracao || null,
    data.consentimento ? 1 : 0,
    data.timestamp || null,
    
    // Dados de Pessoa Jurídica
    data.cnpjEmpresa || null,
    data.razaoSocial || null,
    data.nomeFantasia || null,
    data.cargoEmpresa || null,
    data.emailEmpresa || null,
    
    // Dados de Coligação
    data.nomeColigacao || null,
    data.emailColigacao || null,
    data.enderecoColigacao || null
  );

  return await stmt.run();
}

// Manipula as requisições POST
async function handlePost(request, env) {
  try {
    // Certifica-se de que a tabela existe
    await setupDatabase(env);
    
    // Obtém os dados do formulário
    const contentType = request.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }
    
    // Adiciona timestamp se não existir
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }
    
    // Converte checkbox em booleano
    data.consentimento = data.consentimento === 'on' || data.consentimento === true || data.consentimento === '1';
    
    // Insere no banco de dados
    const result = await inserirProcuracao(env, data);
    
    // Retorna resposta de sucesso
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Procuração registrada com sucesso',
        id: result.meta?.last_row_id || null
      }), 
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    // Retorna resposta de erro
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
}

// Manipula as requisições GET (para testar se o Worker está funcionando)
async function handleGet(request, env) {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'API para formulário de procuração está funcionando'
    }), 
    {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    }
  );
}

// Event listener para requisições
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Manipula requisições CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }
    
    // Manipula requisições POST (dados do formulário)
    if (request.method === 'POST') {
      return handlePost(request, env);
    }
    
    // Manipula requisições GET (teste da API)
    if (request.method === 'GET') {
      return handleGet(request, env);
    }
    
    // Método não suportado
    return new Response('Método não suportado', {
      status: 405,
      headers: {
        Allow: 'GET, POST, OPTIONS',
        ...corsHeaders
      }
    });
  }
};
