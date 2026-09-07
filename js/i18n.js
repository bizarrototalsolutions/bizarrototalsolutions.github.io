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

    'foot.blurb':   ['Obras técnicas na região do Porto — eletricidade, carpintaria, telecomunicações e domótica, com um só interlocutor.', 'Technical work across the Porto region — electrical, carpentry, networks and home automation, with a single point of contact.', 'Trabajos técnicos en la región de Oporto — electricidad, carpintería, redes y domótica, con un único interlocutor.', 'Travaux techniques dans la région de Porto — électricité, menuiserie, réseaux et domotique, avec un seul interlocuteur.'],
    'foot.services': ['Serviços', 'Services', 'Servicios', 'Services'],
    'foot.contact':  ['Contacto', 'Contact', 'Contacto', 'Contact'],
    'foot.svc.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'foot.svc.tel':  ['Telecom &amp; Redes', 'Telecom &amp; Networks', 'Telecom y Redes', 'Télécom &amp; Réseaux'],
    'foot.svc.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'foot.svc.domo': ['Domótica', 'Home automation', 'Domótica', 'Domotique'],
    'foot.slogan':   ['Soluções Inteligentes, Resultados Excelentes', 'Smart Solutions, Excellent Results', 'Soluciones Inteligentes, Resultados Excelentes', 'Solutions Intelligentes, Résultats Excellents'],
    'foot.privacy':  ['Privacidade', 'Privacy', 'Privacidad', 'Confidentialité'],
    'foot.cart.project': ['Projeto', 'Project', 'Proyecto', 'Projet'],
    'foot.cart.scale':   ['Escala', 'Scale', 'Escala', 'Échelle'],
    'foot.cart.area':    ['Zona', 'Area', 'Zona', 'Zone'],
    'foot.cart.rev':     ['Revisão', 'Revision', 'Revisión', 'Révision'],

    /* ===== Home ===== */
    'home.title':   ['Dizarro — Obras técnicas no Grande Porto', 'Dizarro — Technical work in Greater Porto', 'Dizarro — Trabajos técnicos en el Gran Oporto', 'Dizarro — Travaux techniques dans le Grand Porto'],
    'home.desc':    ['Dizarro: eletricidade, carpintaria, telecomunicações e domótica na região do Porto. Um só interlocutor, trabalho certificado, orçamento grátis em menos de 24 h.', 'Dizarro: electrical, carpentry, networks and home automation across the Porto region. One point of contact, certified work, free quote in under 24 h.', 'Dizarro: electricidad, carpintería, redes y domótica en la región de Oporto. Un único interlocutor, trabajo certificado, presupuesto gratis en menos de 24 h.', 'Dizarro : électricité, menuiserie, réseaux et domotique dans la région de Porto. Un seul interlocuteur, travail certifié, devis gratuit en moins de 24 h.'],
    'home.eyebrow': ['Obras técnicas · Grande Porto', 'Technical work · Greater Porto', 'Trabajos técnicos · Gran Oporto', 'Travaux techniques · Grand Porto'],
    'home.h1':      ['Do quadro <span class="b">à cozinha,</span> fica <span class="o">bem&nbsp;feito.</span>', 'From the panel <span class="b">to the kitchen,</span> <span class="o">done&nbsp;right.</span>', 'Del cuadro <span class="b">a la cocina,</span> <span class="o">bien&nbsp;hecho.</span>', 'Du tableau <span class="b">à la cuisine,</span> <span class="o">bien&nbsp;fait.</span>'],
    'home.sub':     ['Eletricidade, carpintaria, telecomunicações e domótica — e tudo o que uma casa ou um espaço precisa em obra técnica. Um interlocutor, trabalho certificado, resposta em menos de 24&nbsp;horas.', 'Electrical, carpentry, networks and home automation — and everything a home or space needs in technical work. One point of contact, certified work, reply in under 24&nbsp;hours.', 'Electricidad, carpintería, redes y domótica — y todo lo que una casa o un local necesita en obra técnica. Un interlocutor, trabajo certificado, respuesta en menos de 24&nbsp;horas.', 'Électricité, menuiserie, réseaux et domotique — et tout ce dont un logement ou un local a besoin en travaux techniques. Un interlocuteur, travail certifié, réponse en moins de 24&nbsp;heures.'],
    'home.heroAlt': ['Aplique de parede acabado, com luz quente, sobre revestimento de chapa perfilada — obra da Dizarro', 'Finished wall light with warm glow on profiled metal cladding — a Dizarro job', 'Aplique de pared acabado, con luz cálida, sobre revestimiento de chapa perfilada — obra de Dizarro', 'Applique murale finie, lumière chaude, sur bardage métallique nervuré — chantier Dizarro'],

    'home.trust.works':  ['obras concluídas', 'completed jobs', 'obras terminadas', 'chantiers réalisés'],
    'home.trust.years':  ['anos de ofício', 'years on the tools', 'años de oficio', "années de métier"],
    'home.trust.radius': ['raio · base Matosinhos', 'radius · based in Matosinhos', 'radio · base en Matosinhos', 'rayon · base à Matosinhos'],
    'home.trust.reply':  ['resposta a pedidos', 'to answer a request', 'para responder', 'pour répondre'],

    'home.s01.k':    ['O que fazemos', 'What we do', 'Qué hacemos', 'Ce que nous faisons'],
    'home.s01.lead': ['Não é só uma coisa. A Dizarro trata a parte técnica de uma casa ou espaço de ponta a ponta — e coordena as áreas entre si, para não andar atrás de três empresas diferentes.', 'Not just one thing. Dizarro handles the technical side of a home or space end to end — and coordinates the trades, so you are not chasing three different firms.', 'No es solo una cosa. Dizarro se ocupa de la parte técnica de una casa o local de principio a fin — y coordina los oficios entre sí, para que no persigas a tres empresas distintas.', "Pas une seule chose. Dizarro prend en charge le volet technique d'un logement ou d'un local de bout en bout — et coordonne les corps de métier, pour ne pas courir après trois entreprises."],
    'home.disc.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'home.disc.tel':  ['Telecomunicações &amp; Redes', 'Telecom &amp; Networks', 'Telecom y Redes', 'Télécom &amp; Réseaux'],
    'home.disc.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'home.disc.domo': ['Domótica &amp; automação', 'Home automation', 'Domótica y automatización', 'Domotique &amp; automatisation'],
    'home.s01.elec.list': ['<li>Instalações novas e remodelações de quadro</li><li>Diagnóstico e reparação de avarias</li><li>Tomadas, circuitos e iluminação interior/exterior</li><li>Pré-instalação de carregador de veículo elétrico</li>', '<li>New installations and panel upgrades</li><li>Fault diagnosis and repair</li><li>Sockets, circuits and indoor/outdoor lighting</li><li>EV charger pre-installation</li>', '<li>Instalaciones nuevas y renovación de cuadros</li><li>Diagnóstico y reparación de averías</li><li>Enchufes, circuitos e iluminación interior/exterior</li><li>Preinstalación de cargador para vehículo eléctrico</li>', '<li>Installations neuves et rénovation de tableaux</li><li>Diagnostic et réparation de pannes</li><li>Prises, circuits et éclairage intérieur/extérieur</li><li>Pré-installation de borne de recharge</li>'],
    'home.s01.tel.list': ['<li>Videovigilância (CCTV) e sistemas de alarme</li><li>Redes estruturadas e Wi-Fi por zonas</li><li>Fibra ótica, controlo de acessos, videoporteiro IP</li><li>Certificação ITED / ITUR</li>', '<li>CCTV and alarm systems</li><li>Structured cabling and zoned Wi-Fi</li><li>Fibre optics, access control, IP door entry</li><li>ITED / ITUR certification</li>', '<li>Videovigilancia (CCTV) y sistemas de alarma</li><li>Redes estructuradas y Wi-Fi por zonas</li><li>Fibra óptica, control de accesos, videoportero IP</li><li>Certificación ITED / ITUR</li>', '<li>Vidéosurveillance (CCTV) et alarmes</li><li>Réseaux structurés et Wi-Fi par zones</li><li>Fibre optique, contrôle d’accès, portier vidéo IP</li><li>Certification ITED / ITUR</li>'],
    'home.s01.carp.list': ['<li>Móveis à medida, roupeiros embutidos, cozinhas</li><li>Soalhos, rodapés e revestimentos</li><li>Portas interiores em madeira</li><li>Decks, pérgulas e estruturas exteriores · restauro</li>', '<li>Bespoke furniture, fitted wardrobes, kitchens</li><li>Flooring, skirting and wall panelling</li><li>Interior wooden doors</li><li>Decking, pergolas and outdoor structures · restoration</li>', '<li>Muebles a medida, armarios empotrados, cocinas</li><li>Suelos, rodapiés y revestimientos</li><li>Puertas interiores de madera</li><li>Tarimas, pérgolas y estructuras exteriores · restauración</li>', '<li>Meubles sur mesure, dressings intégrés, cuisines</li><li>Parquets, plinthes et habillages</li><li>Portes intérieures en bois</li><li>Terrasses, pergolas et structures extérieures · restauration</li>'],
    'home.s01.domo.list': ['<li>Iluminação e estores inteligentes</li><li>Cenários (dia, noite, fora de casa) configurados no local</li><li>Integração com os interruptores que já tem</li><li>Sensores, termostatos e fecho de portões por app</li>', '<li>Smart lighting and blinds</li><li>Scenes (day, night, away) set up on site</li><li>Works with the switches you already have</li><li>Sensors, thermostats and gate control by app</li>', '<li>Iluminación y persianas inteligentes</li><li>Escenas (día, noche, fuera de casa) configuradas in situ</li><li>Compatible con los interruptores que ya tienes</li><li>Sensores, termostatos y apertura de portones por app</li>', '<li>Éclairage et volets connectés</li><li>Scénarios (jour, nuit, absence) réglés sur place</li><li>Compatible avec vos interrupteurs actuels</li><li>Capteurs, thermostats et portail par appli</li>'],
    'home.step.no1': ['PASSO 01', 'STEP 01', 'PASO 01', 'ÉTAPE 01'],
    'home.step.no2': ['PASSO 02', 'STEP 02', 'PASO 02', 'ÉTAPE 02'],
    'home.step.no3': ['PASSO 03', 'STEP 03', 'PASO 03', 'ÉTAPE 03'],
    'home.plate.1t': ['Parede de TV — do móvel para a parede', 'TV wall — from the unit to the wall', 'Pared de TV — del mueble a la pared', 'Mur TV — du meuble au mur'],
    'home.plate.2t': ['Bastidor e rede estruturada', 'Rack and structured cabling', 'Rack y red estructurada', 'Baie et câblage structuré'],
    'home.plate.3t': ['Apliques sobre revestimento metálico', 'Wall lights on metal cladding', 'Apliques sobre revestimiento metálico', 'Appliques sur bardage métallique'],
    'home.plate.4t': ['Móvel de apoio para clínica de laser', 'Support cabinet for a laser clinic', 'Mueble de apoyo para clínica láser', 'Meuble d’appoint pour clinique laser'],
    'home.plate.5t': ['Da parede preparada à TV configurada', 'From prepped wall to configured TV', 'De la pared preparada a la TV configurada', 'Du mur préparé à la TV configurée'],
    'home.plate.loc':  ['Grande Porto · 2025', 'Greater Porto · 2025', 'Gran Oporto · 2025', 'Grand Porto · 2025'],
    'home.plate.loc2': ['Porto · 2025', 'Porto · 2025', 'Oporto · 2025', 'Porto · 2025'],
    'tape.telecom': ['Telecom', 'Telecom', 'Telecom', 'Télécom'],
    'tape.networks': ['Redes', 'Networks', 'Redes', 'Réseaux'],
    'tape.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'tape.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'tape.domo': ['Domótica', 'Automation', 'Domótica', 'Domotique'],
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
    'home.s01.more.domo': ['Ver domótica →', 'View home automation →', 'Ver domótica →', 'Voir la domotique →'],

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
    'home.faq2.a':  ['Sim. Em regra, 12 meses em instalações e 6 meses em reparações. Se algo não ficar bem dentro do prazo, voltamos sem custo.', 'Yes. As a rule, 12 months on installations and 6 months on repairs. If something isn’t right within that time, we come back at no cost.', 'Sí. Por norma, 12 meses en instalaciones y 6 meses en reparaciones. Si algo no queda bien dentro del plazo, volvemos sin coste.', 'Oui. En règle générale, 12 mois sur les installations et 6 mois sur les réparations. Si un défaut apparaît dans ce délai, nous revenons sans frais.'],
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
    'svc.spec.cctv': ['CCTV', 'CCTV', 'CCTV', 'CCTV'],
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
    'svchub.desc':  ['Eletricidade, telecomunicações e redes, carpintaria à medida e domótica na região do Porto. Um só interlocutor para toda a obra técnica.', 'Electrical, networks, bespoke carpentry and home automation across the Porto region. One point of contact for all the technical work.', 'Electricidad, redes, carpintería a medida y domótica en la región de Oporto. Un único interlocutor para toda la obra técnica.', 'Électricité, réseaux, menuiserie sur mesure et domotique dans la région de Porto. Un seul interlocuteur pour tous les travaux techniques.'],
    'svchub.h1':    ['Uma equipa,<br><span class="o">quatro frentes</span>', 'One team,<br><span class="o">four fronts</span>', 'Un equipo,<br><span class="o">cuatro frentes</span>', 'Une équipe,<br><span class="o">quatre fronts</span>'],
    'svchub.sub':   ['A parte técnica de uma casa ou espaço, tratada de ponta a ponta e coordenada entre si. Escolha a área para os detalhes.', 'The technical side of a home or space, handled end to end and coordinated. Pick an area for details.', 'La parte técnica de una casa o local, de principio a fin y coordinada. Elige un área para ver los detalles.', 'Le volet technique d’un logement ou d’un local, de bout en bout et coordonné. Choisissez un domaine pour les détails.'],
    'svchub.elec.cap': ['Instalações · quadros · avarias · iluminação · wallbox', 'Installations · panels · faults · lighting · wallbox', 'Instalaciones · cuadros · averías · iluminación · wallbox', 'Installations · tableaux · pannes · éclairage · wallbox'],
    'svchub.tel.cap':  ['CCTV · Cat 6/6A · Wi-Fi · fibra · alarmes · ITED/ITUR', 'CCTV · Cat 6/6A · Wi-Fi · fibre · alarms · ITED/ITUR', 'CCTV · Cat 6/6A · Wi-Fi · fibra · alarmas · ITED/ITUR', 'CCTV · Cat 6/6A · Wi-Fi · fibre · alarmes · ITED/ITUR'],
    'svchub.carp.cap': ['Móveis à medida · cozinhas · soalhos · portas · decks', 'Bespoke furniture · kitchens · floors · doors · decking', 'Muebles a medida · cocinas · suelos · puertas · tarimas', 'Meubles sur mesure · cuisines · parquets · portes · terrasses'],
    'svchub.domo.cap': ['Iluminação · estores · cenários · HomeKit/Google/Alexa', 'Lighting · blinds · scenes · HomeKit/Google/Alexa', 'Iluminación · persianas · escenas · HomeKit/Google/Alexa', 'Éclairage · volets · scénarios · HomeKit/Google/Alexa'],
    'svchub.why.h': ['Porquê ter tudo com a mesma equipa', 'Why keep it all with one team', 'Por qué tenerlo todo con el mismo equipo', 'Pourquoi tout confier à la même équipe'],
    'svchub.why.list': ['Um orçamento, um responsável, um número para ligar|As áreas falam entre si — a tomada fica onde o móvel a precisa|Menos dias de obra, menos marcações, menos "isso não é comigo"|Garantia sobre o conjunto, não sobre pedaços soltos', 'One quote, one person in charge, one number to call|The trades talk to each other — the socket goes where the furniture needs it|Fewer days on site, fewer appointments, fewer "not my job"|Warranty on the whole, not on loose pieces', 'Un presupuesto, un responsable, un número al que llamar|Los oficios hablan entre sí — el enchufe va donde lo necesita el mueble|Menos días de obra, menos citas, menos "eso no es lo mío"|Garantía sobre el conjunto, no sobre piezas sueltas', 'Un devis, un responsable, un numéro à appeler|Les métiers se parlent — la prise est là où le meuble en a besoin|Moins de jours de chantier, moins de rendez-vous, moins de "ce n’est pas mon rayon"|Garantie sur l’ensemble, pas sur des morceaux isolés'],
    'svchub.cta.h': ['Não sabe por onde começar? Diga-nos o problema.', 'Not sure where to start? Just tell us the problem.', '¿No sabes por dónde empezar? Cuéntanos el problema.', 'Vous ne savez pas par où commencer ? Dites-nous le problème.'],

    /* ===== Contactos ===== */
    'ct.title':  ['Contactos &amp; Orçamento — Dizarro', 'Contact &amp; Quote — Dizarro', 'Contacto y Presupuesto — Dizarro', 'Contact &amp; Devis — Dizarro'],
    'ct.desc':   ['Peça um orçamento grátis à Dizarro para eletricidade, telecomunicações, carpintaria ou domótica na região do Porto. Telefone 932 344 080, WhatsApp e formulário.', 'Ask Dizarro for a free quote — electrical, networks, carpentry or home automation across the Porto region. Phone 932 344 080, WhatsApp and form.', 'Pide a Dizarro un presupuesto gratis — electricidad, redes, carpintería o domótica en la región de Oporto. Teléfono 932 344 080, WhatsApp y formulario.', 'Demandez un devis gratuit à Dizarro — électricité, réseaux, menuiserie ou domotique dans la région de Porto. Téléphone 932 344 080, WhatsApp et formulaire.'],
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
    'ct.f.opt.domo':['Domótica', 'Home automation', 'Domótica', 'Domotique'],
    'ct.f.opt.many':['Várias / não sei', 'Several / not sure', 'Varias / no sé', 'Plusieurs / je ne sais pas'],
    'ct.f.local':   ['Localidade da obra', 'Job location', 'Localidad de la obra', 'Lieu du chantier'],
    'ct.f.local.ph':['Ex.: Matosinhos', 'E.g. Matosinhos', 'Ej.: Matosinhos', 'Ex. : Matosinhos'],
    'ct.f.local.err':['Indique a localidade.', 'Please enter the location.', 'Indica la localidad.', 'Indiquez le lieu.'],
    'ct.f.desc':    ['O que precisa', 'What you need', 'Qué necesitas', 'Ce dont vous avez besoin'],
    'ct.f.desc.ph': ['Descreva o trabalho: nº de pontos, tipo de móvel, câmaras, divisões…', 'Describe the job: number of points, type of furniture, cameras, rooms…', 'Describe el trabajo: nº de puntos, tipo de mueble, cámaras, estancias…', 'Décrivez le chantier : nombre de points, type de meuble, caméras, pièces…'],
    'ct.f.desc.err':['Descreva o trabalho pretendido.', 'Please describe the job.', 'Describe el trabajo.', 'Décrivez le chantier.'],
    'ct.f.submit':  ['Enviar pedido', 'Send request', 'Enviar solicitud', 'Envoyer la demande'],
    'ct.f.note':    ['🔒 Só usamos os dados para responder ao pedido.', '🔒 We only use your details to answer the request.', '🔒 Solo usamos los datos para responder a la solicitud.', '🔒 Nous n’utilisons vos données que pour répondre.'],

    /* ===== Sobre ===== */
    'about.title': ['Sobre a Dizarro — quem faz o trabalho', 'About Dizarro — who does the work', 'Sobre Dizarro — quién hace el trabajo', 'À propos de Dizarro — qui fait le travail'],
    'about.desc':  ['A Dizarro (Bizarro Total Solutions) nasceu em Padrão da Légua, Matosinhos. Sete anos de obra técnica na região do Porto, com o rigor de quem assina cada trabalho.', 'Dizarro (Bizarro Total Solutions) started in Padrão da Légua, Matosinhos. Seven years of technical work across the Porto region, with the care of someone who signs every job.', 'Dizarro (Bizarro Total Solutions) nació en Padrão da Légua, Matosinhos. Siete años de obra técnica en la región de Oporto, con el rigor de quien firma cada trabajo.', 'Dizarro (Bizarro Total Solutions) est née à Padrão da Légua, Matosinhos. Sept ans de travaux techniques dans la région de Porto, avec la rigueur de celui qui signe chaque chantier.'],
    'about.crumb': ['Sobre', 'About', 'Nosotros', 'À propos'],
    'about.h1':    ['Quem faz<br>o <span class="o">trabalho</span>', 'Who does<br>the <span class="o">work</span>', 'Quién hace<br>el <span class="o">trabajo</span>', 'Qui fait<br>le <span class="o">travail</span>'],
    'about.sub':   ['A Dizarro — nome comercial de <em>Bizarro Total Solutions</em> — nasceu em Padrão da Légua, Matosinhos, para responder a uma coisa simples: trabalho técnico bem feito, à hora combinada, com quem atende o telefone a seguir.', 'Dizarro — the trading name of <em>Bizarro Total Solutions</em> — started in Padrão da Légua, Matosinhos, to deliver something simple: technical work done well, on time, with someone who still picks up the phone afterwards.', 'Dizarro — nombre comercial de <em>Bizarro Total Solutions</em> — nació en Padrão da Légua, Matosinhos, para responder a algo simple: trabajo técnico bien hecho, a la hora acordada, con quien atiende el teléfono después.', 'Dizarro — nom commercial de <em>Bizarro Total Solutions</em> — est née à Padrão da Légua, Matosinhos, pour offrir une chose simple : un travail technique bien fait, à l’heure convenue, avec quelqu’un qui répond encore au téléphone ensuite.'],
    'about.lead':  ['Sete anos, mais de 150 obras, um raio de 100 km à volta do Porto.', 'Seven years, over 150 jobs, a 100 km radius around Porto.', 'Siete años, más de 150 obras, un radio de 100 km alrededor de Oporto.', 'Sept ans, plus de 150 chantiers, un rayon de 100 km autour de Porto.'],
    'about.p1':    ['Começámos com pequenas reparações elétricas e fomos crescendo por indicação — cliente que recomenda a cliente. Pelo caminho juntámos a carpintaria à medida, as redes e a domótica, porque eram sempre as mesmas casas a precisar das três coisas.', 'We started with small electrical repairs and grew by word of mouth — one client recommending the next. Along the way we added bespoke carpentry, networks and home automation, because it was always the same homes needing all three.', 'Empezamos con pequeñas reparaciones eléctricas y crecimos por recomendación — cliente que recomienda a cliente. Por el camino sumamos la carpintería a medida, las redes y la domótica, porque eran siempre las mismas casas las que necesitaban las tres cosas.', 'Nous avons commencé par de petites réparations électriques et avons grandi par le bouche-à-oreille — un client en recommandant un autre. En chemin, nous avons ajouté la menuiserie sur mesure, les réseaux et la domotique, car c’étaient toujours les mêmes logements qui avaient besoin des trois.'],
    'about.p2':    ['Hoje a Dizarro coordena a parte técnica de uma obra de fio a pavio: o eletricista sabe onde o carpinteiro vai pôr o móvel, e o técnico de redes sabe por onde passa o cabo antes de a parede fechar.', 'Today Dizarro coordinates the technical side of a job from start to finish: the electrician knows where the carpenter will put the unit, and the network tech knows where the cable runs before the wall closes up.', 'Hoy Dizarro coordina la parte técnica de una obra de principio a fin: el electricista sabe dónde va a poner el mueble el carpintero, y el técnico de redes sabe por dónde pasa el cable antes de cerrar la pared.', 'Aujourd’hui, Dizarro coordonne le volet technique d’un chantier de A à Z : l’électricien sait où le menuisier va poser le meuble, et le technicien réseau sait où passe le câble avant que le mur ne se referme.'],
    'about.h2work': ['Como gostamos de trabalhar', 'How we like to work', 'Cómo nos gusta trabajar', 'Notre façon de travailler'],
    'about.v1.t': ['Transparência', 'Transparency', 'Transparencia', 'Transparence'],
    'about.v1.d': ['Orçamento discriminado. O que muda, avisa-se antes — não na fatura.', 'Itemised quote. Any change is flagged upfront — not on the invoice.', 'Presupuesto detallado. Lo que cambia se avisa antes — no en la factura.', 'Devis détaillé. Tout changement est signalé en amont — pas sur la facture.'],
    'about.v2.t': ['Pontualidade', 'Punctuality', 'Puntualidad', 'Ponctualité'],
    'about.v2.d': ['A hora combinada é a hora. O seu tempo conta.', 'The agreed time is the time. Your time matters.', 'La hora acordada es la hora. Tu tiempo cuenta.', 'L’heure convenue est l’heure. Votre temps compte.'],
    'about.v3.t': ['Garantia', 'Warranty', 'Garantía', 'Garantie'],
    'about.v3.d': ['12 meses em instalações, 6 em reparações. Se falhar, voltamos.', '12 months on installations, 6 on repairs. If it fails, we come back.', '12 meses en instalaciones, 6 en reparaciones. Si falla, volvemos.', '12 mois sur les installations, 6 sur les réparations. En cas de défaut, nous revenons.'],
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
    'pf.desc':  ['Obras reais da Dizarro na região do Porto: eletricidade, telecomunicações e redes, carpintaria à medida e domótica. Estudos de caso com antes e depois.', 'Real Dizarro jobs across the Porto region: electrical, networks, bespoke carpentry and home automation. Case studies with before and after.', 'Obras reales de Dizarro en la región de Oporto: electricidad, redes, carpintería a medida y domótica. Casos con antes y después.', 'Chantiers réels de Dizarro dans la région de Porto : électricité, réseaux, menuiserie sur mesure et domotique. Études de cas avec avant/après.'],
    'pf.crumb': ['Trabalhos', 'Projects', 'Trabajos', 'Réalisations'],
    'pf.h1':    ['Obras <span class="o">reais</span>,<br>não renders', '<span class="o">Real</span> jobs,<br>not renders', 'Obras <span class="o">reales</span>,<br>no renders', 'Des chantiers <span class="o">réels</span>,<br>pas des rendus'],
    'pf.sub':   ['Uma seleção de trabalhos da Dizarro na região do Porto. Clique num projeto para ver o antes/depois, os materiais e o que foi resolvido.', 'A selection of Dizarro jobs across the Porto region. Click a project for the before/after, the materials and what was solved.', 'Una selección de trabajos de Dizarro en la región de Oporto. Haz clic en un proyecto para ver el antes/después, los materiales y lo que se resolvió.', 'Une sélection de chantiers Dizarro dans la région de Porto. Cliquez sur un projet pour l’avant/après, les matériaux et ce qui a été résolu.'],
    'pf.filter.all':  ['Todos', 'All', 'Todos', 'Tous'],
    'pf.filter.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'pf.filter.tel':  ['Telecom &amp; Redes', 'Telecom &amp; Networks', 'Telecom y Redes', 'Télécom &amp; Réseaux'],
    'pf.filter.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'pf.filter.domo': ['Domótica', 'Home automation', 'Domótica', 'Domotique'],
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
    'priv.crumb':  ['Privacidade', 'Privacy', 'Privacidad', 'Confidentialité'],
    'priv.h1':     ['Privacidade<br>&amp; <span class="o">cookies</span>', 'Privacy<br>&amp; <span class="o">cookies</span>', 'Privacidad<br>y <span class="o">cookies</span>', 'Confidentialité<br>&amp; <span class="o">cookies</span>'],
    'priv.sub':    ['Em linguagem simples: só recolhemos o que precisamos para responder ao seu pedido, e não vendemos nem partilhamos os seus dados.', 'In plain terms: we only collect what we need to answer your request, and we do not sell or share your data.', 'En lenguaje simple: solo recogemos lo necesario para responder a tu solicitud, y no vendemos ni compartimos tus datos.', 'En clair : nous ne collectons que ce qu’il faut pour répondre à votre demande, et nous ne vendons ni ne partageons vos données.'],
    'priv.h.resp':  ['Responsável', 'Controller', 'Responsable', 'Responsable'],
    'priv.resp':    ['<strong>Bizarro Total Solutions</strong> (marca <strong>Dizarro</strong>), Padrão da Légua, Matosinhos, Porto. Contacto: <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>.', '<strong>Bizarro Total Solutions</strong> (trading as <strong>Dizarro</strong>), Padrão da Légua, Matosinhos, Porto. Contact: <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>.', '<strong>Bizarro Total Solutions</strong> (marca <strong>Dizarro</strong>), Padrão da Légua, Matosinhos, Oporto. Contacto: <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>.', '<strong>Bizarro Total Solutions</strong> (marque <strong>Dizarro</strong>), Padrão da Légua, Matosinhos, Porto. Contact : <a href="mailto:bizarrototalsolutions@gmail.com">bizarrototalsolutions@gmail.com</a>.'],
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
    'elec.title': ['Eletricidade no Porto — Dizarro', 'Electrical work in Porto — Dizarro', 'Electricidad en Oporto — Dizarro', 'Électricité à Porto — Dizarro'],
    'elec.desc':  ['Instalações elétricas, quadros e diferenciais, avarias, iluminação LED e pré-instalação de carregador de veículo elétrico na região do Porto. Trabalho conforme RTIEBT.', 'Electrical installations, panels and RCDs, faults, LED lighting and EV charger pre-installation across the Porto region. Work compliant with the Portuguese wiring rules (RTIEBT).', 'Instalaciones eléctricas, cuadros y diferenciales, averías, iluminación LED y preinstalación de cargador para vehículo eléctrico en la región de Oporto. Trabajo conforme a la normativa (RTIEBT).', 'Installations électriques, tableaux et différentiels, pannes, éclairage LED et pré-installation de borne de recharge dans la région de Porto. Travaux conformes à la norme portugaise (RTIEBT).'],
    'elec.h1':    ['<span class="o">Eletricidade</span><br>sem improvisos', '<span class="o">Electrical work</span><br>no improvising', '<span class="o">Electricidad</span><br>sin improvisar', '<span class="o">Électricité</span><br>sans improvisation'],
    'elec.sub':   ['Instalações e remodelações, avarias resolvidas à primeira, e tudo entregue conforme as regras técnicas em vigor (RTIEBT). Residencial, comercial e industrial.', 'Installations and refits, faults fixed first time, and everything delivered to the wiring rules in force (RTIEBT). Residential, commercial and industrial.', 'Instalaciones y reformas, averías resueltas a la primera, y todo entregado conforme a la normativa vigente (RTIEBT). Residencial, comercial e industrial.', 'Installations et rénovations, pannes réglées du premier coup, et tout livré selon la norme en vigueur (RTIEBT). Résidentiel, commercial et industriel.'],
    'elec.intro': ['Uma instalação elétrica bem feita não se vê — nota-se quando <em>nunca</em> dá problemas. A Dizarro trata a parte elétrica de raiz ou intervém no que já existe, com material de marca e um plano claro antes de abrir a primeira roça.', 'A good electrical installation is invisible — you notice it when it <em>never</em> gives trouble. Dizarro does the electrical side from scratch or works on what is already there, with proper brands and a clear plan before the first chase is cut.', 'Una instalación eléctrica bien hecha no se ve — se nota cuando <em>nunca</em> da problemas. Dizarro hace la parte eléctrica desde cero o interviene en lo existente, con material de marca y un plan claro antes de la primera roza.', 'Une bonne installation électrique est invisible — on la remarque quand elle ne pose <em>jamais</em> de problème. Dizarro réalise la partie électrique de zéro ou intervient sur l’existant, avec du matériel de marque et un plan clair avant la première saignée.'],
    'elec.list':  ['<li>Instalações novas e remodelações completas de quadro</li><li>Substituição de quadros antigos, diferenciais e proteções por circuito</li><li>Diagnóstico e reparação de avarias (curto-circuitos, disparos, sobreaquecimento)</li><li>Tomadas, circuitos dedicados, iluminação interior e exterior</li><li>Iluminação LED e regulação (dimmer), sensores de presença</li><li>Pré-instalação de carregador de veículo elétrico (wallbox)</li><li>Ligações à terra e correção de instalações sem proteção</li>', '<li>New installations and complete panel refits</li><li>Replacing old panels, RCDs and per-circuit protection</li><li>Fault diagnosis and repair (short circuits, tripping, overheating)</li><li>Sockets, dedicated circuits, indoor and outdoor lighting</li><li>LED lighting and dimming, presence sensors</li><li>EV charger (wallbox) pre-installation</li><li>Earthing and fixing unprotected installations</li>', '<li>Instalaciones nuevas y renovación completa de cuadros</li><li>Sustitución de cuadros antiguos, diferenciales y protecciones por circuito</li><li>Diagnóstico y reparación de averías (cortocircuitos, disparos, sobrecalentamiento)</li><li>Enchufes, circuitos dedicados, iluminación interior y exterior</li><li>Iluminación LED y regulación (dimmer), sensores de presencia</li><li>Preinstalación de cargador para vehículo eléctrico (wallbox)</li><li>Tomas de tierra y corrección de instalaciones sin protección</li>', '<li>Installations neuves et rénovation complète de tableaux</li><li>Remplacement de tableaux anciens, différentiels et protections par circuit</li><li>Diagnostic et réparation de pannes (courts-circuits, déclenchements, surchauffe)</li><li>Prises, circuits dédiés, éclairage intérieur et extérieur</li><li>Éclairage LED et variation, détecteurs de présence</li><li>Pré-installation de borne de recharge (wallbox)</li><li>Mises à la terre et correction d’installations sans protection</li>'],
    'elec.how':   ['Vistoria e medição, proposta discriminada, execução por fases para a casa nunca ficar sem energia mais do que o necessário, e ficha técnica no fim. Deixamos tudo testado e identificado no quadro.', 'Survey and measurements, itemised proposal, phased work so the home is never without power longer than needed, and a technical sheet at the end. We leave everything tested and labelled at the panel.', 'Inspección y mediciones, propuesta detallada, ejecución por fases para que la casa nunca quede sin energía más de lo necesario, y ficha técnica al final. Dejamos todo probado e identificado en el cuadro.', 'Visite et relevés, devis détaillé, exécution par phases pour que le logement ne soit jamais privé d’électricité plus que nécessaire, et fiche technique à la fin. Tout est testé et repéré au tableau.'],
    'elec.ex':    ['Moradia T4 em Matosinhos: instalação dos anos 80 sem terra em vários circuitos. Novo quadro com diferenciais por circuito, 42 tomadas, iluminação LED regulável e pré-instalação de wallbox — casa habitada durante toda a obra.', '4-bed house in Matosinhos: 1980s wiring with no earth on several circuits. New panel with per-circuit RCDs, 42 sockets, dimmable LED lighting and wallbox pre-install — the family lived in the house throughout.', 'Vivienda de 4 dormitorios en Matosinhos: instalación de los años 80 sin toma de tierra en varios circuitos. Cuadro nuevo con diferenciales por circuito, 42 enchufes, iluminación LED regulable y preinstalación de wallbox — casa habitada durante toda la obra.', 'Maison T4 à Matosinhos : installation des années 80 sans terre sur plusieurs circuits. Nouveau tableau avec différentiels par circuit, 42 prises, éclairage LED variable et pré-installation wallbox — maison habitée pendant tout le chantier.'],
    'elec.cap1': ['<b>Quadros &amp; proteções</b><span>Diferenciais e disjuntores por circuito, com esquema legível no quadro.</span>', '<b>Panels &amp; protection</b><span>RCDs and breakers per circuit, with a readable layout at the panel.</span>', '<b>Cuadros y protecciones</b><span>Diferenciales y magnetotérmicos por circuito, con esquema legible en el cuadro.</span>', '<b>Tableaux &amp; protections</b><span>Différentiels et disjoncteurs par circuit, avec un schéma lisible au tableau.</span>'],
    'elec.cap2': ['<b>Avarias</b><span>Localização da falha e reparação — sem trocar o que não é preciso.</span>', '<b>Faults</b><span>Locating the fault and repairing it — without replacing what does not need it.</span>', '<b>Averías</b><span>Localización del fallo y reparación — sin cambiar lo que no hace falta.</span>', '<b>Pannes</b><span>Localisation de la panne et réparation — sans remplacer l’inutile.</span>'],
    'elec.cap3': ['<b>Iluminação</b><span>LED eficiente, embutidos, exterior, cenários e regulação.</span>', '<b>Lighting</b><span>Efficient LED, downlights, outdoor, scenes and dimming.</span>', '<b>Iluminación</b><span>LED eficiente, empotrados, exterior, escenas y regulación.</span>', '<b>Éclairage</b><span>LED efficace, encastrés, extérieur, scénarios et variation.</span>'],
    'elec.cap4': ['<b>Mobilidade elétrica</b><span>Ponto de carga para veículo elétrico, dimensionado ao contador.</span>', '<b>EV charging</b><span>EV charging point, sized to your supply.</span>', '<b>Movilidad eléctrica</b><span>Punto de carga para vehículo eléctrico, dimensionado al contador.</span>', '<b>Mobilité électrique</b><span>Point de charge pour véhicule électrique, dimensionné au compteur.</span>'],
    'elec.baLead': ['Apliques de parede numa fachada de chapa perfilada: da montagem com o casquilho e os fios à vista ao acabamento com a caixa fechada.', 'Wall lights on profiled-metal cladding: from assembly with the lampholder and wires showing, to the finished, closed housing.', 'Apliques de pared en una fachada de chapa perfilada: del montaje con el portalámparas y los cables a la vista al acabado con la caja cerrada.', 'Appliques murales sur bardage métallique nervuré : du montage avec la douille et les fils apparents à la finition boîtier fermé.'],
    'elec.baBeforeAlt': ['Antes: aplique montado com o casquilho e os fios à vista', 'Before: wall light mounted with lampholder and wires showing', 'Antes: aplique montado con portalámparas y cables a la vista', 'Avant : applique montée avec douille et fils apparents'],
    'elec.baAfterAlt':  ['Depois: aplique com a caixa fechada e alinhada', 'After: wall light with the housing closed and aligned', 'Después: aplique con la caja cerrada y alineada', 'Après : applique boîtier fermé et aligné'],
    'elec.g1': ['Focos LED embutidos no teto', 'Recessed LED downlights in the ceiling', 'Focos LED empotrados en el techo', 'Spots LED encastrés au plafond'],
    'elec.g2': ['Ventoinha de teto com luz', 'Ceiling fan with light', 'Ventilador de techo con luz', 'Ventilateur de plafond avec lumière'],
    'elec.g3': ['Ventoinha de teto · outra divisão', 'Ceiling fan · another room', 'Ventilador de techo · otra estancia', 'Ventilateur de plafond · autre pièce'],
    'elec.bandAlt': ['Aplique retangular aceso num revestimento de chapa ondulada, obra elétrica da Dizarro', 'Lit rectangular wall light on corrugated cladding, Dizarro electrical job', 'Aplique rectangular encendido en revestimiento de chapa ondulada, obra eléctrica de Dizarro', 'Applique rectangulaire allumée sur bardage ondulé, chantier électrique Dizarro'],
    'elec.ctaH': ['Problema elétrico? Vamos resolvê-lo.', 'Electrical problem? Let’s sort it.', '¿Problema eléctrico? Lo resolvemos.', 'Un problème électrique ? On le règle.'],

    /* ===== Telecom & Redes ===== */
    'tel.title': ['Telecomunicações &amp; Redes no Porto — Dizarro', 'Telecom &amp; Networks in Porto — Dizarro', 'Telecom y Redes en Oporto — Dizarro', 'Télécom &amp; Réseaux à Porto — Dizarro'],
    'tel.desc':  ['CCTV, redes estruturadas Cat 6/6A, Wi-Fi por zonas, fibra ótica, alarmes, controlo de acessos e certificação ITED/ITUR na região do Porto.', 'CCTV, Cat 6/6A structured cabling, zoned Wi-Fi, fibre optics, alarms, access control and ITED/ITUR certification across the Porto region.', 'CCTV, redes estructuradas Cat 6/6A, Wi-Fi por zonas, fibra óptica, alarmas, control de accesos y certificación ITED/ITUR en la región de Oporto.', 'CCTV, câblage structuré Cat 6/6A, Wi-Fi par zones, fibre optique, alarmes, contrôle d’accès et certification ITED/ITUR dans la région de Porto.'],
    'tel.h1':    ['<span class="b">Telecom</span> &amp; redes<br>que se aguentam', '<span class="b">Telecom</span> &amp; networks<br>that hold up', '<span class="b">Telecom</span> y redes<br>que aguantan', '<span class="b">Télécom</span> &amp; réseaux<br>qui tiennent'],
    'tel.sub':   ['CCTV, rede estruturada, Wi-Fi que chega a toda a casa, fibra, alarmes e controlo de acessos. Instalado com método e entregue com relatório de testes.', 'CCTV, structured cabling, Wi-Fi that reaches the whole home, fibre, alarms and access control. Installed methodically and handed over with a test report.', 'CCTV, red estructurada, Wi-Fi que llega a toda la casa, fibra, alarmas y control de accesos. Instalado con método y entregado con informe de pruebas.', 'CCTV, câblage structuré, Wi-Fi qui couvre toute la maison, fibre, alarmes et contrôle d’accès. Installé avec méthode et remis avec un rapport de tests.'],
    'tel.intro': ['A maior parte dos problemas de rede não é o operador — é a instalação. Cabo mal crimpado, tudo a passar por Wi-Fi, switches escondidos numa gaveta. A Dizarro organiza a infraestrutura para deixar de pensar nela.', 'Most network problems aren’t the ISP — they’re the wiring. Badly crimped cable, everything going over Wi-Fi, switches hidden in a drawer. Dizarro organises the infrastructure so you stop thinking about it.', 'La mayoría de los problemas de red no son del operador — son de la instalación. Cable mal crimpado, todo por Wi-Fi, switches escondidos en un cajón. Dizarro organiza la infraestructura para que dejes de pensar en ella.', 'La plupart des problèmes de réseau ne viennent pas du fournisseur — mais de l’installation. Câble mal serti, tout en Wi-Fi, switchs cachés dans un tiroir. Dizarro organise l’infrastructure pour que vous n’y pensiez plus.'],
    'tel.list':  ['<li>Videovigilância (CCTV) com gravação local e acesso remoto seguro</li><li>Rede estruturada Cat 6 / Cat 6A com bastidor e patch panel</li><li>Wi-Fi por zonas (pontos de acesso), fim das zonas mortas</li><li>Instalação e fusão de fibra ótica</li><li>Alarmes, deteção de perímetro e sirenes</li><li>Controlo de acessos e videoporteiro IP (atende no telemóvel)</li><li>Certificação ITED / ITUR para habitação nova ou remodelada</li>', '<li>CCTV with local recording and secure remote access</li><li>Cat 6 / Cat 6A structured cabling with rack and patch panel</li><li>Zoned Wi-Fi (access points), no more dead spots</li><li>Fibre optic installation and splicing</li><li>Alarms, perimeter detection and sirens</li><li>Access control and IP door entry (answer on your phone)</li><li>ITED / ITUR certification for new or refurbished homes</li>', '<li>Videovigilancia (CCTV) con grabación local y acceso remoto seguro</li><li>Red estructurada Cat 6 / Cat 6A con rack y patch panel</li><li>Wi-Fi por zonas (puntos de acceso), fin de las zonas muertas</li><li>Instalación y fusión de fibra óptica</li><li>Alarmas, detección de perímetro y sirenas</li><li>Control de accesos y videoportero IP (contesta en el móvil)</li><li>Certificación ITED / ITUR para vivienda nueva o reformada</li>', '<li>Vidéosurveillance (CCTV) avec enregistrement local et accès distant sécurisé</li><li>Câblage structuré Cat 6 / Cat 6A avec baie et panneau de brassage</li><li>Wi-Fi par zones (points d’accès), fini les zones mortes</li><li>Installation et soudure de fibre optique</li><li>Alarmes, détection périmétrique et sirènes</li><li>Contrôle d’accès et portier vidéo IP (répond sur le téléphone)</li><li>Certification ITED / ITUR pour logement neuf ou rénové</li>'],
    'tel.how':   ['Levantamento dos pontos, passagem de cabo (novo ou aproveitando calhas), certificação com equipamento próprio, e um esquema simples de "o que está ligado a quê". Sem pontas soltas.', 'Point survey, cable pulling (new or reusing trunking), certification with our own gear, and a simple "what’s connected to what" map. No loose ends.', 'Relevamiento de puntos, tendido de cable (nuevo o aprovechando canaletas), certificación con equipo propio, y un esquema simple de "qué está conectado a qué". Sin cabos sueltos.', 'Relevé des points, tirage de câble (neuf ou en réutilisant les goulottes), certification avec notre matériel, et un schéma simple « qui est branché où ». Aucun fil qui pend.'],
    'tel.ex':    ['Escritório no Porto: 24 tomadas Cat 6A certificadas, bastidor organizado, 6 câmaras IP com 14 dias de gravação e Wi-Fi por zona — operacional numa semana.', 'Office in Porto: 24 certified Cat 6A points, a tidy rack, 6 IP cameras with 14 days of recording and zoned Wi-Fi — up and running in a week.', 'Oficina en Oporto: 24 tomas Cat 6A certificadas, rack ordenado, 6 cámaras IP con 14 días de grabación y Wi-Fi por zonas — operativa en una semana.', 'Bureau à Porto : 24 prises Cat 6A certifiées, baie rangée, 6 caméras IP avec 14 jours d’enregistrement et Wi-Fi par zones — opérationnel en une semaine.'],
    'tel.cap1': ['<b>CCTV</b><span>Câmaras IP, gravação local, visão noturna e acesso pelo telemóvel.</span>', '<b>CCTV</b><span>IP cameras, local recording, night vision and phone access.</span>', '<b>CCTV</b><span>Cámaras IP, grabación local, visión nocturna y acceso desde el móvil.</span>', '<b>CCTV</b><span>Caméras IP, enregistrement local, vision nocturne et accès mobile.</span>'],
    'tel.cap2': ['<b>Rede &amp; Wi-Fi</b><span>Cablagem certificada e cobertura sem falhas em toda a área.</span>', '<b>Network &amp; Wi-Fi</b><span>Certified cabling and seamless coverage across the whole area.</span>', '<b>Red y Wi-Fi</b><span>Cableado certificado y cobertura sin fallos en toda el área.</span>', '<b>Réseau &amp; Wi-Fi</b><span>Câblage certifié et couverture sans faille sur toute la zone.</span>'],
    'tel.cap3': ['<b>Fibra</b><span>Instalação e fusão, extensão de fibra dentro do edifício.</span>', '<b>Fibre</b><span>Installation and splicing, extending fibre inside the building.</span>', '<b>Fibra</b><span>Instalación y fusión, extensión de fibra dentro del edificio.</span>', '<b>Fibre</b><span>Installation et soudure, extension de fibre dans le bâtiment.</span>'],
    'tel.cap4': ['<b>Acessos</b><span>Videoporteiro IP, fechaduras e abertura de portões por app.</span>', '<b>Access</b><span>IP door entry, locks and gate opening by app.</span>', '<b>Accesos</b><span>Videoportero IP, cerraduras y apertura de portones por app.</span>', '<b>Accès</b><span>Portier vidéo IP, serrures et ouverture de portail par appli.</span>'],
    'tel.baLead': ['Reorganização de rede num escritório: da confusão de cabos e routers empilhados a ponto de acesso montado e cablagem em calha, com UPS.', 'Network overhaul in an office: from a mess of cables and stacked routers to a mounted access point and trunked cabling, with a UPS.', 'Reorganización de red en una oficina: del lío de cables y routers apilados a un punto de acceso montado y cableado en canaleta, con SAI.', 'Réorganisation réseau dans un bureau : d’un enchevêtrement de câbles et de routeurs empilés à un point d’accès monté et un câblage en goulotte, avec onduleur.'],
    'tel.baBeforeAlt': ['Antes: cabos, routers e fontes de alimentação amontoados debaixo da secretária', 'Before: cables, routers and power supplies piled up under the desk', 'Antes: cables, routers y fuentes amontonados bajo el escritorio', 'Avant : câbles, routeurs et alimentations entassés sous le bureau'],
    'tel.baAfterAlt':  ['Depois: ponto de acesso Wi-Fi montado e cablagem organizada em calha', 'After: Wi-Fi access point mounted and cabling tidied into trunking', 'Después: punto de acceso Wi-Fi montado y cableado ordenado en canaleta', 'Après : point d’accès Wi-Fi monté et câblage rangé en goulotte'],
    'tel.g1': ['Bastidor de parede · organização', 'Wall rack · tidy-up', 'Rack de pared · organización', 'Baie murale · rangement'],
    'tel.g2': ['Cablagem a etiquetar e arrumar', 'Cabling to label and tidy', 'Cableado por etiquetar y ordenar', 'Câblage à étiqueter et ranger'],
    'tel.g3': ['Ponto de TV com dados dedicados', 'TV point with a dedicated data outlet', 'Punto de TV con datos dedicados', 'Point TV avec prise data dédiée'],
    'tel.bandAlt': ['Ponto de acesso D-Link montado com cablagem organizada e UPS', 'Mounted D-Link access point with tidy cabling and a UPS', 'Punto de acceso D-Link montado con cableado ordenado y SAI', 'Point d’accès D-Link monté avec câblage rangé et onduleur'],
    'tel.ctaH': ['Wi-Fi mau ou obra nova? Falamos.', 'Bad Wi-Fi or a new build? Let’s talk.', '¿Wi-Fi malo u obra nueva? Hablamos.', 'Mauvais Wi-Fi ou construction neuve ? Parlons-en.'],

    /* ===== Carpintaria ===== */
    'carp.title': ['Carpintaria à medida no Porto — Dizarro', 'Bespoke carpentry in Porto — Dizarro', 'Carpintería a medida en Oporto — Dizarro', 'Menuiserie sur mesure à Porto — Dizarro'],
    'carp.desc':  ['Móveis à medida, roupeiros embutidos, cozinhas lacadas, soalhos, portas e decks exteriores na região do Porto. Projeto, fabrico e montagem.', 'Bespoke furniture, fitted wardrobes, lacquered kitchens, flooring, doors and outdoor decking across the Porto region. Design, build and install.', 'Muebles a medida, armarios empotrados, cocinas lacadas, suelos, puertas y tarimas exteriores en la región de Oporto. Diseño, fabricación y montaje.', 'Meubles sur mesure, dressings intégrés, cuisines laquées, parquets, portes et terrasses extérieures dans la région de Porto. Conception, fabrication et pose.'],
    'carp.h1':    ['<span class="o">Carpintaria</span><br>ao milímetro', '<span class="o">Carpentry</span><br>to the millimetre', '<span class="o">Carpintería</span><br>al milímetro', '<span class="o">Menuiserie</span><br>au millimètre'],
    'carp.sub':   ['Do roupeiro embutido à cozinha lacada, do soalho ao deck exterior. Medimos, desenhamos, fabricamos e montamos — com acabamentos que duram.', 'From the fitted wardrobe to the lacquered kitchen, from flooring to outdoor decking. We measure, draw, build and install — with finishes that last.', 'Del armario empotrado a la cocina lacada, del suelo a la tarima exterior. Medimos, dibujamos, fabricamos y montamos — con acabados que duran.', 'Du dressing intégré à la cuisine laquée, du parquet à la terrasse. Nous mesurons, dessinons, fabriquons et posons — avec des finitions qui durent.'],
    'carp.intro': ['Móvel comprado feito nunca encaixa numa parede fora de esquadria. À medida encaixa — e aproveita cada centímetro. A Dizarro trata o projeto de carpintaria de fio a pavio, e coordena com a eletricidade quando é preciso (iluminação de nicho, tomadas dentro do móvel).', 'Off-the-shelf furniture never fits a wall that’s out of square. Bespoke does — and uses every centimetre. Dizarro handles the carpentry project from start to finish, and coordinates with the electrics when needed (niche lighting, sockets inside the unit).', 'Un mueble comprado hecho nunca encaja en una pared fuera de escuadra. A medida sí — y aprovecha cada centímetro. Dizarro lleva el proyecto de carpintería de principio a fin, y coordina con la electricidad cuando hace falta (iluminación de nicho, enchufes dentro del mueble).', 'Un meuble tout fait n’entre jamais dans un mur hors d’équerre. Le sur-mesure, si — et exploite chaque centimètre. Dizarro mène le projet de menuiserie de A à Z, et coordonne avec l’électricité si besoin (éclairage de niche, prises dans le meuble).'],
    'carp.list':  ['<li>Móveis à medida: cozinhas, quartos, salas, escritórios</li><li>Roupeiros e armários embutidos, com interiores organizados</li><li>Frentes lacadas, folheadas ou em melamina de qualidade</li><li>Soalhos, rodapés, lambris e revestimentos de parede</li><li>Portas interiores em madeira</li><li>Decks, pérgulas e estruturas exteriores em madeira tratada</li><li>Restauro e reparação de móveis e portas antigas</li>', '<li>Bespoke furniture: kitchens, bedrooms, living rooms, offices</li><li>Fitted wardrobes and cabinets, with organised interiors</li><li>Lacquered, veneered or quality melamine fronts</li><li>Flooring, skirting, panelling and wall linings</li><li>Interior wooden doors</li><li>Decking, pergolas and outdoor structures in treated timber</li><li>Restoration and repair of old furniture and doors</li>', '<li>Muebles a medida: cocinas, dormitorios, salones, oficinas</li><li>Armarios empotrados, con interiores organizados</li><li>Frentes lacados, chapados o en melamina de calidad</li><li>Suelos, rodapiés, lambrines y revestimientos de pared</li><li>Puertas interiores de madera</li><li>Tarimas, pérgolas y estructuras exteriores en madera tratada</li><li>Restauración y reparación de muebles y puertas antiguas</li>', '<li>Meubles sur mesure : cuisines, chambres, salons, bureaux</li><li>Dressings et placards intégrés, aménagement intérieur soigné</li><li>Façades laquées, plaquées ou en mélaminé de qualité</li><li>Parquets, plinthes, lambris et habillages muraux</li><li>Portes intérieures en bois</li><li>Terrasses, pergolas et structures extérieures en bois traité</li><li>Restauration et réparation de meubles et portes anciens</li>'],
    'carp.how':   ['Levantamento rigoroso (a laser quando a obra exige), desenho 3D para aprovar antes de cortar, fabrico e montagem com ferragens de marca — gavetões com extração total e travão, dobradiças com amortecedor.', 'Precise survey (laser when the job calls for it), a 3D drawing to approve before cutting, then build and install with proper hardware — full-extension soft-close drawers, damped hinges.', 'Relevamiento riguroso (láser cuando la obra lo exige), dibujo 3D para aprobar antes de cortar, fabricación y montaje con herrajes de marca — cajones de extracción total con freno, bisagras amortiguadas.', 'Relevé précis (laser si le chantier l’exige), plan 3D à valider avant la découpe, fabrication et pose avec de la quincaillerie de marque — tiroirs à sortie totale et frein, charnières amorties.'],
    'carp.ex':    ['Cozinha na Maia: espaço pequeno e paredes fora de esquadria. Mobiliário lacado mate desenhado ao milímetro, ilha com zona de refeição e bancada em quartzo — 30% mais arrumação, sem obra de alvenaria.', 'Kitchen in Maia: small space and walls out of square. Matte-lacquered units drawn to the millimetre, an island with a dining area and a quartz worktop — 30% more storage, with no building work.', 'Cocina en Maia: espacio pequeño y paredes fuera de escuadra. Mobiliario lacado mate diseñado al milímetro, isla con zona de comer y encimera de cuarzo — 30% más de almacenaje, sin obra de albañilería.', 'Cuisine à Maia : petit espace et murs hors d’équerre. Meubles laqués mat dessinés au millimètre, îlot avec coin repas et plan de travail en quartz — 30 % de rangement en plus, sans maçonnerie.'],
    'carp.cap1': ['<b>À medida</b><span>Cada milímetro aproveitado, mesmo em paredes fora de esquadria.</span>', '<b>Bespoke</b><span>Every millimetre used, even on walls that are out of square.</span>', '<b>A medida</b><span>Cada milímetro aprovechado, incluso en paredes fuera de escuadra.</span>', '<b>Sur mesure</b><span>Chaque millimètre exploité, même sur des murs hors d’équerre.</span>'],
    'carp.cap2': ['<b>Acabamentos</b><span>Lacado mate anti-dedada, folha natural, verniz de água.</span>', '<b>Finishes</b><span>Anti-fingerprint matte lacquer, natural veneer, water-based varnish.</span>', '<b>Acabados</b><span>Lacado mate antihuellas, chapa natural, barniz al agua.</span>', '<b>Finitions</b><span>Laque mate anti-traces, placage naturel, vernis à l’eau.</span>'],
    'carp.cap3': ['<b>Exterior</b><span>Decks e pérgulas em madeira tratada, com fixação oculta.</span>', '<b>Outdoors</b><span>Decking and pergolas in treated timber, with hidden fixings.</span>', '<b>Exterior</b><span>Tarimas y pérgolas en madera tratada, con fijación oculta.</span>', '<b>Extérieur</b><span>Terrasses et pergolas en bois traité, fixation invisible.</span>'],
    'carp.cap4': ['<b>Restauro</b><span>Recuperação de móveis e portas com valor de estimação.</span>', '<b>Restoration</b><span>Bringing back furniture and doors with sentimental value.</span>', '<b>Restauración</b><span>Recuperación de muebles y puertas con valor sentimental.</span>', '<b>Restauration</b><span>Remise en état de meubles et portes de valeur sentimentale.</span>'],
    'carp.g1': ['Sapateira basculante · hall de entrada', 'Tilting shoe cabinet · entrance hall', 'Zapatero abatible · recibidor', 'Meuble à chaussures basculant · entrée'],
    'carp.g2': ['Secretária à medida com gaveteiro', 'Bespoke desk with drawer unit', 'Escritorio a medida con cajonera', 'Bureau sur mesure avec caisson'],
    'carp.g3': ['Armário de cozinha adaptado ao exaustor', 'Kitchen cabinet adapted to the extractor', 'Armario de cocina adaptado al extractor', 'Meuble de cuisine adapté à la hotte'],
    'carp.g4': ['Caixilharia pintada de castanho para branco', 'Window frames painted from brown to white', 'Carpintería pintada de marrón a blanco', 'Menuiseries repeintes du marron au blanc'],
    'carp.g5': ['Móvel de apoio para clínica de laser', 'Support cabinet for a laser clinic', 'Mueble de apoyo para clínica láser', 'Meuble d’appoint pour clinique laser'],
    'carp.bandAlt': ['Secretária lacada branca à medida com gaveteiro, feita pela Dizarro para o vão entre a parede e o radiador', 'Bespoke white lacquered desk with drawers, built by Dizarro for the gap between wall and radiator', 'Escritorio lacado blanco a medida con cajonera, hecho por Dizarro para el hueco entre la pared y el radiador', 'Bureau laqué blanc sur mesure avec caisson, réalisé par Dizarro pour l’espace entre le mur et le radiateur'],
    'carp.ctaH': ['Tem uma ideia à medida? Desenhamo-la.', 'Got a bespoke idea? We’ll draw it up.', '¿Tienes una idea a medida? La dibujamos.', 'Une idée sur mesure ? On la dessine.'],

    /* ===== Domótica ===== */
    'domo.title': ['Domótica e casa inteligente no Porto — Dizarro', 'Home automation & smart home in Porto — Dizarro', 'Domótica y hogar inteligente en Oporto — Dizarro', 'Domotique et maison connectée à Porto — Dizarro'],
    'domo.desc':  ['Iluminação e estores inteligentes, cenários, integração com Apple Home, Google e Alexa — mantendo os interruptores que já tem. Instalação e configuração no local.', 'Smart lighting and blinds, scenes, integration with Apple Home, Google and Alexa — keeping the switches you already have. Installed and configured on site.', 'Iluminación y persianas inteligentes, escenas, integración con Apple Home, Google y Alexa — manteniendo los interruptores que ya tienes. Instalación y configuración in situ.', 'Éclairage et volets connectés, scénarios, intégration Apple Home, Google et Alexa — en gardant vos interrupteurs actuels. Installation et configuration sur place.'],
    'domo.h1':    ['<span class="b">Domótica</span><br>sem dores de cabeça', '<span class="b">Home automation</span><br>without the headaches', '<span class="b">Domótica</span><br>sin dolores de cabeza', '<span class="b">Domotique</span><br>sans prise de tête'],
    'domo.sub':   ['Automação que funciona no dia a dia — e que qualquer pessoa da casa usa. Sem obra grande, sem trocar os interruptores, sem depender de uma app estrangeira que fecha amanhã.', 'Automation that works day to day — and that anyone in the house can use. No big building work, no swapping the switches, no relying on a foreign app that shuts down tomorrow.', 'Automatización que funciona en el día a día — y que usa cualquiera en casa. Sin obra grande, sin cambiar los interruptores, sin depender de una app extranjera que cierra mañana.', 'De l’automatisation qui fonctionne au quotidien — et que tout le monde à la maison peut utiliser. Sans gros travaux, sans changer les interrupteurs, sans dépendre d’une appli étrangère qui ferme demain.'],
    'domo.intro': ['Domótica boa é invisível: a luz certa acende sozinha, os estores fecham ao pôr do sol, e há um botão físico na parede para quando o telemóvel está longe. A Dizarro instala o hardware e — o mais importante — <strong>configura os cenários no local</strong>, consigo.', 'Good automation is invisible: the right light comes on by itself, the blinds close at sunset, and there’s a physical button on the wall for when the phone is out of reach. Dizarro installs the hardware and — most importantly — <strong>sets up the scenes on site</strong>, with you.', 'La buena domótica es invisible: la luz adecuada se enciende sola, las persianas bajan al atardecer, y hay un botón físico en la pared para cuando el móvil está lejos. Dizarro instala el hardware y — lo más importante — <strong>configura las escenas in situ</strong>, contigo.', 'Une bonne domotique est invisible : la bonne lumière s’allume seule, les volets se ferment au coucher du soleil, et il y a un bouton physique au mur quand le téléphone est loin. Dizarro installe le matériel et — surtout — <strong>règle les scénarios sur place</strong>, avec vous.'],
    'domo.list':  ['<li>Iluminação inteligente com regulação e temperatura de cor</li><li>Módulos atrás dos interruptores — mantém o comando físico</li><li>Estores e cortinados motorizados, com horários</li><li>Cenários: Acordar, Sair de casa, Cinema, Noite</li><li>Integração com Apple Home (HomeKit), Google Home e Alexa</li><li>Sensores de presença, porta e fumo; termostatos</li><li>Abertura de portão e fechaduras por app, com registo de acessos</li>', '<li>Smart lighting with dimming and colour temperature</li><li>Modules behind the switches — the physical control stays</li><li>Motorised blinds and curtains, with schedules</li><li>Scenes: Wake up, Leaving home, Cinema, Night</li><li>Integration with Apple Home (HomeKit), Google Home and Alexa</li><li>Presence, door and smoke sensors; thermostats</li><li>Gate and lock opening by app, with an access log</li>', '<li>Iluminación inteligente con regulación y temperatura de color</li><li>Módulos detrás de los interruptores — se mantiene el mando físico</li><li>Persianas y cortinas motorizadas, con horarios</li><li>Escenas: Despertar, Salir de casa, Cine, Noche</li><li>Integración con Apple Home (HomeKit), Google Home y Alexa</li><li>Sensores de presencia, puerta y humo; termostatos</li><li>Apertura de portón y cerraduras por app, con registro de accesos</li>', '<li>Éclairage connecté avec variation et température de couleur</li><li>Modules derrière les interrupteurs — la commande physique reste</li><li>Volets et rideaux motorisés, avec horaires</li><li>Scénarios : Réveil, Départ, Cinéma, Nuit</li><li>Intégration Apple Home (HomeKit), Google Home et Alexa</li><li>Capteurs de présence, d’ouverture et de fumée ; thermostats</li><li>Ouverture de portail et de serrures par appli, avec journal d’accès</li>'],
    'domo.how':   ['Vemos o que já tem, escolhemos equipamento com padrões abertos (Matter / Thread sempre que possível), instalamos e configuramos tudo consigo à frente. Fica com um resumo escrito de cada cenário.', 'We look at what you already have, pick equipment on open standards (Matter / Thread where possible), install and configure everything with you there. You get a written summary of each scene.', 'Vemos lo que ya tienes, elegimos equipos con estándares abiertos (Matter / Thread siempre que se pueda), instalamos y configuramos todo contigo delante. Te quedas con un resumen escrito de cada escena.', 'Nous regardons ce que vous avez déjà, choisissons du matériel aux standards ouverts (Matter / Thread si possible), installons et configurons tout avec vous. Vous repartez avec un récapitulatif écrit de chaque scénario.'],
    'domo.ex':    ['Moradia em Vila do Conde: substituição de iluminação a falhar por lâmpadas inteligentes compatíveis com HomeKit, interruptores de parede mantidos, e cenários de dia/noite/fora de casa configurados no local.', 'House in Vila do Conde: failing lighting replaced with HomeKit-compatible smart bulbs, wall switches kept, and day/night/away scenes set up on site.', 'Vivienda en Vila do Conde: sustitución de iluminación que fallaba por bombillas inteligentes compatibles con HomeKit, interruptores de pared mantenidos, y escenas de día/noche/fuera de casa configuradas in situ.', 'Maison à Vila do Conde : éclairage défaillant remplacé par des ampoules connectées compatibles HomeKit, interrupteurs muraux conservés, et scénarios jour/nuit/absence réglés sur place.'],
    'domo.cap1': ['<b>Iluminação</b><span>Cenas, regulação e temperatura de cor por divisão.</span>', '<b>Lighting</b><span>Scenes, dimming and colour temperature per room.</span>', '<b>Iluminación</b><span>Escenas, regulación y temperatura de color por estancia.</span>', '<b>Éclairage</b><span>Scénarios, variation et température de couleur par pièce.</span>'],
    'domo.cap2': ['<b>Estores</b><span>Motorização e horários ligados ao nascer/pôr do sol.</span>', '<b>Blinds</b><span>Motorisation and schedules tied to sunrise/sunset.</span>', '<b>Persianas</b><span>Motorización y horarios ligados al amanecer/atardecer.</span>', '<b>Volets</b><span>Motorisation et horaires liés au lever/coucher du soleil.</span>'],
    'domo.cap3': ['<b>Segurança</b><span>Sensores, fecho de portões e notificações no telemóvel.</span>', '<b>Security</b><span>Sensors, gate closing and phone notifications.</span>', '<b>Seguridad</b><span>Sensores, cierre de portones y notificaciones en el móvil.</span>', '<b>Sécurité</b><span>Capteurs, fermeture de portail et notifications mobiles.</span>'],
    'domo.cap4': ['<b>Voz &amp; app</b><span>Funciona com Siri, Google e Alexa — e com o interruptor.</span>', '<b>Voice &amp; app</b><span>Works with Siri, Google and Alexa — and with the switch.</span>', '<b>Voz y app</b><span>Funciona con Siri, Google y Alexa — y con el interruptor.</span>', '<b>Voix &amp; appli</b><span>Fonctionne avec Siri, Google et Alexa — et avec l’interrupteur.</span>'],
    'domo.baLead': ['Sala com a parede já preparada (focos e caixas embutidas) e a TV nova por instalar; depois, TV montada, ligada e configurada de raiz no local.', 'A living room with the wall already prepped (downlights and back boxes) and the new TV yet to install; then the TV mounted, wired and configured from scratch on site.', 'Salón con la pared ya preparada (focos y cajas empotradas) y la TV nueva por instalar; después, TV montada, conectada y configurada desde cero in situ.', 'Salon avec le mur déjà préparé (spots et boîtiers encastrés) et la nouvelle TV à poser ; puis TV montée, raccordée et configurée de zéro sur place.'],
    'domo.baBeforeAlt': ['Antes: parede preparada com focos e caixas, TV ainda por instalar', 'Before: wall prepped with downlights and boxes, TV not yet installed', 'Antes: pared preparada con focos y cajas, TV aún por instalar', 'Avant : mur préparé avec spots et boîtiers, TV pas encore posée'],
    'domo.baAfterAlt':  ['Depois: TV montada e a ser configurada', 'After: TV mounted and being configured', 'Después: TV montada y configurándose', 'Après : TV montée et en cours de configuration'],
    'domo.g1': ['Primeira configuração da TV no local', 'First TV setup done on site', 'Primera configuración de la TV in situ', 'Première configuration de la TV sur place'],
    'domo.g2': ['Ventoinha de teto com luz e comando', 'Ceiling fan with light and control', 'Ventilador de techo con luz y mando', 'Ventilateur de plafond avec lumière et commande'],
    'domo.g3': ['Focos embutidos na parede preparada', 'Recessed downlights on the prepped wall', 'Focos empotrados en la pared preparada', 'Spots encastrés sur le mur préparé'],
    'domo.bandAlt': ['Televisor a ser configurado numa sala, com proteção de obra no chão', 'A TV being configured in a living room, with dust sheeting on the floor', 'Televisor configurándose en un salón, con protección de obra en el suelo', 'Téléviseur en cours de configuration dans un salon, bâche de chantier au sol'],
    'domo.ctaH': ['Quer a casa mais esperta? Falamos.', 'Want a smarter home? Let’s talk.', '¿Quieres una casa más lista? Hablamos.', 'Envie d’une maison plus futée ? Parlons-en.'],
    'svc.baBeforeAria': ['Comparação antes e depois', 'Before and after comparison', 'Comparación antes y después', 'Comparaison avant/après']
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
