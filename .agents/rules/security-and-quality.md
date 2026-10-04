# Regras de Segurança e Qualidade - E-Commerce Semi Joias

## Regras Obrigatórias para Qualquer Edição de Código

1. **Proteção Contra Erros de Preço e Carrinho**:
   - Nunca confie em preços de produtos vindo do lado do cliente no checkout.
   - Sempre consulte e calcule o preço final, frete e desconto no servidor antes de redirecionar para o gateway de pagamento.

2. **Segurança de Variáveis Secretas**:
   - Nunca inclua chaves privadas de API, senhas de DB ou tokens de integração em arquivos cliente.
   - Não altere o `.gitignore` para permitir arquivos `.env` ou `.env.local`.

3. **Integriação Visual Premium**:
   - Trata-se de uma loja online de semi-joias (produtos de luxo/moda).
   - Mantenha imagens em alta definição usando `next/image`.
   - Preserve o layout responsivo, banners promocionais e cards de produto.

4. **Validação de Inputs de Formulários**:
   - Utilize Zod ou validação rigorosa em formulários de checkout, endereço, cupons e avaliações.
   - Higienize dados para evitar ataques de XSS e SQL Injection.

5. **Testes de Build**:
   - Qualquer modificação de código deve ser verificada com `pnpm build` ou `npm run build` para certificar que não há quebras no Next.js ou erros de TypeScript.
