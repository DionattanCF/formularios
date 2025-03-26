# Configuração do Cloudflare Worker para Formulário de Procuração

Este diretório contém os arquivos necessários para configurar e implantar um Cloudflare Worker que recebe os dados do formulário de procuração e os armazena em um banco de dados D1 do Cloudflare.

## Pré-requisitos

1. Conta no Cloudflare
2. Wrangler CLI instalado (`npm install -g wrangler`)
3. Fazer login no Wrangler (`wrangler login`)

## Configuração

O banco de dados D1 já foi criado com o nome `banco_juridico` e ID `fee873da-0b4c-484d-8258-2ee139b246fd`.

## Arquivos

- `wrangler.toml`: Configuração do Worker e sua conexão com o banco D1
- `formulario_worker.js`: Código do Worker que recebe os dados e os salva no D1
- `setup_db.sql`: Script SQL para criar a tabela no banco D1
- `deploy.sh`: Script de shell para facilitar a implantação

## Como implantar

1. Edite o arquivo `wrangler.toml` se necessário
2. Execute o script de implantação:

```bash
./deploy.sh
```

3. Após a implantação, o Worker estará disponível em uma URL como:
   `https://formulario-procuracao-worker.{seu-dominio}.workers.dev`

4. Atualize a URL do Worker no arquivo `formulario_procuracao.html`:

```javascript
const workerUrl = 'https://formulario-procuracao-worker.{seu-dominio}.workers.dev';
```

## Verificação

Você pode testar o Worker fazendo uma requisição GET para a URL:

```bash
curl https://formulario-procuracao-worker.{seu-dominio}.workers.dev
```

Deve retornar:

```json
{
  "success": true,
  "message": "API para formulário de procuração está funcionando"
}
```

## Consultando os dados

Para consultar os dados armazenados no D1:

```bash
wrangler d1 execute banco_juridico --command="SELECT * FROM procuracoes"
``` 