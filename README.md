# EQUILÍBRIO INTEGRAL

Portal premium de conteúdo (Next.js 15) + site institucional legado.

## Portal (produção)

O portal completo está em [`portal/`](./portal):

```bash
cd portal
npm install
npm run dev
```

### CMS (publicar artigos sem código)

- URL: http://localhost:3000/admin/login
- Usuário: `admin`
- Senha: `Equilibrio@2026`

### O que foi entregue

- 31 artigos DOCX importados e padronizados
- Home premium (hero, destaque, categorias, tags, busca, newsletter)
- Página de artigo editorial (TOC, progresso, share, relacionados, ads)
- SEO completo (schema, sitemap, RSS, robots, image sitemap)
- GA4 / GTM / AdSense preparados via `.env`
- Painel admin com métricas, CRUD de artigos, anúncios e leads

Veja detalhes em [`portal/README.md`](./portal/README.md).

## Legado

Os arquivos `index.html`, `css/`, `js/` e a pasta `artigos/` originais foram preservados.
