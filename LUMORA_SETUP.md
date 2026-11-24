# Lumora — tema fitness

O tema está preparado para a integração GitHub → Shopify pela branch main.

## O que já funciona
- Início inspirado na referência, responsivo, com fotografias de campanha originais.
- Catálogo, filtros, ordenação, busca, variantes, estoque, sacola e checkout nativos do Dawn.
- Cards ligados aos produtos publicados. Peças com tamanho/cor levam à escolha das variantes.
- Favoritos locais neste navegador, sem app externo.
- Newsletter com consentimento e formulário de contato nativos da Shopify.
- Guia de medidas, cuidados, perguntas frequentes e links das políticas publicadas na loja.
- Conta e meios de pagamento exibidos conforme a configuração real da loja.

## Antes de começar a vender
1. Publique produtos reais no canal Loja virtual: título, fotos, descrição, composição, preço, estoque, peso e variantes de cor e tamanho. As fotos de campanha ilustram o visual da marca; os cards de inspiração exibidos com catálogo vazio não são produtos cadastrados.
2. Crie as coleções de Leggings, Tops, Conjuntos, Shorts e Acessórios. No editor, selecione-as nos botões do destaque e na seção de produtos. Selecione também as coleções dos quatro cards de atividade; sem seleção, eles abrem o catálogo completo.
3. Em Configurações do tema → Lumora · Loja fitness, revise marca, logo, e-mail público, WhatsApp, dados legais reais e informação de entrega. Configure as redes sociais nos campos existentes do Dawn.
4. Preencha a tabela de medidas com dados reais do fornecedor, uma linha por tamanho no formato tamanho;busto;cintura;quadril, em centímetros. Alternativamente, selecione uma página de medidas. Para medidas específicas por produto, crie um metafield de produto do tipo rich text em custom.size_guide. Ele tem prioridade sobre o guia geral. custom.fabric_care (rich text) fornece as instruções específicas no guia de cuidados.
5. Configure frete, regiões atendidas, prazo, tributos e provedor de pagamentos no admin Shopify. Pix, parcelamento e promoções dependem das condições e do provedor que você ativar.
6. Preencha e publique as políticas reais em Configurações → Políticas. Os links aparecem no rodapé automaticamente. Não foram criados prazos, descontos, avaliações, garantias ou números de clientes fictícios.
7. Faça um pedido de teste, teste o formulário de contato e confira o recebimento da newsletter no admin antes de divulgar a loja.
8. Se houver um menu próprio, selecione-o em Lumora · Cabeçalho. Sem seleção, o tema usa links funcionais para catálogo e seções da página inicial.

## Estrutura e manutenção
Os arquivos assets/lumora.*, sections/lumora-* e snippets/lumora-* contêm as personalizações. O mecanismo nativo de compra e as páginas de coleção, busca, carrinho e produto continuam baseados no Dawn. As imagens de campanha em assets/lumora-hero.png e assets/lumora-lookbook.png foram geradas para este projeto e podem ser substituídas por fotos dos produtos reais no editor.

Atualizações do tema devem preservar mudanças feitas pelo editor da Shopify em templates/*.json e config/settings_data.json. O commit anterior à personalização permite reverter o visual, se necessário.
