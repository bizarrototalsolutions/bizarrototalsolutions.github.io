/* ============================================================
   Dizarro — portfolio-data.js
   FONTE ÚNICA dos trabalhos. Lida por portfolio.html e projeto.html.

   Campos:
     slug      id único (vai no URL: projeto.html?slug=...)
     servico   'eletricidade' | 'telecomunicacoes' | 'carpintaria' | 'domotica'
     titulo, local, ano, duracao, resumo
     capa      caminho da imagem 4:3 (assets/img/...); null = placeholder
     galeria   [ 'assets/img/...' , ... ]  (opcional)
     antesDepois { antes:'...', depois:'...' }  (opcional)
     desafio, solucao, resultado   (texto)
     destaques [ '...' ]
     testemunho { texto, autor, papel }  (opcional)

   Para juntar fotos novas: meta os ficheiros em assets/img/projetos/<slug>/
   e aponte 'capa' e 'galeria' para eles (ver assets/img/README.md).
   ============================================================ */

window.PROJETOS = [
  {
    slug: 'parede-tv-matosinhos',
    servico: 'telecomunicacoes',
    titulo: 'Parede de TV com cabos escondidos',
    local: 'Matosinhos, Porto',
    ano: 2025, duracao: '2 dias',
    resumo: 'Preparação da parede, iluminação embutida e suporte de TV com toda a cablagem oculta.',
    capa: 'assets/img/obras/tv-wall-2-4x3.jpg',
    galeria: ['assets/img/obras/tv-wall-1.jpg', 'assets/img/obras/tv-wall-2.jpg'],
    desafio: 'O cliente queria a TV na parede sem um único cabo à vista, com tomadas e HDMI no sítio certo e luz de ambiente por trás.',
    solucao: 'Roços para tubo VD, caixa de tomadas + dados atrás da TV, segunda caixa junto ao móvel, e fita LED regulável no recorte do teto. Suporte nivelado e testado com o peso real.',
    resultado: 'Parede limpa, TV a "flutuar", e uma cena de luz para ver cinema — tudo comandável do telecomando e do telemóvel.',
    destaques: ['Zero cabos à vista', 'Tomadas + dados atrás da TV', 'Iluminação de ambiente regulável'],
    testemunho: { texto: 'Trocou todos os cabos antigos por cabo de rede para todas as divisões. Educado, transparente e rápido.', autor: 'Eduardo D.', papel: 'Telecomunicações' }
  },
  {
    slug: 'rede-escritorio-porto',
    servico: 'telecomunicacoes',
    titulo: 'Rede e Wi-Fi reorganizados — Escritório',
    local: 'Porto',
    ano: 2025, duracao: '3 dias',
    resumo: 'Da confusão de cabos e routers empilhados a ponto de acesso montado, cablagem em calha e UPS.',
    capa: 'assets/img/obras/rede-depois-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/rede-antes-4x3.jpg', depois: 'assets/img/obras/rede-depois-4x3.jpg' },
    galeria: ['assets/img/obras/rede-antes.jpg', 'assets/img/obras/rede-depois.jpg'],
    desafio: 'Vários routers e switches empilhados no chão, fontes de alimentação à mistura, Wi-Fi a falhar em metade do escritório e nenhuma proteção contra falhas de energia.',
    solucao: 'Ponto único organizado: switch fixo, cablagem em calha, ponto de acesso Wi-Fi montado ao teto e UPS para o essencial. Etiquetagem de todas as ligações.',
    resultado: 'Wi-Fi estável em toda a área, arranque limpo após falhas de energia e um esquema simples de "o que está ligado a quê".',
    destaques: ['Cablagem em calha, sem cabos no chão', 'Ponto de acesso Wi-Fi dedicado', 'UPS para servidores e rede']
  },
  {
    slug: 'iluminacao-embutida-sala',
    servico: 'eletricidade',
    titulo: 'Iluminação embutida — Sala T4',
    local: 'Matosinhos, Porto',
    ano: 2025, duracao: '1 semana',
    resumo: 'Novo circuito de iluminação com embutidos reguláveis e reforço de tomadas na sala.',
    capa: 'assets/img/obras/tv-wall-1-4x3.jpg',
    galeria: ['assets/img/obras/tv-wall-1.jpg'],
    desafio: 'Sala com um único ponto de luz central e poucas tomadas. O cliente queria luz uniforme, regulável, e tomadas suficientes para a zona de estar e a zona de TV.',
    solucao: 'Circuito novo com focos LED embutidos no teto, regulação por dimmer, e seis tomadas distribuídas. Coordenado com a parede de TV para deixar tudo pronto antes de fechar.',
    resultado: 'Luz uniforme e regulável, consumo mais baixo e uma sala pronta para receber o mobiliário sem extensões à vista.',
    destaques: ['Focos LED embutidos reguláveis', 'Circuito dedicado', '+6 tomadas na zona de estar']
  },
  {
    slug: 'cozinha-lacada-maia',
    servico: 'carpintaria',
    titulo: 'Cozinha lacada à medida',
    local: 'Maia, Porto',
    ano: 2024, duracao: '5 semanas',
    resumo: 'Projeto, fabrico e montagem de cozinha lacada mate com ilha central.',
    capa: null,
    desafio: 'Cozinha pequena, paredes fora de esquadria e vontade de uma ilha sem comprometer a circulação.',
    solucao: 'Levantamento a laser, mobiliário desenhado ao milímetro, frentes lacadas mate, gavetões com travão, bancada em quartzo e ilha com zona de refeição.',
    resultado: '30% mais arrumação e uma zona de refeições nova, sem obra de alvenaria.',
    destaques: ['Frentes lacadas mate anti-dedada', 'Gavetões com extração total', 'Bancada em quartzo'],
    testemunho: { texto: 'Trouxe todo o material demonstrando um know-how e uma facilidade a perceber o problema. Profissionais assim são raros.', autor: 'Frederico S.', papel: 'Carpintaria' }
  },
  {
    slug: 'homekit-vila-do-conde',
    servico: 'domotica',
    titulo: 'Iluminação inteligente + Apple Home',
    local: 'Vila do Conde',
    ano: 2025, duracao: '1 dia',
    resumo: 'Substituição de iluminação e configuração de cenários com HomeKit, mantendo os interruptores.',
    capa: null,
    desafio: 'Lâmpadas a falhar e vontade de passar a controlo por voz e cenários, sem trocar os interruptores existentes.',
    solucao: 'Iluminação inteligente compatível com HomeKit, módulos atrás dos interruptores para manter o comando físico, e cenários (dia, noite, fora de casa) configurados no local.',
    resultado: 'Controlo por app e por voz, com os interruptores de parede a funcionar como sempre.',
    destaques: ['Compatível com Apple Home / Google / Alexa', 'Interruptores físicos mantidos', 'Cenários configurados no local'],
    testemunho: { texto: 'Depois de instalar as lâmpadas inteligentes, ajudou-me a configurá-las com o Apple Home. Recomendo o Diogo a todos.', autor: 'Nik V.', papel: 'Eletricidade + Domótica' }
  },
  {
    slug: 'deck-terraco-porto',
    servico: 'carpintaria',
    titulo: 'Deck exterior sobre terraço · 35 m²',
    local: 'Porto',
    ano: 2024, duracao: '2 semanas',
    resumo: 'Estrutura nivelada e deck em madeira tratada com iluminação embutida no perímetro.',
    capa: null,
    desafio: 'Terraço com pendentes irregulares e caixas de esgoto a manter acessíveis.',
    solucao: 'Vigamento tratado sobre apoios reguláveis, réguas com fixação oculta, alçapões discretos sobre as caixas de visita e fita LED IP67 no perímetro.',
    resultado: 'Terraço utilizável todo o ano, com acesso mantido às infraestruturas e sem infiltrações.',
    destaques: ['Apoios reguláveis, sem betão', 'Fixação oculta', 'Iluminação perimetral IP67']
  }
];
