# Regras do Projeto: ExecutiveJetWorldMap

## 1. Visão Geral e Escopo

**Objetivo:** Construir e manter uma aplicação web interativa para o planejamento de rotas de aviação executiva. A aplicação é construída com HTML, CSS e JavaScript puros, utilizando a biblioteca OpenLayers para a visualização de mapas.

**Funcionalidades Principais:**
- Seleção de aeronaves de um banco de dados estático.
- Definição de uma rota com múltiplos aeroportos (waypoints).
- Validação em tempo real de cada trecho da rota em relação ao alcance da aeronave selecionada.
- Visualização da rota, dos marcadores de aeroporto e dos círculos de alcance no mapa.
- Exibição de uma lista resumida da rota atual com distâncias por trecho e distância total.

## 2. Arquitetura e Arquivos Chave

A aplicação utiliza uma arquitetura simples de arquivos estáticos, sem frameworks.

- **`index.html`**: A estrutura principal da interface do usuário (View).
- **`style.css`**: O estilo visual da aplicação.
- **`data.js`**: O banco de dados da aplicação (Model), contendo os dados de aeronaves e aeroportos.
- **`script.js`**: O coração da aplicação (Controller). Contém toda a lógica para manipulação de eventos, validação de rotas, cálculos geodésicos e renderização no mapa.
- **`Dockerfile` / `docker-compose.yml`**: Configuração para executar a aplicação em um ambiente containerizado com Docker.

## 3. Processo de Desenvolvimento e Depuração

Nosso processo de iteração e diagnóstico segue um padrão definido:

1.  **Relato do Problema:** O usuário descreve o comportamento inesperado e fornece o log completo do console do navegador.
2.  **Análise:** Eu analiso o log para identificar o erro exato (`SyntaxError`, `ReferenceError`, etc.) e a sua localização no código.
3.  **Hipótese e Correção:** Com base na análise, formulo uma hipótese sobre a causa raiz (ex: uma função definida no escopo errado, um erro de sintaxe, uma falha na lógica) e aplico uma correção cirúrgica.
4.  **Validação:** O usuário testa a aplicação para validar a correção.
5.  **Depuração Avançada:** Para problemas de lógica que não geram erros claros, a estratégia é inserir `console.log` para monitorar o estado de variáveis críticas (como `routePoints`) e o fluxo de execução das funções.

**Problemas Comuns e Soluções:**
- **`ReferenceError`**: Geralmente causado por funções definidas em escopos locais (aninhadas dentro de outras funções) quando deveriam estar no escopo global. A solução é mover a definição da função para o nível superior do script.
- **UI não atualiza:** Frequentemente um sintoma de um erro de JavaScript que interrompe a execução do script antes que a função de atualização da UI (como `updateRouteList`) seja chamada. A solução é encontrar e corrigir o erro que está bloqueando a execução.
