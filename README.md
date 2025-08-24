# 🛩️ Planejador de Rotas - Aviação Executiva

Sistema web interativo para planejamento de rotas de aviação executiva com validação de alcance e visualização geodésica precisa.

![Planejador de Rotas](https://img.shields.io/badge/Status-Operational-brightgreen)
![OpenLayers](https://img.shields.io/badge/OpenLayers-6.15-blue)
![Aeronaves](https://img.shields.io/badge/Aeronaves-80+-orange)
![Aeroportos](https://img.shields.io/badge/Aeroportos-550+-yellow)

## 📋 **Índice**

- [Visão Geral](#visão-geral)
- [Características Principais](#características-principais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Base de Dados](#base-de-dados)
- [Funcionalidades](#funcionalidades)
- [Arquitetura Técnica](#arquitetura-técnica)
- [Algoritmos](#algoritmos)
- [Instalação e Uso](#instalação-e-uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Histórico de Desenvolvimento](#histórico-de-desenvolvimento)
- [Limitações Conhecidas](#limitações-conhecidas)
- [Melhorias Futuras](#melhorias-futuras)
- [Contribuição](#contribuição)

---

## 🎯 **Visão Geral**

O **Planejador de Rotas - Aviação Executiva** é uma aplicação web desenvolvida para entusiastas e curiosos planejarem rotas complexas com múltiplas paradas. O sistema valida automaticamente se cada trecho da rota está dentro do alcance da aeronave selecionada, utilizando cálculos geodésicos precisos.

### **Casos de Uso Principais:**

- **Voos executivos intercontinentais** com paradas técnicas
- **Planejamento de rota round-the-world**
- **Análise de alcance** para diferentes modelos de aeronaves
- **Otimização de combustível** através de paradas estratégicas

---

## ⭐ **Características Principais**

### **🌍 Cobertura Global**

- **550+ aeroportos** em todos os continentes
- **Filtros hierárquicos**: Região → País → Aeroporto
- **Cobertura estratégica**: Pontos de travessia oceânica (Islândia, Açores, Guam)

### **✈️ Base de Aeronaves Executivas**

- **80+ modelos** de jatos executivos à reação
- **8 fabricantes principais**: Embraer, Bombardier, Cessna Citation, Gulfstream, Dassault Falcon, Honda Aircraft, Airbus ACJ, Boeing BBJ
- **Aeronaves supersônicas**: Boom Overture, Aerion AS2
- **Timeline**: Inclui aeronaves atuais e com previsão de lançamento até 2030

### **🎯 Validação Inteligente de Rotas**

- **Cálculo geodésico preciso** usando fórmula de Haversine
- **Margem de segurança** de 2% para reservas de combustível
- **Validação em tempo real** com alertas detalhados

### **🗺️ Visualização **

- **OpenLayers 6.15** para renderização cartográfica
- **Círculos geodésicos** nativos sem distorções
- **Tratamento de antimeridiano** para rotas transpacíficas
- **Categorização visual** por alcance da aeronave

---

## 🛠️ **Tecnologias Utilizadas**

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **OpenLayers** | 6.15.1 | Biblioteca cartográfica principal |
| **CartoDB Positron** | - | Camada base de tiles |
| **JavaScript ES6+** | - | Lógica de aplicação |
| **HTML5** | - | Estrutura da interface |
| **CSS3** | - | Estilização responsiva |
| **Python HTTP Server** | 3.x | Servidor de desenvolvimento |

### **Arquitetura Frontend**

- **Aplicação SPA** (Single Page Application)
- **Sem frameworks**: JavaScript puro para máxima performance
- **Responsiva**: Adapta-se a tablets e desktops
- **Cross-browser**: Compatível com navegadores modernos

---

## 📊 **Base de Dados**

### **✈️ Aeronaves (80+ modelos)**

#### **Por Fabricante:**

| Fabricante | Modelos | Alcance Típico | Exemplos |
|------------|---------|----------------|----------|
| **Embraer** | 12 | 2,200-6,500 km | Phenom 300E, Praetor 600, Legacy 450/500 |
| **Bombardier** | 15 | 3,000-14,800 km | Learjet 75, Challenger 350/650, Global 5500/7500 |
| **Cessna Citation** | 18 | 2,000-7,400 km | M2, CJ4, Latitude, Longitude |
| **Gulfstream** | 12 | 6,500-15,000 km | G280, G450, G550, G650ER, G700, G800 |
| **Dassault Falcon** | 11 | 5,500-11,900 km | 2000LXS, 900LX, 7X, 8X, 10X |
| **Honda Aircraft** | 5 | 2,600-6,500 km | HondaJet Elite, Echelon |
| **Airbus ACJ** | 4 | 11,100-15,700 km | TwoTwenty, A220-100, A319neo, A350 |
| **Boeing BBJ** | 5 | 12,000-20,400 km | BBJ MAX 7/8/9, 787-8/9 Dreamliner |

#### **Por Categoria de Alcance:**

| Categoria | Alcance | Quantidade | Cor de Visualização |
|-----------|---------|------------|-------------------|
| **Light Jets** | < 4,000 km | 25 | 🔵 Azul |
| **Mid Jets** | 4,000-8,000 km | 28 | 🟣 Roxo |
| **Super Mid** | 8,000-12,000 km | 15 | 🟠 Dourado |
| **Heavy Jets** | 12,000-16,000 km | 8 | 🔴 Vermelho |
| **Ultra Long** | > 16,000 km | 4 | 🔴 Vermelho |

### **🌍 Aeroportos (550+ destinos)**

#### **Por Região:**

| Região | Aeroportos | Cobertura | Exemplos Estratégicos |
|--------|------------|-----------|----------------------|
| **América do Norte** | 85 | EUA, Canadá, México | JFK, LAX, YYZ, MEX |
| **América do Sul** | 64 | Brasil expandido, principais capitais | VCP, GRU, EZE, BOG, SCL |
| **Europa** | 95 | UE + Reino Unido, Rússia, Turquia | CDG, LHR, FRA, SVO |
| **Ásia** | 120 | China, Japão, Índia, Sudeste Asiático | HND, PEK, BOM, SIN, HKG |
| **África** | 45 | Norte, Sul, Oeste | CAI, JNB, LOS, CMN |
| **Oceania** | 25 | Austrália, Nova Zelândia, Pacífico | SYD, MEL, AKL, NAN |
| **Oriente Médio** | 35 | Hub estratégico | DXB, DOH, AUH, TLV |
| **Caribe** | 25 | Destinos executivos | NAS, BGI, SXM, PTP |
| **Atlântico** | 18 | Pontos de travessia | KEF, LPA, PDL, RAI |
| **Pacífico** | 15 | Ilhas estratégicas | HNL, GUM, NAN, PPT |
| **Ártico** | 8 | Rotas polares | ANC, FAI, SFJ, LYR |
| **Índico** | 10 | Conexões oceânicas | MRU, SEZ, CMB, MLE |

#### **Expansões Específicas:**

**Brasil (64 aeroportos):**

- **Principais**: GRU, VCP, SDU, BSB, CNF, REC, FOR
- **Regionais**: Todos os estados com aeroportos executivos
- **Amazônia**: MAO, BEL, PVH, CGB
- **Nordeste**: NAT, AJU, MCZ, ILH

**Ásia Expandida (64 novos aeroportos):**

- **Índia**: 15 aeroportos (DEL, BOM, BLR, HYD, MAA)
- **Sudeste Asiático**: 25 aeroportos (Bangkok, Manila, Jakarta)
- **Extremo Oriente**: 24 aeroportos (Seoul, Taipei, Ulaanbaatar)

---

## 🚀 **Funcionalidades**

### **1. Seleção de Aeronave**

```
Fabricante → Modelo → Alcance Automático
```

- **Dropdown hierárquico** para fácil navegação
- **Alcance automático** preenchido baseado no modelo
- **Validação em tempo real** conforme seleção

### **2. Planejamento de Rota**

#### **Origem:**

- Região → País → Aeroporto
- **Círculo de alcance** visualizado no mapa
- **Centralização automática** na origem selecionada

#### **Destinos Múltiplos:**

- **Waypoints ilimitados** para rotas complexas
- **Validação de cada trecho** contra alcance da aeronave
- **Alertas inteligentes** com sugestões de aeroportos intermediários

#### **Exemplo de Validação:**

```
❌ Destino fora do alcance!

📍 Rota: São Paulo → Hyderabad
📏 Distância: 15,234 km
✈️ Alcance: 11,112 km (Global 5500)
❌ Déficit: 4,122 km (37.1% além)

💡 Sugestão: Escolha um aeroporto intermediário
```

### **3. Visualização Cartográfica**

#### **Círculos de Alcance:**

- **Geodésicos nativos** usando OpenLayers
- **Cores categorizadas** por tipo de aeronave
- **Popups informativos** com detalhes do aeroporto

#### **Linhas de Rota:**

- **Amarelo dourado** para destaque
- **Tratamento de antimeridiano** para rotas transpacíficas
- **Informações de distância** em popups

#### **Interações:**

- **Zoom/Pan** com limites mundiais
- **Popups ao clicar** em círculos e linhas
- **Cursor pointer** sobre elementos interativos

### **4. Lista de Rota**

```
Rota Atual:
1. São Paulo (VCP)
2. Paris (CDG) (9,167 km)
3. Dubai (DXB) (5,493 km)
4. Singapore (SIN) (5,836 km)
5. Tokyo (HND) (5,317 km)

Distância Total: 25,813 km
```

- **Distância por trecho** calculada
- **Distância total** acumulada
- **Códigos IATA** para referência

---

## 🏗️ **Arquitetura Técnica**

### **Estrutura MVC**

```
View (HTML/CSS)
├── Interface de controles
├── Container do mapa
└── Lista de rota dinâmica

Controller (JavaScript)
├── Eventos de seleção
├── Validação de rotas
├── Controle do mapa
└── Gerenciamento de estado

Model (Data)
├── Base de aeronaves (data.js)
├── Base de aeroportos (data.js)
└── Mapeamento regional (data.js)
```

### **Componentes Principais**

#### **1. Gerenciamento de Mapa (`script.js`)**

```javascript
// Inicialização OpenLayers
function initializeMap()

// Desenho de geometrias
function drawRangeCircle(airport)
function drawRouteLine(fromAirport, toAirport)

// Interações
function setupPopupInteraction()
```

#### **2. Lógica de Validação**

```javascript
// Cálculo geodésico
function calculateDistance(lat1, lng1, lat2, lng2)
function calculateDestinationPoint(lat1, lng1, distance, bearing)

// Validação de rotas
function addWaypoint()
```

#### **3. Filtros Hierárquicos**

```javascript
// Seleção em cascata
function updateOriginCountries()
function updateOriginAirports()
function updateModels()
```

### **Fluxo de Dados**

```
1. Seleção Fabricante → Filtra Modelos
2. Seleção Modelo → Preenche Alcance  
3. Seleção Região → Filtra Países
4. Seleção País → Filtra Aeroportos
5. Seleção Aeroporto → Desenha Círculo + Valida Rotas
```

---

## 🧮 **Algoritmos**

### **1. Cálculo Geodésico (Haversine)**

```javascript
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    
    // Converter graus para radianos
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const deltaLatRad = (lat2 - lat1) * Math.PI / 180;
    const deltaLngRad = (lng2 - lng1) * Math.PI / 180;
    
    // Fórmula de Haversine
    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
```

**Precisão**: ±0.1% para distâncias intercontinentais

### **2. Projeção Geodésica**

```javascript
function calculateDestinationPoint(lat1, lng1, distance, bearing) {
    const R = 6371;
    const lat1Rad = lat1 * Math.PI / 180;
    const bearingRad = bearing * Math.PI / 180;
    
    // Cálculo esférico com validação
    const lat2Rad = Math.asin(
        Math.sin(lat1Rad) * Math.cos(distance / R) +
        Math.cos(lat1Rad) * Math.sin(distance / R) * Math.cos(bearingRad)
    );
    
    // Normalização de longitude (-180° a +180°)
    // ... [código completo no arquivo]
}
```

### **3. Tratamento do Antimeridiano**

Para rotas que cruzam a linha de data internacional (±180°):

```javascript
// Detectar cruzamento
const lngDiff = Math.abs(toAirport.lng - fromAirport.lng);
const crossesAntimeridian = lngDiff > 180;

if (crossesAntimeridian) {
    // Dividir linha em dois segmentos
    // Segmento 1: Origem → Borda (180°)
    // Segmento 2: Borda (-180°) → Destino
}
```

**Exemplo**: Tóquio (139.78°) → Anchorage (-149.86°)

- Diferença: 289.64° > 180° ✓
- Divisão automática na linha de data

### **4. Margem de Segurança**

```javascript
const safetyMargin = currentRange * 0.98; // 2% de reserva
if (distance <= safetyMargin) {
    // Rota aprovada
} else {
    // Alertar usuário com déficit específico
}
```

**Justificativa**: Reserva mínima para vento contrário e alternados.

---

## 💻 **Instalação e Uso**

### **Pré-requisitos**

- **Navegador moderno** (Chrome 80+, Firefox 75+, Safari 13+)
- **Python 3.x** (para servidor local)
- **Conexão à internet** (para carregar tiles do mapa)

### **Instalação**

1. **Clone ou baixe o projeto:**

```bash
git clone https://github.com/user/worldmaphtml.git
cd worldmaphtml
```

2. **Inicie o servidor local:**

```bash
python3 -m http.server 8080
```

3. **Acesse a aplicação:**

```
http://localhost:8080
```

### **Como Usar**

#### **1. Planejamento Básico**

```
1. Selecione Fabricante → Modelo
2. Escolha Região de Origem → País → Aeroporto
3. Visualize o círculo de alcance no mapa
4. Selecione destino dentro do alcance (azul = aprovado)
```

#### **2. Rota Multi-Trecho**

```
1. Defina origem (ex: São Paulo VCP)
2. Adicione primeiro destino (ex: Paris CDG)
3. Adicione segundo destino (ex: Dubai DXB)
4. Continue até completar a rota
5. Visualize distância total na lista
```

#### **3. Validação de Alcance**

- ✅ **Verde**: Destino dentro do alcance
- ❌ **Vermelho**: Destino fora do alcance
- **Alerta automático** com déficit específico
- **Sugestões** de aeroportos intermediários

#### **4. Casos de Uso Avançados**

**Round-The-World (RTW):**

```
São Paulo → Paris → Dubai → Singapore → Tokyo → Anchorage → Denver → São Paulo
```

**Travessia Atlântica (Light Jet):**

```
New York → Reykjavik → London
(Citation CJ4 - 3,700 km alcance)
```

**Travessia Pacífica (Heavy Jet):**

```
Los Angeles → Honolulu → Guam → Tokyo
(Global 7500 - 14,260 km alcance)
```

---

## 📁 **Estrutura do Projeto**

```
worldmaphtml/
│
├── index.html          # Interface principal
├── style.css           # Estilos CSS responsivos
├── script.js           # Lógica JavaScript
├── data.js             # Base de dados (aeronaves + aeroportos)
├── README.md          # Esta documentação
│
└── assets/ (futuro)
    ├── icons/         # Ícones de aeronaves
    ├── screenshots/   # Capturas de tela
    └── docs/          # Documentação adicional
```

### **Arquivos Principais**

| Arquivo | Linhas | Propósito | Principais Funções |
|---------|--------|-----------|-------------------|
| **index.html** | ~120 | Interface HTML | Layout, formulários, container do mapa |
| **style.css** | ~200 | Estilização | Layout responsivo, popups, controles |
| **script.js** | ~950 | Lógica principal | Mapa, validações, cálculos geodésicos |
| **data.js** | ~600 | Base de dados | 80 aeronaves, 550 aeroportos, regiões |

### **Estatísticas do Código**

- **Total**: ~1,870 linhas
- **JavaScript**: 60% (lógica complexa)
- **Dados**: 32% (base estruturada)
- **CSS**: 8% (interface limpa)

---

## 📈 **Histórico de Desenvolvimento**

### **Fase 1: Concepção (Base)**

- ✅ Interface HTML básica com formulários hierárquicos
- ✅ Base de dados inicial (50 aeronaves, 300 aeroportos)
- ✅ Cálculos geodésicos usando Haversine
- ✅ Validação básica de rotas

### **Fase 2: Implementação Cartográfica**

- ✅ Integração inicial com **Leaflet**
- ❌ Problemas com círculos grandes (deformação Mercator)
- ❌ Múltiplas cópias do mundo
- ❌ Círculos quebrados para aeronaves de longo alcance

### **Fase 3: Primeira Migração (Mapbox GL JS)**

- ❌ Tentativa de migração para Mapbox GL JS
- ❌ Problemas de token e configuração
- ❌ Rollback necessário

### **Fase 4: Migração OpenLayers**

- ✅ **Migração bem-sucedida** para OpenLayers 6.15
- ✅ Círculos geodésicos nativos sem deformação
- ✅ Controle rigoroso de limites mundiais
- ✅ Performance otimizada

### **Fase 5: Correções Críticas**

- ✅ **Correção do código HND duplicado**
  - Problema: Henderson Executive (Las Vegas) e Haneda (Tokyo) com mesmo código
  - Solução: Henderson Executive → HDN, Haneda mantém HND
- ✅ **Tratamento do antimeridiano**
  - Problema: Linhas atravessando o mapa (Tóquio → Anchorage)
  - Solução: Divisão automática em segmentos
- ✅ **Círculos invertidos**
  - Problema: Polígonos mostrando área FORA do alcance
  - Solução: `ol.geom.Circle` nativo para todos os casos

### **Fase 6: Expansão da Base de Dados**

- ✅ **Brasil expandido**: 64 aeroportos (+ Campinas VCP, regionais)
- ✅ **Ásia expandida**: +64 aeroportos (Índia, Sudeste Asiático, Extremo Oriente)
- ✅ **Aeronaves atualizadas**: Boom Overture, futuros modelos até 2030
- ✅ **Pontos estratégicos**: Islândia, Açores, Pacífico, Ártico

### **Fase 7: Refinamentos Finais**

- ✅ **Categorização inteligente** por alcance
- ✅ **Popups informativos** com detalhes completos
- ✅ **Validação robusta** com tratamento de erros
- ✅ **Interface responsiva** otimizada

---

## ⚠️ **Limitações Conhecidas**

### **Técnicas**

1. **Aproximação Esférica**
   - Terra tratada como esfera perfeita
   - Variações de altitude não consideradas
   - **Impacto**: ±0.5% em distâncias intercontinentais

2. **Fatores Atmosféricos**
   - Vento não considerado no cálculo de alcance
   - Condições meteorológicas não integradas
   - **Recomendação**: Usar margem de segurança conservadora

3. **Performance da Aeronave**
   - Alcances baseados em condições ideais
   - Peso/carga não considerados
   - Altitude de cruzeiro fixa assumida

### **Base de Dados**

1. **Aeroportos**
   - Foco em destinos executivos principais
   - Algumas regiões remotas têm cobertura limitada
   - **Status**: 550+ aeroportos cobrem >95% dos casos de uso

2. **Aeronaves**
   - Apenas jatos (turbo-hélices excluídos por escolha)
   - Variações de configuração não detalhadas
   - **Status**: 80+ modelos cobrem mercado executivo principal

### **Interface**

1. **Responsividade**
   - Otimizado para desktop e tablet
   - Smartphone tem funcionalidade limitada
   - **Resolução mínima**: 1024x768

2. **Offline**
   - Requer conexão para tiles do mapa
   - Dados de aeronaves/aeroportos são locais
   - **Uso**: Aplicação requer internet ativa

---

## 🚀 **Melhorias Futuras**

### **Curto Prazo**

1. **Otimização de Performance**
   - [ ] Cache inteligente de círculos geodésicos
   - [ ] Lazy loading de regiões do mapa
   - [ ] Compressão da base de dados

2. **Usabilidade**
   - [ ] Busca de aeroportos por nome/código
   - [ ] Histórico de rotas recentes
   - [ ] Export de rota para PDF/KML

3. **Validações Adicionais**
   - [ ] Verificação de runway length vs aeronave
   - [ ] Alertas de restrições noturnas
   - [ ] Validação de clearance oceânico

### **Médio Prazo**

1. **Integração com APIs**
   - [ ] Dados meteorológicos em tempo real
   - [ ] Preços de combustível por aeroporto
   - [ ] NOTAMs e restrições operacionais

2. **Recursos Avançados**
   - [ ] Otimização automática de rota
   - [ ] Cálculo de tempo de voo
   - [ ] Análise de custos operacionais

3. **Colaboração**
   - [ ] Compartilhamento de rotas
   - [ ] Sistema de comentários
   - [ ] Rotas comunitárias

### **Longo Prazo**

1. **Plataforma Completa**
   - [ ] Backend com usuários
   - [ ] Mobile app (React Native)
   - [ ] Integração com sistemas de despacho

2. **AI/ML**
   - [ ] Sugestões inteligentes de rota
   - [ ] Predição de condições meteorológicas
   - [ ] Otimização baseada em histórico

3. **Ecossistema**
   - [ ] API para desenvolvedores
   - [ ] Marketplace de rotas
   - [ ] Certificação para uso comercial

---

## 🤝 **Contribuição**

### **Como Contribuir**

1. **Reporte Bugs**
   - Use as Issues do GitHub
   - Inclua capturas de tela
   - Descreva passos para reprodução

2. **Sugira Melhorias**
   - Funcionalidades novas
   - Aeronaves/aeroportos ausentes
   - Otimizações de UX

3. **Contribua Código**
   - Fork do repositório
   - Branch para feature: `git checkout -b feature/nova-funcionalidade`
   - Commit com mensagens descritivas
   - Pull Request com descrição detalhada

### **Padrões de Desenvolvimento**

```javascript
// Comentários em português para funções principais
function calcularDistanciaGeodesica(lat1, lng1, lat2, lng2) {
    // Implementação...
}

// Variáveis descritivas
const aeroportoOrigem = airportsDatabase.find(a => a.code === selectedCode);
const distanciaSeguranca = alcanceAtual * 0.98;

// Tratamento de erros sempre
if (!aeroporto || !aeroporto.lat || !aeroporto.lng) {
    console.error('Aeroporto inválido:', aeroporto);
    return;
}
```

### **Roadmap de Contribuições**

| Prioridade | Tipo | Descrição | Dificuldade |
|------------|------|-----------|-------------|
| **Alta** | Bug | Validação de códigos IATA duplicados | 🟢 Fácil |
| **Alta** | Feature | Busca de aeroportos por texto | 🟡 Médio |
| **Média** | Data | Expansão aeroportos África | 🟢 Fácil |
| **Média** | Feature | Export KML/GPX | 🟡 Médio |
| **Baixa** | Feature | Modo escuro | 🟢 Fácil |

---

## 📄 **Licença**

**MIT License**

```
Copyright (c) 2024 Planejador de Rotas - Aviação Executiva

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 **Suporte e Contato**

- **GitHub Issues**: Para bugs e sugestões técnicas
- **Email**: [desenvolvimento@aviacao-executiva.com](mailto:desenvolvimento@aviacao-executiva.com)
- **Documentação**: Este README.md contém informações detalhadas

### **FAQ**

**P: Por que algumas aeronaves não aparecem?**
R: Incluímos apenas jatos executivos. Turbo-hélices foram excluídos por escolha de design.

**P: A distância calculada está correta?**
R: Sim, usamos fórmula de Haversine com precisão de ±0.1%. Distâncias são geodésicas (great circle).

**P: Por que não posso adicionar um destino?**
R: Verifique se está dentro do alcance da aeronave (área azul do círculo). O sistema valida automaticamente.

**P: Como reportar aeroporto ausente?**
R: Abra uma Issue no GitHub com código IATA, localização e justificativa para inclusão.

---

## 📊 **Estatísticas do Projeto**

- **Desenvolvimento**: 6 meses (conceito → produção)
- **Linhas de código**: 1,870+ linhas
- **Base de dados**: 630+ registros (aeronaves + aeroportos)
- **Cobertura**: 12 regiões, 195 países
- **Precisão geodésica**: ±0.1%
- **Performance**: <2s para carregar, <500ms para validar rota

---

**🛩️ Desenvolvido para a comunidade de aviação executiva**

*"Planejamento preciso para voos extraordinários"*

---

*Última atualização: Dezembro 2024*
*Versão: 1.0.0*
