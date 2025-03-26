# Formulário de Alinhamento de Demandas e Sugestões

Este é um formulário responsivo para coletar demandas e sugestões dos usuários, com integração via webhook para processar as respostas.

## Características

- Design responsivo que funciona em dispositivos móveis e desktop
- Validação de formulário em tempo real
- Suporte para seleção múltipla de categorias
- Campos separados para WhatsApp (obrigatório) e e-mail (opcional)
- Suporte para upload de arquivos com pré-visualização
- Campos condicionais que aparecem conforme a seleção do usuário
- Modal de confirmação após envio bem-sucedido
- Integração com webhook para processamento de dados
- Animações e efeitos visuais para melhor experiência do usuário

## Arquivos do Projeto

- `index.html` - Estrutura do formulário
- `styles.css` - Estilos e responsividade
- `script.js` - Funcionalidades e integração com webhook

## Como Configurar o Webhook

Para que o formulário envie os dados para o seu sistema, você precisa configurar um webhook:

1. Abra o arquivo `script.js`
2. Localize a linha com `const webhookUrl = 'https://hook.eu1.make.com/YOUR_WEBHOOK_ID';`
3. Substitua `YOUR_WEBHOOK_ID` pelo ID do seu webhook

### Opções de Webhook

Você pode usar várias plataformas para criar seu webhook:

- [Make.com](https://www.make.com/) (antigo Integromat)
- [Zapier](https://zapier.com/)
- [n8n](https://n8n.io/)
- [Pipedream](https://pipedream.com/)
- Ou criar seu próprio endpoint em um servidor

## Integração com WordPress

Para integrar este formulário em uma página do WordPress:

1. **Usando um bloco HTML personalizado**:
   - Edite a página onde deseja adicionar o formulário
   - Adicione um bloco "HTML Personalizado" ou "Custom HTML"
   - Cole o código HTML completo do arquivo `index.html` dentro deste bloco

2. **Usando um plugin de código personalizado**:
   - Instale um plugin como "Code Snippets", "Custom CSS & JS" ou "Header and Footer Scripts"
   - Adicione os arquivos CSS e JavaScript como snippets separados
   - Configure-os para carregar apenas nas páginas onde o formulário será exibido
   - Adicione apenas o HTML do formulário na página do WordPress

3. **Considerações importantes**:
   - Se seu tema WordPress já carrega o Font Awesome, você pode remover essa linha do HTML
   - Pode ser necessário adicionar prefixos específicos às classes CSS para evitar conflitos com o tema
   - Certifique-se de que seu servidor WordPress permite solicitações AJAX para domínios externos

## Personalização

### Cores e Tema

Para alterar as cores do formulário:

1. Abra o arquivo `styles.css`
2. Modifique as variáveis CSS no seletor `:root`

```css
:root {
    --primary-color: #3f51b5;
    --primary-light: #757de8;
    --primary-dark: #002984;
    --secondary-color: #ff4081;
    /* outras variáveis... */
}
```

### Campos do Formulário

Para adicionar ou remover campos:

1. Edite a estrutura HTML em `index.html`
2. Atualize a lógica JavaScript em `script.js` se necessário

## Funcionalidades Especiais

### Seleção Múltipla de Categorias
O formulário permite que o usuário selecione várias categorias para sua demanda. Pelo menos uma categoria deve ser selecionada.

### Campos de Contato Separados
- **WhatsApp**: Campo obrigatório para contato principal
- **E-mail**: Campo opcional para contato alternativo

### Validação Inteligente
O formulário valida automaticamente:
- Formato de número de WhatsApp
- Formato de e-mail (quando preenchido)
- Seleção de pelo menos uma categoria
- Preenchimento de campos obrigatórios

## Processamento de Arquivos

O formulário atual não envia arquivos para o webhook, apenas dados em formato JSON. Para implementar o upload de arquivos, você precisará:

1. Configurar um serviço de armazenamento (como AWS S3, Google Cloud Storage, etc.)
2. Modificar o JavaScript para fazer upload do arquivo e obter uma URL
3. Incluir essa URL nos dados enviados para o webhook

## Instalação

1. Faça o download dos arquivos para seu servidor web ou integre com WordPress
2. Configure o webhook conforme instruções acima
3. Teste o formulário para garantir que está funcionando corretamente

## Compatibilidade

O formulário é compatível com os seguintes navegadores:

- Chrome (versão 60+)
- Firefox (versão 55+)
- Safari (versão 11+)
- Edge (versão 80+)
- Opera (versão 47+)
- Navegadores móveis modernos

## Licença

Este projeto está disponível para uso livre. Atribua os créditos se possível. 