/* ============================================================
   Dizarro — portfolio-data.js
   FONTE ÚNICA dos trabalhos. Lida por portfolio.html e projeto.html.

   Campos de texto são objetos { pt, en, es, fr } e resolvem-se com
   window.i18n.pick(). Campos não traduzíveis (slug, servico, ano,
   caminhos de imagem) ficam como estão.
   ============================================================ */

window.PROJETOS = [
  {
    slug: 'parede-tv-sala',
    servico: 'telecomunicacoes',
    ano: 2025,
    titulo: { pt: 'Parede de TV — do móvel para a parede', en: 'TV wall — from the unit to the wall', es: 'Pared de TV — del mueble a la pared', fr: 'Mur TV — du meuble au mur' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    duracao: { pt: '1 dia', en: '1 day', es: '1 día', fr: '1 jour' },
    resumo: { pt: 'A TV estava pousada em cima do móvel. Passou para a parede, com a cablagem escondida e ponto de dados dedicado.', en: 'The TV was sitting on the sideboard. It moved to the wall, with hidden cabling and a dedicated data outlet.', es: 'La TV estaba apoyada en el mueble. Pasó a la pared, con el cableado oculto y una toma de datos dedicada.', fr: 'Le téléviseur était posé sur le meuble. Il est passé au mur, câblage caché et prise data dédiée.' },
    capa: 'assets/img/obras/tv-parede-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/tv-parede-antes-4x3.jpg', depois: 'assets/img/obras/tv-parede-4x3.jpg' },
    galeria: ['assets/img/obras/tv-parede.jpg'],
    desafio: { pt: 'Televisor grande apoiado no aparador, com os cabos à vista e sem ponto de rede junto à zona de TV.', en: 'A large TV resting on the sideboard, cables on show and no network point near the TV area.', es: 'Un televisor grande apoyado en el aparador, con los cables a la vista y sin punto de red junto a la zona de TV.', fr: 'Un grand téléviseur posé sur le buffet, câbles apparents et aucune prise réseau près de la zone TV.' },
    solucao: { pt: 'Suporte fixo dimensionado ao peso real da TV, roço para levar energia e dados até trás do ecrã, e cabos conduzidos até ao móvel sem ficarem à vista.', en: 'A fixed bracket sized to the TV’s real weight, a chase to bring power and data behind the screen, and cables routed to the unit out of sight.', es: 'Soporte fijo dimensionado al peso real de la TV, roza para llevar energía y datos detrás de la pantalla, y cables conducidos al mueble sin quedar a la vista.', fr: 'Un support fixe dimensionné au poids réel de la TV, une saignée pour amener courant et data derrière l’écran, et des câbles acheminés vers le meuble, hors de vue.' },
    resultado: { pt: 'TV alinhada na parede, aparador liberto e uma tomada de dados dedicada para a box e a smart TV.', en: 'The TV level on the wall, the sideboard freed up and a dedicated data socket for the set-top box and smart TV.', es: 'TV alineada en la pared, aparador libre y una toma de datos dedicada para el descodificador y la smart TV.', fr: 'TV bien alignée au mur, buffet dégagé et une prise data dédiée pour le décodeur et la smart TV.' },
    destaques: [
      { pt: 'Suporte dimensionado ao peso da TV', en: 'Bracket sized to the TV’s weight', es: 'Soporte dimensionado al peso de la TV', fr: 'Support dimensionné au poids de la TV' },
      { pt: 'Energia + dados atrás do ecrã', en: 'Power + data behind the screen', es: 'Energía + datos detrás de la pantalla', fr: 'Courant + data derrière l’écran' },
      { pt: 'Cabos conduzidos até ao móvel', en: 'Cables routed down to the unit', es: 'Cables conducidos hasta el mueble', fr: 'Câbles acheminés jusqu’au meuble' }
    ],
    testemunho: {
      texto: { pt: 'Trocou todos os cabos antigos por cabo de rede para todas as divisões. Educado, transparente e rápido.', en: 'Replaced all the old cables with network cable to every room. Polite, transparent and quick.', es: 'Cambió todos los cables antiguos por cable de red a todas las habitaciones. Educado, transparente y rápido.', fr: 'A remplacé tous les vieux câbles par du câble réseau vers chaque pièce. Poli, transparent et rapide.' },
      autor: 'Eduardo D.',
      papel: { pt: 'Telecomunicações', en: 'Telecom', es: 'Telecom', fr: 'Télécom' }
    }
  },
  {
    slug: 'bastidor-rede-escritorio',
    servico: 'telecomunicacoes',
    ano: 2025,
    titulo: { pt: 'Bastidor e rede estruturada — Escritório', en: 'Rack and structured cabling — Office', es: 'Rack y red estructurada — Oficina', fr: 'Baie et câblage structuré — Bureau' },
    local: { pt: 'Porto', en: 'Porto', es: 'Oporto', fr: 'Porto' },
    duracao: { pt: '3 dias', en: '3 days', es: '3 días', fr: '3 jours' },
    resumo: { pt: 'De uma secretária cheia de routers e um bastidor com cabo solto a um ponto de rede organizado, com ponto de acesso Wi-Fi e UPS.', en: 'From a desk full of routers and a rack of loose cable to a tidy network point, with a Wi-Fi access point and a UPS.', es: 'De un escritorio lleno de routers y un rack con cable suelto a un punto de red ordenado, con punto de acceso Wi-Fi y SAI.', fr: 'D’un bureau plein de routeurs et d’une baie au câble en vrac à un point réseau rangé, avec point d’accès Wi-Fi et onduleur.' },
    capa: 'assets/img/obras/rede-depois-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/rede-antes-4x3.jpg', depois: 'assets/img/obras/rede-depois-4x3.jpg' },
    galeria: ['assets/img/obras/rede-antes-b.jpg', 'assets/img/obras/bastidor-a.jpg', 'assets/img/obras/bastidor-b.jpg', 'assets/img/obras/bastidor-cabos.jpg', 'assets/img/obras/rede-depois.jpg'],
    desafio: { pt: 'Routers e fontes de alimentação empilhados na secretária, bastidor de parede com cabo por terminar e por etiquetar, Wi-Fi a falhar em parte do escritório.', en: 'Routers and power supplies stacked on the desk, a wall rack with cable left unterminated and unlabelled, Wi-Fi dropping in part of the office.', es: 'Routers y fuentes apilados en el escritorio, rack de pared con cable sin rematar ni etiquetar, Wi-Fi fallando en parte de la oficina.', fr: 'Routeurs et alimentations empilés sur le bureau, baie murale au câble non raccordé ni étiqueté, Wi-Fi défaillant dans une partie du bureau.' },
    solucao: { pt: 'Terminação e arrumação de todo o cabo no bastidor, patch cords à medida, ponto de acesso Wi-Fi dedicado e UPS para o essencial. Cada ligação etiquetada.', en: 'Terminating and tidying all the cable in the rack, made-to-length patch cords, a dedicated Wi-Fi access point and a UPS for the essentials. Every link labelled.', es: 'Rematado y ordenado de todo el cable en el rack, latiguillos a medida, punto de acceso Wi-Fi dedicado y SAI para lo esencial. Cada conexión etiquetada.', fr: 'Raccordement et rangement de tout le câble dans la baie, cordons de brassage sur mesure, point d’accès Wi-Fi dédié et onduleur pour l’essentiel. Chaque liaison étiquetée.' },
    resultado: { pt: 'Bastidor limpo, Wi-Fi estável em toda a área e um esquema simples de "o que está ligado a quê".', en: 'A clean rack, stable Wi-Fi across the whole area and a simple "what’s connected to what" map.', es: 'Rack limpio, Wi-Fi estable en toda el área y un esquema simple de "qué está conectado a qué".', fr: 'Baie propre, Wi-Fi stable sur toute la zone et un schéma simple « qui est branché où ».' },
    destaques: [
      { pt: 'Cabo terminado e etiquetado no bastidor', en: 'Cable terminated and labelled in the rack', es: 'Cable rematado y etiquetado en el rack', fr: 'Câble raccordé et étiqueté dans la baie' },
      { pt: 'Ponto de acesso Wi-Fi dedicado', en: 'Dedicated Wi-Fi access point', es: 'Punto de acceso Wi-Fi dedicado', fr: 'Point d’accès Wi-Fi dédié' },
      { pt: 'UPS para rede e servidores', en: 'UPS for network and servers', es: 'SAI para red y servidores', fr: 'Onduleur pour réseau et serveurs' }
    ]
  },
  {
    slug: 'tv-config-cenarios',
    servico: 'domotica',
    ano: 2025,
    titulo: { pt: 'Da parede preparada à TV configurada', en: 'From prepped wall to configured TV', es: 'De la pared preparada a la TV configurada', fr: 'Du mur préparé à la TV configurée' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    duracao: { pt: '1 dia', en: '1 day', es: '1 día', fr: '1 jour' },
    resumo: { pt: 'Parede preparada com focos e caixas embutidas; depois, TV montada, ligada e configurada de raiz.', en: 'A wall prepped with downlights and back boxes; then the TV mounted, wired and configured from scratch.', es: 'Pared preparada con focos y cajas empotradas; después, TV montada, conectada y configurada desde cero.', fr: 'Mur préparé avec spots et boîtiers encastrés ; puis TV montée, raccordée et configurée de zéro.' },
    capa: 'assets/img/obras/tv-config-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/sala-embutidos-4x3.jpg', depois: 'assets/img/obras/tv-config-4x3.jpg' },
    galeria: ['assets/img/obras/sala-embutidos.jpg', 'assets/img/obras/tv-config.jpg'],
    desafio: { pt: 'Sala com a parede já preparada (focos embutidos e caixas roughed-in) e a TV nova ainda por instalar e configurar.', en: 'A living room with the wall already prepped (recessed downlights and back boxes) and the new TV still to install and configure.', es: 'Salón con la pared ya preparada (focos empotrados y cajas) y la TV nueva aún por instalar y configurar.', fr: 'Un salon avec le mur déjà préparé (spots encastrés et boîtiers) et la nouvelle TV encore à poser et à configurer.' },
    solucao: { pt: 'Montagem do suporte, ligação de energia e sinal pelas caixas deixadas na parede, e primeira configuração da TV feita no local — rede, contas e imagem.', en: 'Mounting the bracket, wiring power and signal through the back boxes left in the wall, and doing the TV’s first-time setup on site — network, accounts and picture.', es: 'Montaje del soporte, conexión de energía y señal por las cajas dejadas en la pared, y primera configuración de la TV in situ — red, cuentas e imagen.', fr: 'Pose du support, raccordement courant et signal par les boîtiers laissés dans le mur, et première configuration de la TV sur place — réseau, comptes et image.' },
    resultado: { pt: 'TV pronta a usar no dia, sem cabos à vista e com a imagem já acertada.', en: 'The TV ready to use the same day, no cables in sight and the picture already dialled in.', es: 'TV lista para usar el mismo día, sin cables a la vista y con la imagen ya ajustada.', fr: 'TV prête à l’emploi le jour même, sans câble visible et l’image déjà réglée.' },
    destaques: [
      { pt: 'Aproveitou as caixas deixadas na parede', en: 'Reused the back boxes left in the wall', es: 'Aprovechó las cajas dejadas en la pared', fr: 'A réutilisé les boîtiers laissés dans le mur' },
      { pt: 'Primeira configuração feita no local', en: 'First-time setup done on site', es: 'Primera configuración hecha in situ', fr: 'Première configuration faite sur place' },
      { pt: 'Sem cabos à vista', en: 'No cables in sight', es: 'Sin cables a la vista', fr: 'Aucun câble visible' }
    ]
  },
  {
    slug: 'apliques-revestimento-metalico',
    servico: 'eletricidade',
    ano: 2025,
    titulo: { pt: 'Apliques de parede sobre revestimento metálico', en: 'Wall lights on metal cladding', es: 'Apliques de pared sobre revestimiento metálico', fr: 'Appliques murales sur bardage métallique' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    duracao: { pt: '2 dias', en: '2 days', es: '2 días', fr: '2 jours' },
    resumo: { pt: 'Instalação de apliques numa parede de chapa perfilada — da montagem com os fios à vista ao acabamento fechado.', en: 'Fitting wall lights on profiled-metal cladding — from assembly with wires showing to the finished, closed housing.', es: 'Instalación de apliques en una pared de chapa perfilada — del montaje con los cables a la vista al acabado cerrado.', fr: 'Pose d’appliques sur bardage métallique nervuré — du montage fils apparents à la finition boîtier fermé.' },
    capa: 'assets/img/obras/luz-parede-b-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/luz-parede-a-4x3.jpg', depois: 'assets/img/obras/luz-parede-b-4x3.jpg' },
    galeria: [],
    desafio: { pt: 'Fixar e alimentar apliques numa parede de chapa perfilada (revestimento metálico), sem danificar o painel e com a ligação escondida.', en: 'Fixing and wiring wall lights on profiled-metal cladding without damaging the panel and with the connection hidden.', es: 'Fijar y alimentar apliques en una pared de chapa perfilada sin dañar el panel y con la conexión oculta.', fr: 'Fixer et alimenter des appliques sur un bardage métallique nervuré sans abîmer le panneau et connexion cachée.' },
    solucao: { pt: 'Furação e fixação adequadas ao perfil da chapa, passagem discreta da alimentação, ligação do casquilho e fecho da caixa com a tampa do aplique.', en: 'Drilling and fixings suited to the cladding profile, a discreet supply run, wiring the lampholder and closing the housing with the light’s cover.', es: 'Taladrado y fijación adecuados al perfil de la chapa, tendido discreto de la alimentación, conexión del portalámparas y cierre de la caja con la tapa.', fr: 'Perçage et fixations adaptés au profil du bardage, passage discret de l’alimentation, câblage de la douille et fermeture du boîtier avec le capot.' },
    resultado: { pt: 'Luz de parede quente na varanda, com a caixa fechada e limpa — sem fios nem casquilho à vista.', en: 'A warm wall light on the balcony, with the housing closed and clean — no wires or lampholder showing.', es: 'Luz de pared cálida en el balcón, con la caja cerrada y limpia — sin cables ni portalámparas a la vista.', fr: 'Une lumière murale chaude sur le balcon, boîtier fermé et net — ni fils ni douille apparents.' },
    destaques: [
      { pt: 'Fixação adequada ao perfil da chapa', en: 'Fixings suited to the cladding profile', es: 'Fijación adecuada al perfil de la chapa', fr: 'Fixations adaptées au profil du bardage' },
      { pt: 'Ligação escondida', en: 'Hidden connection', es: 'Conexión oculta', fr: 'Connexion cachée' },
      { pt: 'Caixa fechada e alinhada', en: 'Housing closed and aligned', es: 'Caja cerrada y alineada', fr: 'Boîtier fermé et aligné' }
    ]
  },
  {
    slug: 'pintura-caixilharia-branco',
    servico: 'carpintaria',
    ano: 2025,
    titulo: { pt: 'Pintar caixilharia — de castanho para branco', en: 'Painting window frames — from brown to white', es: 'Pintar carpintería — de marrón a blanco', fr: 'Peindre les menuiseries — du marron au blanc' },
    local: { pt: 'Matosinhos, Porto', en: 'Matosinhos, Porto', es: 'Matosinhos, Oporto', fr: 'Matosinhos, Porto' },
    duracao: { pt: '2 dias', en: '2 days', es: '2 días', fr: '2 jours' },
    resumo: { pt: 'As janelas eram castanhas. Lixadas, preparadas e pintadas de branco, para acompanhar os interiores.', en: 'The windows were brown. Sanded, prepped and painted white to match the interiors.', es: 'Las ventanas eran marrones. Lijadas, preparadas y pintadas de blanco para combinar con los interiores.', fr: 'Les fenêtres étaient marron. Poncées, préparées et peintes en blanc pour s’accorder aux intérieurs.' },
    capa: 'assets/img/obras/janela-vista-b-4x3.jpg',
    galeria: ['assets/img/obras/janela-diogo.jpg', 'assets/img/obras/janela-vista-a.jpg', 'assets/img/obras/janela-vista-b.jpg'],
    desafio: { pt: 'Caixilharia de madeira castanha, destoante dos interiores claros — e sem justificar a troca das janelas.', en: 'Brown wooden window frames, clashing with the light interiors — and not worth replacing.', es: 'Carpintería de madera marrón, desentonando con los interiores claros — y sin justificar el cambio de ventanas.', fr: 'Menuiseries bois marron, en décalage avec les intérieurs clairs — et sans justifier un remplacement.' },
    solucao: { pt: 'Lixagem, limpeza e desengorduramento do perfil, primário de aderência e duas demãos de esmalte branco, com fitas e proteção do vidro e da parede.', en: 'Sanding, cleaning and degreasing the frame, an adhesion primer and two coats of white enamel, with masking and protection of the glass and wall.', es: 'Lijado, limpieza y desengrasado del perfil, imprimación de adherencia y dos manos de esmalte blanco, con cintas y protección del vidrio y la pared.', fr: 'Ponçage, nettoyage et dégraissage du profil, primaire d’accrochage et deux couches d’émail blanc, avec adhésif et protection du vitrage et du mur.' },
    resultado: { pt: 'Janelas brancas a condizer com os interiores, sem obra e sem trocar a caixilharia.', en: 'White windows to match the interiors, with no building work and without replacing the frames.', es: 'Ventanas blancas a juego con los interiores, sin obra y sin cambiar la carpintería.', fr: 'Fenêtres blanches assorties aux intérieurs, sans travaux ni remplacement des menuiseries.' },
    destaques: [
      { pt: 'Lixagem + primário de aderência', en: 'Sanding + adhesion primer', es: 'Lijado + imprimación de adherencia', fr: 'Ponçage + primaire d’accrochage' },
      { pt: 'Duas demãos de esmalte branco', en: 'Two coats of white enamel', es: 'Dos manos de esmalte blanco', fr: 'Deux couches d’émail blanc' },
      { pt: 'Vidro e parede protegidos com fita', en: 'Glass and wall protected with masking', es: 'Vidrio y pared protegidos con cinta', fr: 'Vitrage et mur protégés par adhésif' }
    ]
  },
  {
    slug: 'sapateira-hall',
    servico: 'carpintaria',
    ano: 2025,
    titulo: { pt: 'Sapateira basculante para o hall de entrada', en: 'Tilting shoe cabinet for the entrance hall', es: 'Zapatero abatible para el recibidor', fr: 'Meuble à chaussures basculant pour l’entrée' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    duracao: { pt: '4 dias', en: '4 days', es: '4 días', fr: '4 jours' },
    resumo: { pt: 'Sapateira estreita, lacada a branco, encostada à parede junto ao aquecedor — sem roubar passagem.', en: 'A slim white-lacquered shoe cabinet against the wall next to the radiator — without eating into the walkway.', es: 'Zapatero estrecho, lacado en blanco, pegado a la pared junto al radiador — sin robar paso.', fr: 'Meuble à chaussures étroit, laqué blanc, contre le mur près du radiateur — sans empiéter sur le passage.' },
    capa: 'assets/img/obras/sapateira-4x3.jpg',
    galeria: ['assets/img/obras/sapateira.jpg'],
    desafio: { pt: 'Hall de entrada estreito, sem sítio para calçado e com um radiador a limitar a profundidade disponível.', en: 'A narrow entrance hall with nowhere for shoes and a radiator limiting the available depth.', es: 'Recibidor estrecho, sin sitio para el calzado y con un radiador que limita la profundidad disponible.', fr: 'Entrée étroite, aucun espace pour les chaussures et un radiateur limitant la profondeur disponible.' },
    solucao: { pt: 'Sapateira de portas basculantes com pouca profundidade, lacada a branco mate a condizer com a parede, dimensionada para não interferir com o radiador nem com a circulação.', en: 'A shallow tilting-door shoe cabinet, matte white lacquer to match the wall, sized so it clears the radiator and the walkway.', es: 'Zapatero de puertas abatibles poco profundo, lacado blanco mate a juego con la pared, dimensionado para no interferir con el radiador ni con el paso.', fr: 'Meuble à portes basculantes peu profond, laque blanc mat assortie au mur, dimensionné pour ne gêner ni le radiateur ni la circulation.' },
    resultado: { pt: 'Arrumação de calçado à entrada, com o corredor a manter a largura de passagem.', en: 'Shoe storage right at the door, with the hallway keeping its full width.', es: 'Almacenaje de calzado en la entrada, con el pasillo manteniendo su ancho.', fr: 'Rangement des chaussures dès l’entrée, le couloir conservant toute sa largeur.' },
    destaques: [
      { pt: 'Portas basculantes, pouca profundidade', en: 'Tilting doors, shallow depth', es: 'Puertas abatibles, poca profundidad', fr: 'Portes basculantes, faible profondeur' },
      { pt: 'Lacado branco mate', en: 'Matte white lacquer', es: 'Lacado blanco mate', fr: 'Laque blanc mat' },
      { pt: 'Não interfere com radiador nem passagem', en: 'Clears the radiator and the walkway', es: 'No interfiere con el radiador ni el paso', fr: 'Ne gêne ni le radiateur ni le passage' }
    ]
  },
  {
    slug: 'secretaria-medida',
    servico: 'carpintaria',
    ano: 2025,
    titulo: { pt: 'Secretária à medida com gaveteiro', en: 'Bespoke desk with drawer unit', es: 'Escritorio a medida con cajonera', fr: 'Bureau sur mesure avec caisson' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    duracao: { pt: '5 dias', en: '5 days', es: '5 días', fr: '5 jours' },
    resumo: { pt: 'Secretária lacada a branco com gaveteiro e módulo de apoio, feita para o vão entre a parede e o radiador.', en: 'A white-lacquered desk with a drawer unit and a side module, built for the gap between wall and radiator.', es: 'Escritorio lacado en blanco con cajonera y módulo de apoyo, hecho para el hueco entre la pared y el radiador.', fr: 'Bureau laqué blanc avec caisson et module d’appoint, conçu pour l’espace entre le mur et le radiateur.' },
    capa: 'assets/img/obras/secretaria-4x3.jpg',
    galeria: ['assets/img/obras/secretaria.jpg'],
    desafio: { pt: 'Aproveitar um vão certo entre a parede e o aquecedor para um posto de trabalho fixo, com arrumação.', en: 'Making use of an exact gap between wall and radiator for a fixed workstation, with storage.', es: 'Aprovechar un hueco exacto entre la pared y el radiador para un puesto de trabajo fijo, con almacenaje.', fr: 'Exploiter un espace précis entre le mur et le radiateur pour un poste de travail fixe, avec rangement.' },
    solucao: { pt: 'Tampo à medida do vão, gaveteiro suspenso de um lado e módulo de porta do outro, tudo lacado a branco mate, com passagem de cabos para a zona de trabalho.', en: 'A top made to the gap, a suspended drawer unit on one side and a door module on the other, all matte white lacquer, with cable routing to the work area.', es: 'Tablero a medida del hueco, cajonera suspendida a un lado y módulo de puerta al otro, todo lacado blanco mate, con paso de cables a la zona de trabajo.', fr: 'Plateau à la mesure de l’espace, caisson suspendu d’un côté et module à porte de l’autre, le tout laqué blanc mat, avec passage de câbles vers le poste.' },
    resultado: { pt: 'Um posto de trabalho estável e arrumado onde antes era espaço morto.', en: 'A stable, tidy workstation where there used to be dead space.', es: 'Un puesto de trabajo estable y ordenado donde antes era espacio muerto.', fr: 'Un poste de travail stable et rangé là où il n’y avait qu’un espace perdu.' },
    destaques: [
      { pt: 'Tampo à medida do vão', en: 'Top made to the gap', es: 'Tablero a medida del hueco', fr: 'Plateau à la mesure de l’espace' },
      { pt: 'Gaveteiro + módulo de porta', en: 'Drawer unit + door module', es: 'Cajonera + módulo de puerta', fr: 'Caisson + module à porte' },
      { pt: 'Passagem de cabos integrada', en: 'Built-in cable routing', es: 'Paso de cables integrado', fr: 'Passage de câbles intégré' }
    ]
  },
  {
    slug: 'ventoinhas-teto',
    servico: 'eletricidade',
    ano: 2025,
    titulo: { pt: 'Ventoinhas de teto com luz', en: 'Ceiling fans with light', es: 'Ventiladores de techo con luz', fr: 'Ventilateurs de plafond avec lumière' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    duracao: { pt: '1 dia', en: '1 day', es: '1 día', fr: '1 jour' },
    resumo: { pt: 'Instalação de ventoinhas de teto com iluminação integrada, em teto inclinado e em teto com clarabóia.', en: 'Fitting ceiling fans with integrated lighting, on a sloped ceiling and on a ceiling with a skylight.', es: 'Instalación de ventiladores de techo con iluminación integrada, en techo inclinado y en techo con claraboya.', fr: 'Pose de ventilateurs de plafond à éclairage intégré, sur plafond incliné et sur plafond avec puits de lumière.' },
    capa: 'assets/img/obras/ventoinha-teto-b-4x3.jpg',
    galeria: ['assets/img/obras/ventoinha-teto.jpg', 'assets/img/obras/ventoinha-teto-b.jpg'],
    desafio: { pt: 'Substituir o ponto de luz por ventoinha com luz, garantindo fixação segura ao teto (um deles inclinado) e comando simples.', en: 'Swapping the light point for a fan with light, ensuring a secure fix to the ceiling (one of them sloped) and simple control.', es: 'Sustituir el punto de luz por un ventilador con luz, asegurando una fijación segura al techo (uno de ellos inclinado) y un mando simple.', fr: 'Remplacer le point lumineux par un ventilateur avec lumière, en assurant une fixation sûre au plafond (l’un incliné) et une commande simple.' },
    solucao: { pt: 'Caixa de teto reforçada para suportar o peso e o movimento da ventoinha, montagem nivelada e ligação da ventoinha e da luz ao comando.', en: 'A reinforced ceiling box to take the fan’s weight and motion, a level mount and wiring the fan and light to the control.', es: 'Caja de techo reforzada para soportar el peso y el movimiento del ventilador, montaje nivelado y conexión del ventilador y la luz al mando.', fr: 'Boîtier de plafond renforcé pour supporter le poids et le mouvement du ventilateur, pose de niveau et raccordement du ventilateur et de la lumière à la commande.' },
    resultado: { pt: 'Ventilação e luz no mesmo ponto, com montagem firme e sem vibração.', en: 'Ventilation and light at the same point, firmly mounted and vibration-free.', es: 'Ventilación y luz en el mismo punto, con montaje firme y sin vibración.', fr: 'Ventilation et lumière au même point, montage ferme et sans vibration.' },
    destaques: [
      { pt: 'Caixa de teto reforçada', en: 'Reinforced ceiling box', es: 'Caja de techo reforzada', fr: 'Boîtier de plafond renforcé' },
      { pt: 'Montagem nivelada (inclui teto inclinado)', en: 'Level mount (including a sloped ceiling)', es: 'Montaje nivelado (incluye techo inclinado)', fr: 'Pose de niveau (y compris plafond incliné)' },
      { pt: 'Ventoinha + luz no mesmo comando', en: 'Fan + light on one control', es: 'Ventilador + luz en un mando', fr: 'Ventilateur + lumière sur une commande' }
    ]
  },
  {
    slug: 'armario-cozinha-exaustor',
    servico: 'carpintaria',
    ano: 2025,
    titulo: { pt: 'Armário de cozinha adaptado ao exaustor', en: 'Kitchen cabinet adapted to the extractor', es: 'Armario de cocina adaptado al extractor', fr: 'Meuble de cuisine adapté à la hotte' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    duracao: { pt: '3 dias', en: '3 days', es: '3 días', fr: '3 jours' },
    resumo: { pt: 'Módulo superior alterado para dar passagem à conduta do exaustor, mantendo a frente a condizer com a cozinha.', en: 'The upper unit reworked to route the extractor duct, keeping the front matching the kitchen.', es: 'Módulo superior modificado para dar paso al conducto del extractor, manteniendo el frente a juego con la cocina.', fr: 'Meuble haut retravaillé pour laisser passer le conduit de hotte, façade toujours assortie à la cuisine.' },
    capa: 'assets/img/obras/cozinha-armario-4x3.jpg',
    galeria: ['assets/img/obras/cozinha-armario.jpg'],
    desafio: { pt: 'A conduta do exaustor tinha de subir pelo armário superior sem deixar o módulo inutilizável nem alterar a frente da cozinha.', en: 'The extractor duct had to rise through the upper cabinet without making the unit unusable or changing the kitchen front.', es: 'El conducto del extractor tenía que subir por el armario superior sin dejar el módulo inutilizable ni alterar el frente de la cocina.', fr: 'Le conduit de hotte devait monter dans le meuble haut sans le rendre inutilisable ni modifier la façade de la cuisine.' },
    solucao: { pt: 'Recorte do fundo e das prateleiras para a conduta e tubagem, reforço da estrutura e frente mantida igual à dos restantes módulos.', en: 'Cutting out the back and shelves for the duct and pipework, reinforcing the carcass and keeping the front identical to the other units.', es: 'Recorte del fondo y de los estantes para el conducto y la tubería, refuerzo de la estructura y frente igual al de los demás módulos.', fr: 'Découpe du fond et des étagères pour le conduit et la tuyauterie, renfort du caisson et façade identique aux autres meubles.' },
    resultado: { pt: 'Conduta escondida dentro do armário, com o mínimo de arrumação perdida.', en: 'The duct hidden inside the cabinet, with the least possible storage lost.', es: 'Conducto escondido dentro del armario, con la mínima pérdida de almacenaje.', fr: 'Conduit caché dans le meuble, avec un minimum de rangement perdu.' },
    destaques: [
      { pt: 'Recorte à medida para a conduta', en: 'Custom cut-out for the duct', es: 'Recorte a medida para el conducto', fr: 'Découpe sur mesure pour le conduit' },
      { pt: 'Estrutura reforçada', en: 'Reinforced carcass', es: 'Estructura reforzada', fr: 'Caisson renforcé' },
      { pt: 'Frente igual à restante cozinha', en: 'Front matching the rest of the kitchen', es: 'Frente igual al resto de la cocina', fr: 'Façade identique au reste de la cuisine' }
    ]
  },
  {
    slug: 'movel-laser-clinica',
    servico: 'carpintaria',
    ano: 2025,
    titulo: { pt: 'Móvel de apoio à medida para máquina de laser', en: 'Bespoke support cabinet for a laser machine', es: 'Mueble de apoyo a medida para máquina láser', fr: 'Meuble d’appoint sur mesure pour machine laser' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    duracao: { pt: '1 semana', en: '1 week', es: '1 semana', fr: '1 semaine' },
    resumo: { pt: 'Móvel em pinho maciço feito à medida para uma clínica de laser e sobrancelhas, para assentar e arrumar a máquina de laser à altura de trabalho.', en: 'A solid-pine cabinet made to measure for a laser and brow clinic, to sit the laser machine at working height and store its supplies.', es: 'Mueble en pino macizo hecho a medida para una clínica de láser y cejas, para asentar la máquina láser a la altura de trabajo y guardar el material.', fr: 'Meuble en pin massif réalisé sur mesure pour une clinique laser et sourcils, pour poser la machine laser à hauteur de travail et ranger les consommables.' },
    capa: 'assets/img/obras/movel-laser-4x3.jpg',
    galeria: ['assets/img/obras/movel-laser.jpg'],
    desafio: { pt: 'A máquina de laser não tinha um sítio próprio — ocupava bancada e não havia onde arrumar os consumíveis. Precisava de uma base robusta, à altura certa junto à marquesa.', en: 'The laser machine had no home of its own — it took up bench space and there was nowhere for the supplies. It needed a sturdy base at the right height next to the treatment bed.', es: 'La máquina láser no tenía sitio propio — ocupaba encimera y no había dónde guardar el material. Necesitaba una base robusta, a la altura adecuada junto a la camilla.', fr: 'La machine laser n’avait pas de place attitrée — elle occupait le plan de travail et rien pour ranger les consommables. Il fallait un socle robuste, à bonne hauteur près de la table de soin.' },
    solucao: { pt: 'Móvel em pinho maciço dimensionado à máquina, com tampo reforçado para o peso, portas para arrumar o material de apoio e acabamento a condizer com o espaço.', en: 'A solid-pine cabinet sized to the machine, with a reinforced top for the weight, doors to store the supplies and a finish matching the room.', es: 'Mueble en pino macizo dimensionado a la máquina, con tablero reforzado para el peso, puertas para guardar el material y acabado a juego con el espacio.', fr: 'Meuble en pin massif dimensionné à la machine, plateau renforcé pour le poids, portes pour ranger le matériel et finition assortie à la pièce.' },
    resultado: { pt: 'A máquina passou a ter um lugar fixo, estável e à altura de trabalho, com os consumíveis arrumados por baixo.', en: 'The machine now has a fixed, stable place at working height, with the supplies stored underneath.', es: 'La máquina pasó a tener un sitio fijo, estable y a la altura de trabajo, con el material guardado debajo.', fr: 'La machine a désormais une place fixe, stable et à hauteur de travail, les consommables rangés en dessous.' },
    destaques: [
      { pt: 'Tampo reforçado para o peso da máquina', en: 'Reinforced top for the machine’s weight', es: 'Tablero reforzado para el peso de la máquina', fr: 'Plateau renforcé pour le poids de la machine' },
      { pt: 'Pinho maciço, à altura de trabalho', en: 'Solid pine, at working height', es: 'Pino macizo, a la altura de trabajo', fr: 'Pin massif, à hauteur de travail' },
      { pt: 'Portas para arrumar consumíveis', en: 'Doors to store supplies', es: 'Puertas para guardar el material', fr: 'Portes pour ranger les consommables' }
    ]
  }
];
