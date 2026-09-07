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

   Todas as fotos abaixo são reais (assets/img/obras/), tratadas por
   tools/import-fotos.py.
   ============================================================ */

window.PROJETOS = [
  {
    slug: 'parede-tv-matosinhos',
    servico: 'telecomunicacoes',
    titulo: 'Parede de TV com cabos escondidos',
    local: 'Matosinhos, Porto',
    ano: 2025, duracao: '2 dias',
    resumo: 'Preparação da parede, dados e tomadas atrás da TV, iluminação de ambiente e suporte nivelado — zero cabos à vista.',
    capa: 'assets/img/obras/tv-parede-4x3.jpg',
    galeria: ['assets/img/obras/tv-parede.jpg', 'assets/img/obras/tv-config.jpg', 'assets/img/obras/sala-embutidos.jpg'],
    desafio: 'O cliente queria a TV na parede sem um único cabo à vista, com tomadas e HDMI no sítio certo e luz de ambiente por trás.',
    solucao: 'Roços para tubo VD, caixa de tomadas + dados atrás da TV, segunda caixa junto ao móvel e fita LED regulável no recorte do teto. Suporte nivelado e testado com o peso real.',
    resultado: 'Parede limpa, TV a "flutuar" e uma cena de luz para ver cinema — tudo comandável do telecomando e do telemóvel.',
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
    galeria: ['assets/img/obras/rede-antes.jpg', 'assets/img/obras/rede-antes-b.jpg', 'assets/img/obras/bastidor-a.jpg', 'assets/img/obras/bastidor-b.jpg', 'assets/img/obras/bastidor-cabos.jpg', 'assets/img/obras/rede-depois.jpg'],
    desafio: 'Vários routers e switches empilhados no chão, fontes de alimentação à mistura, Wi-Fi a falhar em metade do escritório e nenhuma proteção contra falhas de energia.',
    solucao: 'Ponto único organizado: switch fixo, cablagem em calha, ponto de acesso Wi-Fi montado ao teto e UPS para o essencial. Etiquetagem de todas as ligações.',
    resultado: 'Wi-Fi estável em toda a área, arranque limpo após falhas de energia e um esquema simples de "o que está ligado a quê".',
    destaques: ['Cablagem em calha, sem cabos no chão', 'Ponto de acesso Wi-Fi dedicado', 'UPS para servidores e rede']
  },
  {
    slug: 'iluminacao-ambiente-porto',
    servico: 'eletricidade',
    titulo: 'Iluminação de ambiente e apliques',
    local: 'Porto',
    ano: 2025, duracao: '4 dias',
    resumo: 'Circuito novo com focos embutidos reguláveis, apliques de parede e ponto para ventoinha de teto.',
    capa: 'assets/img/obras/luz-parede-a-4x3.jpg',
    galeria: ['assets/img/obras/luz-parede-a.jpg', 'assets/img/obras/luz-parede-b.jpg', 'assets/img/obras/sala-embutidos.jpg', 'assets/img/obras/ventoinha-teto.jpg'],
    desafio: 'Espaço com um único ponto de luz central e luz "dura". O cliente queria camadas de luz — geral, de leitura e de ambiente — e um ponto novo para ventoinha.',
    solucao: 'Circuito dedicado com focos LED embutidos reguláveis, apliques de parede sobre o revestimento de chapa/madeira e caixa de teto reforçada para a ventoinha. Tudo em dimmer.',
    resultado: 'Três cenas de luz na mesma divisão, consumo mais baixo e um ambiente quente à noite sem candeeiros de pé.',
    destaques: ['Focos LED embutidos reguláveis', 'Apliques de parede sobre revestimento', 'Caixa reforçada para ventoinha de teto']
  },
  {
    slug: 'sala-lareira-multimedia',
    servico: 'carpintaria',
    titulo: 'Móvel e prateleiras à volta da lareira de pedra',
    local: 'Porto',
    ano: 2025, duracao: '2 semanas',
    resumo: 'Móvel de TV suspenso e prateleiras à medida a acompanhar a parede de pedra, com passagem de cabos integrada.',
    capa: 'assets/img/obras/sala-lareira-4x3.jpg',
    galeria: ['assets/img/obras/sala-lareira.jpg', 'assets/img/obras/sala-lareira-b.jpg', 'assets/img/obras/tv-parede.jpg'],
    desafio: 'Parede de pedra irregular, lareira ao centro e vontade de integrar a TV, o equipamento de som e arrumação aberta sem "esconder" a pedra.',
    solucao: 'Móvel suspenso lacado a dois tons, prateleiras assimétricas fixadas ponto a ponto na pedra, e conduta interna para levar os cabos da TV até ao móvel sem furar à vista.',
    resultado: 'A pedra continua a ser a protagonista; a eletrónica desapareceu para dentro do móvel.',
    destaques: ['Fixação ponto a ponto em pedra', 'Passagem de cabos interna', 'Lacado a dois tons']
  },
  {
    slug: 'sapateira-secretaria-medida',
    servico: 'carpintaria',
    titulo: 'Sapateira de entrada e secretária à medida',
    local: 'Matosinhos, Porto',
    ano: 2025, duracao: '10 dias',
    resumo: 'Dois móveis para aproveitar cantos difíceis: sapateira estreita no hall e secretária em L num quarto.',
    capa: 'assets/img/obras/sapateira-4x3.jpg',
    galeria: ['assets/img/obras/sapateira.jpg', 'assets/img/obras/secretaria.jpg'],
    desafio: 'Hall de entrada estreito, sem sítio para calçado, e um quarto com um recanto que nenhum móvel de loja aproveitava.',
    solucao: 'Sapateira basculante de 22 cm de profundidade rente à parede, e secretária em L lacada branca com gavetão e passagem de cabos para a zona de trabalho.',
    resultado: 'Entrada arrumada sem roubar passagem, e um posto de trabalho fixo onde antes era espaço morto.',
    destaques: ['Sapateira basculante de 22 cm', 'Secretária em L com gestão de cabos', 'Lacado branco mate']
  },
  {
    slug: 'janelas-aluminio-vista',
    servico: 'carpintaria',
    titulo: 'Caixilharia de alumínio com vista para a marina',
    local: 'Matosinhos, Porto',
    ano: 2025, duracao: '1 semana',
    resumo: 'Substituição de janelas antigas por caixilharia de alumínio com corte térmico e vidro duplo.',
    capa: 'assets/img/obras/janela-vista-a-4x3.jpg',
    galeria: ['assets/img/obras/janela-vista-a.jpg', 'assets/img/obras/janela-vista-b.jpg', 'assets/img/obras/janela-diogo.jpg'],
    desafio: 'Janelas antigas com infiltrações e muito ruído da rua, numa fachada virada ao mar — exposta a sal e vento.',
    solucao: 'Caixilharia de alumínio lacado preto com rutura de ponte térmica, vidro duplo, remates interiores em madeira e vedação nova em todo o perímetro.',
    resultado: 'Menos ruído, sem condensação, e uma moldura mais fina que deixa entrar mais da vista.',
    destaques: ['Alumínio com corte térmico', 'Vidro duplo', 'Remates interiores em madeira']
  },
  {
    slug: 'cozinha-armario-exaustor',
    servico: 'carpintaria',
    titulo: 'Armário de cozinha com passagem de exaustor',
    local: 'Porto',
    ano: 2024, duracao: '1 semana',
    resumo: 'Módulo superior à medida a esconder a conduta do exaustor, mantendo o volume de arrumação.',
    capa: 'assets/img/obras/cozinha-armario-4x3.jpg',
    galeria: ['assets/img/obras/cozinha-armario.jpg'],
    desafio: 'A conduta do novo exaustor tinha de subir pelo móvel superior sem deixar a arrumação inutilizável.',
    solucao: 'Módulo desenhado com um canal técnico ao fundo para a conduta e tubagem, prateleiras recortadas em volta e frente igual à restante cozinha.',
    resultado: 'A conduta desapareceu; o armário perdeu só o mínimo de fundo e mantém-se a par dos outros.',
    destaques: ['Canal técnico integrado', 'Prateleiras recortadas', 'Frente a condizer com a cozinha']
  },
  {
    slug: 'homekit-tv-vila-do-conde',
    servico: 'domotica',
    titulo: 'Configuração de TV, cenários e ventoinha inteligente',
    local: 'Vila do Conde',
    ano: 2025, duracao: '1 dia',
    resumo: 'Iluminação e ventoinha inteligentes, TV configurada e cenários de dia/noite/cinema — sem trocar os interruptores.',
    capa: 'assets/img/obras/tv-config-4x3.jpg',
    galeria: ['assets/img/obras/tv-config.jpg', 'assets/img/obras/ventoinha-teto-b.jpg', 'assets/img/obras/ventoinha-teto.jpg'],
    desafio: 'Lâmpadas a falhar e vontade de passar a controlo por voz e cenários, sem obra e mantendo os interruptores de parede.',
    solucao: 'Iluminação e ventoinha de teto inteligentes, módulos atrás dos interruptores, TV ligada à cena de cinema e cenários (dia, noite, fora de casa) configurados no local.',
    resultado: 'Controlo por app e por voz, com os interruptores a funcionar como sempre — e a ventoinha a entrar nas cenas.',
    destaques: ['Compatível com Apple Home / Google / Alexa', 'Interruptores físicos mantidos', 'Ventoinha de teto nas cenas'],
    testemunho: { texto: 'Depois de instalar as lâmpadas inteligentes, ajudou-me a configurá-las com o Apple Home. Recomendo o Diogo a todos.', autor: 'Nik V.', papel: 'Eletricidade + Domótica' }
  },
  {
    slug: 'clinica-circuito-equipamento',
    servico: 'eletricidade',
    titulo: 'Circuito dedicado e móvel de apoio — Clínica',
    local: 'Porto',
    ano: 2025, duracao: '3 dias',
    resumo: 'Ponto de energia dedicado para equipamento de estética e móvel de apoio à medida.',
    capa: 'assets/img/obras/cliente-comercial-4x3.jpg',
    galeria: ['assets/img/obras/cliente-comercial.jpg'],
    desafio: 'Equipamento novo de maior consumo a partilhar circuito com a iluminação, e sem sítio de arrumação junto ao posto.',
    solucao: 'Circuito dedicado com proteção própria a partir do quadro, tomada no sítio exato do equipamento, e móvel baixo lacado com rodízios para o material de apoio.',
    resultado: 'Equipamento estável sem disparos, e um posto de trabalho arrumado e móvel.',
    destaques: ['Circuito dedicado com proteção própria', 'Tomada no ponto de uso', 'Móvel de apoio com rodízios']
  }
];
