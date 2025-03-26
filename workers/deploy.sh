#!/bin/bash

# Verifica se o Wrangler está instalado
if ! command -v wrangler &> /dev/null; then
    echo "Erro: Wrangler não está instalado. Instale com 'npm install -g wrangler'"
    exit 1
fi

# Implanta o Worker
echo "Implantando o Worker..."
cd "$(dirname "$0")"
wrangler deploy

echo "Criando a tabela no banco de dados D1..."
wrangler d1 execute banco_juridico --file=./setup_db.sql

echo "Implantação concluída!" 