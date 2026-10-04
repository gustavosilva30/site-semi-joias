# 🔒 Manual de Segurança, Proteção e Padrão Profissional
### **Projeto:** Loja Online de Semi Joias (`site semi joias`)

---

## 📌 Introdução

Este documento foi criado para servir como guia permanente de segurança, proteção de dados e manutenção do padrão profissional da loja online de semi-joias. 

Sempre que um **editor**, **desenvolvedor** ou **assistente de IA** realizar alterações no código, no banco de dados ou no painel de conteúdo, este manual deve ser seguido rigorosamente para garantir uma experiência de compra segura, confiável e de alto nível para os clientes.

---

## 🚀 Checklist Rápido Pré-Alteração

Antes de publicar qualquer alteração na loja online, certifique-se de que:

- [ ] **Preços e Descontos**: Todos os cálculos de preço, descontos e parcelas continuam sendo validados no **lado do servidor** (Server-Side).
- [ ] **Sem Segredos Expostos**: Nenhuma chave de API (Stripe, Mercado Pago, AWS, DB) foi colocada em arquivos do frontend ou commitada no Git.
- [ ] **Responsividade Verificada**: O layout dos produtos, banner principal, carrinho e checkout funcionam perfeitamente em telas de celular, tablet e computador.
- [ ] **Imagens Otimizadas**: Fotos de joias e banners estão otimizadas via `<Image />` do Next.js sem causar lentidão no carregamento da loja.
- [ ] **Compilação Sem Erros**: O projeto passa com sucesso no teste de build (`pnpm build` ou `npm run build`).

---

## 🛡️ 1. Segurança de Pagamentos e Prevenção de Fraudes

Como uma loja e-commerce lida com transações financeiras e dados sensíveis dos clientes, a segurança deve ser prioridade máxima:

### 1.1. Cálculo de Carrinho e Preços
* **Servidor é a Única Fonte da Verdade**: O preço de cada semi-joia, o cálculo do valor do frete e a validação do cupom de desconto **jamais** devem aceitar valores vindo diretamente do código do navegador do usuário.
* **Prevenção de Adulteração de Payload**: No checkout, o cliente envia apenas os IDs dos produtos e a quantidade. O backend recalcula o valor real consultando a base oficial antes de enviar a cobrança ao gateway de pagamento.

### 1.2. Integração com Gateways de Pagamento
* Utilize apenas SDKs oficiais e rotas seguras (Route Handlers/Server Actions) para comunicar com Mercado Pago, Stripe, PagSeguro ou outros integradores.
* Habilite suporte a **Webhooks com Verificação de Assinatura** para garantir que as confirmações de pagamento recebidas venham comprovadamente do gateway.

---

## 🔒 2. Proteção de Dados (LGPD) e Privacidade do Cliente

### 2.1. Manipulação de Dados Sensíveis
* **Não Logar Dados de Clientes**: Nunca coloque comandos como `console.log(usuario)` que exibam senhas, números de cartão, CPF ou endereços dos clientes em ambiente de produção ou servidores de log.
* **Mascaramento de Informações**: Na tela de confirmação de pedido, exiba apenas os últimos 4 dígitos de cartões de crédito e mascare parte do CPF/email.

### 2.2. Gerenciamento de Credenciais
* Mantenha arquivos `.env` e `.env.local` na lista do `.gitignore`.
* Apenas variáveis com o prefixo `NEXT_PUBLIC_` (ex: `NEXT_PUBLIC_SITE_URL`) são expostas ao navegador. Todas as outras variáveis devem ser tratadas como privadas e confidenciais.

---

## 💎 3. Padrão Visual e Experiência do Cliente (Luxo e Elegância)

Loja de semi-joias exige uma estética impecável para transmitir confiança e o valor das peças:

### 3.1. Apresentação das Semi-Joias
* **Qualidade Visual**: As fotos dos produtos devem ser nítidas, com fundo limpo e iluminação adequada para destacar banho de ouro, prata, zircônias e acabamentos.
* **Sem Quebra de Imagens**: Utilize sempre o componente `<Image />` do Next.js com atributos de dimensão e `alt` para acessibilidade e SEO.
* **Ficha Técnica Completa**: Mantenha visíveis detalhes cruciais como: *Material (Banho de Ouro 18k, Prata 925)*, *Verniz de Proteção*, *Tecnologia Antialérgica (Nickel Free)* e *Garantia*.

### 3.2. Selos de Confiança e Transparência
Mantenha em destaque no rodapé e na página de produto:
* Selo de Conexão Segura (SSL / HTTPS).
* Ícones dos Gateways de Pagamento aceitos.
* Informações claras sobre **Troca e Devolução (Conforme Código de Defesa do Consumidor)**.
* Canais oficiais de atendimento (WhatsApp de suporte, E-mail, CNPJ e Endereço).

---

## 🛠️ 4. Proteção do Código e Boas Práticas Tecnológicas

### 4.1. Sanitização e Proteção Contra Ataques Web
* **XSS (Cross-Site Scripting)**: Sanitize qualquer campo de entrada de texto (como avaliações de produtos ou perguntas sobre o item) antes de renderizá-los.
* **SQL/NoSQL Injection**: Utilize sempre ORMs ou rotas preparadas com parâmetros tipados (TypeScript / Prisma / Drizzle / Postgres Driver).

### 4.2. Fluxo de Publicação e Edição
1. **Ambiente de Testes**: Teste novas funcionalidades ou mudanças visuais localmente (`pnpm dev`) antes de enviar para a loja em produção.
2. **Build de Verificação**: Execute `pnpm build` para confirmar que não existem erros de TypeScript ou imports quebrados.
3. **Commit Organizado**: Documente as alterações no Git com mensagens descritivas (ex: `fix: correção na exibição do frete na página de produto`).

---

## 📞 5. Procedimentos de Emergência

Em caso de suspeita de vulnerabilidade, erro em preços ou instabilidade na loja:

1. **Pausar Transações Afetadas**: Se houver erro de preço em determinado item, desative temporariamente a visibilidade do produto no catálogo.
2. **Revogar Chaves Expostas**: Se qualquer chave privada for acidentalmente enviada para um repositório, gere imediatamente uma nova chave no painel do provedor (Stripe, Vercel, Supabase, Mercado Pago, etc.) e atualize o `.env`.
3. **Restaurar Backup**: Mantenha o histórico do Git limpo para permitir reversão rápida (`git revert`) para uma versão estável anterior se necessário.

---

> *Este arquivo garante que o projeto **site semi joias** permaneça um e-commerce seguro, protegido, confiável e com altíssimo padrão de qualidade.*
