/* ============================================================
   Dizarro — portfolio-data.js
   FONTE ÚNICA dos trabalhos. Lida por portfolio.html, projeto.js e
   por tools/gen-obras.mjs (que gera as páginas estáticas obra-*.html).

   Campos de texto são objetos { pt, en, es, fr } e resolvem-se com
   window.i18n.pick(). Só descrevemos o que a foto mostra e o que foi
   mesmo feito — pequenos trabalhos, sem exageros.
   ============================================================ */

window.PROJETOS = [
  {
    slug: 'parede-tv-sala',
    servico: 'telecomunicacoes',
    ano: 2025,
    titulo: { pt: 'Televisão na parede, com os cabos escondidos', en: 'TV on the wall, with hidden cables', es: 'Televisor en la pared, con los cables ocultos', fr: 'Téléviseur au mur, câbles cachés' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    resumo: { pt: 'A televisão estava em cima do móvel e passou para a parede, com os cabos escondidos.', en: 'The TV was on the sideboard and moved to the wall, with the cables hidden.', es: 'El televisor estaba sobre el mueble y pasó a la pared, con los cables ocultos.', fr: 'Le téléviseur était posé sur le meuble et est passé au mur, câbles cachés.' },
    capa: 'assets/img/obras/tv-parede-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/tv-parede-antes-4x3.jpg', depois: 'assets/img/obras/tv-parede-4x3.jpg' },
    galeria: ['assets/img/obras/tv-parede.jpg'],
    desafio: { pt: 'Televisão grande em cima do aparador, com os cabos à vista.', en: 'A large TV on the sideboard, with the cables on show.', es: 'Un televisor grande sobre el aparador, con los cables a la vista.', fr: 'Un grand téléviseur sur le buffet, câbles apparents.' },
    solucao: { pt: 'Montámos a televisão num suporte fixo na parede e escondemos os cabos.', en: 'We mounted the TV on a fixed wall bracket and hid the cables.', es: 'Montamos el televisor en un soporte fijo en la pared y ocultamos los cables.', fr: 'Nous avons fixé le téléviseur sur un support mural et caché les câbles.' },
    resultado: { pt: 'Televisão alinhada na parede e o aparador livre.', en: 'The TV level on the wall and the sideboard freed up.', es: 'Televisor alineado en la pared y el aparador libre.', fr: 'Téléviseur bien aligné au mur et buffet dégagé.' },
    destaques: [
      { pt: 'Suporte fixo na parede', en: 'Fixed wall bracket', es: 'Soporte fijo en la pared', fr: 'Support mural fixe' },
      { pt: 'Cabos escondidos', en: 'Hidden cables', es: 'Cables ocultos', fr: 'Câbles cachés' },
      { pt: 'Aparador livre', en: 'Sideboard freed up', es: 'Aparador libre', fr: 'Buffet dégagé' }
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
    titulo: { pt: 'Rede arrumada num escritório', en: 'Network tidied up in an office', es: 'Red ordenada en una oficina', fr: 'Réseau rangé dans un bureau' },
    local: { pt: 'Porto', en: 'Porto', es: 'Oporto', fr: 'Porto' },
    resumo: { pt: 'Cabos e routers arrumados e um ponto de acesso Wi-Fi montado.', en: 'Cables and routers tidied up and a Wi-Fi access point mounted.', es: 'Cables y routers ordenados y un punto de acceso Wi-Fi montado.', fr: 'Câbles et routeurs rangés et un point d’accès Wi-Fi monté.' },
    capa: 'assets/img/obras/rede-depois-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/rede-antes-4x3.jpg', depois: 'assets/img/obras/rede-depois-4x3.jpg' },
    galeria: ['assets/img/obras/rede-antes-b.jpg', 'assets/img/obras/bastidor-a.jpg', 'assets/img/obras/bastidor-b.jpg', 'assets/img/obras/bastidor-cabos.jpg', 'assets/img/obras/rede-depois.jpg'],
    desafio: { pt: 'Routers e fontes de alimentação empilhados debaixo da secretária e cabos soltos.', en: 'Routers and power supplies piled up under the desk and loose cables.', es: 'Routers y fuentes de alimentación apilados bajo el escritorio y cables sueltos.', fr: 'Routeurs et alimentations entassés sous le bureau et câbles en vrac.' },
    solucao: { pt: 'Arrumámos os cabos, montámos um ponto de acesso Wi-Fi e organizámos o equipamento.', en: 'We tidied the cables, mounted a Wi-Fi access point and organised the equipment.', es: 'Ordenamos los cables, montamos un punto de acceso Wi-Fi y organizamos los equipos.', fr: 'Nous avons rangé les câbles, monté un point d’accès Wi-Fi et organisé le matériel.' },
    resultado: { pt: 'Cabos arrumados e o equipamento organizado.', en: 'Cables tidy and the equipment organised.', es: 'Cables ordenados y el equipo organizado.', fr: 'Câbles rangés et matériel organisé.' },
    destaques: [
      { pt: 'Cabos arrumados', en: 'Tidy cables', es: 'Cables ordenados', fr: 'Câbles rangés' },
      { pt: 'Ponto de acesso Wi-Fi montado', en: 'Wi-Fi access point mounted', es: 'Punto de acceso Wi-Fi montado', fr: 'Point d’accès Wi-Fi monté' },
      { pt: 'Equipamento organizado', en: 'Equipment organised', es: 'Equipo organizado', fr: 'Matériel organisé' }
    ]
  },
  {
    slug: 'tv-config-cenarios',
    servico: 'telecomunicacoes',
    ano: 2025,
    titulo: { pt: 'Televisão montada e configurada', en: 'TV mounted and set up', es: 'Televisor montado y configurado', fr: 'Téléviseur monté et configuré' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    resumo: { pt: 'Televisão montada na parede e configurada no local (rede, contas e imagem).', en: 'TV mounted on the wall and set up on site (network, accounts and picture).', es: 'Televisor montado en la pared y configurado in situ (red, cuentas e imagen).', fr: 'Téléviseur monté au mur et configuré sur place (réseau, comptes et image).' },
    capa: 'assets/img/obras/tv-config-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/sala-embutidos-4x3.jpg', depois: 'assets/img/obras/tv-config-4x3.jpg' },
    galeria: ['assets/img/obras/sala-embutidos.jpg', 'assets/img/obras/tv-config.jpg'],
    desafio: { pt: 'Televisão nova por montar e configurar, numa sala com a parede já preparada.', en: 'A new TV to mount and set up, in a living room with the wall already prepared.', es: 'Un televisor nuevo por montar y configurar, en un salón con la pared ya preparada.', fr: 'Un nouveau téléviseur à poser et à configurer, dans un salon au mur déjà préparé.' },
    solucao: { pt: 'Montámos o suporte, ligámos a televisão e fizemos a primeira configuração no local.', en: 'We fitted the bracket, connected the TV and did the first-time setup on site.', es: 'Montamos el soporte, conectamos el televisor e hicimos la primera configuración in situ.', fr: 'Nous avons posé le support, branché le téléviseur et fait la première configuration sur place.' },
    resultado: { pt: 'Televisão pronta a usar no próprio dia.', en: 'The TV ready to use the same day.', es: 'Televisor listo para usar el mismo día.', fr: 'Téléviseur prêt à l’emploi le jour même.' },
    destaques: [
      { pt: 'Montagem na parede', en: 'Wall mounting', es: 'Montaje en la pared', fr: 'Pose au mur' },
      { pt: 'Primeira configuração no local', en: 'First-time setup on site', es: 'Primera configuración in situ', fr: 'Première configuration sur place' },
      { pt: 'Pronta a usar', en: 'Ready to use', es: 'Lista para usar', fr: 'Prête à l’emploi' }
    ]
  },
  {
    slug: 'apliques-revestimento-metalico',
    servico: 'eletricidade',
    ano: 2025,
    titulo: { pt: 'Aplique de parede numa fachada de chapa', en: 'Wall light on a metal-clad wall', es: 'Aplique de pared en una fachada de chapa', fr: 'Applique murale sur bardage métallique' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    resumo: { pt: 'Montagem de um aplique numa parede de chapa, do aplique com os fios à vista ao acabamento com a caixa fechada.', en: 'Fitting a wall light on a metal-clad wall, from the fitting with wires showing to the finished, closed housing.', es: 'Montaje de un aplique en una pared de chapa, del aplique con los cables a la vista al acabado con la caja cerrada.', fr: 'Pose d’une applique sur un bardage métallique, de l’applique aux fils apparents à la finition boîtier fermé.' },
    capa: 'assets/img/obras/luz-parede-b-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/luz-parede-a-4x3.jpg', depois: 'assets/img/obras/luz-parede-b-4x3.jpg' },
    galeria: [],
    desafio: { pt: 'Fixar e ligar um aplique numa parede de chapa ondulada.', en: 'Fixing and wiring a wall light on corrugated metal cladding.', es: 'Fijar y conectar un aplique en una pared de chapa ondulada.', fr: 'Fixer et raccorder une applique sur un bardage métallique ondulé.' },
    solucao: { pt: 'Fixámos o aplique, fizemos a ligação e fechámos a caixa.', en: 'We fixed the light, made the connection and closed the housing.', es: 'Fijamos el aplique, hicimos la conexión y cerramos la caja.', fr: 'Nous avons fixé l’applique, fait le raccordement et fermé le boîtier.' },
    resultado: { pt: 'Aplique aceso, com a caixa fechada e sem fios à vista.', en: 'The light on, with the housing closed and no wires showing.', es: 'Aplique encendido, con la caja cerrada y sin cables a la vista.', fr: 'Applique allumée, boîtier fermé et sans fils apparents.' },
    destaques: [
      { pt: 'Fixação na chapa', en: 'Fixed to the cladding', es: 'Fijación en la chapa', fr: 'Fixation sur le bardage' },
      { pt: 'Ligação feita', en: 'Connection made', es: 'Conexión hecha', fr: 'Raccordement fait' },
      { pt: 'Caixa fechada', en: 'Housing closed', es: 'Caja cerrada', fr: 'Boîtier fermé' }
    ]
  },
  {
    slug: 'pintura-caixilharia-branco',
    servico: 'pinturas',
    ano: 2025,
    titulo: { pt: 'Janelas pintadas de castanho para branco', en: 'Windows painted from brown to white', es: 'Ventanas pintadas de marrón a blanco', fr: 'Fenêtres peintes du marron au blanc' },
    local: { pt: 'Matosinhos, Porto', en: 'Matosinhos, Porto', es: 'Matosinhos, Oporto', fr: 'Matosinhos, Porto' },
    resumo: { pt: 'As janelas eram castanhas e foram pintadas de branco, a condizer com o interior.', en: 'The windows were brown and were painted white, to match the interior.', es: 'Las ventanas eran marrones y se pintaron de blanco, a juego con el interior.', fr: 'Les fenêtres étaient marron et ont été peintes en blanc, assorties à l’intérieur.' },
    capa: 'assets/img/obras/janela-vista-b-4x3.jpg',
    antesDepois: { antes: 'assets/img/obras/janela-vista-a-4x3.jpg', depois: 'assets/img/obras/janela-diogo-4x3.jpg' },
    galeria: ['assets/img/obras/janela-vista-b.jpg'],
    desafio: { pt: 'Janelas de madeira castanha a destoar do interior claro.', en: 'Brown wooden windows clashing with the light interior.', es: 'Ventanas de madera marrón desentonando con el interior claro.', fr: 'Fenêtres en bois marron en décalage avec l’intérieur clair.' },
    solucao: { pt: 'Lixámos e preparámos a caixilharia e pintámo-la de branco.', en: 'We sanded and prepped the frames and painted them white.', es: 'Lijamos y preparamos la carpintería y la pintamos de blanco.', fr: 'Nous avons poncé et préparé les menuiseries et les avons peintes en blanc.' },
    resultado: { pt: 'Janelas brancas a condizer com o interior, sem trocar a caixilharia.', en: 'White windows matching the interior, without replacing the frames.', es: 'Ventanas blancas a juego con el interior, sin cambiar la carpintería.', fr: 'Fenêtres blanches assorties à l’intérieur, sans remplacer les menuiseries.' },
    destaques: [
      { pt: 'Lixagem e preparação', en: 'Sanding and prep', es: 'Lijado y preparación', fr: 'Ponçage et préparation' },
      { pt: 'Pintura branca', en: 'White paint', es: 'Pintura blanca', fr: 'Peinture blanche' },
      { pt: 'Sem trocar as janelas', en: 'No need to replace the windows', es: 'Sin cambiar las ventanas', fr: 'Sans remplacer les fenêtres' }
    ]
  },
  {
    slug: 'sapateira-hall',
    servico: 'carpintaria',
    ano: 2025,
    titulo: { pt: 'Sapateira no hall de entrada', en: 'Shoe cabinet in the entrance hall', es: 'Zapatero en el recibidor', fr: 'Meuble à chaussures dans l’entrée' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    resumo: { pt: 'Sapateira branca no hall, junto ao aquecedor, sem tapar a passagem.', en: 'A white shoe cabinet in the hall, next to the radiator, without blocking the way.', es: 'Zapatero blanco en el recibidor, junto al radiador, sin tapar el paso.', fr: 'Meuble à chaussures blanc dans l’entrée, près du radiateur, sans gêner le passage.' },
    capa: 'assets/img/obras/sapateira-4x3.jpg',
    galeria: ['assets/img/obras/sapateira.jpg'],
    desafio: { pt: 'Hall estreito, sem sítio para os sapatos.', en: 'A narrow hall with nowhere for shoes.', es: 'Recibidor estrecho, sin sitio para los zapatos.', fr: 'Entrée étroite, sans place pour les chaussures.' },
    solucao: { pt: 'Sapateira estreita, branca, de portas basculantes, encostada à parede.', en: 'A slim white shoe cabinet with tilting doors, against the wall.', es: 'Zapatero estrecho, blanco, de puertas abatibles, pegado a la pared.', fr: 'Meuble à chaussures étroit, blanc, à portes basculantes, contre le mur.' },
    resultado: { pt: 'Sapatos arrumados à entrada e o corredor livre.', en: 'Shoes stored at the door and the hallway kept clear.', es: 'Zapatos guardados en la entrada y el pasillo libre.', fr: 'Chaussures rangées à l’entrée et couloir dégagé.' },
    destaques: [
      { pt: 'Portas basculantes', en: 'Tilting doors', es: 'Puertas abatibles', fr: 'Portes basculantes' },
      { pt: 'Estreita', en: 'Slim', es: 'Estrecho', fr: 'Étroit' },
      { pt: 'Branca', en: 'White', es: 'Blanco', fr: 'Blanc' }
    ]
  },
  {
    slug: 'secretaria-medida',
    servico: 'carpintaria',
    ano: 2025,
    titulo: { pt: 'Secretária com gaveteiro', en: 'Desk with drawer unit', es: 'Escritorio con cajonera', fr: 'Bureau avec caisson' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    resumo: { pt: 'Secretária branca com gaveteiro, no espaço entre a parede e o radiador.', en: 'A white desk with a drawer unit, in the gap between the wall and the radiator.', es: 'Escritorio blanco con cajonera, en el hueco entre la pared y el radiador.', fr: 'Bureau blanc avec caisson, dans l’espace entre le mur et le radiateur.' },
    capa: 'assets/img/obras/secretaria-4x3.jpg',
    galeria: ['assets/img/obras/secretaria.jpg'],
    desafio: { pt: 'Aproveitar o espaço entre a parede e o aquecedor para trabalhar.', en: 'Making use of the space between the wall and the radiator for a workstation.', es: 'Aprovechar el espacio entre la pared y el radiador para trabajar.', fr: 'Exploiter l’espace entre le mur et le radiateur pour travailler.' },
    solucao: { pt: 'Secretária branca com gaveteiro e um módulo de apoio, ajustada ao espaço.', en: 'A white desk with a drawer unit and a side module, fitted to the space.', es: 'Escritorio blanco con cajonera y un módulo de apoyo, ajustado al espacio.', fr: 'Bureau blanc avec caisson et module d’appoint, ajusté à l’espace.' },
    resultado: { pt: 'Um posto de trabalho arrumado onde antes era espaço vazio.', en: 'A tidy workstation where there used to be empty space.', es: 'Un puesto de trabajo ordenado donde antes había espacio vacío.', fr: 'Un poste de travail rangé là où il n’y avait qu’un espace vide.' },
    destaques: [
      { pt: 'Ajustada ao espaço', en: 'Fitted to the space', es: 'Ajustado al espacio', fr: 'Ajusté à l’espace' },
      { pt: 'Gaveteiro', en: 'Drawer unit', es: 'Cajonera', fr: 'Caisson' },
      { pt: 'Módulo de apoio', en: 'Side module', es: 'Módulo de apoyo', fr: 'Module d’appoint' }
    ]
  },
  {
    slug: 'ventoinhas-teto',
    servico: 'eletricidade',
    ano: 2025,
    titulo: { pt: 'Ventoinhas de teto com luz', en: 'Ceiling fans with light', es: 'Ventiladores de techo con luz', fr: 'Ventilateurs de plafond avec lumière' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    resumo: { pt: 'Montagem de ventoinhas de teto com luz.', en: 'Fitting ceiling fans with light.', es: 'Montaje de ventiladores de techo con luz.', fr: 'Pose de ventilateurs de plafond avec lumière.' },
    capa: 'assets/img/obras/ventoinha-teto-b-4x3.jpg',
    galeria: ['assets/img/obras/ventoinha-teto.jpg', 'assets/img/obras/ventoinha-teto-b.jpg'],
    desafio: { pt: 'Substituir pontos de luz por ventoinhas com luz.', en: 'Replacing light points with fans that include a light.', es: 'Sustituir puntos de luz por ventiladores con luz.', fr: 'Remplacer des points lumineux par des ventilateurs avec lumière.' },
    solucao: { pt: 'Montámos as ventoinhas, ligámos a luz e fizemos o teste final.', en: 'We fitted the fans, connected the light and did a final test.', es: 'Montamos los ventiladores, conectamos la luz e hicimos la prueba final.', fr: 'Nous avons posé les ventilateurs, branché la lumière et fait le test final.' },
    resultado: { pt: 'Ventilação e luz no mesmo ponto.', en: 'Ventilation and light at the same point.', es: 'Ventilación y luz en el mismo punto.', fr: 'Ventilation et lumière au même point.' },
    destaques: [
      { pt: 'Montagem nivelada', en: 'Level mounting', es: 'Montaje nivelado', fr: 'Pose de niveau' },
      { pt: 'Luz integrada', en: 'Integrated light', es: 'Luz integrada', fr: 'Lumière intégrée' },
      { pt: 'Teste final', en: 'Final test', es: 'Prueba final', fr: 'Test final' }
    ]
  },
  {
    slug: 'armario-cozinha-exaustor',
    servico: 'carpintaria',
    ano: 2025,
    titulo: { pt: 'Armário de cozinha ajustado ao exaustor', en: 'Kitchen cabinet adjusted for the extractor', es: 'Armario de cocina ajustado al extractor', fr: 'Meuble de cuisine ajusté à la hotte' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    resumo: { pt: 'Armário superior ajustado para dar passagem ao tubo do exaustor.', en: 'An upper cabinet adjusted to let the extractor duct through.', es: 'Armario superior ajustado para dar paso al conducto del extractor.', fr: 'Meuble haut ajusté pour laisser passer le conduit de la hotte.' },
    capa: 'assets/img/obras/cozinha-armario-4x3.jpg',
    galeria: ['assets/img/obras/cozinha-armario.jpg'],
    desafio: { pt: 'O tubo do exaustor tinha de passar pelo armário superior.', en: 'The extractor duct had to pass through the upper cabinet.', es: 'El conducto del extractor tenía que pasar por el armario superior.', fr: 'Le conduit de la hotte devait passer par le meuble haut.' },
    solucao: { pt: 'Fizemos o recorte no armário para o tubo e mantivemos a frente igual.', en: 'We cut the opening in the cabinet for the duct and kept the front unchanged.', es: 'Hicimos el recorte en el armario para el conducto y mantuvimos el frente igual.', fr: 'Nous avons découpé le meuble pour le conduit et gardé la façade identique.' },
    resultado: { pt: 'Tubo escondido dentro do armário.', en: 'The duct hidden inside the cabinet.', es: 'Conducto escondido dentro del armario.', fr: 'Conduit caché dans le meuble.' },
    destaques: [
      { pt: 'Recorte para o tubo', en: 'Cut-out for the duct', es: 'Recorte para el conducto', fr: 'Découpe pour le conduit' },
      { pt: 'Frente igual', en: 'Front unchanged', es: 'Frente igual', fr: 'Façade identique' },
      { pt: 'Tubo escondido', en: 'Duct hidden', es: 'Conducto oculto', fr: 'Conduit caché' }
    ]
  },
  {
    slug: 'movel-laser-clinica',
    servico: 'carpintaria',
    ano: 2025,
    titulo: { pt: 'Móvel de apoio para máquina de laser', en: 'Support cabinet for a laser machine', es: 'Mueble de apoyo para máquina láser', fr: 'Meuble d’appoint pour machine laser' },
    local: { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' },
    resumo: { pt: 'Móvel em pinho para apoiar a máquina de laser de uma clínica, à altura de trabalho.', en: 'A pine cabinet to support a clinic’s laser machine at working height.', es: 'Mueble en pino para apoyar la máquina láser de una clínica, a la altura de trabajo.', fr: 'Meuble en pin pour poser la machine laser d’une clinique à hauteur de travail.' },
    capa: 'assets/img/obras/movel-laser-4x3.jpg',
    galeria: ['assets/img/obras/movel-laser.jpg'],
    desafio: { pt: 'A máquina de laser não tinha um sítio próprio.', en: 'The laser machine had no place of its own.', es: 'La máquina láser no tenía un sitio propio.', fr: 'La machine laser n’avait pas de place attitrée.' },
    solucao: { pt: 'Móvel em pinho, com tampo para a máquina e portas para o material.', en: 'A pine cabinet, with a top for the machine and doors for the supplies.', es: 'Mueble en pino, con tablero para la máquina y puertas para el material.', fr: 'Meuble en pin, avec plateau pour la machine et portes pour le matériel.' },
    resultado: { pt: 'A máquina tem um lugar fixo e o material fica arrumado por baixo.', en: 'The machine has a fixed place and the supplies are stored underneath.', es: 'La máquina tiene un sitio fijo y el material queda guardado debajo.', fr: 'La machine a une place fixe et le matériel est rangé en dessous.' },
    destaques: [
      { pt: 'Pinho', en: 'Pine', es: 'Pino', fr: 'Pin' },
      { pt: 'À altura de trabalho', en: 'At working height', es: 'A la altura de trabajo', fr: 'À hauteur de travail' },
      { pt: 'Portas para arrumar', en: 'Doors for storage', es: 'Puertas para guardar', fr: 'Portes de rangement' }
    ]
  }
];
