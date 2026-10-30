# Portfólio — Miguel Virgínio

Site estático (HTML, CSS e JavaScript puro, sem dependências) com Início, Sobre, Projetos e Contato.

## Estrutura
- `css/style.css` — design system (tokens, tipografia, componentes)
- `css/responsive.css` — tablet (≤860px) e mobile (≤520px)
- `js/script.js` — menu, revelação ao rolar, formulário
- `img/` — `perfil.jpg` e `veloce.jpg` (otimizadas)

## Princípios de design
Fonte do sistema com tracking/leading por tamanho, material translúcido (`backdrop-filter`) na navegação, feedback imediato ao toque, movimento suave e respeito a `prefers-reduced-motion`, `prefers-reduced-transparency` e `prefers-contrast`.

## Rodar localmente
```bash
python3 -m http.server 8000
# abra http://localhost:8000
```
