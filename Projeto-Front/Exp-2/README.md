# ONG Exemplo — Site Institucional

Site estático e acessível para apresentar a organização, seus projetos, voluntariado e campanhas de arrecadação.

- Tecnologias: HTML5, CSS (responsivo), JavaScript (vanilla)
- Páginas: Início (index.html), Projetos (projetos.html), Cadastro (cadastro.html)

## Recursos principais

- Área institucional (index.html)
  - Missão, Visão e Valores
  - Histórico e conquistas
  - Equipe e estrutura
  - Relatórios de transparência (lista de documentos)

- Gestão de projetos (projetos.html)
  - Cards de projetos com indicadores e categorias
  - Filtro por categoria (Todos, Educação, Meio ambiente)
  - Galeria de fotos e link de vídeo

- Engajamento de voluntários (projetos.html e cadastro.html)
  - Oportunidades de voluntariado com modal de inscrição
  - Área do voluntário (aparece após envio do cadastro como “Voluntário”)
  - Certificado digital imprimível

- Captação de recursos (projetos.html)
  - Campanhas com meta, valor arrecadado, barra de progresso
  - Simulação de doações (atualiza progresso no front-end)

- Comunicação e transparência
  - Notícias (index.html)
  - Lista de documentos públicos (index.html)

## Como executar

1. Baixe ou clone o projeto para sua máquina.
2. Abra o arquivo index.html no navegador.
   - Dica: use a extensão “Live Server” do VS Code para recarregar automaticamente.

## Estrutura de pastas

- index.html — página inicial e área institucional
- projetos.html — projetos, filtros, voluntariado, campanhas
- cadastro.html — formulário com máscaras e área do voluntário
- assets/
  - styles.css — estilos responsivos, componentes e temas (light/dark)
  - scripts.js — utilidades (máscaras, filtros, modal, progresso, certificado)
  - img/ — imagens do site (substitua pelos seus arquivos)

## Imagens

Coloque suas imagens em assets/img mantendo estes nomes para funcionar sem ajustes no HTML:
- hero.jpg, impacto.jpg, doacoes.jpg, horta.jpg, oficina.jpg
Você pode usar outras imagens, apenas atualize os atributos src no HTML.

## Formulário e máscaras

- Campos com máscara: CPF, Telefone e CEP.
- Validação nativa do navegador com realce de erro e foco no primeiro campo inválido.
- Ao enviar com “Sou: Voluntário”, a área do voluntário é exibida e permite imprimir o certificado.

## Acessibilidade

- Navegação por teclado (skip-link, foco visível)
- Landmark roles e ARIA onde necessário
- Imagens com texto alternativo
- Cores com contraste e modo escuro (prefers-color-scheme)

## Personalização

- Cores, espaçamentos e raios em assets/styles.css via CSS variables (ex.: --accent).
- Ajuste categorias de projetos editando data-category nos cards e os botões de filtro.
- Campanhas: configure data-goal e data-raised nas campanhas em projetos.html.

## Observações

- Doações e inscrições são simulações no front-end (sem backend).
- Relatórios e documentos estão como links de exemplo; substitua pelas URLs reais.