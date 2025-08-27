# Regras do Projeto: ExecutiveJetWorldMap

## 1. Visão Geral e Escopo do Usuário

**Objetivo Principal:** Desenvolver uma aplicação web interativa e intuitiva para planejamento de rotas de aviação executiva, priorizando experiência visual e interação direta com o mapa.

**Funcionalidades Implementadas:**
- ✅ Seleção de aeronaves (80+ modelos) de banco de dados estático
- ✅ **Interface Visual Revolucionária**: Clique direto no mapa para definir rotas (não mais dropdowns)
- ✅ **Exibição Global**: Todos os 400+ aeroportos visíveis no carregamento do mapa
- ✅ **Marcadores Temáticos**: Ícones de avião SVG com cores dinâmicas baseadas no papel na rota
- ✅ **Edição Intuitiva**: Clique em waypoints existentes para truncar rota
- ✅ Validação em tempo real com margem de segurança de 2%
- ✅ Visualização geodésica precisa com OpenLayers
- ✅ Lista de rota com distâncias e interface de status em tempo real

**Preferências do Usuário Identificadas:**
- **Interação Visual**: Prefere clicar no mapa a usar dropdowns
- **Feedback Visual**: Valoriza indicadores visuais (cores, tamanhos, ícones)
- **Simplicidade**: Interface deve ser intuitiva e auto-explicativa
- **Funcionalidade de Edição**: Capacidade de modificar rotas facilmente
- **Informação Contextual**: Status e dicas em tempo real

## 2. Arquitetura e Arquivos Chave

**Estrutura Modular Atual:**

- **`index.html`**: Interface do usuário com controles de aeronave e container do mapa
- **`style.css`**: Estilos responsivos e visuais
- **`script.js`**: Controlador principal (~1,800 linhas) com lógica de interação visual
- **`data.js`**: Base de dados de aeronaves e mapeamento regional (~200 linhas)
- **`data/` (13 arquivos regionais)**: Bases de dados de aeroportos organizadas geograficamente
  - `africa.json`, `asia.json`, `caribbean.json`, `central_america.json`, etc.
  - Formato: Um objeto JSON por linha, ordenação consistente (País → Cidade → Código)
- **`Dockerfile` / `docker-compose.yml`**: Containerização para desenvolvimento e produção

**Padrão de Organização dos Dados:**
- **Aeroportos**: Organizados por região geográfica em arquivos JSON separados
- **Ordenação Padrão**: País (alfabética) → Cidade (alfabética) → Código IATA (alfabética)
- **Formato Otimizado**: Objetos JSON em linha única para carregamento eficiente

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

## 4. Padrões de Interface Visual e Interação

**Arquitetura de Interface Atual:**

### **Sistema de Marcadores Dinâmicos:**
- **Aeroportos Regulares**: Ícones SVG de avião azul/cinza (scale: 0.8, zIndex: 10)
- **Aeroporto de Origem**: Ícone SVG verde, maior (scale: 1.0, zIndex: 15)
- **Waypoints da Rota**: Ícones SVG laranja/dourado (scale: 0.9, zIndex: 12)
- **Atualização Dinâmica**: `vectorLayer.getSource().changed()` para re-renderização

### **Fluxo de Interação Principal:**
1. **Seleção de Aeronave**: Dropdown tradicional → habilita planejamento
2. **Definição de Origem**: Primeiro clique em aeroporto no mapa
3. **Adição de Waypoints**: Cliques subsequentes validados por alcance
4. **Edição de Rota**: Clique em waypoint existente trunca rota

### **Sistema de Feedback Visual:**
- **Status Panel**: Div dinâmica com instruções contextuais
- **Validação Visual**: Alertas detalhados para aeroportos fora de alcance
- **Círculos de Alcance**: Geodésicos precisos com categorização por cor
- **Linhas de Rota**: Douradas com tratamento de antimeridiano

## 5. Funções Críticas e Responsabilidades

**Core Functions:**
- `loadAndDisplayAllAirports()`: Carregamento assíncrono de todos os 13 arquivos regionais
- `selectAirportForRoute(airport)`: Lógica principal de construção/edição de rota
- `redrawRouteFromPoints()`: Reconstrução completa da visualização da rota
- `updateRouteInterface()`: Sincronização de status e feedback visual
- `clearMapFeatures()`: Limpeza seletiva mantendo marcadores de aeroportos

**Estado da Aplicação:**
- `routePoints[]`: Array principal com aeroportos da rota atual
- `currentAircraft`: Objeto com dados da aeronave selecionada
- `currentRange`: Alcance em km para validações
- `airportDataCache{}`: Cache de dados regionais carregados

## 6. Instruções de Deploy e Manutenção

**Ambiente de Desenvolvimento:**
```bash
cd ExecutiveJetWorldMap
python -m http.server 8080
# Acesso: http://localhost:8080
```

**Ambiente Docker:**
```bash
docker-compose up -d  # Produção
# Acesso: http://localhost:8080
```

**Modificações Seguras:**
- **Dados de Aeroportos**: Editar arquivos JSON em `data/` mantendo ordenação
- **Dados de Aeronaves**: Modificar estruturas em `data.js`
- **Estilos Visuais**: Ajustar SVG e cores na função de estilo do vectorLayer
- **Interface**: Modificar `updateRouteInterface()` para mudanças de UX

**Diagnóstico de Problemas:**
- Console do navegador para erros JavaScript
- Network tab para problemas de carregamento de JSON
- `routePoints` array para estado da rota
- `vectorSource.getFeatures()` para debugging de features do mapa
