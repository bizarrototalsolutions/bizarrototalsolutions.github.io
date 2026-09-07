/* ============================================================
   Dizarro — portfolio-data.js
   FONTE ÚNICA dos trabalhos. Lida por portfolio.html e projeto.html.

   Campos:
     slug      id único (vai no URL: projeto.html?slug=...)
     servico   'eletricidade' | 'telecomunicacoes' | 'carpintaria' | 'domotica'
     titulo, local, ano, duracao, resumo
     capa      imagem 4:3 (assets/img/...); null = placeholder
     galeria   [ 'assets/img/...' , ... ]  (opcional)
     antesDepois { antes:'...', depois:'...' }  (opcional — cursor de comparação)
     desafio, solucao, resultado   (texto)
     destaques [ '...' ]
     testemunho { texto, autor, papel }  (opcional)

   Todas as fotos são reais (assets/img/obras/), tratadas por
   tools/import-fotos.py. As descrições dizem apenas o que as fotos mostram.
   ============================================================ */

window.PROJETOS = [
  {
    slug: 'parede-tv-sala',
    servico: 'telecomunicacoes',
    titulo: 'Parede de TV — do móvel para a parede',
    local: 'Grande Porto',
    ano: 2025, duracao: '1 dia',
    resumo: 'A TV estava pousada em cima do móvel. Passou para a parede, com a cablagem escondida e ponto de dados dedicado.',
    capa: 'assets/img/obras/tv-parede-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/tv-parede-antes-4x3.jpg', depois: 'assets/img/obras/tv-parede-4x3.jpg' },
    galeria: ['assets/img/obras/tv-parede.jpg'],
    desafio: 'Televisor grande apoiado no aparador, com os cabos à vista e sem ponto de rede junto à zona de TV.',
    solucao: 'Suporte fixo dimensionado ao peso real da TV, roço para levar energia e dados até trás do ecrã, e cabos conduzidos até ao móvel sem ficarem à vista.',
    resultado: 'TV alinhada na parede, aparador liberto e uma tomada de dados dedicada para a box e a smart TV.',
    destaques: ['Suporte dimensionado ao peso da TV', 'Energia + dados atrás do ecrã', 'Cabos conduzidos até ao móvel'],
    testemunho: { texto: 'Trocou todos os cabos antigos por cabo de rede para todas as divisões. Educado, transparente e rápido.', autor: 'Eduardo D.', papel: 'Telecomunicações' }
  },
  {
    slug: 'bastidor-rede-escritorio',
    servico: 'telecomunicacoes',
    titulo: 'Bastidor e rede estruturada — Escritório',
    local: 'Porto',
    ano: 2025, duracao: '3 dias',
    resumo: 'De uma secretária cheia de routers e um bastidor com cabo solto a um ponto de rede organizado, com ponto de acesso Wi-Fi e UPS.',
    capa: 'assets/img/obras/rede-depois-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/rede-antes-4x3.jpg', depois: 'assets/img/obras/rede-depois-4x3.jpg' },
    galeria: ['assets/img/obras/rede-antes-b.jpg', 'assets/img/obras/bastidor-a.jpg', 'assets/img/obras/bastidor-b.jpg', 'assets/img/obras/bastidor-cabos.jpg', 'assets/img/obras/rede-depois.jpg'],
    desafio: 'Routers e fontes de alimentação empilhados na secretária, bastidor de parede com cabo por terminar e por etiquetar, Wi-Fi a falhar em parte do escritório.',
    solucao: 'Terminação e arrumação de todo o cabo no bastidor, patch cords à medida, ponto de acesso Wi-Fi dedicado e UPS para o essencial. Cada ligação etiquetada.',
    resultado: 'Bastidor limpo, Wi-Fi estável em toda a área e um esquema simples de "o que está ligado a quê".',
    destaques: ['Cabo terminado e etiquetado no bastidor', 'Ponto de acesso Wi-Fi dedicado', 'UPS para rede e servidores']
  },
  {
    slug: 'tv-config-cenarios',
    servico: 'domotica',
    titulo: 'Da parede preparada à TV configurada',
    local: 'Grande Porto',
    ano: 2025, duracao: '1 dia',
    resumo: 'Parede preparada com focos e caixas embutidas; depois, TV montada, ligada e configurada de raiz.',
    capa: 'assets/img/obras/tv-config-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/sala-embutidos-4x3.jpg', depois: 'assets/img/obras/tv-config-4x3.jpg' },
    galeria: ['assets/img/obras/sala-embutidos.jpg', 'assets/img/obras/tv-config.jpg'],
    desafio: 'Sala com a parede já preparada (focos embutidos e caixas roughed-in) e a TV nova ainda por instalar e configurar.',
    solucao: 'Montagem do suporte, ligação de energia e sinal pelas caixas deixadas na parede, e primeira configuração da TV feita no local — rede, contas e imagem.',
    resultado: 'TV pronta a usar no dia, sem cabos à vista e com a imagem já acertada.',
    destaques: ['Aproveitou as caixas deixadas na parede', 'Primeira configuração feita no local', 'Sem cabos à vista']
  },
  {
    slug: 'apliques-revestimento-metalico',
    servico: 'eletricidade',
    titulo: 'Apliques de parede sobre revestimento metálico',
    local: 'Grande Porto',
    ano: 2025, duracao: '2 dias',
    resumo: 'Instalação de apliques numa parede de chapa perfilada — da montagem com os fios à vista ao acabamento fechado.',
    capa: 'assets/img/obras/luz-parede-b-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/luz-parede-a-4x3.jpg', depois: 'assets/img/obras/luz-parede-b-4x3.jpg' },
    galeria: ['assets/img/obras/luz-parede-a.jpg', 'assets/img/obras/luz-parede-b.jpg'],
    desafio: 'Fixar e alimentar apliques numa parede de chapa perfilada (revestimento metálico), sem danificar o painel e com a ligação escondida.',
    solucao: 'Furação e fixação adequadas ao perfil da chapa, passagem discreta da alimentação, ligação do casquilho e fecho da caixa com a tampa do aplique.',
    resultado: 'Luz de parede quente na varanda, com a caixa fechada e limpa — sem fios nem casquilho à vista.',
    destaques: ['Fixação adequada ao perfil da chapa', 'Ligação escondida', 'Caixa fechada e alinhada']
  },
  {
    slug: 'pintura-caixilharia-branco',
    servico: 'carpintaria',
    titulo: 'Pintar caixilharia — de castanho para branco',
    local: 'Matosinhos, Porto',
    ano: 2025, duracao: '2 dias',
    resumo: 'As janelas eram castanhas. Lixadas, preparadas e pintadas de branco, para acompanhar os interiores.',
    capa: 'assets/img/obras/janela-vista-b-4x3.jpg',
    galeria: ['assets/img/obras/janela-diogo.jpg', 'assets/img/obras/janela-vista-a.jpg', 'assets/img/obras/janela-vista-b.jpg'],
    desafio: 'Caixilharia de madeira castanha, destoante dos interiores claros — e sem justificar a troca das janelas.',
    solucao: 'Lixagem, limpeza e desengorduramento do perfil, primário de aderência e duas demãos de esmalte branco, com fitas e proteção do vidro e da parede.',
    resultado: 'Janelas brancas a condizer com os interiores, sem obra e sem trocar a caixilharia.',
    destaques: ['Lixagem + primário de aderência', 'Duas demãos de esmalte branco', 'Vidro e parede protegidos com fita']
  },
  {
    slug: 'sapateira-hall',
    servico: 'carpintaria',
    titulo: 'Sapateira basculante para o hall de entrada',
    local: 'Grande Porto',
    ano: 2025, duracao: '4 dias',
    resumo: 'Sapateira estreita, lacada a branco, encostada à parede junto ao aquecedor — sem roubar passagem.',
    capa: 'assets/img/obras/sapateira-4x3.jpg',
    galeria: ['assets/img/obras/sapateira.jpg'],
    desafio: 'Hall de entrada estreito, sem sítio para calçado e com um radiador a limitar a profundidade disponível.',
    solucao: 'Sapateira de portas basculantes com pouca profundidade, lacada a branco mate a condizer com a parede, dimensionada para não interferir com o radiador nem com a circulação.',
    resultado: 'Arrumação de calçado à entrada, com o corredor a manter a largura de passagem.',
    destaques: ['Portas basculantes, pouca profundidade', 'Lacado branco mate', 'Não interfere com radiador nem passagem']
  },
  {
    slug: 'secretaria-medida',
    servico: 'carpintaria',
    titulo: 'Secretária à medida com gaveteiro',
    local: 'Grande Porto',
    ano: 2025, duracao: '5 dias',
    resumo: 'Secretária lacada a branco com gaveteiro e módulo de apoio, feita para o vão entre a parede e o radiador.',
    capa: 'assets/img/obras/secretaria-4x3.jpg',
    galeria: ['assets/img/obras/secretaria.jpg'],
    desafio: 'Aproveitar um vão certo entre a parede e o aquecedor para um posto de trabalho fixo, com arrumação.',
    solucao: 'Tampo à medida do vão, gaveteiro suspenso de um lado e módulo de porta do outro, tudo lacado a branco mate, com passagem de cabos para a zona de trabalho.',
    resultado: 'Um posto de trabalho estável e arrumado onde antes era espaço morto.',
    destaques: ['Tampo à medida do vão', 'Gaveteiro + módulo de porta', 'Passagem de cabos integrada']
  },
  {
    slug: 'ventoinhas-teto',
    servico: 'eletricidade',
    titulo: 'Ventoinhas de teto com luz',
    local: 'Grande Porto',
    ano: 2025, duracao: '1 dia',
    resumo: 'Instalação de ventoinhas de teto com iluminação integrada, em teto inclinado e em teto com clarabóia.',
    capa: 'assets/img/obras/ventoinha-teto-b-4x3.jpg',
    galeria: ['assets/img/obras/ventoinha-teto.jpg', 'assets/img/obras/ventoinha-teto-b.jpg'],
    desafio: 'Substituir o ponto de luz por ventoinha com luz, garantindo fixação segura ao teto (um deles inclinado) e comando simples.',
    solucao: 'Caixa de teto reforçada para suportar o peso e o movimento da ventoinha, montagem nivelada e ligação da ventoinha e da luz ao comando.',
    resultado: 'Ventilação e luz no mesmo ponto, com montagem firme e sem vibração.',
    destaques: ['Caixa de teto reforçada', 'Montagem nivelada (inclui teto inclinado)', 'Ventoinha + luz no mesmo comando']
  },
  {
    slug: 'armario-cozinha-exaustor',
    servico: 'carpintaria',
    titulo: 'Armário de cozinha adaptado ao exaustor',
    local: 'Grande Porto',
    ano: 2025, duracao: '3 dias',
    resumo: 'Módulo superior alterado para dar passagem à conduta do exaustor, mantendo a frente a condizer com a cozinha.',
    capa: 'assets/img/obras/cozinha-armario-4x3.jpg',
    galeria: ['assets/img/obras/cozinha-armario.jpg'],
    desafio: 'A conduta do exaustor tinha de subir pelo armário superior sem deixar o módulo inutilizável nem alterar a frente da cozinha.',
    solucao: 'Recorte do fundo e das prateleiras para a conduta e tubagem, reforço da estrutura e frente mantida igual à dos restantes módulos.',
    resultado: 'Conduta escondida dentro do armário, com o mínimo de arrumação perdida.',
    destaques: ['Recorte à medida para a conduta', 'Estrutura reforçada', 'Frente igual à restante cozinha']
  }
];
