// Obter os dados do webhook
const inputData = $input.item;
const webhookData = Array.isArray($input.all()) && $input.all().length > 0 ? $input.all()[0] : null;

// Registrar os dados completos recebidos para depuração
console.log("Input completo:", JSON.stringify($input, null, 2));
console.log("Item completo:", JSON.stringify(inputData, null, 2));
console.log("Webhook data:", JSON.stringify(webhookData, null, 2));

// Verificar se há dados binários (arquivos)
let anexoInfo = "Não enviado";
let temAnexo = false;

if (inputData.binary && inputData.binary.anexo) {
    temAnexo = true;
    anexoInfo = {
        nome: inputData.binary.anexo.fileName || webhookData?.body?.nome_arquivo || "Desconhecido",
        tipo: inputData.binary.anexo.mimeType || webhookData?.body?.tipo_arquivo || "Desconhecido",
        tamanho: inputData.binary.anexo.fileSize ? 
            Math.round(inputData.binary.anexo.fileSize / 1024) + " KB" : 
            webhookData?.body?.tamanho_arquivo ? 
            Math.round(parseInt(webhookData.body.tamanho_arquivo) / 1024) + " KB" : "Desconhecido",
        url: inputData.binary.anexo.url || ""
    };
}

// Determinar a fonte de dados mais confiável
// Primeiro tenta usar o corpo do webhook, depois o JSON analisado, depois o item
const body = webhookData?.body || {};
let dadosJSON = {};

// Tentar extrair dados do campo dados_json (se existir)
if (body.dados_json) {
    try {
        dadosJSON = JSON.parse(body.dados_json);
        console.log("Dados JSON extraídos do campo dados_json:", dadosJSON);
    } catch (e) {
        console.log("Erro ao processar dados_json:", e.message);
    }
}

// Extrair categorias
const categorias = [];
// Verificar se há categorias individuais (categoria_0, categoria_1, etc.)
const categoriasCount = parseInt(body.categorias_count || "0");
for (let i = 0; i < categoriasCount; i++) {
    const categoria = body[`categoria_${i}`];
    if (categoria) categorias.push(categoria);
}

// Se não encontrou categorias individuais, tentar extrair do dados_json
if (categorias.length === 0 && dadosJSON.categorias && Array.isArray(dadosJSON.categorias)) {
    categorias.push(...dadosJSON.categorias);
}

// Extrair acompanhamento
const acompanhamento = [];
// Verificar se há acompanhamentos individuais (acompanhamento_0, acompanhamento_1, etc.)
const acompanhamentoCount = parseInt(body.acompanhamento_count || "0");
for (let i = 0; i < acompanhamentoCount; i++) {
    const acomp = body[`acompanhamento_${i}`];
    if (acomp) acompanhamento.push(acomp);
}

// Se não encontrou acompanhamentos individuais, tentar extrair do dados_json
if (acompanhamento.length === 0 && dadosJSON.acompanhamento && Array.isArray(dadosJSON.acompanhamento)) {
    acompanhamento.push(...dadosJSON.acompanhamento);
}

// Função para formatar data
function formatarData(dataString) {
    if (!dataString) return "";
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return "Data inválida";
        return data.toLocaleDateString('pt-BR');
    } catch (e) {
        return "Erro ao formatar data";
    }
}

// Função para formatar hora
function formatarHora(dataString) {
    if (!dataString) return "";
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return "Hora inválida";
        return data.toLocaleTimeString('pt-BR');
    } catch (e) {
        return "Erro ao formatar hora";
    }
}

// Criar objeto formatado com dados do formulário
const dadosFormatados = {
    dataRecebimento: formatarData(body.timestamp || dadosJSON.timestamp || new Date().toISOString()),
    horaRecebimento: formatarHora(body.timestamp || dadosJSON.timestamp || new Date().toISOString()),
    
    nome: body.nome || dadosJSON.nome || "Não informado",
    empresa: body.empresa || dadosJSON.empresa || "Não informado",
    cargo: body.cargo || dadosJSON.cargo || "Não informado",
    whatsapp: body.whatsapp || dadosJSON.whatsapp || "Não informado",
    email: body.email || dadosJSON.email || "Não informado",
    
    categorias: categorias.length > 0 ? categorias.join(", ") : "Não informado",
    
    descricao: body.descricao || dadosJSON.descricao || "Não informado",
    importancia: body.importancia || dadosJSON.importancia || "Não informado",
    prazo: body.prazo || dadosJSON.prazo || "Não informado",
    dataPrazo: formatarData(body.dataPrazo || dadosJSON.dataPrazo || ""),
    
    impactoTrabalho: body.impactoTrabalho || dadosJSON.impactoTrabalho || "Não informado",
    beneficio: body.beneficio || dadosJSON.beneficio || "Não informado",
    
    acompanhamento: acompanhamento.length > 0 ? acompanhamento.join(", ") : "Não informado",
    
    comentariosAdicionais: body.comentariosAdicionais || dadosJSON.comentariosAdicionais || "Não informado",
    
    anexo: anexoInfo,
    temAnexo: temAnexo || (body.tem_anexo === "sim"),
    statusDemanda: "Nova",
    
    // Adicionar informações de depuração
    debug: {
        contentType: webhookData?.headers?.['content-type'] || "Desconhecido",
        bodyKeys: Object.keys(body),
        temDadosJSON: Boolean(dadosJSON && Object.keys(dadosJSON).length > 0),
        dadosOriginais: {
            body: body,
            json: dadosJSON
        }
    }
};

return {json: dadosFormatados}; 