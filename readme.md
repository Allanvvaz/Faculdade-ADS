# ONG Exemplo — Frontend (Projeto acadêmico)

Pequeno site estático (HTML/CSS/JS) criado como projeto acadêmico para demonstrar uma interface de ONG com:
- Páginas: Início, Projetos, Cadastro
- Navegação SPA simulada (fetch + History API)
- Formulário com máscaras (CPF, telefone, CEP), validação e salvamento temporário em localStorage
- Módulos de campanhas com barra de progresso e simulação de doação
- Modal para inscrição em vagas de voluntariado
- Acessibilidade básica (skip link, foco visível, labels)

Pré-requisitos
- Navegador moderno (Chrome, Edge, Firefox)
- Servidor HTTP local (necessário para fetch/navegação SPA)

Como rodar localmente
1. Clonar/copiar o projeto para sua máquina.
2. Entrar na pasta do projeto:
   cd "c:\Users\wilma\Desktop\Faculdade-ADS"
3. Iniciar um servidor HTTP simples (exemplos):
   - Python 3:
     python -m http.server 8000
   - VS Code: usar a extensão Live Server
4. Abrir no navegador:
   http://localhost:8000/index.html

Observações importantes
- O projeto é estático; interações como "enviar cadastro" e "doar" são simulações e usam localStorage para persistência local.
- A navegação entre páginas é feita via fetch; portanto abra via servidor e não diretamente pelo file:// para evitar bloqueios de fetch.

Estrutura de arquivos (resumo)
- index.html — página principal
- projetos.html — listagem de projetos, voluntariado e campanhas
- cadastro.html — formulário de cadastro e área do voluntário
- assets/
  - styles.css — estilos principais
  - scripts.js — lógica JS: SPA, máscaras, validações, campanhas, modal
  - img/ — imagens usadas nas páginas

Contribuição
- Issue/PR com correções ou melhorias são bem-vindas. Mantenha o foco em HTML/CSS/JS e acessibilidade.


