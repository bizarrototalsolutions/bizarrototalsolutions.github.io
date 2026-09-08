/* ============================================================
   Dizarro — i18n.js
   Motor de traduções (PT · EN · ES · FR) + seletor de idioma
   com bandeiras. Carrega DEPOIS de layout.js e ANTES de main.js.

   Marcação nas páginas:
     data-i18n="chave"          -> textContent
     data-i18n-html="chave"     -> innerHTML (para <br>, <span>…)
     data-i18n-aria="chave"     -> aria-label
     data-i18n-ph="chave"       -> placeholder
     data-i18n-alt="chave"      -> alt
     data-i18n-title="chave"    -> title
     data-i18n-content="chave"  -> content (meta)

   Objetos {pt,en,es,fr} (ex.: js/portfolio-data.js) resolvem-se
   com window.i18n.pick(obj).
   ============================================================ */
(function () {
  'use strict';

  var LANGS = ['pt', 'en', 'es', 'fr'];
  var KEY = 'dizarro-lang';
  var NAMES = { pt: 'Português', en: 'English', es: 'Español', fr: 'Français' };

  var FLAG = {
    pt: '<svg viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#da291c"/><rect width="8" height="14" fill="#046a38"/><circle cx="8" cy="7" r="2.7" fill="#ffcf00" stroke="#fff" stroke-width="1"/></svg>',
    en: '<svg viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#012169"/><path d="M0 0l20 14M20 0L0 14" stroke="#fff" stroke-width="2.8"/><path d="M0 0l20 14M20 0L0 14" stroke="#c8102e" stroke-width="1.4"/><path d="M10 0v14M0 7h20" stroke="#fff" stroke-width="4.2"/><path d="M10 0v14M0 7h20" stroke="#c8102e" stroke-width="2.4"/></svg>',
    es: '<svg viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#c60b1e"/><rect y="3.5" width="20" height="7" fill="#ffc400"/></svg>',
    fr: '<svg viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#fff"/><rect width="6.67" height="14" fill="#0055a4"/><rect x="13.33" width="6.67" height="14" fill="#ef4135"/></svg>'
  };

  /* ---------------- Dicionário ---------------- */
  /* [pt, en, es, fr] */
  var D = {
    /* ===== Navegação / rodapé / UI ===== */
    'nav.home':     ['Início', 'Home', 'Inicio', 'Accueil'],
    'nav.services': ['Serviços', 'Services', 'Servicios', 'Services'],
    'nav.works':    ['Trabalhos', 'Projects', 'Trabajos', 'Réalisations'],
    'nav.about':    ['Sobre', 'About', 'Nosotros', 'À propos'],
    'nav.contact':  ['Contactos', 'Contact', 'Contacto', 'Contact'],
    'ui.quote':     ['Orçamento', 'Get a quote', 'Presupuesto', 'Devis'],
    'ui.skip':      ['Saltar para o conteúdo', 'Skip to content', 'Saltar al contenido', 'Aller au contenu'],
    'ui.menu':      ['Abrir menu', 'Open menu', 'Abrir menú', 'Ouvrir le menu'],
    'ui.theme':     ['Alternar tema claro/escuro', 'Toggle light/dark theme', 'Cambiar tema claro/oscuro', 'Basculer le thème clair/sombre'],
    'ui.lang':      ['Mudar de idioma', 'Change language', 'Cambiar idioma', 'Changer de langue'],
    'ui.wa':        ['Contactar por WhatsApp', 'Contact via WhatsApp', 'Contactar por WhatsApp', 'Contacter par WhatsApp'],
    'ui.waDirect':  ['WhatsApp direto', 'WhatsApp us', 'WhatsApp directo', 'WhatsApp direct'],
    'ui.waNow':     ['Falar agora no WhatsApp', 'Message us on WhatsApp', 'Hablar ahora por WhatsApp', 'Écrire sur WhatsApp'],
    'ui.quoteFree': ['Pedir orçamento grátis', 'Get a free quote', 'Pedir presupuesto gratis', 'Devis gratuit'],
    'ui.quoteReq':  ['Pedir orçamento', 'Request a quote', 'Pedir presupuesto', 'Demander un devis'],
    'ui.quoteForm': ['Formulário de orçamento', 'Quote form', 'Formulario de presupuesto', 'Formulaire de devis'],
    'ui.callNow':   ['Ligar agora', 'Call now', 'Llamar ahora', 'Appeler'],
    'ui.viewAll':   ['Ver todos os trabalhos →', 'See all projects →', 'Ver todos los trabajos →', 'Voir toutes les réalisations →'],
    'ui.caseAll':   ['Ver os estudos de caso completos →', 'See the full case studies →', 'Ver los casos completos →', 'Voir les études de cas →'],
    'ui.dragCompare': ['Arraste o cursor para comparar. Obras reais, sem montagens.', 'Drag the slider to compare. Real jobs, no staging.', 'Arrastra el cursor para comparar. Obras reales, sin montajes.', 'Faites glisser le curseur pour comparer. Chantiers réels, sans mise en scène.'],
    'ui.otherAreas': ['Outras áreas', 'Other areas', 'Otras áreas', 'Autres domaines'],

    'foot.blurb':   ['Trabalho técnico na região do Porto — eletricidade, carpintaria, redes e sites, e pinturas, com um só interlocutor.', 'Technical work across the Porto region — electrical, carpentry, networks and websites, and painting, with a single point of contact.', 'Trabajo técnico en la región de Oporto — electricidad, carpintería, redes y webs, y pintura, con un único interlocutor.', 'Travail technique dans la région de Porto — électricité, menuiserie, réseaux et sites web, et peinture, avec un seul interlocuteur.'],
    'foot.services': ['Serviços', 'Services', 'Servicios', 'Services'],
    'foot.contact':  ['Contacto', 'Contact', 'Contacto', 'Contact'],
    'foot.svc.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'foot.svc.tel':  ['Telecom &amp; Redes', 'Telecom &amp; Networks', 'Telecom y Redes', 'Télécom &amp; Réseaux'],
    'foot.svc.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'foot.svc.pint': ['Pinturas', 'Painting', 'Pintura', 'Peinture'],
    'foot.slogan':   ['Soluções Inteligentes, Resultados Excelentes', 'Smart Solutions, Excellent Results', 'Soluciones Inteligentes, Resultados Excelentes', 'Solutions Intelligentes, Résultats Excellents'],
    'foot.privacy':  ['Privacidade', 'Privacy', 'Privacidad', 'Confidentialité'],
    'foot.cart.project': ['Projeto', 'Project', 'Proyecto', 'Projet'],
    'foot.cart.scale':   ['Escala', 'Scale', 'Escala', 'Échelle'],
    'foot.cart.area':    ['Zona', 'Area', 'Zona', 'Zone'],
    'foot.cart.rev':     ['Revisão', 'Revision', 'Revisión', 'Révision'],

    /* ===== Home ===== */
    'home.title':   ['Dizarro — Obras técnicas no Grande Porto', 'Dizarro — Technical work in Greater Porto', 'Dizarro — Trabajos técnicos en el Gran Oporto', 'Dizarro — Travaux techniques dans le Grand Porto'],
    'home.desc':    ['Dizarro: eletricidade, carpintaria e montagem de móveis, redes e Wi-Fi, criação de sites e pinturas na região do Porto. Um só interlocutor, orçamento grátis em menos de 24 h.', 'Dizarro: electrical, carpentry and furniture assembly, networks and Wi-Fi, website creation and painting across the Porto region. One point of contact, free quote in under 24 h.', 'Dizarro: electricidad, carpintería y montaje de muebles, redes y Wi-Fi, creación de webs y pintura en la región de Oporto. Un único interlocutor, presupuesto gratis en menos de 24 h.', 'Dizarro : électricité, menuiserie et montage de meubles, réseaux et Wi-Fi, création de sites et peinture dans la région de Porto. Un seul interlocuteur, devis gratuit en moins de 24 h.'],
    'home.eyebrow': ['Obras técnicas · Grande Porto', 'Technical work · Greater Porto', 'Trabajos técnicos · Gran Oporto', 'Travaux techniques · Grand Porto'],
    'home.h1':      ['Da luz <span class="b">à madeira,</span> fica <span class="o">bem&nbsp;feito.</span>', 'From the light <span class="b">to the woodwork,</span> <span class="o">done&nbsp;right.</span>', 'De la luz <span class="b">a la madera,</span> <span class="o">bien&nbsp;hecho.</span>', 'De la lumière <span class="b">au bois,</span> <span class="o">bien&nbsp;fait.</span>'],
    'home.sub':     ['Eletricidade, carpintaria e montagem de móveis, redes e Wi-Fi, criação de sites e pinturas — o essencial de uma casa ou de um espaço, com um só interlocutor. Resposta em menos de 24&nbsp;horas.', 'Electrical, carpentry and furniture assembly, networks and Wi-Fi, website creation and painting — the essentials of a home or space, with a single point of contact. Reply in under 24&nbsp;hours.', 'Electricidad, carpintería y montaje de muebles, redes y Wi-Fi, creación de webs y pintura — lo esencial de una casa o un local, con un único interlocutor. Respuesta en menos de 24&nbsp;horas.', 'Électricité, menuiserie et montage de meubles, réseaux et Wi-Fi, création de sites et peinture — l’essentiel d’un logement ou d’un local, avec un seul interlocuteur. Réponse en moins de 24&nbsp;heures.'],
    'home.heroAlt': ['Aplique de parede acabado, com luz quente, sobre revestimento de chapa perfilada — obra da Dizarro', 'Finished wall light with warm glow on profiled metal cladding — a Dizarro job', 'Aplique de pared acabado, con luz cálida, sobre revestimiento de chapa perfilada — obra de Dizarro', 'Applique murale finie, lumière chaude, sur bardage métallique nervuré — chantier Dizarro'],

    'home.trust.works':  ['obras concluídas', 'completed jobs', 'obras terminadas', 'chantiers réalisés'],
    'home.trust.years':  ['anos de ofício', 'years on the tools', 'años de oficio', "années de métier"],
    'home.trust.radius': ['raio · base Matosinhos', 'radius · based in Matosinhos', 'radio · base en Matosinhos', 'rayon · base à Matosinhos'],
    'home.trust.reply':  ['resposta a pedidos', 'to answer a request', 'para responder', 'pour répondre'],

    'home.s01.k':    ['O que fazemos', 'What we do', 'Qué hacemos', 'Ce que nous faisons'],
    'home.s01.lead': ['Não é só uma coisa. A Dizarro trata a parte técnica de uma casa ou espaço de ponta a ponta — e coordena as áreas entre si, para não andar atrás de três empresas diferentes.', 'Not just one thing. Dizarro handles the technical side of a home or space end to end — and coordinates the trades, so you are not chasing three different firms.', 'No es solo una cosa. Dizarro se ocupa de la parte técnica de una casa o local de principio a fin — y coordina los oficios entre sí, para que no persigas a tres empresas distintas.', "Pas une seule chose. Dizarro prend en charge le volet technique d'un logement ou d'un local de bout en bout — et coordonne les corps de métier, pour ne pas courir après trois entreprises."],
    'home.disc.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'home.disc.tel':  ['Redes, Wi-Fi &amp; Sites', 'Networks, Wi-Fi &amp; Websites', 'Redes, Wi-Fi y Sitios web', 'Réseaux, Wi-Fi &amp; Sites'],
    'home.disc.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'home.disc.pint': ['Pinturas', 'Painting', 'Pintura', 'Peinture'],
    'home.s01.elec.list': ['<li>Troca de luminárias, apliques e focos</li><li>Substituição de tomadas e interruptores</li><li>Disjuntores e diferenciais que disparam</li><li>Pequenas reparações (sem quadros de raiz)</li>', '<li>Swapping light fittings, wall lights and spots</li><li>Replacing sockets and switches</li><li>Breakers and RCDs that keep tripping</li><li>Small repairs (no panels from scratch)</li>', '<li>Cambio de luminarias, apliques y focos</li><li>Sustitución de enchufes e interruptores</li><li>Magnetotérmicos y diferenciales que saltan</li><li>Pequeñas reparaciones (sin cuadros de cero)</li>', '<li>Remplacement de luminaires, appliques et spots</li><li>Remplacement de prises et interrupteurs</li><li>Disjoncteurs et différentiels qui sautent</li><li>Petites réparations (pas de tableaux de zéro)</li>'],
    'home.s01.tel.list': ['<li>Passagem de cabo de internet e de TV</li><li>Wi-Fi em toda a casa: repetidores e pontos de acesso</li><li>Fibra ótica, repartidores e ligações</li><li>Criação de sites (como este)</li>', '<li>Running internet and TV cable</li><li>Whole-home Wi-Fi: repeaters and access points</li><li>Fibre optics, splitters and connections</li><li>Website creation (like this one)</li>', '<li>Tendido de cable de internet y TV</li><li>Wi-Fi en toda la casa: repetidores y puntos de acceso</li><li>Fibra óptica, repartidores y conexiones</li><li>Creación de webs (como esta)</li>', '<li>Tirage de câble internet et TV</li><li>Wi-Fi dans toute la maison : répéteurs et points d’accès</li><li>Fibre optique, répartiteurs et raccordements</li><li>Création de sites (comme celui-ci)</li>'],
    'home.s01.carp.list': ['<li>Montagem de móveis (loja ou projeto) e transporte</li><li>Peças à medida: prateleiras, estantes, bancadas</li><li>Recortes, pintura e reparação de madeira</li><li>Exaustores: instalação, afinação e manutenção</li>', '<li>Furniture assembly (flat-pack or project) and transport</li><li>Made-to-measure pieces: shelves, units, worktops</li><li>Cut-outs, wood painting and repair</li><li>Extractor hoods: install, tune and maintain</li>', '<li>Montaje de muebles (tienda o proyecto) y transporte</li><li>Piezas a medida: estantes, librerías, encimeras</li><li>Recortes, pintura y reparación de madera</li><li>Extractores: instalación, ajuste y mantenimiento</li>', '<li>Montage de meubles (kit ou projet) et transport</li><li>Pièces sur mesure : étagères, meubles, plans de travail</li><li>Découpes, peinture et réparation du bois</li><li>Hottes : pose, réglage et entretien</li>'],
    'home.s01.pint.list': ['<li>Pintura de paredes e tetos, interior</li><li>Esmalte de portas, rodapés e caixilharia</li><li>Caixilharia de castanho para branco</li><li>Preparação: fissuras, betume, lixagem e primário</li>', '<li>Painting interior walls and ceilings</li><li>Enamel for doors, skirting and window frames</li><li>Window frames from brown to white</li><li>Prep: cracks, filler, sanding and primer</li>', '<li>Pintura de paredes y techos, interior</li><li>Esmalte de puertas, rodapiés y carpintería</li><li>Carpintería de marrón a blanco</li><li>Preparación: fisuras, masilla, lijado e imprimación</li>', '<li>Peinture de murs et plafonds, intérieur</li><li>Émail pour portes, plinthes et menuiseries</li><li>Menuiseries du marron au blanc</li><li>Préparation : fissures, enduit, ponçage et primaire</li>'],
    'home.chips.elec': ['<span>luzes</span><span>tomadas</span><span>interruptores</span><span>disjuntores</span>', '<span>lights</span><span>sockets</span><span>switches</span><span>breakers</span>', '<span>luces</span><span>enchufes</span><span>interruptores</span><span>magnetotérmicos</span>', '<span>lumières</span><span>prises</span><span>interrupteurs</span><span>disjoncteurs</span>'],
    'home.chips.tel':  ['<span>cabo</span><span>Wi-Fi</span><span>repetidores</span><span>fibra</span><span>sites</span>', '<span>cable</span><span>Wi-Fi</span><span>repeaters</span><span>fibre</span><span>websites</span>', '<span>cable</span><span>Wi-Fi</span><span>repetidores</span><span>fibra</span><span>webs</span>', '<span>câble</span><span>Wi-Fi</span><span>répéteurs</span><span>fibre</span><span>sites</span>'],
    'home.chips.carp': ['<span>montagem</span><span>transporte</span><span>à medida</span><span>exaustores</span>', '<span>assembly</span><span>transport</span><span>made to measure</span><span>extractors</span>', '<span>montaje</span><span>transporte</span><span>a medida</span><span>extractores</span>', '<span>montage</span><span>transport</span><span>sur mesure</span><span>hottes</span>'],
    'home.chips.pint': ['<span>paredes</span><span>madeiras</span><span>esmalte</span><span>castanho→branco</span>', '<span>walls</span><span>woodwork</span><span>enamel</span><span>brown→white</span>', '<span>paredes</span><span>maderas</span><span>esmalte</span><span>marrón→blanco</span>', '<span>murs</span><span>boiseries</span><span>émail</span><span>marron→blanc</span>'],
    'home.step.no1': ['PASSO 01', 'STEP 01', 'PASO 01', 'ÉTAPE 01'],
    'home.step.no2': ['PASSO 02', 'STEP 02', 'PASO 02', 'ÉTAPE 02'],
    'home.step.no3': ['PASSO 03', 'STEP 03', 'PASO 03', 'ÉTAPE 03'],
    'home.plate.1t': ['Parede de TV — do móvel para a parede', 'TV wall — from the unit to the wall', 'Pared de TV — del mueble a la pared', 'Mur TV — du meuble au mur'],
    'home.plate.2t': ['Bastidor e rede estruturada', 'Rack and structured cabling', 'Rack y red estructurada', 'Baie et câblage structuré'],
    'home.plate.3t': ['Apliques sobre revestimento metálico', 'Wall lights on metal cladding', 'Apliques sobre revestimiento metálico', 'Appliques sur bardage métallique'],
    'home.plate.4t': ['Móvel de apoio para clínica de laser', 'Support cabinet for a laser clinic', 'Mueble de apoyo para clínica láser', 'Meuble d’appoint pour clinique laser'],
    'home.plate.5t': ['Janelas · de castanho para branco', 'Windows · from brown to white', 'Ventanas · de marrón a blanco', 'Fenêtres · du marron au blanc'],
    'home.plate.loc':  ['Grande Porto · 2025', 'Greater Porto · 2025', 'Gran Oporto · 2025', 'Grand Porto · 2025'],
    'home.plate.loc2': ['Porto · 2025', 'Porto · 2025', 'Oporto · 2025', 'Porto · 2025'],
    'tape.telecom': ['Telecom', 'Telecom', 'Telecom', 'Télécom'],
    'tape.networks': ['Redes', 'Networks', 'Redes', 'Réseaux'],
    'tape.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'tape.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'tape.pint': ['Pinturas', 'Painting', 'Pintura', 'Peinture'],
    'ui.5of5': ['5 em 5', '5 out of 5', '5 de 5', '5 sur 5'],
    'home.band2Alt': ['Secretária lacada branca à medida com gaveteiro, feita pela Dizarro', 'Bespoke white lacquered desk with drawers, by Dizarro', 'Escritorio lacado blanco a medida con cajonera, de Dizarro', 'Bureau laqué blanc sur mesure avec caisson, par Dizarro'],
    'home.win.beforeAlt': ['Em obra: caixilharia a ser lixada e pintada', 'In progress: window frame being sanded and painted', 'En obra: carpintería lijándose y pintándose', 'En cours : menuiserie poncée et peinte'],
    'home.win.afterAlt':  ['Depois: caixilharia pintada de branco, com vista para a marina', 'After: window frame painted white, with a marina view', 'Después: carpintería pintada de blanco, con vistas al puerto', 'Après : menuiserie peinte en blanc, vue sur la marina'],
    'home.tv.beforeAlt':  ['Antes: televisor pousado em cima do aparador', 'Before: TV resting on the sideboard', 'Antes: televisor apoyado en el aparador', 'Avant : téléviseur posé sur le buffet'],
    'home.tv.afterAlt':   ['Depois: televisor fixo na parede, com os cabos escondidos', 'After: TV fixed to the wall, cables hidden', 'Después: televisor fijado a la pared, con los cables ocultos', 'Après : téléviseur fixé au mur, câbles cachés'],
    'home.s05.hqv':    ['Padrão da Légua, Matosinhos, Porto', 'Padrão da Légua, Matosinhos, Porto', 'Padrão da Légua, Matosinhos, Oporto', 'Padrão da Légua, Matosinhos, Porto'],
    'home.s01.more.elec': ['Ver eletricidade →', 'View electrical →', 'Ver electricidad →', 'Voir l’électricité →'],
    'home.s01.more.tel':  ['Ver telecom &amp; redes →', 'View telecom &amp; networks →', 'Ver telecom y redes →', 'Voir télécom &amp; réseaux →'],
    'home.s01.more.carp': ['Ver carpintaria →', 'View carpentry →', 'Ver carpintería →', 'Voir la menuiserie →'],
    'home.s01.more.pint': ['Ver pinturas →', 'View painting →', 'Ver pintura →', 'Voir la peinture →'],

    'home.bandAlt': ['Aplique de parede acabado sobre revestimento de chapa perfilada, obra elétrica da Dizarro', 'Finished wall light on profiled metal cladding, Dizarro electrical job', 'Aplique de pared acabado sobre revestimiento de chapa perfilada, obra eléctrica de Dizarro', 'Applique murale finie sur bardage métallique nervuré, chantier électrique Dizarro'],

    'home.s02.k':    ['Pedir orçamento é rápido', 'Getting a quote is quick', 'Pedir presupuesto es rápido', 'Demander un devis est rapide'],
    'home.s02.lead': ['Sem formulários intermináveis. Diga o que precisa, respondemos em menos de 24&nbsp;horas úteis, e o orçamento é gratuito e sem compromisso.', 'No endless forms. Tell us what you need, we reply within 24&nbsp;working hours, and the quote is free with no obligation.', 'Sin formularios interminables. Dinos qué necesitas, respondemos en menos de 24&nbsp;horas laborables, y el presupuesto es gratis y sin compromiso.', 'Pas de formulaires interminables. Dites-nous ce dont vous avez besoin, nous répondons sous 24&nbsp;heures ouvrées, et le devis est gratuit et sans engagement.'],
    'home.s02.st1.t': ['Conta-nos', 'Tell us', 'Cuéntanos', 'Dites-nous'],
    'home.s02.st1.p': ['Uma mensagem por WhatsApp ou uma chamada. Fotos ajudam, mas não são obrigatórias.', 'A WhatsApp message or a call. Photos help, but are not required.', 'Un mensaje de WhatsApp o una llamada. Las fotos ayudan, pero no son obligatorias.', 'Un message WhatsApp ou un appel. Les photos aident, mais ne sont pas obligatoires.'],
    'home.s02.st2.t': ['Vistoria', 'Site visit', 'Visita técnica', 'Visite technique'],
    'home.s02.st2.p': ['Se o trabalho justificar, marcamos uma visita técnica para medir e perceber o contexto.', 'If the job calls for it, we book a site visit to measure and understand the context.', 'Si el trabajo lo requiere, concertamos una visita para medir y entender el contexto.', 'Si le chantier le justifie, nous planifions une visite pour mesurer et comprendre le contexte.'],
    'home.s02.st3.t': ['Proposta clara', 'Clear proposal', 'Propuesta clara', 'Devis clair'],
    'home.s02.st3.p': ['Recebe um orçamento discriminado — materiais, mão de obra e prazo. Sem surpresas na fatura.', 'You get an itemised quote — materials, labour and timeline. No surprises on the invoice.', 'Recibes un presupuesto detallado — materiales, mano de obra y plazo. Sin sorpresas en la factura.', 'Vous recevez un devis détaillé — matériaux, main-d’œuvre et délai. Aucune surprise sur la facture.'],

    'home.s03.k':    ['Trabalhos recentes', 'Recent projects', 'Trabajos recientes', 'Réalisations récentes'],
    'home.s03.lead': ['Obras reais da Dizarro na região do Porto.', 'Real Dizarro jobs across the Porto region.', 'Obras reales de Dizarro en la región de Oporto.', 'Chantiers réels de Dizarro dans la région de Porto.'],

    'home.s04.k':    ['Antes &amp; depois', 'Before &amp; after', 'Antes y después', 'Avant &amp; après'],
    'home.s04.win':  ['Janelas · de castanho para branco', 'Windows · from brown to white', 'Ventanas · de marrón a blanco', 'Fenêtres · du marron au blanc'],
    'home.s04.tv':   ['TV · do móvel para a parede', 'TV · from the unit to the wall', 'TV · del mueble a la pared', 'TV · du meuble au mur'],
    'home.s04.more': ['Mais trabalhos', 'More projects', 'Más trabajos', 'Plus de réalisations'],
    'home.s04.light': ['Aplique de parede · montagem → acabamento', 'Wall light · assembly → finish', 'Aplique de pared · montaje → acabado', 'Applique murale · montage → finition'],
    'ba.inwork':   ['Em obra', 'In progress', 'En obra', 'En cours'],
    'ba.done':     ['Acabado', 'Finished', 'Acabado', 'Terminé'],
    'ba.onunit':   ['No móvel', 'On the unit', 'En el mueble', 'Sur le meuble'],
    'ba.onwall':   ['Na parede', 'On the wall', 'En la pared', 'Au mur'],
    'ba.prepped':  ['Parede preparada', 'Wall prepped', 'Pared preparada', 'Mur préparé'],
    'ba.tvset':    ['TV configurada', 'TV set up', 'TV configurada', 'TV configurée'],
    'ba.assembly': ['Montagem', 'Assembly', 'Montaje', 'Montage'],
    'ba.finish':   ['Acabamento', 'Finish', 'Acabado', 'Finition'],
    'ba.before':   ['Antes', 'Before', 'Antes', 'Avant'],
    'ba.after':    ['Depois', 'After', 'Después', 'Après'],

    'home.g.elecLight': ['Eletricidade · aplique de parede', 'Electrical · wall light', 'Electricidad · aplique de pared', 'Électricité · applique murale'],
    'home.g.fan':       ['Eletricidade · ventoinha de teto', 'Electrical · ceiling fan', 'Electricidad · ventilador de techo', 'Électricité · ventilateur de plafond'],
    'home.g.net':       ['Telecom · rede organizada', 'Telecom · tidy network', 'Telecom · red ordenada', 'Télécom · réseau rangé'],
    'home.g.desk':      ['Carpintaria · secretária à medida', 'Carpentry · bespoke desk', 'Carpintería · escritorio a medida', 'Menuiserie · bureau sur mesure'],
    'home.g.shoe':      ['Carpintaria · sapateira de entrada', 'Carpentry · hallway shoe cabinet', 'Carpintería · zapatero de entrada', 'Menuiserie · meuble à chaussures'],
    'home.g.laser':     ['Carpintaria · móvel p/ clínica de laser', 'Carpentry · cabinet for a laser clinic', 'Carpintería · mueble para clínica láser', 'Menuiserie · meuble pour clinique laser'],

    'home.s05.k':    ['Onde trabalhamos', 'Where we work', 'Dónde trabajamos', 'Où nous intervenons'],
    'home.s05.lead': ['Base em Padrão da Légua, Matosinhos. Deslocamo-nos num raio de cerca de 100&nbsp;km — toda a Área Metropolitana do Porto, mais Braga e Aveiro.', 'Based in Padrão da Légua, Matosinhos. We cover a radius of about 100&nbsp;km — the whole Porto metropolitan area, plus Braga and Aveiro.', 'Con base en Padrão da Légua, Matosinhos. Nos desplazamos en un radio de unos 100&nbsp;km — toda el área metropolitana de Oporto, más Braga y Aveiro.', 'Basés à Padrão da Légua, Matosinhos. Nous couvrons un rayon d’environ 100&nbsp;km — toute l’aire métropolitaine de Porto, plus Braga et Aveiro.'],
    'home.s05.hq':    ['Sede', 'Base', 'Sede', 'Siège'],
    'home.s05.coord': ['Coord', 'Coord', 'Coord', 'Coord'],
    'home.s05.rad':   ['Raio', 'Radius', 'Radio', 'Rayon'],
    'home.s05.radv':  ['≈ 100 km (Porto · Braga · Aveiro)', '≈ 100 km (Porto · Braga · Aveiro)', '≈ 100 km (Oporto · Braga · Aveiro)', '≈ 100 km (Porto · Braga · Aveiro)'],
    'home.s05.urg':   ['Urgências', 'Emergencies', 'Urgencias', 'Urgences'],
    'home.s05.urgv':  ['dentro da Área Metropolitana do Porto', 'within the Porto metropolitan area', 'dentro del área metropolitana de Oporto', 'dans l’aire métropolitaine de Porto'],

    'home.s06.k':   ['O que dizem os clientes', 'What clients say', 'Lo que dicen los clientes', 'Ce que disent les clients'],
    'home.q1':      ['Profissional e muito rápido. Veio no mesmo dia trocar a iluminação e ainda me ajudou a configurar tudo no Apple Home. Recomendo a toda a gente.', 'Professional and very fast. Came the same day to swap the lighting and even helped me set it all up in Apple Home. I recommend him to everyone.', 'Profesional y muy rápido. Vino el mismo día a cambiar la iluminación e incluso me ayudó a configurarlo todo en Apple Home. Lo recomiendo a todos.', 'Professionnel et très rapide. Venu le jour même changer l’éclairage et m’a même aidé à tout configurer dans Apple Home. Je le recommande à tous.'],
    'home.q1.by':   ['Nik V. — Vila do Conde · Eletricidade', 'Nik V. — Vila do Conde · Electrical', 'Nik V. — Vila do Conde · Electricidad', 'Nik V. — Vila do Conde · Électricité'],
    'home.q2':      ['Educado, transparente e rápido. Trocou todos os cabos de TV antigos dentro da parede por cabo de rede para todas as divisões. Recomendo muito.', 'Polite, transparent and quick. Replaced all the old in-wall TV cables with network cable to every room. Highly recommend.', 'Educado, transparente y rápido. Cambió todos los cables de TV antiguos dentro de la pared por cable de red a todas las habitaciones. Muy recomendable.', 'Poli, transparent et rapide. A remplacé tous les vieux câbles TV dans le mur par du câble réseau vers chaque pièce. Je recommande vivement.'],
    'home.q2.by':   ['Eduardo D. — Aveiro · Telecomunicações', 'Eduardo D. — Aveiro · Telecom', 'Eduardo D. — Aveiro · Telecom', 'Eduardo D. — Aveiro · Télécom'],
    'home.q3':      ['Percebeu o problema num instante e trouxe todo o material. No fim disse que era só ligar se algo não ficasse bem. Profissionais assim são raros.', 'Understood the problem instantly and brought all the materials. Told me to just call if anything wasn’t right. Professionals like this are rare.', 'Entendió el problema al instante y trajo todo el material. Al final dijo que solo llamara si algo no quedaba bien. Profesionales así son raros.', 'A compris le problème en un instant et a apporté tout le matériel. À la fin, il a dit d’appeler si quelque chose n’allait pas. Des pros comme ça, c’est rare.'],
    'home.q3.by':   ['Frederico S. — Vila do Conde · Carpintaria', 'Frederico S. — Vila do Conde · Carpentry', 'Frederico S. — Vila do Conde · Carpintería', 'Frederico S. — Vila do Conde · Menuiserie'],

    'home.s07.k':   ['Perguntas frequentes', 'FAQ', 'Preguntas frecuentes', 'Questions fréquentes'],
    'home.faq1.q':  ['O orçamento tem algum custo?', 'Is the quote free?', '¿El presupuesto tiene coste?', 'Le devis est-il payant ?'],
    'home.faq1.a':  ['Não. É gratuito e sem compromisso, seja pelo WhatsApp, e-mail ou numa visita técnica quando o trabalho justifica.', 'No. It’s free and with no obligation — by WhatsApp, email or a site visit when the job calls for it.', 'No. Es gratis y sin compromiso, por WhatsApp, correo o visita técnica cuando el trabajo lo requiere.', 'Non. Il est gratuit et sans engagement — par WhatsApp, e-mail ou visite sur site si le chantier le justifie.'],
    'home.faq2.q':  ['Dão garantia?', 'Do you offer a warranty?', '¿Dais garantía?', 'Offrez-vous une garantie ?'],
    'home.faq2.a':  ['Sim. Em regra, 6 a 12 meses conforme o trabalho. Se algo não ficar bem dentro do prazo, voltamos sem custo.', 'Yes. As a rule, 6 to 12 months depending on the job. If something isn’t right within that time, we come back at no cost.', 'Sí. Por norma, 6 a 12 meses según el trabajo. Si algo no queda bien dentro del plazo, volvemos sin coste.', 'Oui. En règle générale, 6 à 12 mois selon le travail. Si un défaut apparaît dans ce délai, nous revenons sans frais.'],
    'home.faq3.q':  ['Trabalham com particulares e empresas?', 'Do you work with individuals and businesses?', '¿Trabajáis con particulares y empresas?', 'Travaillez-vous avec les particuliers et les entreprises ?'],
    'home.faq3.a':  ['Ambos. Temos obra residencial, comercial e industrial, de pequenas intervenções a projetos completos.', 'Both. We do residential, commercial and industrial work, from small jobs to complete projects.', 'Ambos. Hacemos obra residencial, comercial e industrial, desde pequeñas intervenciones hasta proyectos completos.', 'Les deux. Nous réalisons des travaux résidentiels, commerciaux et industriels, de la petite intervention au projet complet.'],
    'home.faq4.q':  ['Como posso pagar?', 'How can I pay?', '¿Cómo puedo pagar?', 'Comment puis-je payer ?'],
    'home.faq4.a':  ['Transferência bancária, MB Way e numerário. Em obras maiores é comum faseiar: sinal, durante a obra e conclusão.', 'Bank transfer, MB Way and cash. On larger jobs we usually stage payments: deposit, during the work and on completion.', 'Transferencia bancaria, MB Way y efectivo. En obras grandes es habitual fraccionar: señal, durante la obra y al finalizar.', 'Virement, MB Way et espèces. Sur les gros chantiers, le paiement est souvent échelonné : acompte, en cours et à la livraison.'],

    'home.cta.h':   ['Diga-nos o que precisa', 'Tell us what you need', 'Dinos qué necesitas', 'Dites-nous ce dont vous avez besoin'],

    /* ===== Página de serviço (partilhado) ===== */
    'svc.crumb.services': ['Serviços', 'Services', 'Servicios', 'Services'],
    'svc.whatWeDo':  ['O que fazemos', 'What we do', 'Qué hacemos', 'Ce que nous faisons'],
    'svc.howWeWork': ['Como trabalhamos', 'How we work', 'Cómo trabajamos', 'Comment nous travaillons'],
    'svc.realEx':    ['Exemplo real', 'Real example', 'Ejemplo real', 'Exemple réel'],
    'svc.baTitle':   ['Antes &amp; depois — obra real', 'Before &amp; after — real job', 'Antes y después — obra real', 'Avant &amp; après — chantier réel'],
    'svc.spec.norm': ['Norma', 'Standard', 'Norma', 'Norme'],
    'svc.spec.volt': ['Tensão', 'Voltage', 'Tensión', 'Tension'],
    'svc.spec.warr': ['Garantia', 'Warranty', 'Garantía', 'Garantie'],
    'svc.spec.reply':['Resposta', 'Reply', 'Respuesta', 'Réponse'],
    'svc.spec.area': ['Zona', 'Area', 'Zona', 'Zone'],
    'svc.spec.cable':['Cabo', 'Cable', 'Cable', 'Câble'],
    'svc.spec.cert': ['Certificação', 'Certification', 'Certificación', 'Certification'],
    'svc.spec.mat':  ['Materiais', 'Materials', 'Materiales', 'Matériaux'],
    'svc.spec.hw':   ['Ferragens', 'Hardware', 'Herrajes', 'Quincaillerie'],
    'svc.spec.appr': ['Aprovação', 'Approval', 'Aprobación', 'Validation'],
    'svc.spec.std':  ['Padrões', 'Standards', 'Estándares', 'Standards'],
    'svc.spec.eco':  ['Ecossistemas', 'Ecosystems', 'Ecosistemas', 'Écosystèmes'],
    'svc.spec.sw':   ['Interruptores', 'Switches', 'Interruptores', 'Interrupteurs'],
    'svc.spec.cfg':  ['Config', 'Setup', 'Config', 'Config'],
    'svc.spec.12m':  ['12 meses', '12 months', '12 meses', '12 mois'],
    'svc.spec.kept': ['mantidos', 'kept', 'se mantienen', 'conservés'],
    'svc.spec.onsite': ['feita no local', 'done on site', 'in situ', 'sur place'],
    'svc.spec.zone': ['≈ 100 km · Porto', '≈ 100 km · Porto', '≈ 100 km · Oporto', '≈ 100 km · Porto'],

    /* ===== Serviços (hub) ===== */
    'svchub.title': ['Serviços — Dizarro', 'Services — Dizarro', 'Servicios — Dizarro', 'Services — Dizarro'],
    'svchub.desc':  ['Eletricidade, redes e sites, carpintaria e montagem de móveis, e pinturas na região do Porto. Um só interlocutor para o trabalho técnico do dia a dia.', 'Electrical, networks and websites, carpentry and furniture assembly, and painting across the Porto region. One point of contact for everyday technical work.', 'Electricidad, redes y webs, carpintería y montaje de muebles, y pintura en la región de Oporto. Un único interlocutor para el trabajo técnico del día a día.', 'Électricité, réseaux et sites, menuiserie et montage de meubles, et peinture dans la région de Porto. Un seul interlocuteur pour le travail technique du quotidien.'],
    'svchub.h1':    ['Uma equipa,<br><span class="o">quatro frentes</span>', 'One team,<br><span class="o">four fronts</span>', 'Un equipo,<br><span class="o">cuatro frentes</span>', 'Une équipe,<br><span class="o">quatre fronts</span>'],
    'svchub.sub':   ['A parte técnica de uma casa ou espaço, tratada de ponta a ponta e coordenada entre si. Escolha a área para os detalhes.', 'The technical side of a home or space, handled end to end and coordinated. Pick an area for details.', 'La parte técnica de una casa o local, de principio a fin y coordinada. Elige un área para ver los detalles.', 'Le volet technique d’un logement ou d’un local, de bout en bout et coordonné. Choisissez un domaine pour les détails.'],
    'svchub.elec.cap': ['Luzes · tomadas · interruptores · disjuntores · reparações', 'Lights · sockets · switches · breakers · repairs', 'Luces · enchufes · interruptores · magnetotérmicos · reparaciones', 'Lumières · prises · interrupteurs · disjoncteurs · réparations'],
    'svchub.tel.cap':  ['Cabo · Wi-Fi · repetidores · fibra · pontos de TV · sites', 'Cable · Wi-Fi · repeaters · fibre · TV points · websites', 'Cable · Wi-Fi · repetidores · fibra · puntos de TV · webs', 'Câble · Wi-Fi · répéteurs · fibre · prises TV · sites'],
    'svchub.carp.cap': ['Montagem · transporte · à medida · recortes · exaustores', 'Assembly · transport · made to measure · cut-outs · extractors', 'Montaje · transporte · a medida · recortes · extractores', 'Montage · transport · sur mesure · découpes · hottes'],
    'svchub.pint.cap': ['Paredes · tetos · madeiras · caixilharia · castanho→branco', 'Walls · ceilings · woodwork · window frames · brown→white', 'Paredes · techos · maderas · carpintería · marrón→blanco', 'Murs · plafonds · boiseries · menuiseries · marron→blanc'],
    'svchub.why.h': ['Porquê ter tudo com a mesma equipa', 'Why keep it all with one team', 'Por qué tenerlo todo con el mismo equipo', 'Pourquoi tout confier à la même équipe'],
    'svchub.why.list': ['Um orçamento, um responsável, um número para ligar|As áreas falam entre si — a tomada fica onde o móvel a precisa|Menos dias de obra, menos marcações, menos "isso não é comigo"|Garantia sobre o conjunto, não sobre pedaços soltos', 'One quote, one person in charge, one number to call|The trades talk to each other — the socket goes where the furniture needs it|Fewer days on site, fewer appointments, fewer "not my job"|Warranty on the whole, not on loose pieces', 'Un presupuesto, un responsable, un número al que llamar|Los oficios hablan entre sí — el enchufe va donde lo necesita el mueble|Menos días de obra, menos citas, menos "eso no es lo mío"|Garantía sobre el conjunto, no sobre piezas sueltas', 'Un devis, un responsable, un numéro à appeler|Les métiers se parlent — la prise est là où le meuble en a besoin|Moins de jours de chantier, moins de rendez-vous, moins de "ce n’est pas mon rayon"|Garantie sur l’ensemble, pas sur des morceaux isolés'],
    'svchub.cta.h': ['Não sabe por onde começar? Diga-nos o problema.', 'Not sure where to start? Just tell us the problem.', '¿No sabes por dónde empezar? Cuéntanos el problema.', 'Vous ne savez pas par où commencer ? Dites-nous le problème.'],

    /* ===== Contactos ===== */
    'ct.title':  ['Contactos &amp; Orçamento — Dizarro', 'Contact &amp; Quote — Dizarro', 'Contacto y Presupuesto — Dizarro', 'Contact &amp; Devis — Dizarro'],
    'ct.desc':   ['Peça um orçamento grátis à Dizarro para eletricidade, redes e sites, carpintaria ou pinturas na região do Porto. Telefone 932 344 080, WhatsApp e formulário.', 'Ask Dizarro for a free quote — electrical, networks and websites, carpentry or painting across the Porto region. Phone 932 344 080, WhatsApp and form.', 'Pide a Dizarro un presupuesto gratis — electricidad, redes y webs, carpintería o pintura en la región de Oporto. Teléfono 932 344 080, WhatsApp y formulario.', 'Demandez un devis gratuit à Dizarro — électricité, réseaux et sites, menuiserie ou peinture dans la région de Porto. Téléphone 932 344 080, WhatsApp et formulaire.'],
    'ct.crumb':  ['Contactos', 'Contact', 'Contacto', 'Contact'],
    'ct.h1':     ['Orçamento <span class="o">grátis</span><br>em &lt; 24 horas', 'Free <span class="o">quote</span><br>in &lt; 24 hours', 'Presupuesto <span class="o">gratis</span><br>en &lt; 24 horas', 'Devis <span class="o">gratuit</span><br>en &lt; 24 heures'],
    'ct.sub':    ['A forma mais rápida é o WhatsApp. Prefere escrever com calma? Use o formulário — chega-nos por e-mail e fica registado.', 'The fastest way is WhatsApp. Rather write at your own pace? Use the form — it reaches us by email and is logged.', 'La forma más rápida es WhatsApp. ¿Prefieres escribir con calma? Usa el formulario — nos llega por correo y queda registrado.', 'Le plus rapide, c’est WhatsApp. Vous préférez écrire tranquillement ? Utilisez le formulaire — il nous arrive par e-mail et reste enregistré.'],
    'ct.row.phone': ['Telefone', 'Phone', 'Teléfono', 'Téléphone'],
    'ct.row.wa':    ['WhatsApp', 'WhatsApp', 'WhatsApp', 'WhatsApp'],
    'ct.row.email': ['E-mail', 'Email', 'Correo', 'E-mail'],
    'ct.row.base':  ['Base', 'Base', 'Base', 'Base'],
    'ct.row.zone':  ['Zona', 'Area', 'Zona', 'Zone'],
    'ct.row.hours': ['Horário', 'Hours', 'Horario', 'Horaires'],
    'ct.wa.send':   ['Enviar mensagem', 'Send a message', 'Enviar mensaje', 'Envoyer un message'],
    'ct.base.v':    ['Padrão da Légua, Matosinhos, Porto', 'Padrão da Légua, Matosinhos, Porto', 'Padrão da Légua, Matosinhos, Oporto', 'Padrão da Légua, Matosinhos, Porto'],
    'ct.zone.v':    ['≈ 100 km — Grande Porto, Braga, Aveiro', '≈ 100 km — Greater Porto, Braga, Aveiro', '≈ 100 km — Gran Oporto, Braga, Aveiro', '≈ 100 km — Grand Porto, Braga, Aveiro'],
    'ct.hours.v':   ['Seg–Sáb · resposta a pedidos em &lt; 24 h úteis', 'Mon–Sat · requests answered in &lt; 24 working h', 'Lun–Sáb · respuesta en &lt; 24 h laborables', 'Lun–Sam · réponse sous &lt; 24 h ouvrées'],
    'ct.ok':        ['✅ Pedido enviado. Respondemos em menos de 24&nbsp;horas úteis. Para urgências, ligue 932&nbsp;344&nbsp;080.', '✅ Request sent. We reply within 24&nbsp;working hours. For emergencies, call 932&nbsp;344&nbsp;080.', '✅ Solicitud enviada. Respondemos en menos de 24&nbsp;horas laborables. Para urgencias, llame al 932&nbsp;344&nbsp;080.', '✅ Demande envoyée. Réponse sous 24&nbsp;heures ouvrées. Pour les urgences, appelez le 932&nbsp;344&nbsp;080.'],
    'ct.f.name':    ['Nome', 'Name', 'Nombre', 'Nom'],
    'ct.f.name.err':['Indique o seu nome.', 'Please enter your name.', 'Indica tu nombre.', 'Indiquez votre nom.'],
    'ct.f.tel':     ['Telefone', 'Phone', 'Teléfono', 'Téléphone'],
    'ct.f.tel.err': ['Indique um contacto.', 'Please enter a contact number.', 'Indica un contacto.', 'Indiquez un contact.'],
    'ct.f.area':    ['Área', 'Area', 'Área', 'Domaine'],
    'ct.f.area.ph': ['Escolher…', 'Choose…', 'Elegir…', 'Choisir…'],
    'ct.f.area.err':['Escolha uma área.', 'Please choose an area.', 'Elige un área.', 'Choisissez un domaine.'],
    'ct.f.opt.elec':['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'ct.f.opt.tel': ['Telecomunicações &amp; Redes', 'Telecom &amp; Networks', 'Telecom y Redes', 'Télécom &amp; Réseaux'],
    'ct.f.opt.carp':['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'ct.f.opt.pint':['Pinturas', 'Painting', 'Pintura', 'Peinture'],
    'ct.f.opt.many':['Várias / não sei', 'Several / not sure', 'Varias / no sé', 'Plusieurs / je ne sais pas'],
    'ct.f.local':   ['Localidade da obra', 'Job location', 'Localidad de la obra', 'Lieu du chantier'],
    'ct.f.local.ph':['Ex.: Matosinhos', 'E.g. Matosinhos', 'Ej.: Matosinhos', 'Ex. : Matosinhos'],
    'ct.f.local.err':['Indique a localidade.', 'Please enter the location.', 'Indica la localidad.', 'Indiquez le lieu.'],
    'ct.f.desc':    ['O que precisa', 'What you need', 'Qué necesitas', 'Ce dont vous avez besoin'],
    'ct.f.desc.ph': ['Descreva o trabalho: nº de pontos de luz/tomadas, tipo de móvel, divisões a pintar…', 'Describe the job: number of light/socket points, type of furniture, rooms to paint…', 'Describe el trabajo: nº de puntos de luz/enchufes, tipo de mueble, estancias a pintar…', 'Décrivez le chantier : nombre de points lumière/prises, type de meuble, pièces à peindre…'],
    'ct.f.desc.err':['Descreva o trabalho pretendido.', 'Please describe the job.', 'Describe el trabajo.', 'Décrivez le chantier.'],
    'ct.f.submit':  ['Enviar pedido', 'Send request', 'Enviar solicitud', 'Envoyer la demande'],
    'ct.f.note':    ['🔒 Só usamos os dados para responder ao pedido.', '🔒 We only use your details to answer the request.', '🔒 Solo usamos los datos para responder a la solicitud.', '🔒 Nous n’utilisons vos données que pour répondre.'],

    /* ===== Sobre ===== */
    'about.title': ['Sobre a Dizarro — quem faz o trabalho', 'About Dizarro — who does the work', 'Sobre Dizarro — quién hace el trabajo', 'À propos de Dizarro — qui fait le travail'],
    'about.desc':  ['A Dizarro nasceu em Padrão da Légua, Matosinhos. Sete anos de trabalho técnico na região do Porto, com o rigor de quem assina cada obra.', 'Dizarro started in Padrão da Légua, Matosinhos. Seven years of technical work across the Porto region, with the care of someone who signs every job.', 'Dizarro nació en Padrão da Légua, Matosinhos. Siete años de trabajo técnico en la región de Oporto, con el rigor de quien firma cada obra.', 'Dizarro est née à Padrão da Légua, Matosinhos. Sept ans de travail technique dans la région de Porto, avec la rigueur de celui qui signe chaque chantier.'],
    'about.crumb': ['Sobre', 'About', 'Nosotros', 'À propos'],
    'about.h1':    ['Quem faz<br>o <span class="o">trabalho</span>', 'Who does<br>the <span class="o">work</span>', 'Quién hace<br>el <span class="o">trabajo</span>', 'Qui fait<br>le <span class="o">travail</span>'],
    'about.sub':   ['A Dizarro nasceu em Padrão da Légua, Matosinhos, para responder a uma coisa simples: trabalho técnico bem feito, à hora combinada, com quem atende o telefone a seguir.', 'Dizarro started in Padrão da Légua, Matosinhos, to deliver something simple: technical work done well, on time, with someone who still picks up the phone afterwards.', 'Dizarro nació en Padrão da Légua, Matosinhos, para responder a algo simple: trabajo técnico bien hecho, a la hora acordada, con quien atiende el teléfono después.', 'Dizarro est née à Padrão da Légua, Matosinhos, pour offrir une chose simple : un travail technique bien fait, à l’heure convenue, avec quelqu’un qui répond encore au téléphone ensuite.'],
    'about.lead':  ['Sete anos, mais de 150 obras, um raio de 100 km à volta do Porto.', 'Seven years, over 150 jobs, a 100 km radius around Porto.', 'Siete años, más de 150 obras, un radio de 100 km alrededor de Oporto.', 'Sept ans, plus de 150 chantiers, un rayon de 100 km autour de Porto.'],
    'about.p1':    ['Começámos com pequenas reparações elétricas e fomos crescendo por indicação — cliente que recomenda a cliente. Pelo caminho juntámos a montagem de móveis, as redes e a pintura, porque eram sempre as mesmas casas a precisar de tudo.', 'We started with small electrical repairs and grew by word of mouth — one client recommending the next. Along the way we added furniture assembly, networks and painting, because it was always the same homes needing all of it.', 'Empezamos con pequeñas reparaciones eléctricas y crecimos por recomendación — cliente que recomienda a cliente. Por el camino sumamos el montaje de muebles, las redes y la pintura, porque eran siempre las mismas casas las que lo necesitaban todo.', 'Nous avons commencé par de petites réparations électriques et avons grandi par le bouche-à-oreille — un client en recommandant un autre. En chemin, nous avons ajouté le montage de meubles, les réseaux et la peinture, car c’étaient toujours les mêmes logements qui avaient besoin de tout.'],
    'about.p2':    ['Hoje a Dizarro trata da parte técnica do dia a dia de uma casa ou de um espaço: a luz que deixou de acender, o móvel para montar, o Wi-Fi que não chega ao quarto, a divisão para pintar.', 'Today Dizarro handles the everyday technical side of a home or space: the light that stopped working, the furniture to assemble, the Wi-Fi that doesn’t reach the bedroom, the room to paint.', 'Hoy Dizarro se ocupa de la parte técnica del día a día de una casa o un local: la luz que dejó de encender, el mueble para montar, el Wi-Fi que no llega al cuarto, la habitación para pintar.', 'Aujourd’hui, Dizarro s’occupe du volet technique du quotidien d’un logement ou d’un local : la lumière qui ne s’allume plus, le meuble à monter, le Wi-Fi qui n’atteint pas la chambre, la pièce à peindre.'],
    'about.h2work': ['Como gostamos de trabalhar', 'How we like to work', 'Cómo nos gusta trabajar', 'Notre façon de travailler'],
    'about.v1.t': ['Transparência', 'Transparency', 'Transparencia', 'Transparence'],
    'about.v1.d': ['Orçamento discriminado. O que muda, avisa-se antes — não na fatura.', 'Itemised quote. Any change is flagged upfront — not on the invoice.', 'Presupuesto detallado. Lo que cambia se avisa antes — no en la factura.', 'Devis détaillé. Tout changement est signalé en amont — pas sur la facture.'],
    'about.v2.t': ['Pontualidade', 'Punctuality', 'Puntualidad', 'Ponctualité'],
    'about.v2.d': ['A hora combinada é a hora. O seu tempo conta.', 'The agreed time is the time. Your time matters.', 'La hora acordada es la hora. Tu tiempo cuenta.', 'L’heure convenue est l’heure. Votre temps compte.'],
    'about.v3.t': ['Garantia', 'Warranty', 'Garantía', 'Garantie'],
    'about.v3.d': ['6 a 12 meses conforme o trabalho. Se falhar dentro do prazo, voltamos sem custo.', '6 to 12 months depending on the job. If it fails within that time, we come back at no cost.', '6 a 12 meses según el trabajo. Si falla dentro del plazo, volvemos sin coste.', '6 à 12 mois selon le travail. En cas de défaut dans ce délai, nous revenons sans frais.'],
    'about.v4.t': ['Material sério', 'Proper materials', 'Material serio', 'Du bon matériel'],
    'about.v4.d': ['Marcas conhecidas e conformidade legal em tudo o que se liga à corrente.', 'Known brands and legal compliance on everything that plugs into the mains.', 'Marcas conocidas y conformidad legal en todo lo que se conecta a la corriente.', 'Marques reconnues et conformité légale sur tout ce qui est raccordé au secteur.'],
    'about.h2rec': ['Reconhecimento', 'Recognition', 'Reconocimiento', 'Reconnaissance'],
    'about.rec.p': ['Somos <strong>Especialista Destacado</strong> na plataforma Fixando, com avaliação de 5 estrelas dos clientes que nos contrataram por lá — o mesmo padrão que aplicamos a quem chega pelo site ou por indicação.', 'We are a <strong>Featured Specialist</strong> on the Fixando platform, with a 5-star rating from clients who hired us there — the same standard we bring to anyone who comes via the site or a referral.', 'Somos <strong>Especialista Destacado</strong> en la plataforma Fixando, con valoración de 5 estrellas de los clientes que nos contrataron allí — el mismo estándar que aplicamos a quien llega por la web o por recomendación.', 'Nous sommes <strong>Spécialiste en vedette</strong> sur la plateforme Fixando, avec une note de 5 étoiles des clients qui nous y ont engagés — le même niveau d’exigence pour ceux qui viennent par le site ou par recommandation.'],
    'about.figcap': ['Diogo Bizarro · Especialista Destacado (Fixando)', 'Diogo Bizarro · Featured Specialist (Fixando)', 'Diogo Bizarro · Especialista Destacado (Fixando)', 'Diogo Bizarro · Spécialiste en vedette (Fixando)'],
    'about.tape':   ['Fundador', 'Founder', 'Fundador', 'Fondateur'],
    'about.sp.company': ['Empresa', 'Company', 'Empresa', 'Société'],
    'about.sp.brand':   ['Marca', 'Brand', 'Marca', 'Marque'],
    'about.sp.base':    ['Base', 'Base', 'Base', 'Base'],
    'about.sp.since':   ['Desde', 'Since', 'Desde', 'Depuis'],
    'about.sp.jobs':    ['Obras', 'Jobs', 'Obras', 'Chantiers'],
    'about.bandAlt': ['Obra da Dizarro: televisor montado com cablagem escondida numa sala', 'A Dizarro job: wall-mounted TV with hidden cabling in a living room', 'Obra de Dizarro: televisor montado con cableado oculto en un salón', 'Chantier Dizarro : téléviseur mural avec câblage caché dans un salon'],
    'about.cta.h': ['Vamos falar da sua obra', 'Let’s talk about your job', 'Hablemos de tu obra', 'Parlons de votre chantier'],

    /* ===== Portfólio / projeto ===== */
    'pf.title': ['Trabalhos — Dizarro', 'Projects — Dizarro', 'Trabajos — Dizarro', 'Réalisations — Dizarro'],
    'pf.desc':  ['Trabalhos reais da Dizarro na região do Porto: eletricidade, redes e sites, carpintaria e montagem de móveis, e pinturas. Estudos de caso com antes e depois.', 'Real Dizarro jobs across the Porto region: electrical, networks and websites, carpentry and furniture assembly, and painting. Case studies with before and after.', 'Trabajos reales de Dizarro en la región de Oporto: electricidad, redes y webs, carpintería y montaje de muebles, y pintura. Casos con antes y después.', 'Travaux réels de Dizarro dans la région de Porto : électricité, réseaux et sites, menuiserie et montage de meubles, et peinture. Études de cas avec avant/après.'],
    'pf.crumb': ['Trabalhos', 'Projects', 'Trabajos', 'Réalisations'],
    'pf.h1':    ['Obras <span class="o">reais</span>,<br>não renders', '<span class="o">Real</span> jobs,<br>not renders', 'Obras <span class="o">reales</span>,<br>no renders', 'Des chantiers <span class="o">réels</span>,<br>pas des rendus'],
    'pf.sub':   ['Uma seleção de trabalhos da Dizarro na região do Porto. Clique num projeto para ver o antes/depois, os materiais e o que foi resolvido.', 'A selection of Dizarro jobs across the Porto region. Click a project for the before/after, the materials and what was solved.', 'Una selección de trabajos de Dizarro en la región de Oporto. Haz clic en un proyecto para ver el antes/después, los materiales y lo que se resolvió.', 'Une sélection de chantiers Dizarro dans la région de Porto. Cliquez sur un projet pour l’avant/après, les matériaux et ce qui a été résolu.'],
    'pf.filter.aria': ['Filtrar por área', 'Filter by area', 'Filtrar por área', 'Filtrer par domaine'],
    'pf.filter.all':  ['Todos', 'All', 'Todos', 'Tous'],
    'pf.filter.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'pf.filter.tel':  ['Telecom &amp; Redes', 'Telecom &amp; Networks', 'Telecom y Redes', 'Télécom &amp; Réseaux'],
    'pf.filter.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'pf.filter.pint': ['Pinturas', 'Painting', 'Pintura', 'Peinture'],
    'pf.note':  ['Alguns projetos estão à espera das fotos finais — a ficha técnica já está completa. Quer ver trabalhos semelhantes ao seu? <a href="contactos.html#orcamento">Fale connosco</a>.', 'Some projects are waiting on final photos — the write-up is already complete. Want to see work like yours? <a href="contactos.html#orcamento">Get in touch</a>.', 'Algunos proyectos esperan las fotos finales — la ficha ya está completa. ¿Quieres ver trabajos como el tuyo? <a href="contactos.html#orcamento">Habla con nosotros</a>.', 'Certains projets attendent les photos finales — la fiche est déjà complète. Envie de voir des travaux comme le vôtre ? <a href="contactos.html#orcamento">Contactez-nous</a>.'],
    'pf.cta.h': ['O próximo trabalho pode ser o seu', 'The next job could be yours', 'El próximo trabajo puede ser el tuyo', 'Le prochain chantier peut être le vôtre'],
    'proj.loading':   ['A carregar o trabalho…', 'Loading the project…', 'Cargando el trabajo…', 'Chargement du projet…'],
    'proj.notfound':  ['Trabalho não encontrado.', 'Project not found.', 'Trabajo no encontrado.', 'Projet introuvable.'],
    'proj.back':      ['← Ver todos os trabalhos', '← See all projects', '← Ver todos los trabajos', '← Voir toutes les réalisations'],
    'proj.challenge': ['O desafio', 'The challenge', 'El reto', 'Le défi'],
    'proj.solution':  ['A nossa solução', 'Our solution', 'Nuestra solución', 'Notre solution'],
    'proj.result':    ['O resultado', 'The result', 'El resultado', 'Le résultat'],
    'proj.highlights':['Destaques', 'Highlights', 'Destacados', 'Points forts'],
    'proj.related':   ['Trabalhos relacionados', 'Related projects', 'Trabajos relacionados', 'Projets liés'],
    'proj.ctaWant':   ['Quero algo parecido', 'I want something similar', 'Quiero algo parecido', 'Je veux quelque chose de similaire'],
    'proj.metaYear':  ['Ano', 'Year', 'Año', 'Année'],
    'proj.metaDur':   ['Duração', 'Duration', 'Duración', 'Durée'],
    'proj.metaLoc':   ['Local', 'Location', 'Lugar', 'Lieu'],

    /* ===== Privacidade ===== */
    'priv.title':  ['Privacidade &amp; Cookies — Dizarro', 'Privacy &amp; Cookies — Dizarro', 'Privacidad y Cookies — Dizarro', 'Confidentialité &amp; Cookies — Dizarro'],
    'priv.desc':   ['Como a Dizarro trata os dados enviados pelos formulários do site e que cookies/armazenamento local o site usa.', 'How Dizarro handles data sent through the site’s forms and which cookies/local storage the site uses.', 'Cómo trata Dizarro los datos enviados por los formularios del sitio y qué cookies/almacenamiento local usa el sitio.', 'Comment Dizarro traite les données envoyées via les formulaires du site et quels cookies/stockage local le site utilise.'],
    'priv.crumb':  ['Privacidade', 'Privacy', 'Privacidad', 'Confidentialité'],
    'priv.h1':     ['Privacidade<br>&amp; <span class="o">cookies</span>', 'Privacy<br>&amp; <span class="o">cookies</span>', 'Privacidad<br>y <span class="o">cookies</span>', 'Confidentialité<br>&amp; <span class="o">cookies</span>'],
    'priv.sub':    ['Em linguagem simples: só recolhemos o que precisamos para responder ao seu pedido, e não vendemos nem partilhamos os seus dados.', 'In plain terms: we only collect what we need to answer your request, and we do not sell or share your data.', 'En lenguaje simple: solo recogemos lo necesario para responder a tu solicitud, y no vendemos ni compartimos tus datos.', 'En clair : nous ne collectons que ce qu’il faut pour répondre à votre demande, et nous ne vendons ni ne partageons vos données.'],
    'priv.h.resp':  ['Responsável', 'Controller', 'Responsable', 'Responsable'],
    'priv.resp':    ['<strong>Dizarro</strong>, Padrão da Légua, Matosinhos, Porto. Contacto: <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>.', '<strong>Dizarro</strong>, Padrão da Légua, Matosinhos, Porto. Contact: <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>.', '<strong>Dizarro</strong>, Padrão da Légua, Matosinhos, Oporto. Contacto: <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>.', '<strong>Dizarro</strong>, Padrão da Légua, Matosinhos, Porto. Contact : <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>.'],
    'priv.h.what':  ['Que dados recolhemos', 'What data we collect', 'Qué datos recogemos', 'Quelles données nous collectons'],
    'priv.what':    ['<li>Os que introduz no formulário de orçamento: nome, telefone, área de serviço, localidade e descrição do trabalho.</li><li>A página onde o formulário foi submetido e o tipo de navegador (para diagnóstico e anti-spam).</li>', '<li>What you enter in the quote form: name, phone, service area, location and job description.</li><li>The page the form was submitted from and the browser type (for diagnostics and anti-spam).</li>', '<li>Lo que introduces en el formulario de presupuesto: nombre, teléfono, área de servicio, localidad y descripción del trabajo.</li><li>La página desde la que se envió el formulario y el tipo de navegador (para diagnóstico y antispam).</li>', '<li>Ce que vous saisissez dans le formulaire de devis : nom, téléphone, domaine, lieu et description du chantier.</li><li>La page d’envoi du formulaire et le type de navigateur (diagnostic et anti-spam).</li>'],
    'priv.h.why':   ['Para que servem', 'What we use them for', 'Para qué sirven', 'À quoi elles servent'],
    'priv.why':     ['Unicamente para responder ao pedido e, se houver adjudicação, para organizar a obra. Base legal: diligências pré-contratuais a seu pedido (RGPD, art.º 6.º/1-b).', 'Solely to answer the request and, if the job goes ahead, to organise the work. Legal basis: pre-contractual steps at your request (GDPR, Art. 6(1)(b)).', 'Únicamente para responder a la solicitud y, si hay adjudicación, para organizar la obra. Base legal: actuaciones precontractuales a petición del interesado (RGPD, art. 6.1.b).', 'Uniquement pour répondre à la demande et, en cas d’acceptation, pour organiser le chantier. Base légale : mesures précontractuelles à votre demande (RGPD, art. 6, §1, b).'],
    'priv.h.where': ['Para onde vão', 'Where they go', 'Adónde van', 'Où elles vont'],
    'priv.where':   ['<li><strong>E-mail</strong>, através do serviço <a href="https://formsubmit.co" target="_blank" rel="noopener">FormSubmit</a>, que encaminha a submissão para a nossa caixa de correio.</li><li><strong>Base de dados Supabase</strong> da Dizarro, onde o pedido fica registado para não se perder. O acesso é restrito à equipa.</li>', '<li><strong>Email</strong>, via the <a href="https://formsubmit.co" target="_blank" rel="noopener">FormSubmit</a> service, which forwards the submission to our inbox.</li><li>Dizarro’s <strong>Supabase database</strong>, where the request is logged so it is not lost. Access is restricted to the team.</li>', '<li><strong>Correo</strong>, mediante el servicio <a href="https://formsubmit.co" target="_blank" rel="noopener">FormSubmit</a>, que reenvía el envío a nuestro buzón.</li><li><strong>Base de datos Supabase</strong> de Dizarro, donde queda registrada la solicitud para que no se pierda. El acceso está restringido al equipo.</li>', '<li><strong>E-mail</strong>, via le service <a href="https://formsubmit.co" target="_blank" rel="noopener">FormSubmit</a>, qui transmet l’envoi à notre boîte.</li><li><strong>Base de données Supabase</strong> de Dizarro, où la demande est enregistrée pour ne pas être perdue. Accès réservé à l’équipe.</li>'],
    'priv.noads':   ['Não há transferência para fins de publicidade nem venda de dados a terceiros.', 'There is no transfer for advertising purposes and no sale of data to third parties.', 'No hay transferencia con fines publicitarios ni venta de datos a terceros.', 'Aucun transfert à des fins publicitaires ni vente de données à des tiers.'],
    'priv.h.keep':  ['Quanto tempo guardamos', 'How long we keep them', 'Cuánto tiempo los guardamos', 'Durée de conservation'],
    'priv.keep':    ['Pedidos sem seguimento: até 12 meses. Pedidos que dão origem a obra: pelo período necessário à garantia e às obrigações legais (contabilísticas/fiscais).', 'Requests with no follow-up: up to 12 months. Requests that lead to work: for as long as needed for the warranty and legal (accounting/tax) obligations.', 'Solicitudes sin seguimiento: hasta 12 meses. Solicitudes que dan lugar a obra: durante el periodo necesario para la garantía y las obligaciones legales (contables/fiscales).', 'Demandes sans suite : jusqu’à 12 mois. Demandes donnant lieu à un chantier : le temps nécessaire à la garantie et aux obligations légales (comptables/fiscales).'],
    'priv.h.cookies': ['Cookies e armazenamento local', 'Cookies and local storage', 'Cookies y almacenamiento local', 'Cookies et stockage local'],
    'priv.cookies1': ['O site <strong>não usa cookies de rastreio nem publicidade</strong>. Guarda apenas, no seu próprio navegador (localStorage), a sua preferência de tema claro/escuro e de idioma. Pode limpá-las nas definições do navegador a qualquer momento.', 'The site <strong>uses no tracking or advertising cookies</strong>. It only stores, in your own browser (localStorage), your light/dark theme and language preference. You can clear these in your browser settings at any time.', 'El sitio <strong>no usa cookies de rastreo ni publicidad</strong>. Solo guarda, en tu propio navegador (localStorage), tu preferencia de tema claro/oscuro e idioma. Puedes borrarlas en los ajustes del navegador cuando quieras.', 'Le site <strong>n’utilise aucun cookie de suivi ni de publicité</strong>. Il ne stocke, dans votre navigateur (localStorage), que votre préférence de thème clair/sombre et de langue. Vous pouvez les effacer dans les réglages du navigateur à tout moment.'],
    'priv.cookies2': ['As tipografias são carregadas do Google Fonts; ao servir os tipos de letra, o Google pode registar o pedido (endereço IP) — é o único recurso externo do site. <span class="mono" style="text-transform:none">Nota técnica:</span> os tipos podem ser alojados no próprio domínio para evitar este pedido — ver <code>DEPLOY.md</code>.', 'Fonts are loaded from Google Fonts; when serving the fonts, Google may log the request (IP address) — it is the site’s only external resource. <span class="mono" style="text-transform:none">Technical note:</span> the fonts can be self-hosted to avoid this request — see <code>DEPLOY.md</code>.', 'Las tipografías se cargan de Google Fonts; al servir las fuentes, Google puede registrar la petición (dirección IP) — es el único recurso externo del sitio. <span class="mono" style="text-transform:none">Nota técnica:</span> las fuentes pueden alojarse en el propio dominio para evitar esta petición — ver <code>DEPLOY.md</code>.', 'Les polices sont chargées depuis Google Fonts ; en les servant, Google peut enregistrer la requête (adresse IP) — c’est la seule ressource externe du site. <span class="mono" style="text-transform:none">Note technique :</span> les polices peuvent être hébergées sur le domaine pour éviter cette requête — voir <code>DEPLOY.md</code>.'],
    'priv.h.rights': ['Os seus direitos', 'Your rights', 'Tus derechos', 'Vos droits'],
    'priv.rights':  ['Pode pedir acesso, correção ou eliminação dos seus dados, por e-mail para <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>. Tem também o direito de reclamar junto da CNPD.', 'You can request access, correction or deletion of your data by emailing <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>. You also have the right to complain to the Portuguese DPA (CNPD).', 'Puedes solicitar acceso, corrección o eliminación de tus datos por correo a <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>. También tienes derecho a reclamar ante la autoridad de control (CNPD).', 'Vous pouvez demander l’accès, la rectification ou l’effacement de vos données par e-mail à <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>. Vous avez aussi le droit de saisir l’autorité de contrôle (CNPD).'],
    'priv.updated': ['Última atualização: 2026.', 'Last updated: 2026.', 'Última actualización: 2026.', 'Dernière mise à jour : 2026.'],
    'ct.card.aria': ['Contactos diretos', 'Direct contacts', 'Contactos directos', 'Contacts directs'],
    'svc.formLabel': ['Ficha do serviço', 'Service sheet', 'Ficha del servicio', 'Fiche du service'],

    /* ===== Eletricidade ===== */
    'elec.title': ['Eletricidade — trocas e reparações no Porto — Dizarro', 'Electrical — swaps and repairs in Porto — Dizarro', 'Electricidad — cambios y reparaciones en Oporto — Dizarro', 'Électricité — remplacements et réparations à Porto — Dizarro'],
    'elec.desc':  ['Troca de luminárias, tomadas, interruptores e disjuntores, e pequenas reparações elétricas na região do Porto. Não fazemos quadros elétricos de raiz.', 'Swapping light fittings, sockets, switches and breakers, plus small electrical repairs across the Porto region. We don’t build electrical panels from scratch.', 'Cambio de luminarias, enchufes, interruptores y magnetotérmicos, y pequeñas reparaciones eléctricas en la región de Oporto. No hacemos cuadros eléctricos de cero.', 'Remplacement de luminaires, prises, interrupteurs et disjoncteurs, et petites réparations électriques dans la région de Porto. Nous ne montons pas de tableaux électriques de zéro.'],
    'elec.h1':    ['<span class="o">Eletricidade</span><br>o essencial, bem feito', '<span class="o">Electrical</span><br>the essentials, done right', '<span class="o">Electricidad</span><br>lo esencial, bien hecho', '<span class="o">Électricité</span><br>l’essentiel, bien fait'],
    'elec.sub':   ['Troca de luzes, tomadas, interruptores e disjuntores, e reparações do dia a dia. Trabalho simples, limpo e seguro — sem obra grande. Não fazemos quadros elétricos novos.', 'Swapping lights, sockets, switches and breakers, and everyday repairs. Simple, clean, safe work — no big building work. We don’t build new electrical panels.', 'Cambio de luces, enchufes, interruptores y magnetotérmicos, y reparaciones del día a día. Trabajo simple, limpio y seguro — sin obra grande. No hacemos cuadros eléctricos nuevos.', 'Remplacement de lampes, prises, interrupteurs et disjoncteurs, et réparations du quotidien. Un travail simple, propre et sûr — sans gros chantier. Nous ne montons pas de tableaux électriques neufs.'],
    'elec.intro': ['Nem tudo precisa de um eletricista para uma semana. Muitas vezes é só trocar uma luminária que deixou de funcionar, mudar tomadas antigas, pôr um interruptor com regulação ou substituir um disjuntor que dispara. É disso que a Dizarro trata — com rapidez, material sério e a casa a ficar arrumada. <strong>Quadros elétricos de raiz e instalações completas não fazemos</strong>; nesses casos indicamos um parceiro.', 'Not everything needs an electrician for a week. Often it’s just swapping a light fitting that stopped working, changing old sockets, fitting a dimmer switch or replacing a breaker that keeps tripping. That’s what Dizarro handles — quickly, with proper materials, leaving the place tidy. <strong>We don’t build electrical panels from scratch or do full installations</strong>; for those we point you to a partner.', 'No todo necesita un electricista para una semana. Muchas veces es solo cambiar una luminaria que dejó de funcionar, sustituir enchufes viejos, poner un interruptor regulable o cambiar un magnetotérmico que salta. De eso se ocupa Dizarro — rápido, con material serio y dejando la casa recogida. <strong>Cuadros eléctricos de cero e instalaciones completas no hacemos</strong>; en esos casos te indicamos un socio.', 'Tout ne demande pas un électricien pour une semaine. Souvent, il s’agit juste de remplacer un luminaire qui ne marche plus, de changer de vieilles prises, de poser un variateur ou de remplacer un disjoncteur qui saute. C’est ce dont Dizarro s’occupe — vite, avec du bon matériel, en laissant les lieux propres. <strong>Les tableaux électriques de zéro et les installations complètes, nous ne les faisons pas</strong> ; dans ce cas, nous vous orientons vers un partenaire.'],
    'elec.list':  ['<li>Troca de luminárias, apliques e focos (interior e exterior)</li><li>Substituição de tomadas e interruptores</li><li>Interruptores com regulação (dimmer) e comandados</li><li>Substituição de disjuntores e diferenciais que disparam ou aquecem</li><li>Montagem de candeeiros, focos e fitas LED</li><li>Pequenas reparações: pontos sem corrente, contactos queimados</li><li><em>Não fazemos:</em> quadros elétricos novos nem instalações de raiz</li>', '<li>Swapping light fittings, wall lights and spots (indoor and outdoor)</li><li>Replacing sockets and switches</li><li>Dimmer and remote-controlled switches</li><li>Replacing breakers and RCDs that trip or overheat</li><li>Fitting lamps, spots and LED strips</li><li>Small repairs: dead points, burnt contacts</li><li><em>We don’t do:</em> new electrical panels or installations from scratch</li>', '<li>Cambio de luminarias, apliques y focos (interior y exterior)</li><li>Sustitución de enchufes e interruptores</li><li>Interruptores regulables (dimmer) y con mando</li><li>Sustitución de magnetotérmicos y diferenciales que saltan o calientan</li><li>Montaje de lámparas, focos y tiras LED</li><li>Pequeñas reparaciones: puntos sin corriente, contactos quemados</li><li><em>No hacemos:</em> cuadros eléctricos nuevos ni instalaciones de cero</li>', '<li>Remplacement de luminaires, appliques et spots (intérieur et extérieur)</li><li>Remplacement de prises et d’interrupteurs</li><li>Interrupteurs variateurs et commandés</li><li>Remplacement de disjoncteurs et différentiels qui sautent ou chauffent</li><li>Pose de lampes, spots et rubans LED</li><li>Petites réparations : points sans courant, contacts brûlés</li><li><em>Nous ne faisons pas :</em> tableaux électriques neufs ni installations de zéro</li>'],
    'elec.how':   ['Vemos o que se passa, dizemos o que é preciso e o preço antes de mexer. Trabalho limpo, testado no fim, e a casa fica arrumada.', 'We look at what’s going on, tell you what’s needed and the price before touching anything. Clean work, tested at the end, and the place left tidy.', 'Vemos qué pasa, decimos qué hace falta y el precio antes de tocar nada. Trabajo limpio, probado al final, y la casa recogida.', 'On regarde ce qui se passe, on dit ce qu’il faut et le prix avant de toucher à quoi que ce soit. Travail propre, testé à la fin, et les lieux rangés.'],
    'elec.ex':    ['Apartamento em Matosinhos: substituição das luminárias antigas por LED em toda a casa, troca de tomadas partidas e de um disjuntor que disparava — resolvido numa manhã.', 'Flat in Matosinhos: replacing the old light fittings with LED throughout, swapping broken sockets and a breaker that kept tripping — done in a morning.', 'Piso en Matosinhos: sustitución de las luminarias antiguas por LED en toda la casa, cambio de enchufes rotos y de un magnetotérmico que saltaba — resuelto en una mañana.', 'Appartement à Matosinhos : remplacement des vieux luminaires par des LED dans tout le logement, changement de prises cassées et d’un disjoncteur qui sautait — réglé en une matinée.'],
    'elec.cap1': ['<b>Luzes</b><span>Troca de luminárias, apliques e focos, com teste no fim.</span>', '<b>Lights</b><span>Swapping light fittings, wall lights and spots, tested at the end.</span>', '<b>Luces</b><span>Cambio de luminarias, apliques y focos, con prueba al final.</span>', '<b>Lumières</b><span>Remplacement de luminaires, appliques et spots, testés à la fin.</span>'],
    'elec.cap2': ['<b>Tomadas &amp; interruptores</b><span>Substituição rápida, incluindo interruptores com regulação.</span>', '<b>Sockets &amp; switches</b><span>Quick replacement, including dimmer switches.</span>', '<b>Enchufes e interruptores</b><span>Sustitución rápida, incluidos interruptores regulables.</span>', '<b>Prises &amp; interrupteurs</b><span>Remplacement rapide, variateurs compris.</span>'],
    'elec.cap3': ['<b>Disjuntores</b><span>Troca de proteções que disparam ou aquecem.</span>', '<b>Breakers</b><span>Replacing protection devices that trip or overheat.</span>', '<b>Magnetotérmicos</b><span>Cambio de protecciones que saltan o calientan.</span>', '<b>Disjoncteurs</b><span>Remplacement des protections qui sautent ou chauffent.</span>'],
    'elec.cap4': ['<b>Reparações</b><span>Pontos sem corrente e contactos queimados, localizados e resolvidos.</span>', '<b>Repairs</b><span>Dead points and burnt contacts, located and fixed.</span>', '<b>Reparaciones</b><span>Puntos sin corriente y contactos quemados, localizados y resueltos.</span>', '<b>Réparations</b><span>Points sans courant et contacts brûlés, localisés et réglés.</span>'],
    'elec.baLead': ['Apliques de parede numa fachada de chapa perfilada: da montagem com o casquilho e os fios à vista ao acabamento com a caixa fechada.', 'Wall lights on profiled-metal cladding: from assembly with the lampholder and wires showing, to the finished, closed housing.', 'Apliques de pared en una fachada de chapa perfilada: del montaje con el portalámparas y los cables a la vista al acabado con la caja cerrada.', 'Appliques murales sur bardage métallique nervuré : du montage avec la douille et les fils apparents à la finition boîtier fermé.'],
    'elec.baBeforeAlt': ['Antes: aplique montado com o casquilho e os fios à vista', 'Before: wall light mounted with lampholder and wires showing', 'Antes: aplique montado con portalámparas y cables a la vista', 'Avant : applique montée avec douille et fils apparents'],
    'elec.baAfterAlt':  ['Depois: aplique com a caixa fechada e alinhada', 'After: wall light with the housing closed and aligned', 'Después: aplique con la caja cerrada y alineada', 'Après : applique boîtier fermé et aligné'],
    'elec.g1': ['Focos LED embutidos no teto', 'Recessed LED downlights in the ceiling', 'Focos LED empotrados en el techo', 'Spots LED encastrés au plafond'],
    'elec.g2': ['Ventoinha de teto com luz', 'Ceiling fan with light', 'Ventilador de techo con luz', 'Ventilateur de plafond avec lumière'],
    'elec.g3': ['Ventoinha de teto · outra divisão', 'Ceiling fan · another room', 'Ventilador de techo · otra estancia', 'Ventilateur de plafond · autre pièce'],
    'elec.bandAlt': ['Mãos a ligar tomadas e interruptores numa parede, com alicate', 'Hands wiring sockets and switches on a wall, with pliers', 'Manos conectando enchufes e interruptores en una pared, con alicate', 'Des mains câblant prises et interrupteurs sur un mur, à la pince'],
    'elec.ctaH': ['Uma luz que não acende? Trocamos.', 'A light that won’t turn on? We’ll swap it.', '¿Una luz que no enciende? La cambiamos.', 'Une lumière qui ne s’allume plus ? On la remplace.'],

    /* ===== Telecom & Redes ===== */
    'tel.title': ['Telecomunicações, redes e sites no Porto — Dizarro', 'Telecom, networks and websites in Porto — Dizarro', 'Telecom, redes y sitios web en Oporto — Dizarro', 'Télécom, réseaux et sites web à Porto — Dizarro'],
    'tel.desc':  ['Passagem de cabos de internet e TV, Wi-Fi, repetidores, ligações, pontos de rede e fibra — e criação de sites como este, na região do Porto.', 'Pulling internet and TV cable, Wi-Fi, repeaters, connections, network points and fibre — and building websites like this one, across the Porto region.', 'Tendido de cable de internet y TV, Wi-Fi, repetidores, conexiones, puntos de red y fibra — y creación de sitios web como este, en la región de Oporto.', 'Tirage de câble internet et TV, Wi-Fi, répéteurs, raccordements, prises réseau et fibre — et création de sites web comme celui-ci, dans la région de Porto.'],
    'tel.h1':    ['<span class="b">Redes</span>, Wi-Fi<br>e sites', '<span class="b">Networks</span>, Wi-Fi<br>and websites', '<span class="b">Redes</span>, Wi-Fi<br>y sitios web', '<span class="b">Réseaux</span>, Wi-Fi<br>et sites web'],
    'tel.sub':   ['Passamos cabo de internet e TV onde precisa, montamos o Wi-Fi para chegar a toda a casa com repetidores e pontos de acesso, tratamos da fibra e das ligações — e também criamos o site do seu negócio.', 'We run internet and TV cable where you need it, set up Wi-Fi to reach the whole home with repeaters and access points, handle the fibre and the connections — and we also build your business website.', 'Pasamos cable de internet y TV donde lo necesitas, montamos el Wi-Fi para que llegue a toda la casa con repetidores y puntos de acceso, nos ocupamos de la fibra y las conexiones — y también creamos la web de tu negocio.', 'Nous tirons le câble internet et TV où il faut, installons le Wi-Fi pour couvrir toute la maison avec répéteurs et points d’accès, gérons la fibre et les raccordements — et nous créons aussi le site de votre entreprise.'],
    'tel.intro': ['A maior parte dos problemas de rede não é o operador — é a instalação. Cabo a menos, tudo por Wi-Fi, um repetidor mal colocado. A Dizarro organiza a rede da casa ou do escritório, e leva o mesmo cuidado à presença online: fazemos sites simples e rápidos, como o que está a ver.', 'Most network problems aren’t the ISP — it’s the wiring. Too little cable, everything over Wi-Fi, a repeater in the wrong place. Dizarro sorts out the network in a home or office, and brings the same care to your online presence: we build simple, fast websites, like the one you’re looking at.', 'La mayoría de los problemas de red no son del operador — es la instalación. Poco cable, todo por Wi-Fi, un repetidor mal puesto. Dizarro organiza la red de la casa o la oficina, y aplica el mismo cuidado a la presencia online: hacemos sitios web simples y rápidos, como el que estás viendo.', 'La plupart des problèmes de réseau ne viennent pas du fournisseur — mais de l’installation. Trop peu de câble, tout en Wi-Fi, un répéteur mal placé. Dizarro remet le réseau d’un logement ou d’un bureau en ordre, et apporte le même soin à votre présence en ligne : nous créons des sites simples et rapides, comme celui que vous consultez.'],
    'tel.list':  ['<li>Passagem de cabo de internet e de TV para qualquer divisão</li><li>Wi-Fi em toda a casa: repetidores, pontos de acesso e sistemas mesh</li><li>Repartidores, ligações e arrumação do router / bastidor</li><li>Instalação e extensão de fibra ótica</li><li>Pontos de rede e de TV dedicados</li><li>Criação de sites institucionais e páginas de negócio (como este)</li>', '<li>Running internet and TV cable to any room</li><li>Whole-home Wi-Fi: repeaters, access points and mesh systems</li><li>Splitters, connections and tidying the router / rack</li><li>Fibre optic installation and extension</li><li>Dedicated network and TV points</li><li>Building business websites and landing pages (like this one)</li>', '<li>Tendido de cable de internet y TV a cualquier habitación</li><li>Wi-Fi en toda la casa: repetidores, puntos de acceso y sistemas mesh</li><li>Repartidores, conexiones y orden del router / rack</li><li>Instalación y extensión de fibra óptica</li><li>Puntos de red y de TV dedicados</li><li>Creación de webs corporativas y páginas de negocio (como esta)</li>', '<li>Tirage de câble internet et TV vers n’importe quelle pièce</li><li>Wi-Fi dans toute la maison : répéteurs, points d’accès et systèmes mesh</li><li>Répartiteurs, raccordements et rangement du routeur / de la baie</li><li>Installation et extension de fibre optique</li><li>Prises réseau et TV dédiées</li><li>Création de sites vitrines et pages d’entreprise (comme celui-ci)</li>'],
    'tel.how':   ['Vemos onde falha o sinal, passamos o cabo (novo ou aproveitando calhas), colocamos o Wi-Fi nos sítios certos e deixamos um esquema simples do que está ligado a quê. Para o site, tratamos de tudo: textos, fotos, domínio e publicação.', 'We find where the signal drops, run the cable (new or reusing trunking), place the Wi-Fi in the right spots and leave a simple map of what’s connected to what. For the website, we handle everything: text, photos, domain and publishing.', 'Vemos dónde falla la señal, pasamos el cable (nuevo o aprovechando canaletas), ponemos el Wi-Fi en los sitios correctos y dejamos un esquema simple de qué está conectado a qué. Para la web, nos ocupamos de todo: textos, fotos, dominio y publicación.', 'On repère où le signal chute, on tire le câble (neuf ou en réutilisant les goulottes), on place le Wi-Fi aux bons endroits et on laisse un schéma simple de qui est branché où. Pour le site, on s’occupe de tout : textes, photos, domaine et mise en ligne.'],
    'tel.ex':    ['Escritório no Porto: cabo de rede novo para 8 postos, dois pontos de acesso Wi-Fi para acabar com as zonas mortas e bastidor arrumado — a funcionar numa tarde.', 'Office in Porto: new network cable to 8 desks, two Wi-Fi access points to kill the dead spots and a tidy rack — working in an afternoon.', 'Oficina en Oporto: cable de red nuevo para 8 puestos, dos puntos de acceso Wi-Fi para acabar con las zonas muertas y rack ordenado — funcionando en una tarde.', 'Bureau à Porto : nouveau câble réseau vers 8 postes, deux points d’accès Wi-Fi pour supprimer les zones mortes et une baie rangée — opérationnel en un après-midi.'],
    'tel.webH':  ['Criação de sites', 'Website creation', 'Creación de sitios web', 'Création de sites'],
    'tel.webP':  ['Fazemos sites como este — rápidos, adaptados ao telemóvel e fáceis de encontrar no Google. Uma página, um portefólio, um catálogo simples. Tratamos dos textos, das fotos, do domínio e da publicação, e explicamos como atualizar sozinho.', 'We build sites like this one — fast, mobile-friendly and easy to find on Google. A one-pager, a portfolio, a simple catalogue. We handle the text, photos, domain and publishing, and show you how to update it yourself.', 'Hacemos webs como esta — rápidas, adaptadas al móvil y fáciles de encontrar en Google. Una página, un portafolio, un catálogo simple. Nos ocupamos de textos, fotos, dominio y publicación, y te enseñamos a actualizarla tú mismo.', 'Nous créons des sites comme celui-ci — rapides, adaptés au mobile et faciles à trouver sur Google. Une page, un portfolio, un catalogue simple. Nous gérons les textes, les photos, le domaine et la mise en ligne, et vous montrons comment le mettre à jour vous-même.'],
    'tel.cap1': ['<b>Cabo &amp; TV</b><span>Internet e televisão em qualquer divisão, sem fios à vista.</span>', '<b>Cable &amp; TV</b><span>Internet and TV in any room, no wires on show.</span>', '<b>Cable y TV</b><span>Internet y televisión en cualquier estancia, sin cables a la vista.</span>', '<b>Câble &amp; TV</b><span>Internet et télévision dans toute pièce, sans fils apparents.</span>'],
    'tel.cap2': ['<b>Wi-Fi</b><span>Cobertura sem falhas com repetidores e pontos de acesso.</span>', '<b>Wi-Fi</b><span>Seamless coverage with repeaters and access points.</span>', '<b>Wi-Fi</b><span>Cobertura sin fallos con repetidores y puntos de acceso.</span>', '<b>Wi-Fi</b><span>Couverture sans faille avec répéteurs et points d’accès.</span>'],
    'tel.cap3': ['<b>Fibra</b><span>Instalação, extensão e ligações dentro do edifício.</span>', '<b>Fibre</b><span>Installation, extension and connections inside the building.</span>', '<b>Fibra</b><span>Instalación, extensión y conexiones dentro del edificio.</span>', '<b>Fibre</b><span>Installation, extension et raccordements dans le bâtiment.</span>'],
    'tel.cap4': ['<b>Sites</b><span>Sites simples e rápidos para o seu negócio, como este.</span>', '<b>Websites</b><span>Simple, fast websites for your business, like this one.</span>', '<b>Webs</b><span>Sitios web simples y rápidos para tu negocio, como este.</span>', '<b>Sites</b><span>Des sites simples et rapides pour votre activité, comme celui-ci.</span>'],
    'tel.baLead': ['Reorganização de rede num escritório: da confusão de cabos e routers empilhados a ponto de acesso montado e cablagem em calha, com UPS.', 'Network overhaul in an office: from a mess of cables and stacked routers to a mounted access point and trunked cabling, with a UPS.', 'Reorganización de red en una oficina: del lío de cables y routers apilados a un punto de acceso montado y cableado en canaleta, con SAI.', 'Réorganisation réseau dans un bureau : d’un enchevêtrement de câbles et de routeurs empilés à un point d’accès monté et un câblage en goulotte, avec onduleur.'],
    'tel.baBeforeAlt': ['Antes: cabos, routers e fontes de alimentação amontoados debaixo da secretária', 'Before: cables, routers and power supplies piled up under the desk', 'Antes: cables, routers y fuentes amontonados bajo el escritorio', 'Avant : câbles, routeurs et alimentations entassés sous le bureau'],
    'tel.baAfterAlt':  ['Depois: ponto de acesso Wi-Fi montado e cablagem organizada em calha', 'After: Wi-Fi access point mounted and cabling tidied into trunking', 'Después: punto de acceso Wi-Fi montado y cableado ordenado en canaleta', 'Après : point d’accès Wi-Fi monté et câblage rangé en goulotte'],
    'tel.g1': ['Bastidor de parede · organização', 'Wall rack · tidy-up', 'Rack de pared · organización', 'Baie murale · rangement'],
    'tel.g2': ['Cablagem a etiquetar e arrumar', 'Cabling to label and tidy', 'Cableado por etiquetar y ordenar', 'Câblage à étiqueter et ranger'],
    'tel.g3': ['Ponto de TV com dados dedicados', 'TV point with a dedicated data outlet', 'Punto de TV con datos dedicados', 'Point TV avec prise data dédiée'],
    'tel.g4': ['Criação de sites — como este', 'Website creation — like this one', 'Creación de webs — como esta', 'Création de sites — comme celui-ci'],
    'tel.g4Alt': ['Portátil com código de um site num escritório', 'Laptop showing website code in an office', 'Portátil mostrando código de una web en una oficina', 'Ordinateur portable affichant le code d’un site dans un bureau'],
    'tel.bandAlt': ['Ponto de acesso D-Link montado com cablagem organizada e UPS', 'Mounted D-Link access point with tidy cabling and a UPS', 'Punto de acceso D-Link montado con cableado ordenado y SAI', 'Point d’accès D-Link monté avec câblage rangé et onduleur'],
    'tel.ctaH': ['Wi-Fi mau ou precisa de site? Falamos.', 'Bad Wi-Fi or need a website? Let’s talk.', '¿Wi-Fi malo o necesitas web? Hablamos.', 'Mauvais Wi-Fi ou besoin d’un site ? Parlons-en.'],

    /* ===== Carpintaria ===== */
    'carp.title': ['Carpintaria e montagem de móveis no Porto — Dizarro', 'Carpentry and furniture assembly in Porto — Dizarro', 'Carpintería y montaje de muebles en Oporto — Dizarro', 'Menuiserie et montage de meubles à Porto — Dizarro'],
    'carp.desc':  ['Montagem e transporte de móveis, peças à medida, recortes, pintura e reparação de madeira, e instalação e manutenção de exaustores na região do Porto.', 'Furniture assembly and transport, made-to-measure pieces, cut-outs, wood painting and repair, and extractor hood installation and maintenance across the Porto region.', 'Montaje y transporte de muebles, piezas a medida, recortes, pintura y reparación de madera, e instalación y mantenimiento de extractores en la región de Oporto.', 'Montage et transport de meubles, pièces sur mesure, découpes, peinture et réparation du bois, et pose et entretien de hottes dans la région de Porto.'],
    'carp.h1':    ['<span class="o">Carpintaria</span><br>e montagem', '<span class="o">Carpentry</span><br>and assembly', '<span class="o">Carpintería</span><br>y montaje', '<span class="o">Menuiserie</span><br>et montage'],
    'carp.sub':   ['Montamos e transportamos os seus móveis, fazemos peças à medida e recortes, pintamos e reparamos madeira — e instalamos, afinamos e mantemos exaustores.', 'We assemble and transport your furniture, make bespoke pieces and cut-outs, paint and repair wood — and we install, tune and maintain extractor hoods.', 'Montamos y transportamos tus muebles, hacemos piezas a medida y recortes, pintamos y reparamos madera — e instalamos, ajustamos y mantenemos extractores.', 'Nous montons et transportons vos meubles, réalisons des pièces sur mesure et des découpes, peignons et réparons le bois — et nous posons, réglons et entretenons les hottes.'],
    'carp.intro': ['Móvel de loja que veio numa caixa, uma prateleira que tem de encaixar num vão certo, uma porta que arrasta, um exaustor que puxa mal. A Dizarro trata da parte de madeira e da montagem, do transporte ao acabamento.', 'Flat-pack furniture that came in a box, a shelf that has to fit an exact gap, a door that drags, an extractor that pulls badly. Dizarro handles the woodwork and the assembly, from transport to finish.', 'Mueble de tienda que vino en una caja, un estante que tiene que encajar en un hueco exacto, una puerta que roza, un extractor que tira mal. Dizarro se ocupa de la parte de madera y del montaje, del transporte al acabado.', 'Un meuble en kit livré dans un carton, une étagère qui doit tenir dans un espace précis, une porte qui frotte, une hotte qui aspire mal. Dizarro s’occupe du bois et du montage, du transport à la finition.'],
    'carp.list':  ['<li>Montagem de móveis (loja ou projeto) e transporte</li><li>Peças à medida: prateleiras, estantes, bancadas, caixotes</li><li>Recortes e ajustes para canos, tomadas e condutas</li><li>Pintura e envernizamento de madeira</li><li>Reparação de móveis, portas e gavetas</li><li>Instalação, afinação e manutenção de exaustores</li>', '<li>Furniture assembly (flat-pack or project) and transport</li><li>Made-to-measure pieces: shelves, units, worktops, crates</li><li>Cut-outs and adjustments for pipes, sockets and ducts</li><li>Wood painting and varnishing</li><li>Repair of furniture, doors and drawers</li><li>Extractor hood installation, tuning and maintenance</li>', '<li>Montaje de muebles (tienda o proyecto) y transporte</li><li>Piezas a medida: estantes, librerías, encimeras, cajones</li><li>Recortes y ajustes para tubos, enchufes y conductos</li><li>Pintura y barnizado de madera</li><li>Reparación de muebles, puertas y cajones</li><li>Instalación, ajuste y mantenimiento de extractores</li>', '<li>Montage de meubles (kit ou projet) et transport</li><li>Pièces sur mesure : étagères, meubles, plans de travail, caisses</li><li>Découpes et ajustements pour tuyaux, prises et conduits</li><li>Peinture et vernissage du bois</li><li>Réparation de meubles, portes et tiroirs</li><li>Pose, réglage et entretien de hottes</li>'],
    'carp.how':   ['Medimos o vão, dizemos o que dá para fazer e o preço, e tratamos do transporte. No fim está montado, a funcionar e limpo.', 'We measure the space, tell you what can be done and the price, and handle the transport. At the end it’s assembled, working and clean.', 'Medimos el hueco, decimos qué se puede hacer y el precio, y nos ocupamos del transporte. Al final está montado, funcionando y limpio.', 'On mesure l’espace, on dit ce qui est faisable et le prix, et on s’occupe du transport. À la fin, c’est monté, fonctionnel et propre.'],
    'carp.ex':    ['Clínica no Grande Porto: móvel em pinho maciço feito à medida para assentar a máquina de laser à altura de trabalho, com portas para arrumar o material.', 'Clinic in Greater Porto: a solid-pine cabinet made to measure to sit the laser machine at working height, with doors to store the supplies.', 'Clínica en el Gran Oporto: mueble en pino macizo hecho a medida para asentar la máquina láser a la altura de trabajo, con puertas para guardar el material.', 'Clinique dans le Grand Porto : meuble en pin massif sur mesure pour poser la machine laser à hauteur de travail, avec portes pour ranger le matériel.'],
    'carp.cap1': ['<b>Montagem</b><span>Móveis de loja ou de projeto, montados e nivelados.</span>', '<b>Assembly</b><span>Flat-pack or project furniture, assembled and levelled.</span>', '<b>Montaje</b><span>Muebles de tienda o de proyecto, montados y nivelados.</span>', '<b>Montage</b><span>Meubles en kit ou de projet, montés et de niveau.</span>'],
    'carp.cap2': ['<b>À medida</b><span>Prateleiras, estantes e bancadas para o vão certo.</span>', '<b>Made to measure</b><span>Shelves, units and worktops for the exact gap.</span>', '<b>A medida</b><span>Estantes, librerías y encimeras para el hueco exacto.</span>', '<b>Sur mesure</b><span>Étagères, meubles et plans de travail pour l’espace exact.</span>'],
    'carp.cap3': ['<b>Recortes</b><span>Passagens para canos, tomadas e condutas, à medida.</span>', '<b>Cut-outs</b><span>Openings for pipes, sockets and ducts, made to fit.</span>', '<b>Recortes</b><span>Pasos para tubos, enchufes y conductos, a medida.</span>', '<b>Découpes</b><span>Passages pour tuyaux, prises et conduits, sur mesure.</span>'],
    'carp.cap4': ['<b>Exaustores</b><span>Instalação, troca de tubo e afinação do caudal.</span>', '<b>Extractors</b><span>Installation, ducting replacement and airflow tuning.</span>', '<b>Extractores</b><span>Instalación, cambio de tubo y ajuste del caudal.</span>', '<b>Hottes</b><span>Pose, remplacement du conduit et réglage du débit.</span>'],
    'carp.g1': ['Sapateira basculante · hall de entrada', 'Tilting shoe cabinet · entrance hall', 'Zapatero abatible · recibidor', 'Meuble à chaussures basculant · entrée'],
    'carp.g2': ['Secretária à medida com gaveteiro', 'Bespoke desk with drawer unit', 'Escritorio a medida con cajonera', 'Bureau sur mesure avec caisson'],
    'carp.g3': ['Armário de cozinha adaptado ao exaustor', 'Kitchen cabinet adapted to the extractor', 'Armario de cocina adaptado al extractor', 'Meuble de cuisine adapté à la hotte'],
    'carp.g4': ['Móvel de apoio para clínica de laser', 'Support cabinet for a laser clinic', 'Mueble de apoyo para clínica láser', 'Meuble d’appoint pour clinique laser'],
    'carp.bandAlt': ['Exaustor de chaminé em inox sobre uma placa de cozinha', 'Stainless chimney extractor hood over a kitchen hob', 'Campana extractora de acero inoxidable sobre una placa de cocina', 'Hotte cheminée en inox au-dessus d’une plaque de cuisson'],
    'carp.ctaH': ['Móvel para montar ou exaustor a puxar mal? Falamos.', 'Furniture to assemble or an extractor pulling badly? Let’s talk.', '¿Mueble para montar o extractor que tira mal? Hablamos.', 'Un meuble à monter ou une hotte qui aspire mal ? Parlons-en.'],

    /* ===== Pinturas ===== */
    'pint.title': ['Pinturas no Porto — Dizarro', 'Painting in Porto — Dizarro', 'Pintura en Oporto — Dizarro', 'Peinture à Porto — Dizarro'],
    'pint.desc':  ['Pintura de paredes, tetos e madeiras, e caixilharia de castanho para branco, na região do Porto. Preparação, proteção e acabamento limpo.', 'Painting walls, ceilings and woodwork, and window frames from brown to white, across the Porto region. Prep, protection and a clean finish.', 'Pintura de paredes, techos y maderas, y carpintería de marrón a blanco, en la región de Oporto. Preparación, protección y acabado limpio.', 'Peinture de murs, plafonds et boiseries, et menuiseries du marron au blanc, dans la région de Porto. Préparation, protection et finition nette.'],
    'pint.h1':    ['<span class="o">Pinturas</span><br>com acabamento', '<span class="o">Painting</span><br>with a clean finish', '<span class="o">Pintura</span><br>con buen acabado', '<span class="o">Peinture</span><br>avec finition nette'],
    'pint.sub':   ['Paredes e tetos, madeiras e caixilharia. Preparamos, protegemos o que fica, e entregamos um acabamento limpo — como as janelas que passaram de castanho a branco.', 'Walls and ceilings, woodwork and window frames. We prep, protect what stays, and deliver a clean finish — like the windows that went from brown to white.', 'Paredes y techos, maderas y carpintería. Preparamos, protegemos lo que se queda, y entregamos un acabado limpio — como las ventanas que pasaron de marrón a blanco.', 'Murs et plafonds, boiseries et menuiseries. On prépare, on protège ce qui reste, et on livre une finition nette — comme les fenêtres passées du marron au blanc.'],
    'pint.intro': ['Uma pintura má vê-se logo: salpicos no vidro, riscos no rodapé, tinta a descascar meses depois. A Dizarro trata da preparação — lixar, limpar, tapar fissuras — antes de dar a primeira demão, e protege o chão, os móveis e os vidros.', 'A bad paint job shows straight away: specks on the glass, streaks on the skirting, paint peeling months later. Dizarro handles the prep — sanding, cleaning, filling cracks — before the first coat, and protects the floor, furniture and glass.', 'Una mala pintura se ve enseguida: salpicaduras en el cristal, marcas en el rodapié, pintura que se pela meses después. Dizarro se ocupa de la preparación — lijar, limpiar, tapar fisuras — antes de la primera mano, y protege el suelo, los muebles y los cristales.', 'Une mauvaise peinture se voit tout de suite : projections sur le verre, traces sur la plinthe, peinture qui s’écaille des mois plus tard. Dizarro s’occupe de la préparation — ponçage, nettoyage, rebouchage — avant la première couche, et protège le sol, les meubles et les vitres.'],
    'pint.list':  ['<li>Pintura de paredes e tetos, interior</li><li>Esmalte de madeiras: portas, rodapés, caixilharia</li><li>Caixilharia de castanho para branco (lixagem + primário + esmalte)</li><li>Preparação: reparar fissuras, betumar, lixar e primário</li><li>Proteção de chão, móveis e vidros com fita e plástico</li><li>Pequenos retoques e mudança de cor de uma divisão</li>', '<li>Painting interior walls and ceilings</li><li>Enamel for woodwork: doors, skirting, window frames</li><li>Window frames from brown to white (sanding + primer + enamel)</li><li>Prep: filling cracks, caulking, sanding and priming</li><li>Protecting floors, furniture and glass with tape and sheeting</li><li>Small touch-ups and changing the colour of a room</li>', '<li>Pintura de paredes y techos, interior</li><li>Esmalte de maderas: puertas, rodapiés, carpintería</li><li>Carpintería de marrón a blanco (lijado + imprimación + esmalte)</li><li>Preparación: reparar fisuras, sellar, lijar e imprimar</li><li>Protección de suelo, muebles y cristales con cinta y plástico</li><li>Pequeños retoques y cambio de color de una estancia</li>', '<li>Peinture de murs et plafonds, intérieur</li><li>Émail pour boiseries : portes, plinthes, menuiseries</li><li>Menuiseries du marron au blanc (ponçage + primaire + émail)</li><li>Préparation : rebouchage, calfeutrage, ponçage et primaire</li><li>Protection du sol, des meubles et des vitres (adhésif et bâche)</li><li>Petites retouches et changement de couleur d’une pièce</li>'],
    'pint.how':   ['Vemos o estado das superfícies, dizemos o que é preciso e quantas demãos, e protegemos tudo antes de abrir a lata. No fim, retiramos as fitas, limpamos e conferimos consigo.', 'We check the state of the surfaces, tell you what is needed and how many coats, and protect everything before opening the tin. At the end we pull the tape, clean up and go over it with you.', 'Vemos el estado de las superficies, decimos qué hace falta y cuántas manos, y protegemos todo antes de abrir el bote. Al final, quitamos las cintas, limpiamos y lo revisamos contigo.', 'On regarde l’état des surfaces, on dit ce qu’il faut et combien de couches, et on protège tout avant d’ouvrir le pot. À la fin, on retire l’adhésif, on nettoie et on vérifie avec vous.'],
    'pint.ex':    ['Apartamento em Matosinhos, Porto: caixilharia de madeira castanha lixada, com primário de aderência e duas demãos de esmalte branco — janelas a condizer com os interiores, sem trocar a caixilharia.', 'Flat in Matosinhos, Porto: brown wooden window frames sanded, with an adhesion primer and two coats of white enamel — windows matching the interiors, without replacing the frames.', 'Piso en Matosinhos, Oporto: carpintería de madera marrón lijada, con imprimación de adherencia y dos manos de esmalte blanco — ventanas a juego con los interiores, sin cambiar la carpintería.', 'Appartement à Matosinhos, Porto : menuiseries en bois marron poncées, avec primaire d’accrochage et deux couches d’émail blanc — fenêtres assorties aux intérieurs, sans remplacer les menuiseries.'],
    'pint.cap1': ['<b>Paredes &amp; tetos</b><span>Demãos uniformes, sem marcas nem salpicos.</span>', '<b>Walls &amp; ceilings</b><span>Even coats, no marks or specks.</span>', '<b>Paredes y techos</b><span>Manos uniformes, sin marcas ni salpicaduras.</span>', '<b>Murs &amp; plafonds</b><span>Couches uniformes, sans traces ni projections.</span>'],
    'pint.cap2': ['<b>Madeiras</b><span>Esmalte para portas, rodapés e caixilharia.</span>', '<b>Woodwork</b><span>Enamel for doors, skirting and window frames.</span>', '<b>Maderas</b><span>Esmalte para puertas, rodapiés y carpintería.</span>', '<b>Boiseries</b><span>Émail pour portes, plinthes et menuiseries.</span>'],
    'pint.cap3': ['<b>Castanho &rarr; branco</b><span>A solução para janelas antigas sem as trocar.</span>', '<b>Brown &rarr; white</b><span>The fix for old windows without replacing them.</span>', '<b>Marrón &rarr; blanco</b><span>La solución para ventanas antiguas sin cambiarlas.</span>', '<b>Marron &rarr; blanc</b><span>La solution pour les vieilles fenêtres sans les changer.</span>'],
    'pint.cap4': ['<b>Preparação</b><span>Fissuras, betume e lixagem antes da tinta.</span>', '<b>Prep</b><span>Cracks, filler and sanding before the paint.</span>', '<b>Preparación</b><span>Fisuras, masilla y lijado antes de la pintura.</span>', '<b>Préparation</b><span>Fissures, enduit et ponçage avant la peinture.</span>'],
    'pint.baLead': ['Caixilharia de madeira: de castanha, lixada e preparada, a pintada de branco a condizer com os interiores.', 'Wooden window frame: from brown, sanded and prepped, to painted white to match the interiors.', 'Carpintería de madera: de marrón, lijada y preparada, a pintada de blanco a juego con los interiores.', 'Menuiserie en bois : du marron, poncée et préparée, au blanc assorti aux intérieurs.'],
    'pint.baBeforeAlt': ['Em obra: caixilharia castanha a ser lixada e preparada', 'In progress: brown window frame being sanded and prepped', 'En obra: carpintería marrón lijándose y preparándose', 'En cours : menuiserie marron poncée et préparée'],
    'pint.baAfterAlt':  ['Depois: caixilharia pintada de branco, com vista para a marina', 'After: window frame painted white, with a marina view', 'Después: carpintería pintada de blanco, con vistas al puerto deportivo', 'Après : menuiserie peinte en blanc, vue sur la marina'],
    'pint.g1': ['Caixilharia pintada de branco · vista de mar', 'Window frame painted white · sea view', 'Carpintería pintada de blanco · vista al mar', 'Menuiserie peinte en blanc · vue sur mer'],
    'pint.g2': ['Janela concluída, a condizer com o interior', 'Finished window, matching the interior', 'Ventana terminada, a juego con el interior', 'Fenêtre terminée, assortie à l’intérieur'],
    'pint.g3': ['Em obra: caixilharia a ser preparada', 'In progress: window frame being prepped', 'En obra: carpintería preparándose', 'En cours : menuiserie en préparation'],
    'pint.bandAlt': ['Rolo a aplicar tinta branca numa parede interior', 'A roller applying white paint to an interior wall', 'Un rodillo aplicando pintura blanca en una pared interior', 'Un rouleau appliquant de la peinture blanche sur un mur intérieur'],
    'pint.ctaH': ['Uma divisão para pintar ou janelas a precisar de cor? Falamos.', 'A room to paint or windows that need colour? Let us talk.', '¿Una estancia para pintar o ventanas que necesitan color? Hablamos.', 'Une pièce à peindre ou des fenêtres qui manquent de couleur ? Parlons-en.'],
    'svc.baBeforeAria': ['Comparação antes e depois', 'Before and after comparison', 'Comparación antes y después', 'Comparaison avant/après'],
    'proj.baTitle':  ['Antes &amp; depois', 'Before &amp; after', 'Antes y después', 'Avant &amp; après'],
    'proj.viewAll':  ['Ver todos os trabalhos', 'See all projects', 'Ver todos los trabajos', 'Voir toutes les réalisations'],
    'pf.gridLabel':  ['Grelha de trabalhos', 'Projects grid', 'Cuadrícula de trabajos', 'Grille des réalisations']
  };

  /* ---------------- Motor ---------------- */
  function detect() {
    try { var s = localStorage.getItem(KEY); if (s && LANGS.indexOf(s) !== -1) return s; } catch (e) {}
    var n = (navigator.language || 'pt').slice(0, 2).toLowerCase();
    return LANGS.indexOf(n) !== -1 ? n : 'pt';
  }
  var cur = detect();

  function idx() { return Math.max(0, LANGS.indexOf(cur)); }
  function t(key) {
    var row = D[key]; if (!row) return null;
    return row[idx()] != null ? row[idx()] : row[0];
  }
  function pick(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[cur] != null ? obj[cur] : (obj.pt != null ? obj.pt : '');
  }

  var ATTR = [
    ['data-i18n-aria', 'aria-label'], ['data-i18n-ph', 'placeholder'],
    ['data-i18n-alt', 'alt'], ['data-i18n-title', 'title'], ['data-i18n-content', 'content']
  ];

  function apply() {
    document.documentElement.setAttribute('lang', cur);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n')); if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html')); if (v != null) el.innerHTML = v;
    });
    ATTR.forEach(function (a) {
      document.querySelectorAll('[' + a[0] + ']').forEach(function (el) {
        var v = t(el.getAttribute(a[0])); if (v != null) el.setAttribute(a[1], v);
      });
    });
    renderSwitcher();
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: cur } }));
  }

  function set(lang) {
    if (LANGS.indexOf(lang) === -1 || lang === cur) { closeMenu(); return; }
    cur = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(); closeMenu();
  }

  /* ---------------- Seletor de idioma ---------------- */
  var menuOpen = false;
  function closeMenu() {
    menuOpen = false;
    var m = document.querySelector('.lang-menu'); if (m) m.hidden = true;
    var b = document.querySelector('.lang-btn'); if (b) b.setAttribute('aria-expanded', 'false');
  }
  function renderSwitcher() {
    var slot = document.getElementById('lang-slot');
    if (!slot) return;
    if (!slot.__built) {
      slot.__built = true;
      slot.className = 'lang';
      slot.innerHTML =
        '<button class="icon-btn lang-btn" aria-haspopup="listbox" aria-expanded="false" ' +
        'aria-label="' + t('ui.lang') + '" title="' + t('ui.lang') + '"></button>' +
        '<ul class="lang-menu" role="listbox" hidden>' +
        LANGS.map(function (l) {
          return '<li role="option" data-lang="' + l + '" tabindex="0">' +
            '<span class="flag">' + FLAG[l] + '</span>' + NAMES[l] + '</li>';
        }).join('') + '</ul>';
      var btn = slot.querySelector('.lang-btn');
      var menu = slot.querySelector('.lang-menu');
      btn.addEventListener('click', function (e) {
        e.stopPropagation(); menuOpen = !menuOpen; menu.hidden = !menuOpen;
        btn.setAttribute('aria-expanded', String(menuOpen));
      });
      menu.addEventListener('click', function (e) {
        var li = e.target.closest('li[data-lang]'); if (li) set(li.getAttribute('data-lang'));
      });
      menu.addEventListener('keydown', function (e) {
        var li = e.target.closest('li[data-lang]');
        if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); set(li.getAttribute('data-lang')); }
      });
      document.addEventListener('click', closeMenu);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    }
    var b = slot.querySelector('.lang-btn');
    b.innerHTML = '<span class="flag">' + FLAG[cur] + '</span><span class="lang-code">' + cur.toUpperCase() + '</span>';
    b.setAttribute('aria-label', t('ui.lang')); b.setAttribute('title', t('ui.lang'));
    slot.querySelectorAll('li[data-lang]').forEach(function (li) {
      li.setAttribute('aria-selected', String(li.getAttribute('data-lang') === cur));
    });
  }

  window.i18n = { get: function () { return cur; }, set: set, t: t, pick: pick, apply: apply };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
