# Diretrizes de Segurança, Qualidade e Boas Práticas - E-commerce Semi Joias

Este arquivo estabelece os padrões obrigatórios de segurança, integridade e profissionalismo que qualquer editor ou assistente de IA deve seguir ao modificar a aplicação **Loja Online de Semi Joias**.

---

## 1. 🛡️ Segurança de Dados e Variáveis de Ambiente
- **Separação de Chaves (Secrets)**: NUNCA expor chaves de API secretas (Stripe, Mercado Pago, banco de dados, tokens JWT, chaves de email) no código do lado do cliente (Client Components).
- **Prefixos `NEXT_PUBLIC_`**: Use o prefixo `NEXT_PUBLIC_` **apenas** para variáveis puramente públicas (ex: URL base pública, Google Analytics ID).
- **Proteção no Git**: O arquivo `.env` e `.env.local` NUNCA devem ser commitados no Git.
- **Privacidade e LGPD**: NUNCA registrar em logs de console (`console.log`) dados sensíveis de clientes como CPF, senhas, dados de cartão de crédito, telefones ou endereços.

---

## 2. 🔐 Integridade nas Transações e Preços do E-commerce
- **Validação Server-Side Obrigatória**: Os preços dos produtos, valores de frete, cálculo de parcelas e aplicação de cupons de desconto **DEVEM** ser validados no lado do servidor (Server Actions ou API Route Handlers).
- **NUNCA confiar no valor vindo do cliente**: O payload do checkout enviado pelo frontend deve conter apenas IDs de produtos e quantidades. Os valores monetários finais devem ser buscados diretamente do banco de dados/catálogo no servidor.
- **Tratamento de Estoque**: Garantir que verificações de estoque e reserva de itens sejam atômicas para evitar venda sem estoque (overbooking).

---

## 3. 🚨 Prevenção de Vulnerabilidades Web (OWASP)
- **XSS (Cross-Site Scripting)**: Não utilize `dangerouslySetInnerHTML` sem antes higienizar a entrada com bibliotecas seguras (ex: DOMPurify). Evite injetar HTML diretamente de formulários de avaliação ou busca.
- **Validação de Formulários**: Todos os inputs de usuário (cadastro, login, contato, avaliações, newsletter) devem ser validados no frontend e backend utilizando bibliotecas de schema como **Zod**.
- **CSRF & Autenticação**: Proteger chamadas de API alteradoras de estado (POST, PUT, DELETE) com validação de sessão/token e cabeçalhos HTTP seguros.
- **Links Externos**: Todos os links externos (`<a>`) devem utilizar `rel="noopener noreferrer"` e `target="_blank"`.

---

## 4. 💎 Padrão Visual e Experiência Luxuosa (UI/UX)
- **Identidade da Loja de Semi Joias**: Manter a estética sofisticada, limpa e elegante adequada para joias e acessórios finos (tons harmoniosos, tipografia legível, espaçamentos generosos).
- **Responsividade Total**: Qualquer alteração em layout ou componentes de produtos deve ser testada em dispositivos móveis (Mobile-First), tablets e desktops.
- **Otimização de Imagens**: Utilizar obrigatoriamente o componente `<Image />` do Next.js para imagens de joias com carregamento otimizado, proporções corretas (`aspect-ratio`) e `alt` descritivo.
- **Preservação do Funil de Vendas**: Nunca ocultar ou quebrar os botões críticos: *Adicionar ao Carrinho*, *Comprar Agora*, *Calculador de Frete* e *Checkout*.
- **Elementos de Confiança**: Manter visíveis os selos de segurança SSL, garantia de fábrica, política de troca/devolução e formas de pagamento aceitas.

---

## 5. 🛠️ Qualidade de Código e Processo de Deploy
- **TypeScript Estrito**: Respeitar as tipagens do TypeScript. Evitar o uso do tipo `any`.
- **Verificação Pré-Deploy**: Antes de finalizar alterações, garanta que o comando de build (`pnpm build` ou `npm run build`) execute com sucesso e sem erros de sintaxe ou tipagem.
- **Arquitetura Next.js**: Distinguir claramente Server Components (`'use server'`) e Client Components (`'use client'`) mantendo o mínimo de JS enviado ao navegador.
