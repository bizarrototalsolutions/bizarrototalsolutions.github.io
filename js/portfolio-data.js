/* ============================================================
   Dizarro — portfolio-data.js
   FONTE ÚNICA dos trabalhos. Lida por portfolio.html, projeto.js e
   por tools/gen-seo.mjs (que gera as páginas estáticas obra-*.html).

   Campos de texto são objetos { pt, en, es, fr } e resolvem-se com
   window.i18n.pick(). Só descrevemos o que a foto mostra e o que foi
   mesmo feito — pequenos trabalhos, sem exageros.
   antesDepois.tall = true quando as fotos são verticais (3:4).
   ============================================================ */

(function () {
'use strict';
var O = 'assets/img/obras/';
var GP = { pt: 'Grande Porto', en: 'Greater Porto', es: 'Gran Oporto', fr: 'Grand Porto' };

window.PROJETOS = [
  {
    slug: 'tv-100-polegadas',
    servico: 'telecomunicacoes',
    titulo: { pt: 'Televisão de 100 polegadas montada na parede', en: '100-inch TV mounted on the wall', es: 'Televisor de 100 pulgadas montado en la pared', fr: 'Téléviseur de 100 pouces monté au mur' },
    local: GP,
    resumo: { pt: 'Televisão de 100 polegadas montada na parede e ligada, até ao ecrã de configuração.', en: 'A 100-inch TV mounted on the wall and connected, up to its setup screen.', es: 'Televisor de 100 pulgadas montado en la pared y conectado, hasta la pantalla de configuración.', fr: 'Téléviseur de 100 pouces monté au mur et branché, jusqu’à l’écran de configuration.' },
    capa: O + 'tv100-depois-4x3.jpg',
    antesDepois: { antes: O + 'tv100-antes.jpg', depois: O + 'tv100-depois.jpg', tall: true },
    galeria: [],
    desafio: { pt: 'Uma parede vazia e uma televisão de 100 polegadas por montar.', en: 'An empty wall and a 100-inch TV waiting to be mounted.', es: 'Una pared vacía y un televisor de 100 pulgadas por montar.', fr: 'Un mur vide et un téléviseur de 100 pouces à poser.' },
    solucao: { pt: 'Montámos a televisão na parede e ligámo-la, até ao ecrã de configuração.', en: 'We mounted the TV on the wall and connected it, up to the setup screen.', es: 'Montamos el televisor en la pared y lo conectamos, hasta la pantalla de configuración.', fr: 'Nous avons monté le téléviseur au mur et l’avons branché, jusqu’à l’écran de configuration.' },
    resultado: { pt: 'Televisão montada na parede e pronta a configurar.', en: 'The TV mounted on the wall and ready to set up.', es: 'Televisor montado en la pared y listo para configurar.', fr: 'Téléviseur monté au mur et prêt à configurer.' },
    destaques: [
      { pt: '100 polegadas', en: '100 inches', es: '100 pulgadas', fr: '100 pouces' },
      { pt: 'Montagem na parede', en: 'Wall mounting', es: 'Montaje en la pared', fr: 'Pose au mur' },
      { pt: 'Pronta a configurar', en: 'Ready to set up', es: 'Lista para configurar', fr: 'Prête à configurer' }
    ]
  },
  {
    slug: 'parede-tv-sala',
    servico: 'telecomunicacoes',
    titulo: { pt: 'Televisão fixa na parede', en: 'TV fixed to the wall', es: 'Televisor fijado a la pared', fr: 'Téléviseur fixé au mur' },
    local: GP,
    resumo: { pt: 'A televisão estava pousada em cima do móvel e passou para a parede.', en: 'The TV was standing on the unit and moved to the wall.', es: 'El televisor estaba apoyado sobre el mueble y pasó a la pared.', fr: 'Le téléviseur était posé sur le meuble et est passé au mur.' },
    capa: O + 'tv-depois-4x3.jpg',
    antesDepois: { antes: O + 'tv-antes.jpg', depois: O + 'tv-depois.jpg', tall: true },
    galeria: [],
    desafio: { pt: 'Televisão grande pousada em cima do móvel.', en: 'A large TV standing on the TV unit.', es: 'Un televisor grande apoyado sobre el mueble.', fr: 'Un grand téléviseur posé sur le meuble.' },
    solucao: { pt: 'Montámos a televisão num suporte fixo na parede.', en: 'We mounted the TV on a fixed wall bracket.', es: 'Montamos el televisor en un soporte fijo en la pared.', fr: 'Nous avons monté le téléviseur sur un support mural fixe.' },
    resultado: { pt: 'Televisão alinhada na parede, por cima do móvel.', en: 'The TV level on the wall, above the unit.', es: 'Televisor alineado en la pared, encima del mueble.', fr: 'Téléviseur bien aligné au mur, au-dessus du meuble.' },
    destaques: [
      { pt: 'Suporte fixo na parede', en: 'Fixed wall bracket', es: 'Soporte fijo en la pared', fr: 'Support mural fixe' },
      { pt: 'Televisão alinhada', en: 'TV level', es: 'Televisor alineado', fr: 'Téléviseur aligné' },
      { pt: 'Montagem no local', en: 'Fitted on site', es: 'Montaje in situ', fr: 'Pose sur place' }
    ]
  },
  {
    slug: 'cabos-secretaria',
    servico: 'telecomunicacoes',
    titulo: { pt: 'Cabos e secretária arrumados', en: 'Tidy cables and desk', es: 'Cables y escritorio ordenados', fr: 'Câbles et bureau rangés' },
    local: GP,
    resumo: { pt: 'De uma secretária com cabos soltos e papéis acumulados a um posto de trabalho arrumado.', en: 'From a desk with loose cables and piled-up papers to a tidy workstation.', es: 'De un escritorio con cables sueltos y papeles acumulados a un puesto de trabajo ordenado.', fr: 'D’un bureau aux câbles en vrac et papiers entassés à un poste de travail rangé.' },
    capa: O + 'cabos-depois-4x3.jpg',
    antesDepois: { antes: O + 'cabos-antes.jpg', depois: O + 'cabos-depois.jpg', tall: true },
    galeria: [],
    desafio: { pt: 'Secretária e prateleiras com cabos soltos e equipamento espalhado.', en: 'A desk and shelves with loose cables and equipment scattered about.', es: 'Escritorio y estantes con cables sueltos y equipos esparcidos.', fr: 'Bureau et étagères avec câbles en vrac et matériel éparpillé.' },
    solucao: { pt: 'Organizámos os cabos e o equipamento: computador, impressora e monitor na parede.', en: 'We organised the cables and equipment: computer, printer and a wall-mounted monitor.', es: 'Organizamos los cables y los equipos: ordenador, impresora y monitor en la pared.', fr: 'Nous avons organisé les câbles et le matériel : ordinateur, imprimante et écran au mur.' },
    resultado: { pt: 'Posto de trabalho arrumado e cabos organizados.', en: 'A tidy workstation with organised cables.', es: 'Puesto de trabajo ordenado y cables organizados.', fr: 'Poste de travail rangé et câbles organisés.' },
    destaques: [
      { pt: 'Cabos organizados', en: 'Organised cables', es: 'Cables organizados', fr: 'Câbles organisés' },
      { pt: 'Equipamento arrumado', en: 'Equipment tidied', es: 'Equipo ordenado', fr: 'Matériel rangé' },
      { pt: 'Monitor na parede', en: 'Wall-mounted monitor', es: 'Monitor en la pared', fr: 'Écran au mur' }
    ]
  },
  {
    slug: 'apliques-revestimento-metalico',
    servico: 'eletricidade',
    titulo: { pt: 'Aplique de parede numa fachada de chapa', en: 'Wall light on a metal-clad wall', es: 'Aplique de pared en una fachada de chapa', fr: 'Applique murale sur bardage métallique' },
    local: GP,
    resumo: { pt: 'Montagem de um aplique numa parede de chapa, do aplique com os fios à vista ao acabamento com a caixa fechada.', en: 'Fitting a wall light on a metal-clad wall, from the fitting with wires showing to the finished, closed housing.', es: 'Montaje de un aplique en una pared de chapa, del aplique con los cables a la vista al acabado con la caja cerrada.', fr: 'Pose d’une applique sur un bardage métallique, de l’applique aux fils apparents à la finition boîtier fermé.' },
    capa: O + 'luz-depois-4x3.jpg',
    antesDepois: { antes: O + 'luz-antes.jpg', depois: O + 'luz-depois.jpg', tall: true },
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
    slug: 'ventoinhas-teto',
    servico: 'eletricidade',
    titulo: { pt: 'Ventoinha de teto com luz', en: 'Ceiling fan with light', es: 'Ventilador de techo con luz', fr: 'Ventilateur de plafond avec lumière' },
    local: GP,
    resumo: { pt: 'Montagem de uma ventoinha de teto com luz.', en: 'Fitting a ceiling fan with light.', es: 'Montaje de un ventilador de techo con luz.', fr: 'Pose d’un ventilateur de plafond avec lumière.' },
    capa: O + 'ventoinha-4x3.jpg',
    galeria: [O + 'ventoinha.jpg'],
    desafio: { pt: 'Substituir um ponto de luz por uma ventoinha com luz.', en: 'Replacing a light point with a fan that includes a light.', es: 'Sustituir un punto de luz por un ventilador con luz.', fr: 'Remplacer un point lumineux par un ventilateur avec lumière.' },
    solucao: { pt: 'Montámos a ventoinha, ligámos a luz e fizemos o teste final.', en: 'We fitted the fan, connected the light and did a final test.', es: 'Montamos el ventilador, conectamos la luz e hicimos la prueba final.', fr: 'Nous avons posé le ventilateur, branché la lumière et fait le test final.' },
    resultado: { pt: 'Ventilação e luz no mesmo ponto.', en: 'Ventilation and light at the same point.', es: 'Ventilación y luz en el mismo punto.', fr: 'Ventilation et lumière au même point.' },
    destaques: [
      { pt: 'Montagem nivelada', en: 'Level mounting', es: 'Montaje nivelado', fr: 'Pose de niveau' },
      { pt: 'Luz integrada', en: 'Integrated light', es: 'Luz integrada', fr: 'Lumière intégrée' },
      { pt: 'Teste final', en: 'Final test', es: 'Prueba final', fr: 'Test final' }
    ]
  },
  {
    slug: 'pintura-caixilharia-branco',
    servico: 'pinturas',
    titulo: { pt: 'Janela pintada de castanho para branco', en: 'Window painted from brown to white', es: 'Ventana pintada de marrón a blanco', fr: 'Fenêtre peinte du marron au blanc' },
    local: GP,
    resumo: { pt: 'A janela tinha a caixilharia castanha e foi pintada de branco, a condizer com o interior.', en: 'The window had a brown frame and was painted white, to match the interior.', es: 'La ventana tenía la carpintería marrón y se pintó de blanco, a juego con el interior.', fr: 'La fenêtre avait une menuiserie marron et a été peinte en blanc, assortie à l’intérieur.' },
    capa: O + 'janela-depois-4x3.jpg',
    antesDepois: { antes: O + 'janela-antes.jpg', depois: O + 'janela-depois.jpg', tall: true },
    galeria: [],
    desafio: { pt: 'Caixilharia de madeira castanha a destoar do interior claro.', en: 'A brown wooden frame clashing with the light interior.', es: 'Carpintería de madera marrón desentonando con el interior claro.', fr: 'Menuiserie en bois marron en décalage avec l’intérieur clair.' },
    solucao: { pt: 'Lixámos e preparámos a caixilharia e pintámo-la de branco.', en: 'We sanded and prepped the frame and painted it white.', es: 'Lijamos y preparamos la carpintería y la pintamos de blanco.', fr: 'Nous avons poncé et préparé la menuiserie et l’avons peinte en blanc.' },
    resultado: { pt: 'Janela branca a condizer com o interior, sem trocar a caixilharia.', en: 'A white window matching the interior, without replacing the frame.', es: 'Ventana blanca a juego con el interior, sin cambiar la carpintería.', fr: 'Fenêtre blanche assortie à l’intérieur, sans remplacer la menuiserie.' },
    destaques: [
      { pt: 'Lixagem e preparação', en: 'Sanding and prep', es: 'Lijado y preparación', fr: 'Ponçage et préparation' },
      { pt: 'Pintura branca', en: 'White paint', es: 'Pintura blanca', fr: 'Peinture blanche' },
      { pt: 'Sem trocar a janela', en: 'No need to replace the window', es: 'Sin cambiar la ventana', fr: 'Sans remplacer la fenêtre' }
    ]
  },
  {
    slug: 'prateleiras-sala',
    servico: 'carpintaria',
    titulo: { pt: 'Prateleiras e televisão fixadas numa sala', en: 'Shelves and TV fixed in a living room', es: 'Estantes y televisor fijados en un salón', fr: 'Étagères et téléviseur fixés dans un salon' },
    local: GP,
    resumo: { pt: 'Fixação de prateleiras e da televisão numa sala com lareira de pedra.', en: 'Fixing shelves and the TV in a living room with a stone fireplace.', es: 'Fijación de estantes y del televisor en un salón con chimenea de piedra.', fr: 'Fixation d’étagères et du téléviseur dans un salon avec cheminée en pierre.' },
    capa: O + 'sala-depois-4x3.jpg',
    antesDepois: { antes: O + 'sala-antes.jpg', depois: O + 'sala-depois.jpg', tall: false },
    galeria: [],
    desafio: { pt: 'Sala com as paredes laterais vazias e a televisão pousada no móvel.', en: 'A living room with empty side walls and the TV standing on the unit.', es: 'Salón con las paredes laterales vacías y el televisor apoyado en el mueble.', fr: 'Salon aux murs latéraux vides et téléviseur posé sur le meuble.' },
    solucao: { pt: 'Fixámos prateleiras na parede, de cada lado da lareira, e fixámos a televisão.', en: 'We fixed shelves to the wall on each side of the fireplace, and fixed the TV.', es: 'Fijamos estantes a la pared, a cada lado de la chimenea, y fijamos el televisor.', fr: 'Nous avons fixé des étagères au mur, de chaque côté de la cheminée, et fixé le téléviseur.' },
    resultado: { pt: 'Sala mais arrumada, com prateleiras para decoração.', en: 'A tidier room, with shelves for decoration.', es: 'Salón más ordenado, con estantes para decoración.', fr: 'Salon plus rangé, avec des étagères pour la décoration.' },
    destaques: [
      { pt: 'Prateleiras fixadas na parede', en: 'Shelves fixed to the wall', es: 'Estantes fijados a la pared', fr: 'Étagères fixées au mur' },
      { pt: 'Televisão fixada', en: 'TV fixed', es: 'Televisor fijado', fr: 'Téléviseur fixé' },
      { pt: 'Fixação feita no local', en: 'Fitted on site', es: 'Fijación in situ', fr: 'Fixation sur place' }
    ]
  },
  {
    slug: 'carro-infantil',
    servico: 'carpintaria',
    titulo: { pt: 'Montagem de um carro infantil', en: 'Assembling a children’s ride-on car', es: 'Montaje de un coche infantil', fr: 'Montage d’une voiture pour enfant' },
    local: GP,
    resumo: { pt: 'Carro infantil montado a partir das peças e dos plásticos espalhados no chão.', en: 'A children’s ride-on car assembled from the parts and packaging spread on the floor.', es: 'Coche infantil montado a partir de las piezas y los plásticos esparcidos por el suelo.', fr: 'Voiture pour enfant montée à partir des pièces et emballages éparpillés au sol.' },
    capa: O + 'carro-depois-4x3.jpg',
    antesDepois: { antes: O + 'carro-antes.jpg', depois: O + 'carro-depois.jpg', tall: true },
    galeria: [],
    desafio: { pt: 'Um carro infantil por montar, com as peças e as instruções espalhadas no chão.', en: 'A children’s car to assemble, with the parts and instructions spread on the floor.', es: 'Un coche infantil por montar, con las piezas y las instrucciones esparcidas por el suelo.', fr: 'Une voiture pour enfant à monter, avec pièces et notice éparpillées au sol.' },
    solucao: { pt: 'Montámos o carro peça a peça, seguindo as instruções.', en: 'We assembled the car piece by piece, following the instructions.', es: 'Montamos el coche pieza a pieza, siguiendo las instrucciones.', fr: 'Nous avons monté la voiture pièce par pièce, en suivant la notice.' },
    resultado: { pt: 'Carro montado e pronto a usar.', en: 'The car assembled and ready to use.', es: 'Coche montado y listo para usar.', fr: 'Voiture montée et prête à l’emploi.' },
    destaques: [
      { pt: 'Montagem completa', en: 'Fully assembled', es: 'Montaje completo', fr: 'Montage complet' },
      { pt: 'Seguindo as instruções', en: 'Following the instructions', es: 'Siguiendo las instrucciones', fr: 'Selon la notice' },
      { pt: 'Pronto a usar', en: 'Ready to use', es: 'Listo para usar', fr: 'Prêt à l’emploi' }
    ]
  },
  {
    slug: 'exaustor-novo',
    servico: 'carpintaria',
    titulo: { pt: 'Exaustor novo montado num armário de cozinha', en: 'New extractor fitted in a kitchen cabinet', es: 'Extractor nuevo montado en un armario de cocina', fr: 'Nouvelle hotte posée dans un meuble de cuisine' },
    local: GP,
    resumo: { pt: 'Exaustor novo montado dentro de um armário de cozinha, com o tubo de saída.', en: 'A new extractor fitted inside a kitchen cabinet, with its outlet duct.', es: 'Extractor nuevo montado dentro de un armario de cocina, con su tubo de salida.', fr: 'Nouvelle hotte posée dans un meuble de cuisine, avec son conduit de sortie.' },
    capa: O + 'exaustor-4x3.jpg',
    galeria: [O + 'exaustor.jpg'],
    desafio: { pt: 'Montar um exaustor novo dentro do armário da cozinha.', en: 'Fitting a new extractor inside the kitchen cabinet.', es: 'Montar un extractor nuevo dentro del armario de la cocina.', fr: 'Poser une nouvelle hotte dans le meuble de la cuisine.' },
    solucao: { pt: 'Montámos o exaustor, ligámos a alimentação e encaminhámos o tubo.', en: 'We fitted the extractor, connected the power and routed the duct.', es: 'Montamos el extractor, conectamos la alimentación y encaminamos el tubo.', fr: 'Nous avons posé la hotte, branché l’alimentation et acheminé le conduit.' },
    resultado: { pt: 'Exaustor montado e pronto a usar.', en: 'The extractor fitted and ready to use.', es: 'Extractor montado y listo para usar.', fr: 'Hotte posée et prête à l’emploi.' },
    destaques: [
      { pt: 'Exaustor novo', en: 'New extractor', es: 'Extractor nuevo', fr: 'Nouvelle hotte' },
      { pt: 'Tubo encaminhado', en: 'Duct routed', es: 'Tubo encaminado', fr: 'Conduit acheminé' },
      { pt: 'Ligação feita', en: 'Connection made', es: 'Conexión hecha', fr: 'Raccordement fait' }
    ]
  },
  {
    slug: 'baloico-rede',
    servico: 'carpintaria',
    titulo: { pt: 'Baloiço de rede fixado numa varanda', en: 'Hammock chair fixed on a balcony', es: 'Hamaca colgante fijada en un balcón', fr: 'Fauteuil hamac fixé sur un balcon' },
    local: GP,
    resumo: { pt: 'Fixação de um baloiço de rede numa varanda fechada.', en: 'Fixing a hammock chair in an enclosed balcony.', es: 'Fijación de una hamaca colgante en un balcón cerrado.', fr: 'Fixation d’un fauteuil hamac sur un balcon fermé.' },
    capa: O + 'baloico-4x3.jpg',
    galeria: [O + 'baloico.jpg'],
    desafio: { pt: 'Pendurar um baloiço de rede com segurança.', en: 'Hanging a hammock chair safely.', es: 'Colgar una hamaca de forma segura.', fr: 'Suspendre un fauteuil hamac en toute sécurité.' },
    solucao: { pt: 'Fixámos o suporte e pendurámos o baloiço.', en: 'We fixed the bracket and hung the chair.', es: 'Fijamos el soporte y colgamos la hamaca.', fr: 'Nous avons fixé le support et suspendu le fauteuil.' },
    resultado: { pt: 'Baloiço de rede pronto a usar.', en: 'The hammock chair ready to use.', es: 'Hamaca lista para usar.', fr: 'Fauteuil hamac prêt à l’emploi.' },
    destaques: [
      { pt: 'Fixação feita no local', en: 'Fitted on site', es: 'Fijación in situ', fr: 'Fixation sur place' },
      { pt: 'Pronto a usar', en: 'Ready to use', es: 'Listo para usar', fr: 'Prêt à l’emploi' }
    ]
  },
  {
    slug: 'movel-laser-clinica',
    servico: 'carpintaria',
    titulo: { pt: 'Móvel à medida para uma máquina de laser', en: 'Made-to-measure cabinet for a laser machine', es: 'Mueble a medida para una máquina láser', fr: 'Meuble sur mesure pour une machine laser' },
    local: GP,
    resumo: { pt: 'Móvel em pinho feito para apoiar a máquina de laser de uma clínica.', en: 'A pine cabinet made to support a clinic’s laser machine.', es: 'Mueble en pino hecho para apoyar la máquina láser de una clínica.', fr: 'Meuble en pin conçu pour accueillir la machine laser d’une clinique.' },
    capa: O + 'movel-4x3.jpg',
    galeria: [O + 'movel.jpg'],
    desafio: { pt: 'A máquina de laser não tinha um sítio próprio.', en: 'The laser machine had no place of its own.', es: 'La máquina láser no tenía un sitio propio.', fr: 'La machine laser n’avait pas de place attitrée.' },
    solucao: { pt: 'Móvel em pinho, com tampo para a máquina e portas para o material.', en: 'A pine cabinet, with a top for the machine and doors for the supplies.', es: 'Mueble en pino, con tablero para la máquina y puertas para el material.', fr: 'Meuble en pin, avec plateau pour la machine et portes pour le matériel.' },
    resultado: { pt: 'A máquina tem um lugar fixo e o material fica arrumado por baixo.', en: 'The machine has a fixed place and the supplies are stored underneath.', es: 'La máquina tiene un sitio fijo y el material queda guardado debajo.', fr: 'La machine a une place fixe et le matériel est rangé en dessous.' },
    destaques: [
      { pt: 'Pinho', en: 'Pine', es: 'Pino', fr: 'Pin' },
      { pt: 'À medida da máquina', en: 'Made to fit the machine', es: 'A medida de la máquina', fr: 'Sur mesure pour la machine' },
      { pt: 'Portas para arrumar', en: 'Doors for storage', es: 'Puertas para guardar', fr: 'Portes de rangement' }
    ]
  }
];
})();
