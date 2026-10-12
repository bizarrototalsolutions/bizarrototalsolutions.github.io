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
    'ui.caseAll': ['Ver todos os trabalhos →', 'See all the jobs →', 'Ver todos los trabajos →', 'Voir tous les travaux →'],
    'ui.dragCompare': ['Arraste o cursor para comparar. Trabalhos reais, sem montagens.', 'Drag the slider to compare. Real jobs, no staging.', 'Arrastra el cursor para comparar. Trabajos reales, sin montajes.', 'Faites glisser le curseur pour comparer. Vrais travaux, sans mise en scène.'],
    'ui.otherAreas': ['Outras áreas', 'Other areas', 'Otras áreas', 'Autres domaines'],

    'foot.blurb': ['Pequenos trabalhos técnicos na região do Porto — tomadas e interruptores, montagem de móveis, cabos e Wi-Fi, exaustores e pinturas, com um só interlocutor.', 'Small technical jobs across the Porto region — sockets and switches, furniture assembly, cables and Wi-Fi, extractors and painting, with a single point of contact.', 'Pequeños trabajos técnicos en la región de Oporto — enchufes e interruptores, montaje de muebles, cables y Wi-Fi, extractores y pintura, con un único interlocutor.', 'Petits travaux techniques dans la région de Porto — prises et interrupteurs, montage de meubles, câbles et Wi-Fi, hottes et peinture, avec un seul interlocuteur.'],
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
    'home.title': ['Dizarro | Eletricista, carpinteiro, redes e pintura no Porto', 'Dizarro | Electrician, carpenter, Wi-Fi and painting in Porto', 'Dizarro | Electricista, carpintero, redes y pintura, Oporto', 'Dizarro | Électricien, menuisier, réseaux, peinture à Porto'],
    'home.desc': ['Pequenos trabalhos no Grande Porto: tomadas e interruptores, montagem de móveis, cabos e Wi-Fi, exaustores e pinturas. Um só contacto. Orçamento grátis em 24 h.', 'Small jobs in Greater Porto: sockets and switches, furniture assembly, cables and Wi-Fi, extractors and painting. One contact. Free quote within 24 h.', 'Pequeños trabajos en el Gran Oporto: enchufes e interruptores, montaje de muebles, cables y Wi-Fi, extractores y pintura. Un solo contacto. Presupuesto gratis en 24 h.', 'Petits travaux dans le Grand Porto : prises et interrupteurs, montage de meubles, câbles et Wi-Fi, hottes et peinture. Un seul contact. Devis gratuit en 24 h.'],
    'home.eyebrow': ['Pequenos trabalhos técnicos · Grande Porto', 'Small technical jobs · Greater Porto', 'Pequeños trabajos técnicos · Gran Oporto', 'Petits travaux techniques · Grand Porto'],
    'home.h1':      ['Da luz <span class="b">à madeira,</span> fica <span class="o">bem&nbsp;feito.</span>', 'From the light <span class="b">to the woodwork,</span> <span class="o">done&nbsp;right.</span>', 'De la luz <span class="b">a la madera,</span> <span class="o">bien&nbsp;hecho.</span>', 'De la lumière <span class="b">au bois,</span> <span class="o">bien&nbsp;fait.</span>'],
    'home.sub': ['Trocar uma tomada, montar um móvel ou uma prateleira, passar um cabo, montar um exaustor, pintar uma janela — pequenos trabalhos, bem feitos, com um só interlocutor. Resposta em menos de 24&nbsp;horas.', 'Swapping a socket, assembling a piece of furniture or a shelf, running a cable, fitting an extractor, painting a window — small jobs, done well, with one point of contact. Reply in under 24&nbsp;hours.', 'Cambiar un enchufe, montar un mueble o una estantería, pasar un cable, montar un extractor, pintar una ventana — pequeños trabajos, bien hechos, con un único interlocutor. Respuesta en menos de 24&nbsp;horas.', 'Changer une prise, monter un meuble ou une étagère, tirer un câble, poser une hotte, peindre une fenêtre — de petits travaux, bien faits, avec un seul interlocuteur. Réponse en moins de 24&nbsp;heures.'],
    'home.heroAlt': ['Aplique de parede acabado, com luz quente, sobre revestimento de chapa perfilada — trabalho da Dizarro', 'Finished wall light with warm glow on profiled metal cladding — a Dizarro job', 'Aplique de pared acabado, con luz cálida, sobre revestimiento de chapa perfilada — trabajo de Dizarro', 'Applique murale finie, lumière chaude, sur bardage métallique nervuré — travail Dizarro'],
    'home.trust.works': ['trabalhos concluídos', 'jobs completed', 'trabajos terminados', 'travaux réalisés'],
    'home.trust.years': ['anos de experiência', 'years of experience', 'años de experiencia', 'ans d’expérience'],
    'home.trust.radius': ['de raio · a partir do Porto', 'radius · from Porto', 'de radio · desde Oporto', 'de rayon · depuis Porto'],
    'home.trust.reply':  ['resposta a pedidos', 'to answer a request', 'para responder', 'pour répondre'],

    'home.s01.k':    ['O que fazemos', 'What we do', 'Qué hacemos', 'Ce que nous faisons'],
    'home.s01.lead': ['Pequenos trabalhos do dia a dia, bem feitos: uma tomada, uma prateleira, um cabo, um exaustor, uma janela para pintar. Um só contacto para tudo.', 'Everyday small jobs, done well: a socket, a shelf, a cable, an extractor, a window to paint. One contact for all of it.', 'Pequeños trabajos del día a día, bien hechos: un enchufe, una estantería, un cable, un extractor, una ventana para pintar. Un solo contacto para todo.', 'Les petits travaux du quotidien, bien faits : une prise, une étagère, un câble, une hotte, une fenêtre à peindre. Un seul contact pour tout.'],
    'home.disc.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'home.disc.tel':  ['Redes, Wi-Fi &amp; Sites', 'Networks, Wi-Fi &amp; Websites', 'Redes, Wi-Fi y Sitios web', 'Réseaux, Wi-Fi &amp; Sites'],
    'home.disc.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'home.disc.pint': ['Pinturas', 'Painting', 'Pintura', 'Peinture'],
    'home.s01.elec.list': ['<li>Troca de tomadas e interruptores</li><li>Troca de luminárias e candeeiros</li><li>Substituição de disjuntores</li><li>Pequenos arranjos (sem quadros nem instalações novas)</li>', '<li>Swapping sockets and switches</li><li>Swapping light fittings and lamps</li><li>Replacing breakers</li><li>Small fixes (no panels or new installations)</li>', '<li>Cambio de enchufes e interruptores</li><li>Cambio de luminarias y lámparas</li><li>Sustitución de magnetotérmicos</li><li>Pequeños arreglos (sin cuadros ni instalaciones nuevas)</li>', '<li>Remplacement de prises et d’interrupteurs</li><li>Remplacement de luminaires et de lampes</li><li>Remplacement de disjoncteurs</li><li>Petits dépannages (ni tableaux ni installations neuves)</li>'],
    'home.s01.tel.list': ['<li>Passagem de cabos de internet e de TV</li><li>Otimização do Wi-Fi</li><li>Montagem e ligação de televisões</li><li>Criação de sites simples (como este)</li>', '<li>Running internet and TV cables</li><li>Wi-Fi optimisation</li><li>Mounting and connecting TVs</li><li>Simple website creation (like this one)</li>', '<li>Tendido de cables de internet y TV</li><li>Optimización del Wi-Fi</li><li>Montaje y conexión de televisores</li><li>Creación de webs sencillas (como esta)</li>', '<li>Tirage de câbles internet et TV</li><li>Optimisation du Wi-Fi</li><li>Pose et branchement de téléviseurs</li><li>Création de sites simples (comme celui-ci)</li>'],
    'home.s01.carp.list': ['<li>Montagem de móveis e prateleiras</li><li>Reparação de madeira e troca de dobradiças</li><li>Pequenos recortes e ajustes</li><li>Exaustores: montagem e verificação de avarias</li>', '<li>Furniture and shelf assembly</li><li>Wood repairs and hinge replacement</li><li>Small cut-outs and adjustments</li><li>Extractors: fitting and fault checks</li>', '<li>Montaje de muebles y estanterías</li><li>Reparación de madera y cambio de bisagras</li><li>Pequeños recortes y ajustes</li><li>Extractores: montaje y revisión de averías</li>', '<li>Montage de meubles et d’étagères</li><li>Réparation du bois et remplacement de charnières</li><li>Petites découpes et ajustements</li><li>Hottes : pose et vérification des pannes</li>'],
    'home.s01.pint.list': ['<li>Pintar móveis</li><li>Pintar janelas e caixilharia</li><li>De castanho para branco</li><li>Pequenos retoques</li>', '<li>Painting furniture</li><li>Painting windows and frames</li><li>From brown to white</li><li>Small touch-ups</li>', '<li>Pintar muebles</li><li>Pintar ventanas y carpintería</li><li>De marrón a blanco</li><li>Pequeños retoques</li>', '<li>Peindre des meubles</li><li>Peindre fenêtres et menuiseries</li><li>Du marron au blanc</li><li>Petites retouches</li>'],
    'home.chips.elec': ['<span>luzes</span><span>tomadas</span><span>interruptores</span><span>disjuntores</span>', '<span>lights</span><span>sockets</span><span>switches</span><span>breakers</span>', '<span>luces</span><span>enchufes</span><span>interruptores</span><span>magnetotérmicos</span>', '<span>lumières</span><span>prises</span><span>interrupteurs</span><span>disjoncteurs</span>'],
    'home.chips.tel': ['<span>cabos</span><span>Wi-Fi</span><span>televisões</span><span>sites</span>', '<span>cables</span><span>Wi-Fi</span><span>TVs</span><span>websites</span>', '<span>cables</span><span>Wi-Fi</span><span>televisores</span><span>webs</span>', '<span>câbles</span><span>Wi-Fi</span><span>téléviseurs</span><span>sites</span>'],
    'home.chips.carp': ['<span>montagem</span><span>prateleiras</span><span>reparações</span><span>exaustores</span>', '<span>assembly</span><span>shelves</span><span>repairs</span><span>extractors</span>', '<span>montaje</span><span>estanterías</span><span>reparaciones</span><span>extractores</span>', '<span>montage</span><span>étagères</span><span>réparations</span><span>hottes</span>'],
    'home.chips.pint': ['<span>móveis</span><span>janelas</span><span>portas</span><span>retoques</span>', '<span>furniture</span><span>windows</span><span>doors</span><span>touch-ups</span>', '<span>muebles</span><span>ventanas</span><span>puertas</span><span>retoques</span>', '<span>meubles</span><span>fenêtres</span><span>portes</span><span>retouches</span>'],
    'home.step.no1': ['PASSO 01', 'STEP 01', 'PASO 01', 'ÉTAPE 01'],
    'home.step.no2': ['PASSO 02', 'STEP 02', 'PASO 02', 'ÉTAPE 02'],
    'home.step.no3': ['PASSO 03', 'STEP 03', 'PASO 03', 'ÉTAPE 03'],
    'home.plate.1t': ['Televisão de 100 polegadas na parede', '100-inch TV on the wall', 'Televisor de 100 pulgadas en la pared', 'Téléviseur de 100 pouces au mur'],
    'home.plate.2t': ['Cabos e secretária arrumados', 'Tidy cables and desk', 'Cables y escritorio ordenados', 'Câbles et bureau rangés'],
    'home.plate.3t': ['Aplique de parede em fachada de chapa', 'Wall light on a metal-clad wall', 'Aplique de pared en una fachada de chapa', 'Applique murale sur bardage métallique'],
    'home.plate.4t': ['Janelas · de castanho para branco', 'Windows · from brown to white', 'Ventanas · de marrón a blanco', 'Fenêtres · du marron au blanc'],
    'home.plate.5t': ['Montagem de um carro infantil', 'Assembling a children’s ride-on car', 'Montaje de un coche infantil', 'Montage d’une voiture pour enfant'],
    'home.plate.loc': ['Grande Porto', 'Greater Porto', 'Gran Oporto', 'Grand Porto'],
    'home.plate.loc2': ['Grande Porto', 'Greater Porto', 'Gran Oporto', 'Grand Porto'],
    'tape.telecom': ['Telecom', 'Telecom', 'Telecom', 'Télécom'],
    'tape.networks': ['Redes', 'Networks', 'Redes', 'Réseaux'],
    'tape.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'tape.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'tape.pint': ['Pinturas', 'Painting', 'Pintura', 'Peinture'],
    'ui.5of5': ['5 em 5', '5 out of 5', '5 de 5', '5 sur 5'],
    'home.band2Alt': ['Secretária branca com gaveteiro, no espaço entre a parede e o radiador', 'White desk with drawers, in the gap between wall and radiator', 'Escritorio blanco con cajonera, en el hueco entre la pared y el radiador', 'Bureau blanc avec caisson, dans l’espace entre le mur et le radiateur'],
    'home.win.beforeAlt': ['Antes: caixilharia castanha, com vista para a marina', 'Before: brown window frame, with a marina view', 'Antes: carpintería marrón, con vistas al puerto deportivo', 'Avant : menuiserie marron, vue sur la marina'],
    'home.win.afterAlt': ['Depois: caixilharia pintada de branco, com vista para a marina', 'After: window frame painted white, with a marina view', 'Después: carpintería pintada de blanco, con vistas al puerto deportivo', 'Après : menuiserie peinte en blanc, vue sur la marina'],
    'home.tv.beforeAlt':  ['Antes: televisor pousado em cima do aparador', 'Before: TV resting on the sideboard', 'Antes: televisor apoyado en el aparador', 'Avant : téléviseur posé sur le buffet'],
    'home.tv.afterAlt':   ['Depois: televisor fixo na parede, com os cabos escondidos', 'After: TV fixed to the wall, cables hidden', 'Después: televisor fijado a la pared, con los cables ocultos', 'Après : téléviseur fixé au mur, câbles cachés'],
    'home.s05.hqv': ['No local do cliente (≈ 90% dos trabalhos)', 'At the client’s place (≈ 90% of jobs)', 'En el domicilio del cliente (≈ 90% de los trabajos)', 'Chez le client (≈ 90 % des travaux)'],
    'home.s01.more.elec': ['Ver eletricidade →', 'View electrical →', 'Ver electricidad →', 'Voir l’électricité →'],
    'home.s01.more.tel':  ['Ver telecom &amp; redes →', 'View telecom &amp; networks →', 'Ver telecom y redes →', 'Voir télécom &amp; réseaux →'],
    'home.s01.more.carp': ['Ver carpintaria →', 'View carpentry →', 'Ver carpintería →', 'Voir la menuiserie →'],
    'home.s01.more.pint': ['Ver pinturas →', 'View painting →', 'Ver pintura →', 'Voir la peinture →'],

    'home.bandAlt': ['Aplique de parede acabado sobre revestimento de chapa perfilada, trabalho elétrico da Dizarro', 'Finished wall light on profiled metal cladding, Dizarro electrical job', 'Aplique de pared acabado sobre revestimiento de chapa perfilada, trabajo eléctrico de Dizarro', 'Applique murale finie sur bardage métallique nervuré, travail électrique Dizarro'],
    'home.s02.k':    ['Pedir orçamento é rápido', 'Getting a quote is quick', 'Pedir presupuesto es rápido', 'Demander un devis est rapide'],
    'home.s02.lead': ['Sem formulários intermináveis. Diga o que precisa, respondemos em menos de 24&nbsp;horas úteis, e o orçamento é gratuito e sem compromisso.', 'No endless forms. Tell us what you need, we reply within 24&nbsp;working hours, and the quote is free with no obligation.', 'Sin formularios interminables. Dinos qué necesitas, respondemos en menos de 24&nbsp;horas laborables, y el presupuesto es gratis y sin compromiso.', 'Pas de formulaires interminables. Dites-nous ce dont vous avez besoin, nous répondons sous 24&nbsp;heures ouvrées, et le devis est gratuit et sans engagement.'],
    'home.s02.st1.t': ['Conta-nos', 'Tell us', 'Cuéntanos', 'Dites-nous'],
    'home.s02.st1.p': ['Uma mensagem por WhatsApp ou uma chamada. Fotos ajudam, mas não são obrigatórias.', 'A WhatsApp message or a call. Photos help, but are not required.', 'Un mensaje de WhatsApp o una llamada. Las fotos ayudan, pero no son obligatorias.', 'Un message WhatsApp ou un appel. Les photos aident, mais ne sont pas obligatoires.'],
    'home.s02.st2.t': ['Vistoria', 'Site visit', 'Visita técnica', 'Visite technique'],
    'home.s02.st2.p': ['Se o trabalho justificar, marcamos uma visita técnica para medir e perceber o contexto.', 'If the job calls for it, we book a site visit to measure and understand the context.', 'Si el trabajo lo requiere, concertamos una visita para medir y entender el contexto.', 'Si le chantier le justifie, nous planifions une visite pour mesurer et comprendre le contexte.'],
    'home.s02.st3.t': ['Proposta clara', 'Clear proposal', 'Propuesta clara', 'Devis clair'],
    'home.s02.st3.p': ['Recebe um preço claro antes de começarmos — materiais, mão de obra e prazo. Sem surpresas na fatura.', 'You get a clear price before we start — materials, labour and timing. No surprises on the invoice.', 'Recibes un precio claro antes de empezar — materiales, mano de obra y plazo. Sin sorpresas en la factura.', 'Vous recevez un prix clair avant que nous commencions — matériaux, main-d’œuvre et délai. Aucune surprise sur la facture.'],
    'home.s03.k':    ['Trabalhos recentes', 'Recent projects', 'Trabajos recientes', 'Réalisations récentes'],
    'home.s03.lead': ['Trabalhos reais da Dizarro na região do Porto.', 'Real Dizarro jobs across the Porto region.', 'Trabajos reales de Dizarro en la región de Oporto.', 'Vrais travaux de Dizarro dans la région de Porto.'],
    'home.s04.k':    ['Antes &amp; depois', 'Before &amp; after', 'Antes y después', 'Avant &amp; après'],
    'home.s04.win': ['Janelas · de castanho para branco', 'Windows · from brown to white', 'Ventanas · de marrón a blanco', 'Fenêtres · du marron au blanc'],
    'home.s04.tv': ['Televisão · do móvel para a parede', 'TV · from the unit to the wall', 'Televisor · del mueble a la pared', 'Téléviseur · du meuble au mur'],
    'home.s04.more': ['Mais trabalhos', 'More projects', 'Más trabajos', 'Plus de réalisations'],
    'home.s04.light': ['Aplique de parede · fios à vista → acabado', 'Wall light · wires showing → finished', 'Aplique de pared · cables a la vista → terminado', 'Applique murale · fils apparents → terminée'],
    'ba.inwork':   ['Em obra', 'In progress', 'En obra', 'En cours'],
    'ba.done':     ['Acabado', 'Finished', 'Acabado', 'Terminé'],
    'ba.brown':  ['Antes · castanha', 'Before · brown', 'Antes · marrón', 'Avant · marron'],
    'ba.white':  ['Depois · branca', 'After · white', 'Después · blanca', 'Après · blanc'],
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
    'home.g.desk': ['Carpintaria · secretária com gaveteiro', 'Carpentry · desk with drawers', 'Carpintería · escritorio con cajonera', 'Menuiserie · bureau avec caisson'],
    'home.g.shoe':      ['Carpintaria · sapateira de entrada', 'Carpentry · hallway shoe cabinet', 'Carpintería · zapatero de entrada', 'Menuiserie · meuble à chaussures'],
    'home.g.laser':     ['Carpintaria · móvel p/ clínica de laser', 'Carpentry · cabinet for a laser clinic', 'Carpintería · mueble para clínica láser', 'Menuiserie · meuble pour clinique laser'],

    'home.s05.k':    ['Onde trabalhamos', 'Where we work', 'Dónde trabajamos', 'Où nous intervenons'],
    'home.s05.lead': ['Trabalhamos no local do cliente: cerca de 90% dos trabalhos fazem-se em casa de quem nos chama. Deslocamo-nos num raio de cerca de 100&nbsp;km do Porto — toda a Área Metropolitana, mais Braga e Aveiro.', 'We work at the client’s place: about 90% of jobs are done in the home of whoever calls us. We travel within about 100&nbsp;km of Porto — the whole metropolitan area, plus Braga and Aveiro.', 'Trabajamos en el domicilio del cliente: cerca del 90% de los trabajos se hacen en casa de quien nos llama. Nos desplazamos en un radio de unos 100&nbsp;km de Oporto — toda el área metropolitana, más Braga y Aveiro.', 'Nous travaillons chez le client : environ 90 % des travaux se font chez celui qui nous appelle. Nous nous déplaçons dans un rayon d’environ 100&nbsp;km autour de Porto — toute l’aire métropolitaine, plus Braga et Aveiro.'],
    'home.s05.hq': ['Atendimento', 'Service', 'Servicio', 'Intervention'],
    'home.s05.coord': ['Coord', 'Coord', 'Coord', 'Coord'],
    'home.s05.rad':   ['Raio', 'Radius', 'Radio', 'Rayon'],
    'home.s05.radv': ['≈ 100 km do Porto (Porto · Braga · Aveiro)', '≈ 100 km from Porto (Porto · Braga · Aveiro)', '≈ 100 km de Oporto (Oporto · Braga · Aveiro)', '≈ 100 km de Porto (Porto · Braga · Aveiro)'],
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
    'home.faq3.q': ['Fazem trabalhos grandes?', 'Do you take on big jobs?', '¿Hacéis trabajos grandes?', 'Faites-vous de gros chantiers ?'],
    'home.faq3.a': ['Não. Fazemos pequenos trabalhos para casas e pequenos espaços: trocar uma tomada, montar um móvel, passar um cabo, pintar uma janela. Se o trabalho for maior do que isso, dizemos-lhe logo.', 'No. We do small jobs for homes and small spaces: swapping a socket, assembling furniture, running a cable, painting a window. If the job is bigger than that, we tell you straight away.', 'No. Hacemos pequeños trabajos para casas y espacios pequeños: cambiar un enchufe, montar un mueble, pasar un cable, pintar una ventana. Si el trabajo es mayor, te lo decimos enseguida.', 'Non. Nous faisons de petits travaux pour logements et petits espaces : changer une prise, monter un meuble, tirer un câble, peindre une fenêtre. Si le travail est plus important, nous vous le disons tout de suite.'],
    'home.faq4.q':  ['Como posso pagar?', 'How can I pay?', '¿Cómo puedo pagar?', 'Comment puis-je payer ?'],
    'home.faq4.a': ['Transferência bancária, MB Way e numerário, no fim do trabalho.', 'Bank transfer, MB Way and cash, at the end of the job.', 'Transferencia bancaria, MB Way y efectivo, al terminar el trabajo.', 'Virement, MB Way et espèces, à la fin du travail.'],
    'home.cta.h':   ['Diga-nos o que precisa', 'Tell us what you need', 'Dinos qué necesitas', 'Dites-nous ce dont vous avez besoin'],

    /* ===== Página de serviço (partilhado) ===== */
    'svc.crumb.services': ['Serviços', 'Services', 'Servicios', 'Services'],
    'svc.whatWeDo':  ['O que fazemos', 'What we do', 'Qué hacemos', 'Ce que nous faisons'],
    'svc.howWeWork': ['Como trabalhamos', 'How we work', 'Cómo trabajamos', 'Comment nous travaillons'],
    'svc.realEx':    ['Exemplo real', 'Real example', 'Ejemplo real', 'Exemple réel'],
    'svc.baTitle': ['Antes &amp; depois — trabalho real', 'Before &amp; after — real job', 'Antes y después — trabajo real', 'Avant &amp; après — travail réel'],
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
    'svchub.title': ['Serviços Dizarro: eletricidade, redes, carpintaria, pintura', 'Dizarro services: electrical, networks, carpentry, painting', 'Servicios Dizarro: electricidad, redes, carpintería, pintura', 'Dizarro : électricité, réseaux, menuiserie, peinture'],
    'svchub.desc': ['Pequenos trabalhos no Porto: tomadas e interruptores, cabos e Wi-Fi, montagem de móveis e exaustores, e pinturas. Um só interlocutor para o dia a dia.', 'Small jobs in Porto: sockets and switches, cables and Wi-Fi, furniture assembly and extractors, and painting. One point of contact for everyday needs.', 'Pequeños trabajos en Oporto: enchufes e interruptores, cables y Wi-Fi, montaje de muebles y extractores, y pintura. Un único interlocutor para el día a día.', 'Petits travaux à Porto : prises et interrupteurs, câbles et Wi-Fi, montage de meubles et hottes, et peinture. Un seul interlocuteur au quotidien.'],
    'svchub.h1':    ['Uma equipa,<br><span class="o">quatro frentes</span>', 'One team,<br><span class="o">four fronts</span>', 'Un equipo,<br><span class="o">cuatro frentes</span>', 'Une équipe,<br><span class="o">quatre fronts</span>'],
    'svchub.sub': ['Pequenos trabalhos de uma casa ou espaço, tratados com cuidado. Escolha a área para os detalhes.', 'Small jobs in a home or space, handled with care. Pick an area for details.', 'Pequeños trabajos de una casa o local, tratados con cuidado. Elige un área para ver los detalles.', 'Les petits travaux d’un logement ou d’un local, traités avec soin. Choisissez un domaine pour les détails.'],
    'svchub.elec.cap': ['Tomadas · interruptores · luzes · disjuntores', 'Sockets · switches · lights · breakers', 'Enchufes · interruptores · luces · magnetotérmicos', 'Prises · interrupteurs · lumières · disjoncteurs'],
    'svchub.tel.cap': ['Cabos · Wi-Fi · televisões · sites', 'Cables · Wi-Fi · TVs · websites', 'Cables · Wi-Fi · televisores · webs', 'Câbles · Wi-Fi · téléviseurs · sites'],
    'svchub.carp.cap': ['Montagem · prateleiras · reparações · exaustores', 'Assembly · shelves · repairs · extractors', 'Montaje · estanterías · reparaciones · extractores', 'Montage · étagères · réparations · hottes'],
    'svchub.pint.cap': ['Móveis · janelas · portas · retoques', 'Furniture · windows · doors · touch-ups', 'Muebles · ventanas · puertas · retoques', 'Meubles · fenêtres · portes · retouches'],
    'svchub.why.h': ['Porquê ter tudo com a mesma equipa', 'Why keep it all with one team', 'Por qué tenerlo todo con el mismo equipo', 'Pourquoi tout confier à la même équipe'],
    'svchub.why.list': ['<li>Um orçamento, um responsável, um número para ligar</li><li>As áreas falam entre si — a tomada fica onde o móvel a precisa</li><li>Menos marcações, menos deslocações, menos "isso não é comigo"</li><li>Se o trabalho voltar a falhar dentro do prazo, voltamos sem custo</li>', '<li>One quote, one person in charge, one number to call</li><li>The trades talk to each other — the socket goes where the furniture needs it</li><li>Fewer appointments, fewer trips, fewer "not my job"</li><li>If the work fails again within the warranty period, we come back at no cost</li>', '<li>Un presupuesto, un responsable, un número al que llamar</li><li>Los oficios hablan entre sí — el enchufe va donde lo necesita el mueble</li><li>Menos citas, menos desplazamientos, menos "eso no es lo mío"</li><li>Si el trabajo vuelve a fallar dentro del plazo, volvemos sin coste</li>', '<li>Un devis, un responsable, un numéro à appeler</li><li>Les métiers se parlent — la prise est là où le meuble en a besoin</li><li>Moins de rendez-vous, moins de déplacements, moins de "ce n’est pas mon rayon"</li><li>Si le travail lâche à nouveau pendant la garantie, nous revenons sans frais</li>'],
    'svchub.cta.h': ['Não sabe por onde começar? Diga-nos o problema.', 'Not sure where to start? Just tell us the problem.', '¿No sabes por dónde empezar? Cuéntanos el problema.', 'Vous ne savez pas par où commencer ? Dites-nous le problème.'],

    /* ===== Contactos ===== */
    'ct.title': ['Contactos e orçamento grátis no Porto | Dizarro', 'Contact and free quote in Porto | Dizarro', 'Contacto y presupuesto gratis en Oporto | Dizarro', 'Contact et devis gratuit à Porto | Dizarro'],
    'ct.desc': ['Peça um orçamento grátis à Dizarro: tomadas, cabos e Wi-Fi, montagem de móveis, exaustores ou pinturas, no Porto. Telefone 932 344 080 e WhatsApp.', 'Ask Dizarro for a free quote: sockets, cables and Wi-Fi, furniture assembly, extractors or painting, in Porto. Phone 932 344 080 and WhatsApp.', 'Pide a Dizarro un presupuesto gratis: enchufes, cables y Wi-Fi, montaje de muebles, extractores o pintura, en Oporto. Teléfono 932 344 080 y WhatsApp.', 'Demandez un devis gratuit à Dizarro : prises, câbles et Wi-Fi, montage de meubles, hottes ou peinture, à Porto. Téléphone 932 344 080 et WhatsApp.'],
    'ct.crumb':  ['Contactos', 'Contact', 'Contacto', 'Contact'],
    'ct.h1':     ['Orçamento <span class="o">grátis</span><br>em &lt; 24 horas', 'Free <span class="o">quote</span><br>in &lt; 24 hours', 'Presupuesto <span class="o">gratis</span><br>en &lt; 24 horas', 'Devis <span class="o">gratuit</span><br>en &lt; 24 heures'],
    'ct.sub':    ['A forma mais rápida é o WhatsApp. Prefere escrever com calma? Use o formulário — chega-nos por e-mail e fica registado.', 'The fastest way is WhatsApp. Rather write at your own pace? Use the form — it reaches us by email and is logged.', 'La forma más rápida es WhatsApp. ¿Prefieres escribir con calma? Usa el formulario — nos llega por correo y queda registrado.', 'Le plus rapide, c’est WhatsApp. Vous préférez écrire tranquillement ? Utilisez le formulaire — il nous arrive par e-mail et reste enregistré.'],
    'ct.row.phone': ['Telefone', 'Phone', 'Teléfono', 'Téléphone'],
    'ct.row.wa':    ['WhatsApp', 'WhatsApp', 'WhatsApp', 'WhatsApp'],
    'ct.row.email': ['E-mail', 'Email', 'Correo', 'E-mail'],
    'ct.row.base': ['Atendimento', 'Service', 'Servicio', 'Intervention'],
    'ct.row.zone':  ['Zona', 'Area', 'Zona', 'Zone'],
    'ct.row.hours': ['Horário', 'Hours', 'Horario', 'Horaires'],
    'ct.wa.send':   ['Enviar mensagem', 'Send a message', 'Enviar mensaje', 'Envoyer un message'],
    'ct.base.v': ['No local do cliente (≈ 90% dos trabalhos). Ainda sem espaço aberto ao público.', 'At the client’s place (≈ 90% of jobs). No premises open to the public yet.', 'En el domicilio del cliente (≈ 90% de los trabajos). Aún sin local abierto al público.', 'Chez le client (≈ 90 % des travaux). Pas encore de local ouvert au public.'],
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
    'ct.f.local': ['Localidade do trabalho', 'Job location', 'Localidad del trabajo', 'Lieu du travail'],
    'ct.f.local.ph':['Ex.: Matosinhos', 'E.g. Matosinhos', 'Ej.: Matosinhos', 'Ex. : Matosinhos'],
    'ct.f.local.err':['Indique a localidade.', 'Please enter the location.', 'Indica la localidad.', 'Indiquez le lieu.'],
    'ct.f.desc':    ['O que precisa', 'What you need', 'Qué necesitas', 'Ce dont vous avez besoin'],
    'ct.f.desc.ph': ['Descreva o trabalho: por exemplo, trocar 2 tomadas, montar uma estante, passar um cabo…', 'Describe the job: for example, swap 2 sockets, assemble a bookcase, run a cable…', 'Describe el trabajo: por ejemplo, cambiar 2 enchufes, montar una estantería, pasar un cable…', 'Décrivez le travail : par exemple, changer 2 prises, monter une bibliothèque, tirer un câble…'],
    'ct.f.desc.err':['Descreva o trabalho pretendido.', 'Please describe the job.', 'Describe el trabajo.', 'Décrivez le chantier.'],
    'ct.f.submit':  ['Enviar pedido', 'Send request', 'Enviar solicitud', 'Envoyer la demande'],
    'ct.f.note':    ['🔒 Só usamos os dados para responder ao pedido.', '🔒 We only use your details to answer the request.', '🔒 Solo usamos los datos para responder a la solicitud.', '🔒 Nous n’utilisons vos données que pour répondre.'],

    /* ===== Sobre ===== */
    'about.title': ['Sobre a Dizarro — quem faz o trabalho', 'About Dizarro — who does the work', 'Sobre Dizarro — quién hace el trabajo', 'À propos de Dizarro — qui fait le travail'],
    'about.desc': ['A Dizarro foi fundada a 13 de outubro de 2026 por Diogo Bizarro, com 7 anos de experiência em pequenos trabalhos técnicos na região do Porto.', 'Dizarro was founded on 13 October 2026 by Diogo Bizarro, with 7 years of experience in small technical jobs across the Porto region.', 'Dizarro fue fundada el 13 de octubre de 2026 por Diogo Bizarro, con 7 años de experiencia en pequeños trabajos técnicos en la región de Oporto.', 'Dizarro a été fondée le 13 octobre 2026 par Diogo Bizarro, avec 7 ans d’expérience dans de petits travaux techniques dans la région de Porto.'],
    'about.crumb': ['Sobre', 'About', 'Nosotros', 'À propos'],
    'about.h1':    ['Quem faz<br>o <span class="o">trabalho</span>', 'Who does<br>the <span class="o">work</span>', 'Quién hace<br>el <span class="o">trabajo</span>', 'Qui fait<br>le <span class="o">travail</span>'],
    'about.sub': ['A Dizarro foi fundada a 13 de outubro de 2026 por Diogo Bizarro, com 7 anos de experiência nestas áreas, para responder a uma coisa simples: trabalho técnico bem feito, à hora combinada, com quem atende o telefone a seguir.', 'Dizarro was founded on 13 October 2026 by Diogo Bizarro, with 7 years of experience in these areas, to deliver something simple: technical work done well, on time, with someone who still picks up the phone afterwards.', 'Dizarro fue fundada el 13 de octubre de 2026 por Diogo Bizarro, con 7 años de experiencia en estas áreas, para responder a algo simple: trabajo técnico bien hecho, a la hora acordada, con quien atiende el teléfono después.', 'Dizarro a été fondée le 13 octobre 2026 par Diogo Bizarro, avec 7 ans d’expérience dans ces domaines, pour offrir une chose simple : un travail technique bien fait, à l’heure convenue, avec quelqu’un qui répond encore au téléphone ensuite.'],
    'about.lead': ['Fundada a 13 de outubro de 2026. Sete anos de experiência, mais de 150 trabalhos feitos, um raio de 100 km à volta do Porto.', 'Founded on 13 October 2026. Seven years of experience, over 150 jobs done, a 100 km radius around Porto.', 'Fundada el 13 de octubre de 2026. Siete años de experiencia, más de 150 trabajos hechos, un radio de 100 km alrededor de Oporto.', 'Fondée le 13 octobre 2026. Sept ans d’expérience, plus de 150 travaux réalisés, un rayon de 100 km autour de Porto.'],
    'about.p1': ['O Diogo começou com pequenas reparações elétricas e foi crescendo por indicação — cliente que recomenda a cliente. Pelo caminho juntou a montagem de móveis, as redes e a pintura, porque eram sempre as mesmas casas a precisar de tudo. Em 2026 nasceu a Dizarro.', 'Diogo started with small electrical repairs and grew by word of mouth — one client recommending the next. Along the way he added furniture assembly, networks and painting, because it was always the same homes needing all of it. Dizarro began in 2026.', 'Diogo empezó con pequeñas reparaciones eléctricas y creció por recomendación — cliente que recomienda a cliente. Por el camino sumó el montaje de muebles, las redes y la pintura, porque eran siempre las mismas casas las que lo necesitaban todo. En 2026 nació Dizarro.', 'Diogo a commencé par de petites réparations électriques et a grandi par le bouche-à-oreille — un client en recommandant un autre. En chemin, il a ajouté le montage de meubles, les réseaux et la peinture, car c’étaient toujours les mêmes logements qui avaient besoin de tout. Dizarro est née en 2026.'],
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
    'about.sp.jobs': ['Trabalhos', 'Jobs', 'Trabajos', 'Travaux'],
    'about.bandAlt': ['Trabalho da Dizarro: televisor montado com cablagem escondida numa sala', 'A Dizarro job: wall-mounted TV with hidden cabling in a living room', 'Trabajo de Dizarro: televisor montado con cableado oculto en un salón', 'Travail Dizarro : téléviseur mural avec câblage caché dans un salon'],
    'about.cta.h': ['Diga-nos o que precisa de arranjar', 'Tell us what needs fixing', 'Dinos qué necesitas arreglar', 'Dites-nous ce qu’il y a à réparer'],
    /* ===== Portfólio / projeto ===== */
    'pf.title': ['Trabalhos reais no Porto — antes e depois | Dizarro', 'Real jobs in Porto — before and after | Dizarro', 'Trabajos reales en Oporto — antes y después | Dizarro', 'Réalisations à Porto — avant et après | Dizarro'],
    'pf.desc': ['Trabalhos reais da Dizarro na região do Porto: tomadas e interruptores, cabos e Wi-Fi, montagem de móveis, exaustores e pinturas, com antes e depois.', 'Real Dizarro jobs across the Porto region: sockets and switches, cables and Wi-Fi, furniture assembly, extractors and painting, with before and after.', 'Trabajos reales de Dizarro en la región de Oporto: enchufes e interruptores, cables y Wi-Fi, montaje de muebles, extractores y pintura, con antes y después.', 'Travaux réels de Dizarro dans la région de Porto : prises et interrupteurs, câbles et Wi-Fi, montage de meubles, hottes et peinture, avec avant/après.'],
    'pf.crumb': ['Trabalhos', 'Projects', 'Trabajos', 'Réalisations'],
    'pf.h1': ['Trabalhos <span class="o">reais</span>,<br>não renders', '<span class="o">Real</span> jobs,<br>not renders', 'Trabajos <span class="o">reales</span>,<br>no renders', 'Des travaux <span class="o">réels</span>,<br>pas des rendus'],
    'pf.sub': ['Alguns trabalhos reais da Dizarro na região do Porto. Clique num trabalho para ver o antes/depois e o que foi feito.', 'A few real Dizarro jobs across the Porto region. Click a job to see the before/after and what was done.', 'Algunos trabajos reales de Dizarro en la región de Oporto. Haz clic en un trabajo para ver el antes/después y lo que se hizo.', 'Quelques travaux réels de Dizarro dans la région de Porto. Cliquez sur un travail pour voir l’avant/après et ce qui a été fait.'],
    'pf.filter.aria': ['Filtrar por área', 'Filter by area', 'Filtrar por área', 'Filtrer par domaine'],
    'pf.filter.all':  ['Todos', 'All', 'Todos', 'Tous'],
    'pf.filter.elec': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'pf.filter.tel':  ['Telecom &amp; Redes', 'Telecom &amp; Networks', 'Telecom y Redes', 'Télécom &amp; Réseaux'],
    'pf.filter.carp': ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'pf.filter.pint': ['Pinturas', 'Painting', 'Pintura', 'Peinture'],
    'pf.note': ['Quer ver trabalhos semelhantes ao seu? <a href="contactos.html#orcamento">Fale connosco</a>.', 'Want to see jobs like yours? <a href="contactos.html#orcamento">Get in touch</a>.', '¿Quieres ver trabajos como el tuyo? <a href="contactos.html#orcamento">Habla con nosotros</a>.', 'Envie de voir des travaux comme le vôtre ? <a href="contactos.html#orcamento">Contactez-nous</a>.'],
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
    'priv.resp': ['<strong>Dizarro</strong> (Diogo Bizarro), serviço prestado no local do cliente, Grande Porto. Contacto: <a href="mailto:dizarro.pt@gmail.com">dizarro.pt@gmail.com</a>.', '<strong>Dizarro</strong> (Diogo Bizarro), service provided at the client’s place, Greater Porto. Contact: <a href="mailto:dizarro.pt@gmail.com">dizarro.pt@gmail.com</a>.', '<strong>Dizarro</strong> (Diogo Bizarro), servicio prestado en el domicilio del cliente, Gran Oporto. Contacto: <a href="mailto:dizarro.pt@gmail.com">dizarro.pt@gmail.com</a>.', '<strong>Dizarro</strong> (Diogo Bizarro), service rendu chez le client, Grand Porto. Contact : <a href="mailto:dizarro.pt@gmail.com">dizarro.pt@gmail.com</a>.'],
    'priv.h.what':  ['Que dados recolhemos', 'What data we collect', 'Qué datos recogemos', 'Quelles données nous collectons'],
    'priv.what':    ['<li>Os que introduz no formulário de orçamento: nome, telefone, área de serviço, localidade e descrição do trabalho.</li><li>A página onde o formulário foi submetido e o tipo de navegador (para diagnóstico e anti-spam).</li>', '<li>What you enter in the quote form: name, phone, service area, location and job description.</li><li>The page the form was submitted from and the browser type (for diagnostics and anti-spam).</li>', '<li>Lo que introduces en el formulario de presupuesto: nombre, teléfono, área de servicio, localidad y descripción del trabajo.</li><li>La página desde la que se envió el formulario y el tipo de navegador (para diagnóstico y antispam).</li>', '<li>Ce que vous saisissez dans le formulaire de devis : nom, téléphone, domaine, lieu et description du chantier.</li><li>La page d’envoi du formulaire et le type de navigateur (diagnostic et anti-spam).</li>'],
    'priv.h.why':   ['Para que servem', 'What we use them for', 'Para qué sirven', 'À quoi elles servent'],
    'priv.why': ['Unicamente para responder ao pedido e, se o trabalho avançar, para o organizar. Base legal: diligências pré-contratuais a seu pedido (RGPD, art.º 6.º/1-b).', 'Solely to answer the request and, if the job goes ahead, to organise it. Legal basis: pre-contractual steps at your request (GDPR, Art. 6(1)(b)).', 'Únicamente para responder a la solicitud y, si el trabajo sigue adelante, para organizarlo. Base legal: actuaciones precontractuales a petición del interesado (RGPD, art. 6.1.b).', 'Uniquement pour répondre à la demande et, si le travail se fait, pour l’organiser. Base légale : mesures précontractuelles à votre demande (RGPD, art. 6, §1, b).'],
    'priv.h.where': ['Para onde vão', 'Where they go', 'Adónde van', 'Où elles vont'],
    'priv.where':   ['<li><strong>E-mail</strong>, através do serviço <a href="https://formsubmit.co" target="_blank" rel="noopener">FormSubmit</a>, que encaminha a submissão para a nossa caixa de correio.</li><li><strong>Base de dados Supabase</strong> da Dizarro, onde o pedido fica registado para não se perder. O acesso é restrito à equipa.</li>', '<li><strong>Email</strong>, via the <a href="https://formsubmit.co" target="_blank" rel="noopener">FormSubmit</a> service, which forwards the submission to our inbox.</li><li>Dizarro’s <strong>Supabase database</strong>, where the request is logged so it is not lost. Access is restricted to the team.</li>', '<li><strong>Correo</strong>, mediante el servicio <a href="https://formsubmit.co" target="_blank" rel="noopener">FormSubmit</a>, que reenvía el envío a nuestro buzón.</li><li><strong>Base de datos Supabase</strong> de Dizarro, donde queda registrada la solicitud para que no se pierda. El acceso está restringido al equipo.</li>', '<li><strong>E-mail</strong>, via le service <a href="https://formsubmit.co" target="_blank" rel="noopener">FormSubmit</a>, qui transmet l’envoi à notre boîte.</li><li><strong>Base de données Supabase</strong> de Dizarro, où la demande est enregistrée pour ne pas être perdue. Accès réservé à l’équipe.</li>'],
    'priv.noads':   ['Não há transferência para fins de publicidade nem venda de dados a terceiros.', 'There is no transfer for advertising purposes and no sale of data to third parties.', 'No hay transferencia con fines publicitarios ni venta de datos a terceros.', 'Aucun transfert à des fins publicitaires ni vente de données à des tiers.'],
    'priv.h.keep':  ['Quanto tempo guardamos', 'How long we keep them', 'Cuánto tiempo los guardamos', 'Durée de conservation'],
    'priv.keep': ['Pedidos sem seguimento: até 12 meses. Pedidos que dão origem a um trabalho: pelo período necessário à garantia e às obrigações legais (contabilísticas/fiscais).', 'Requests with no follow-up: up to 12 months. Requests that lead to a job: for as long as needed for the warranty and legal (accounting/tax) obligations.', 'Solicitudes sin seguimiento: hasta 12 meses. Solicitudes que dan lugar a un trabajo: durante el periodo necesario para la garantía y las obligaciones legales (contables/fiscales).', 'Demandes sans suite : jusqu’à 12 mois. Demandes donnant lieu à un travail : le temps nécessaire à la garantie et aux obligations légales (comptables/fiscales).'],
    'priv.h.cookies': ['Cookies e armazenamento local', 'Cookies and local storage', 'Cookies y almacenamiento local', 'Cookies et stockage local'],
    'priv.cookies1': ['O site <strong>não usa cookies de rastreio nem publicidade</strong>. Guarda apenas, no seu próprio navegador (localStorage), a sua preferência de tema claro/escuro e de idioma. Pode limpá-las nas definições do navegador a qualquer momento.', 'The site <strong>uses no tracking or advertising cookies</strong>. It only stores, in your own browser (localStorage), your light/dark theme and language preference. You can clear these in your browser settings at any time.', 'El sitio <strong>no usa cookies de rastreo ni publicidad</strong>. Solo guarda, en tu propio navegador (localStorage), tu preferencia de tema claro/oscuro e idioma. Puedes borrarlas en los ajustes del navegador cuando quieras.', 'Le site <strong>n’utilise aucun cookie de suivi ni de publicité</strong>. Il ne stocke, dans votre navigateur (localStorage), que votre préférence de thème clair/sombre et de langue. Vous pouvez les effacer dans les réglages du navigateur à tout moment.'],
    'priv.cookies2': ['As tipografias são carregadas do Google Fonts; ao servir os tipos de letra, o Google pode registar o pedido (endereço IP) — é o único recurso externo do site. <span class="mono" style="text-transform:none">Nota técnica:</span> os tipos podem ser alojados no próprio domínio para evitar este pedido — ver <code>DEPLOY.md</code>.', 'Fonts are loaded from Google Fonts; when serving the fonts, Google may log the request (IP address) — it is the site’s only external resource. <span class="mono" style="text-transform:none">Technical note:</span> the fonts can be self-hosted to avoid this request — see <code>DEPLOY.md</code>.', 'Las tipografías se cargan de Google Fonts; al servir las fuentes, Google puede registrar la petición (dirección IP) — es el único recurso externo del sitio. <span class="mono" style="text-transform:none">Nota técnica:</span> las fuentes pueden alojarse en el propio dominio para evitar esta petición — ver <code>DEPLOY.md</code>.', 'Les polices sont chargées depuis Google Fonts ; en les servant, Google peut enregistrer la requête (adresse IP) — c’est la seule ressource externe du site. <span class="mono" style="text-transform:none">Note technique :</span> les polices peuvent être hébergées sur le domaine pour éviter cette requête — voir <code>DEPLOY.md</code>.'],
    'priv.h.rights': ['Os seus direitos', 'Your rights', 'Tus derechos', 'Vos droits'],
    'priv.rights':  ['Pode pedir acesso, correção ou eliminação dos seus dados, por e-mail para <a href="mailto:dizarro.pt@gmail.com">dizarro.pt@gmail.com</a>. Tem também o direito de reclamar junto da CNPD.', 'You can request access, correction or deletion of your data by emailing <a href="mailto:dizarro.pt@gmail.com">dizarro.pt@gmail.com</a>. You also have the right to complain to the Portuguese DPA (CNPD).', 'Puedes solicitar acceso, corrección o eliminación de tus datos por correo a <a href="mailto:dizarro.pt@gmail.com">dizarro.pt@gmail.com</a>. También tienes derecho a reclamar ante la autoridad de control (CNPD).', 'Vous pouvez demander l’accès, la rectification ou l’effacement de vos données par e-mail à <a href="mailto:dizarro.pt@gmail.com">dizarro.pt@gmail.com</a>. Vous avez aussi le droit de saisir l’autorité de contrôle (CNPD).'],
    'priv.updated': ['Última atualização: 2026.', 'Last updated: 2026.', 'Última actualización: 2026.', 'Dernière mise à jour : 2026.'],
    'ct.card.aria': ['Contactos diretos', 'Direct contacts', 'Contactos directos', 'Contacts directs'],
    'svc.formLabel': ['Ficha do serviço', 'Service sheet', 'Ficha del servicio', 'Fiche du service'],

    /* ===== Eletricidade ===== */
    'elec.title': ['Tomadas, interruptores e luzes no Porto — Dizarro', 'Sockets, switches and lights in Porto — Dizarro', 'Enchufes, interruptores y luces en Oporto — Dizarro', 'Prises, interrupteurs et lumières à Porto — Dizarro'],
    'elec.desc': ['Troca de tomadas, interruptores, luminárias e disjuntores, e pequenas reparações elétricas em casa, no Porto. Sem quadros elétricos nem instalações novas.', 'Swapping sockets, switches, light fittings and breakers, plus small electrical repairs at home in Porto. No electrical panels or new installations.', 'Cambio de enchufes, interruptores, luminarias y magnetotérmicos, y pequeñas reparaciones eléctricas en casa, en Oporto. Sin cuadros eléctricos ni instalaciones nuevas.', 'Remplacement de prises, interrupteurs, luminaires et disjoncteurs, et petites réparations électriques à domicile, à Porto. Ni tableaux électriques ni installations neuves.'],
    'elec.h1':    ['<span class="o">Eletricidade</span><br>o essencial, bem feito', '<span class="o">Electrical</span><br>the essentials, done right', '<span class="o">Electricidad</span><br>lo esencial, bien hecho', '<span class="o">Électricité</span><br>l’essentiel, bien fait'],
    'elec.sub': ['Trocar uma tomada, um interruptor, uma luz ou um disjuntor. Trabalhos pequenos, feitos com cuidado e testados no fim. Não fazemos quadros elétricos nem instalações novas.', 'Swapping a socket, a switch, a light or a breaker. Small jobs, done carefully and tested at the end. We don’t build electrical panels or new installations.', 'Cambiar un enchufe, un interruptor, una luz o un magnetotérmico. Trabajos pequeños, hechos con cuidado y probados al final. No hacemos cuadros eléctricos ni instalaciones nuevas.', 'Changer une prise, un interrupteur, une lumière ou un disjoncteur. De petits travaux, faits avec soin et testés à la fin. Nous ne faisons ni tableaux électriques ni installations neuves.'],
    'elec.intro': ['Há trabalhos que não precisam de uma equipa nem de uma obra: uma tomada partida, um interruptor que falha, uma luz para trocar, um disjuntor que dispara. É isso que a Dizarro faz — depressa e a deixar a casa limpa. <strong>Quadros elétricos e instalações novas não fazemos.</strong>', 'Some jobs need neither a crew nor a building site: a broken socket, a switch that fails, a light to swap, a breaker that keeps tripping. That’s what Dizarro does — quickly, leaving the place clean. <strong>We don’t do electrical panels or new installations.</strong>', 'Hay trabajos que no necesitan un equipo ni una obra: un enchufe roto, un interruptor que falla, una luz que cambiar, un magnetotérmico que salta. De eso se ocupa Dizarro — rápido y dejando la casa limpia. <strong>Cuadros eléctricos e instalaciones nuevas no hacemos.</strong>', 'Certains travaux n’exigent ni équipe ni chantier : une prise cassée, un interrupteur qui lâche, une lumière à remplacer, un disjoncteur qui saute. C’est ce que fait Dizarro — vite, en laissant les lieux propres. <strong>Les tableaux électriques et les installations neuves, nous ne les faisons pas.</strong>'],
    'elec.list': ['<li>Troca de tomadas e interruptores</li><li>Troca de luminárias, apliques e candeeiros</li><li>Substituição de disjuntores</li><li>Interruptores com regulação (dimmer)</li><li>Pequenos arranjos em tomadas e pontos de luz</li><li><em>Não fazemos:</em> quadros elétricos nem instalações novas</li>', '<li>Swapping sockets and switches</li><li>Swapping light fittings, wall lights and lamps</li><li>Replacing breakers</li><li>Dimmer switches</li><li>Small fixes to sockets and light points</li><li><em>We don’t do:</em> electrical panels or new installations</li>', '<li>Cambio de enchufes e interruptores</li><li>Cambio de luminarias, apliques y lámparas</li><li>Sustitución de magnetotérmicos</li><li>Interruptores regulables (dimmer)</li><li>Pequeños arreglos en enchufes y puntos de luz</li><li><em>No hacemos:</em> cuadros eléctricos ni instalaciones nuevas</li>', '<li>Remplacement de prises et d’interrupteurs</li><li>Remplacement de luminaires, appliques et lampes</li><li>Remplacement de disjoncteurs</li><li>Interrupteurs variateurs</li><li>Petits dépannages sur prises et points lumineux</li><li><em>Nous ne faisons pas :</em> tableaux électriques ni installations neuves</li>'],
    'elec.how': ['Diga-nos o que tem; combinamos o preço antes de mexer. O trabalho é testado no fim e a casa fica arrumada.', 'Tell us what you have; we agree the price before touching anything. The work is tested at the end and the place left tidy.', 'Cuéntanos qué tienes; acordamos el precio antes de tocar nada. El trabajo se prueba al final y la casa queda recogida.', 'Dites-nous ce que vous avez ; nous convenons du prix avant de toucher à quoi que ce soit. Le travail est testé à la fin et les lieux rangés.'],
    'elec.ex': ['Montagem de um aplique de parede numa fachada de chapa: do aplique com a lâmpada e os fios à vista ao acabamento com a caixa fechada.', 'Fitting a wall light on a metal-clad wall: from the fitting with the bulb and wires showing to the finished, closed housing.', 'Montaje de un aplique de pared en una fachada de chapa: del aplique con la bombilla y los cables a la vista al acabado con la caja cerrada.', 'Pose d’une applique murale sur un bardage métallique : de l’applique avec ampoule et fils apparents à la finition boîtier fermé.'],
    'elec.cap1': ['<b>Luzes</b><span>Troca de luminárias, apliques e candeeiros, com teste no fim.</span>', '<b>Lights</b><span>Swapping light fittings, wall lights and lamps, tested at the end.</span>', '<b>Luces</b><span>Cambio de luminarias, apliques y lámparas, con prueba al final.</span>', '<b>Lumières</b><span>Remplacement de luminaires, appliques et lampes, testés à la fin.</span>'],
    'elec.cap2': ['<b>Tomadas &amp; interruptores</b><span>Substituição rápida, incluindo interruptores com regulação.</span>', '<b>Sockets &amp; switches</b><span>Quick replacement, including dimmer switches.</span>', '<b>Enchufes e interruptores</b><span>Sustitución rápida, incluidos interruptores regulables.</span>', '<b>Prises &amp; interrupteurs</b><span>Remplacement rapide, variateurs compris.</span>'],
    'elec.cap3': ['<b>Disjuntores</b><span>Troca de proteções que disparam ou aquecem.</span>', '<b>Breakers</b><span>Replacing protection devices that trip or overheat.</span>', '<b>Magnetotérmicos</b><span>Cambio de protecciones que saltan o calientan.</span>', '<b>Disjoncteurs</b><span>Remplacement des protections qui sautent ou chauffent.</span>'],
    'elec.cap4': ['<b>Pequenos arranjos</b><span>Tomadas e pontos de luz que deixaram de funcionar.</span>', '<b>Small fixes</b><span>Sockets and light points that stopped working.</span>', '<b>Pequeños arreglos</b><span>Enchufes y puntos de luz que dejaron de funcionar.</span>', '<b>Petits dépannages</b><span>Prises et points lumineux qui ne fonctionnent plus.</span>'],
    'elec.baLead': ['Aplique de parede numa fachada de chapa: do aplique com a lâmpada e os fios à vista ao acabamento com a caixa fechada.', 'Wall light on a metal-clad wall: from the fitting with the bulb and wires showing to the finished, closed housing.', 'Aplique de pared en una fachada de chapa: del aplique con la bombilla y los cables a la vista al acabado con la caja cerrada.', 'Applique murale sur bardage métallique : de l’applique avec ampoule et fils apparents à la finition boîtier fermé.'],
    'elec.baBeforeAlt': ['Antes: aplique montado com o casquilho e os fios à vista', 'Before: wall light mounted with lampholder and wires showing', 'Antes: aplique montado con portalámparas y cables a la vista', 'Avant : applique montée avec douille et fils apparents'],
    'elec.baAfterAlt':  ['Depois: aplique com a caixa fechada e alinhada', 'After: wall light with the housing closed and aligned', 'Después: aplique con la caja cerrada y alineada', 'Après : applique boîtier fermé et aligné'],
    'elec.g1': ['Focos LED embutidos no teto', 'Recessed LED downlights in the ceiling', 'Focos LED empotrados en el techo', 'Spots LED encastrés au plafond'],
    'elec.g2': ['Ventoinha de teto com luz', 'Ceiling fan with light', 'Ventilador de techo con luz', 'Ventilateur de plafond avec lumière'],
    'elec.g3': ['Ventoinha de teto · outra divisão', 'Ceiling fan · another room', 'Ventilador de techo · otra estancia', 'Ventilateur de plafond · autre pièce'],
    'elec.bandAlt': ['Mãos a ligar uma tomada, com um alicate', 'Hands wiring a wall socket with pliers', 'Manos conectando un enchufe con un alicate', 'Des mains câblant une prise à la pince'],
    'elec.ctaH': ['Uma luz que não acende? Trocamos.', 'A light that won’t turn on? We’ll swap it.', '¿Una luz que no enciende? La cambiamos.', 'Une lumière qui ne s’allume plus ? On la remplace.'],

    /* ===== Telecom & Redes ===== */
    'tel.title': ['Redes, Wi-Fi, TV e criação de sites no Porto | Dizarro', 'Networks, Wi-Fi, TV and websites in Porto | Dizarro', 'Redes, Wi-Fi, TV y creación de webs en Oporto | Dizarro', 'Réseaux, Wi-Fi, TV et création de sites à Porto | Dizarro'],
    'tel.desc': ['Passagem de cabos de internet e TV, otimização do Wi-Fi, montagem e ligação de televisões e criação de sites simples, na região do Porto.', 'Running internet and TV cables, Wi-Fi optimisation, TV mounting and set-up, and simple website creation, across the Porto region.', 'Tendido de cables de internet y TV, optimización del Wi-Fi, montaje y conexión de televisores y creación de webs sencillas, en la región de Oporto.', 'Tirage de câbles internet et TV, optimisation du Wi-Fi, pose et branchement de téléviseurs et création de sites simples, dans la région de Porto.'],
    'tel.h1':    ['<span class="b">Redes</span>, Wi-Fi<br>e sites', '<span class="b">Networks</span>, Wi-Fi<br>and websites', '<span class="b">Redes</span>, Wi-Fi<br>y sitios web', '<span class="b">Réseaux</span>, Wi-Fi<br>et sites web'],
    'tel.sub': ['Passamos cabos, melhoramos a internet em casa, montamos e ligamos televisões — e também criamos sites simples para pequenos negócios.', 'We run cables, improve the internet at home, mount and connect TVs — and we also build simple websites for small businesses.', 'Pasamos cables, mejoramos internet en casa, montamos y conectamos televisores — y también creamos webs sencillas para pequeños negocios.', 'Nous tirons des câbles, améliorons internet à la maison, installons et branchons des téléviseurs — et nous créons aussi des sites simples pour petites entreprises.'],
    'tel.intro': ['Muitos problemas de internet resolvem-se com um cabo no sítio certo ou com o Wi-Fi bem posicionado. A Dizarro trata disso, monta e liga a televisão, e cria sites simples e rápidos, como o que está a ver.', 'Many internet problems are fixed with a cable in the right place or Wi-Fi placed properly. Dizarro handles that, mounts and connects your TV, and builds simple, fast websites, like the one you’re looking at.', 'Muchos problemas de internet se resuelven con un cable en el sitio adecuado o con el Wi-Fi bien colocado. Dizarro se ocupa de eso, monta y conecta el televisor, y crea webs sencillas y rápidas, como la que estás viendo.', 'Beaucoup de problèmes d’internet se règlent avec un câble au bon endroit ou un Wi-Fi bien placé. Dizarro s’en occupe, installe et branche le téléviseur, et crée des sites simples et rapides, comme celui que vous consultez.'],
    'tel.list': ['<li>Passagem de cabo de internet e de TV</li><li>Otimização do Wi-Fi: reposicionar o router, repetidores e pontos de acesso</li><li>Montagem e ligação de televisões (suporte, cabos e configuração)</li><li>Pontos de rede e de TV</li><li>Arrumação de cabos e do router</li><li>Criação de sites simples para pequenos negócios (como este)</li>', '<li>Running internet and TV cable</li><li>Wi-Fi optimisation: repositioning the router, repeaters and access points</li><li>Mounting and connecting TVs (bracket, cables and set-up)</li><li>Network and TV points</li><li>Tidying cables and the router</li><li>Simple websites for small businesses (like this one)</li>', '<li>Tendido de cable de internet y TV</li><li>Optimización del Wi-Fi: recolocar el router, repetidores y puntos de acceso</li><li>Montaje y conexión de televisores (soporte, cables y configuración)</li><li>Puntos de red y de TV</li><li>Orden de cables y del router</li><li>Creación de webs sencillas para pequeños negocios (como esta)</li>', '<li>Tirage de câble internet et TV</li><li>Optimisation du Wi-Fi : repositionner la box, répéteurs et points d’accès</li><li>Pose et branchement de téléviseurs (support, câbles et réglages)</li><li>Prises réseau et TV</li><li>Rangement des câbles et de la box</li><li>Création de sites simples pour petites entreprises (comme celui-ci)</li>'],
    'tel.how': ['Vemos onde falha o sinal, passamos o cabo ou mudamos o Wi-Fi de sítio, e deixamos tudo a funcionar. Para o site, tratamos dos textos, das fotos e da publicação.', 'We find where the signal drops, run the cable or move the Wi-Fi, and leave everything working. For the website, we handle the text, photos and publishing.', 'Vemos dónde falla la señal, pasamos el cable o cambiamos el Wi-Fi de sitio, y lo dejamos todo funcionando. Para la web, nos ocupamos de textos, fotos y publicación.', 'On repère où le signal chute, on tire le câble ou on déplace le Wi-Fi, et on laisse tout en état de marche. Pour le site, on s’occupe des textes, des photos et de la mise en ligne.'],
    'tel.ex': ['Televisão de 100 polegadas: da parede vazia, com a caixa ainda no chão, à televisão montada e a arrancar a configuração.', '100-inch TV: from an empty wall with the box still on the floor to the TV mounted and starting its setup.', 'Televisor de 100 pulgadas: de la pared vacía, con la caja aún en el suelo, al televisor montado y arrancando la configuración.', 'Téléviseur de 100 pouces : du mur vide, carton encore au sol, au téléviseur monté et démarrant sa configuration.'],
    'tel.webH':  ['Criação de sites', 'Website creation', 'Creación de sitios web', 'Création de sites'],
    'tel.webP': ['Fazemos sites simples como este: rápidos, adaptados ao telemóvel e fáceis de encontrar no Google. Uma página ou poucas páginas para pequenos negócios. Tratamos dos textos, das fotos, do domínio e da publicação.', 'We build simple sites like this one: fast, mobile-friendly and easy to find on Google. One page or a few pages for small businesses. We handle the text, photos, domain and publishing.', 'Hacemos webs sencillas como esta: rápidas, adaptadas al móvil y fáciles de encontrar en Google. Una página o pocas páginas para pequeños negocios. Nos ocupamos de textos, fotos, dominio y publicación.', 'Nous créons des sites simples comme celui-ci : rapides, adaptés au mobile et faciles à trouver sur Google. Une page ou quelques pages pour petites entreprises. Nous gérons les textes, les photos, le domaine et la mise en ligne.'],
    'tel.cap1': ['<b>Cabo</b><span>Internet e TV em qualquer divisão, sem fios à vista.</span>', '<b>Cable</b><span>Internet and TV in any room, no wires on show.</span>', '<b>Cable</b><span>Internet y TV en cualquier estancia, sin cables a la vista.</span>', '<b>Câble</b><span>Internet et TV dans toute pièce, sans fils apparents.</span>'],
    'tel.cap2': ['<b>Wi-Fi</b><span>Router bem posicionado, repetidores e pontos de acesso.</span>', '<b>Wi-Fi</b><span>A well-placed router, repeaters and access points.</span>', '<b>Wi-Fi</b><span>Router bien colocado, repetidores y puntos de acceso.</span>', '<b>Wi-Fi</b><span>Box bien placée, répéteurs et points d’accès.</span>'],
    'tel.cap3': ['<b>Televisões</b><span>Suporte na parede, ligação e configuração.</span>', '<b>TVs</b><span>Wall bracket, connection and set-up.</span>', '<b>Televisores</b><span>Soporte en la pared, conexión y configuración.</span>', '<b>Téléviseurs</b><span>Support mural, branchement et réglages.</span>'],
    'tel.cap4': ['<b>Sites</b><span>Sites simples e rápidos para o seu negócio, como este.</span>', '<b>Websites</b><span>Simple, fast websites for your business, like this one.</span>', '<b>Webs</b><span>Sitios web simples y rápidos para tu negocio, como este.</span>', '<b>Sites</b><span>Des sites simples et rapides pour votre activité, comme celui-ci.</span>'],
    'tel.baLead': ['Televisão: de pousada em cima do móvel a fixa na parede. E cabos: de uma secretária com cabos soltos a um posto de trabalho arrumado.', 'TV: from standing on the unit to fixed on the wall. And cables: from a desk with loose cables to a tidy workstation.', 'Televisor: de apoyado sobre el mueble a fijado en la pared. Y cables: de un escritorio con cables sueltos a un puesto de trabajo ordenado.', 'Téléviseur : de posé sur le meuble à fixé au mur. Et câbles : d’un bureau aux câbles en vrac à un poste de travail rangé.'],
    'tel.baBeforeAlt': ['Antes: cabos, routers e fontes de alimentação amontoados debaixo da secretária', 'Before: cables, routers and power supplies piled up under the desk', 'Antes: cables, routers y fuentes amontonados bajo el escritorio', 'Avant : câbles, routeurs et alimentations entassés sous le bureau'],
    'tel.baAfterAlt':  ['Depois: ponto de acesso Wi-Fi montado e cablagem organizada em calha', 'After: Wi-Fi access point mounted and cabling tidied into trunking', 'Después: punto de acceso Wi-Fi montado y cableado ordenado en canaleta', 'Après : point d’accès Wi-Fi monté et câblage rangé en goulotte'],
    'tel.g1': ['Bastidor de parede · organização', 'Wall rack · tidy-up', 'Rack de pared · organización', 'Baie murale · rangement'],
    'tel.g2': ['Cablagem a etiquetar e arrumar', 'Cabling to label and tidy', 'Cableado por etiquetar y ordenar', 'Câblage à étiqueter et ranger'],
    'tel.g3': ['Ponto de TV com dados dedicados', 'TV point with a dedicated data outlet', 'Punto de TV con datos dedicados', 'Point TV avec prise data dédiée'],
    'tel.g4': ['Criação de sites — como este', 'Website creation — like this one', 'Creación de webs — como esta', 'Création de sites — comme celui-ci'],
    'tel.g4Alt': ['Portátil com código de um site num escritório', 'Laptop showing website code in an office', 'Portátil mostrando código de una web en una oficina', 'Ordinateur portable affichant le code d’un site dans un bureau'],
    'tel.bandAlt': ['Ponto de acesso D-Link montado com cablagem organizada e UPS', 'Mounted D-Link access point with tidy cabling and a UPS', 'Punto de acceso D-Link montado con cableado ordenado y SAI', 'Point d’accès D-Link monté avec câblage rangé et onduleur'],
    'tel.ctaH': ['Internet lenta ou uma televisão para montar? Falamos.', 'Slow internet or a TV to mount? Let’s talk.', '¿Internet lento o un televisor para montar? Hablamos.', 'Internet lent ou un téléviseur à installer ? Parlons-en.'],
    /* ===== Carpintaria ===== */
    'carp.title': ['Montagem de móveis e exaustores no Porto | Dizarro', 'Furniture assembly and extractors in Porto | Dizarro', 'Montaje de muebles y extractores en Oporto | Dizarro', 'Montage de meubles et hottes à Porto | Dizarro'],
    'carp.desc': ['Montagem de móveis e prateleiras, reparação de madeira, troca de dobradiças e montagem de exaustores, na região do Porto. Trabalhos pequenos, bem acabados.', 'Furniture and shelf assembly, wood repairs, hinge replacement and extractor fitting, across the Porto region. Small jobs, nicely finished.', 'Montaje de muebles y estanterías, reparación de madera, cambio de bisagras y montaje de extractores, en la región de Oporto. Trabajos pequeños, bien acabados.', 'Montage de meubles et d’étagères, réparation du bois, remplacement de charnières et pose de hottes, dans la région de Porto. De petits travaux, bien finis.'],
    'carp.h1':    ['<span class="o">Carpintaria</span><br>e montagem', '<span class="o">Carpentry</span><br>and assembly', '<span class="o">Carpintería</span><br>y montaje', '<span class="o">Menuiserie</span><br>et montage'],
    'carp.sub': ['Montamos móveis e prateleiras, reparamos madeira, trocamos dobradiças e montamos exaustores. Trabalhos pequenos, bem acabados.', 'We assemble furniture and shelves, repair wood, replace hinges and fit extractors. Small jobs, nicely finished.', 'Montamos muebles y estanterías, reparamos madera, cambiamos bisagras y montamos extractores. Trabajos pequeños, bien acabados.', 'Nous montons meubles et étagères, réparons le bois, remplaçons les charnières et posons des hottes. De petits travaux, bien finis.'],
    'carp.intro': ['Um móvel que veio numa caixa, uma prateleira para pôr direita, uma porta que arrasta, uma dobradiça partida. A Dizarro resolve estes pequenos trabalhos de madeira e monta o seu exaustor — sem complicações.', 'A piece of furniture that came in a box, a shelf to hang straight, a door that drags, a broken hinge. Dizarro handles these small woodwork jobs and fits your extractor — no fuss.', 'Un mueble que vino en una caja, una estantería para poner recta, una puerta que roza, una bisagra rota. Dizarro resuelve estos pequeños trabajos de madera y monta tu extractor — sin complicaciones.', 'Un meuble livré dans un carton, une étagère à poser droite, une porte qui frotte, une charnière cassée. Dizarro règle ces petits travaux de bois et pose votre hotte — sans complications.'],
    'carp.list': ['<li>Montagem de móveis (loja ou outros)</li><li>Montagem de prateleiras e estantes</li><li>Reparação de madeira, portas e gavetas</li><li>Troca de dobradiças e ferragens</li><li>Pequenos recortes e ajustes</li><li>Transporte de móveis, quando combinado</li><li>Exaustores: montagem e verificação de avarias</li>', '<li>Furniture assembly (flat-pack or other)</li><li>Shelf and bookcase assembly</li><li>Repair of wood, doors and drawers</li><li>Hinge and hardware replacement</li><li>Small cut-outs and adjustments</li><li>Furniture transport, when agreed</li><li>Extractors: fitting and fault checks</li>', '<li>Montaje de muebles (de tienda u otros)</li><li>Montaje de estanterías y librerías</li><li>Reparación de madera, puertas y cajones</li><li>Cambio de bisagras y herrajes</li><li>Pequeños recortes y ajustes</li><li>Transporte de muebles, si se acuerda</li><li>Extractores: montaje y revisión de averías</li>', '<li>Montage de meubles (kit ou autres)</li><li>Montage d’étagères et de bibliothèques</li><li>Réparation du bois, des portes et des tiroirs</li><li>Remplacement de charnières et de quincaillerie</li><li>Petites découpes et ajustements</li><li>Transport de meubles, si convenu</li><li>Hottes : pose et vérification des pannes</li>'],
    'carp.how': ['Medimos o espaço, dizemos o que dá para fazer e o preço. No fim está montado, a funcionar e limpo.', 'We measure the space, tell you what can be done and the price. At the end it’s assembled, working and clean.', 'Medimos el espacio, decimos qué se puede hacer y el precio. Al final está montado, funcionando y limpio.', 'On mesure l’espace, on dit ce qui est faisable et le prix. À la fin, c’est monté, fonctionnel et propre.'],
    'carp.ex': ['Carro infantil: das peças espalhadas no chão ao carro montado. E prateleiras fixadas na parede de uma sala, de cada lado da lareira.', 'Children’s ride-on car: from parts spread on the floor to the assembled car. And shelves fixed to the wall of a living room, on each side of the fireplace.', 'Coche infantil: de las piezas esparcidas por el suelo al coche montado. Y estantes fijados a la pared de un salón, a cada lado de la chimenea.', 'Voiture pour enfant : des pièces éparpillées au sol à la voiture montée. Et étagères fixées au mur d’un salon, de chaque côté de la cheminée.'],
    'carp.cap1': ['<b>Montagem</b><span>Móveis de loja, montados e nivelados.</span>', '<b>Assembly</b><span>Flat-pack furniture, assembled and levelled.</span>', '<b>Montaje</b><span>Muebles de tienda, montados y nivelados.</span>', '<b>Montage</b><span>Meubles en kit, montés et de niveau.</span>'],
    'carp.cap2': ['<b>Prateleiras</b><span>Montagem e ajuste de prateleiras e estantes.</span>', '<b>Shelves</b><span>Assembling and adjusting shelves and bookcases.</span>', '<b>Estanterías</b><span>Montaje y ajuste de estanterías y librerías.</span>', '<b>Étagères</b><span>Montage et réglage d’étagères et de bibliothèques.</span>'],
    'carp.cap3': ['<b>Reparações</b><span>Madeira, portas, gavetas e dobradiças.</span>', '<b>Repairs</b><span>Wood, doors, drawers and hinges.</span>', '<b>Reparaciones</b><span>Madera, puertas, cajones y bisagras.</span>', '<b>Réparations</b><span>Bois, portes, tiroirs et charnières.</span>'],
    'carp.cap4': ['<b>Exaustores</b><span>Montagem e verificação de avarias.</span>', '<b>Extractors</b><span>Fitting and fault checks.</span>', '<b>Extractores</b><span>Montaje y revisión de averías.</span>', '<b>Hottes</b><span>Pose et vérification des pannes.</span>'],
    'carp.g1': ['Exaustor novo montado num armário de cozinha', 'New extractor fitted in a kitchen cabinet', 'Extractor nuevo montado en un armario de cocina', 'Nouvelle hotte posée dans un meuble de cuisine'],
    'carp.g2': ['Baloiço de rede fixado numa varanda', 'Hammock chair fixed on a balcony', 'Hamaca colgante fijada en un balcón', 'Fauteuil hamac fixé sur un balcon'],
    'carp.g3': ['Móvel em pinho para uma máquina de laser', 'Pine cabinet for a laser machine', 'Mueble de pino para una máquina láser', 'Meuble en pin pour une machine laser'],
    'carp.g4': ['Móvel de apoio para clínica de laser', 'Support cabinet for a laser clinic', 'Mueble de apoyo para clínica láser', 'Meuble d’appoint pour clinique laser'],
    'carp.bandAlt': ['Exaustor montado dentro de um armário de cozinha', 'Extractor fitted inside a kitchen cabinet', 'Extractor montado dentro de un armario de cocina', 'Hotte posée dans un meuble de cuisine'],
    'carp.ctaH': ['Móvel para montar ou exaustor a puxar mal? Falamos.', 'Furniture to assemble or an extractor pulling badly? Let’s talk.', '¿Mueble para montar o extractor que tira mal? Hablamos.', 'Un meuble à monter ou une hotte qui aspire mal ? Parlons-en.'],

    /* ===== Pinturas ===== */
    'pint.title': ['Pintura de móveis e janelas no Porto | Dizarro', 'Furniture and window painting in Porto | Dizarro', 'Pintura de muebles y ventanas en Oporto | Dizarro', 'Peinture de meubles et fenêtres à Porto | Dizarro'],
    'pint.desc': ['Pintura de móveis, janelas e caixilharia — de castanho para branco — e pequenos retoques, na região do Porto. Preparação e acabamento limpo.', 'Painting furniture, windows and frames — from brown to white — and small touch-ups, across the Porto region. Prep and a clean finish.', 'Pintura de muebles, ventanas y carpintería — de marrón a blanco — y pequeños retoques, en la región de Oporto. Preparación y acabado limpio.', 'Peinture de meubles, fenêtres et menuiseries — du marron au blanc — et petites retouches, dans la région de Porto. Préparation et finition nette.'],
    'pint.h1': ['<span class="o">Pinturas</span><br>pequenas, bem feitas', '<span class="o">Painting</span><br>small jobs, done well', '<span class="o">Pintura</span><br>pequeños trabajos, bien hechos', '<span class="o">Peinture</span><br>petits travaux, bien faits'],
    'pint.sub': ['Pintar um móvel, uma janela, uma porta. Trabalhos pequenos, com a preparação e o acabamento que fazem a diferença — como as janelas que passaram de castanho a branco.', 'Painting a piece of furniture, a window, a door. Small jobs, with the prep and finish that make the difference — like the windows that went from brown to white.', 'Pintar un mueble, una ventana, una puerta. Trabajos pequeños, con la preparación y el acabado que marcan la diferencia — como las ventanas que pasaron de marrón a blanco.', 'Peindre un meuble, une fenêtre, une porte. De petits travaux, avec la préparation et la finition qui font la différence — comme les fenêtres passées du marron au blanc.'],
    'pint.intro': ['Uma pintura má vê-se logo: salpicos, riscos, tinta a descascar. Mesmo num trabalho pequeno, a Dizarro lixa, limpa e protege o que fica à volta antes de pintar.', 'A bad paint job shows straight away: specks, streaks, peeling paint. Even on a small job, Dizarro sands, cleans and protects the surroundings before painting.', 'Una mala pintura se ve enseguida: salpicaduras, marcas, pintura que se pela. Incluso en un trabajo pequeño, Dizarro lija, limpia y protege lo que queda alrededor antes de pintar.', 'Une mauvaise peinture se voit tout de suite : projections, traces, peinture qui s’écaille. Même pour un petit travail, Dizarro ponce, nettoie et protège ce qui est autour avant de peindre.'],
    'pint.list': ['<li>Pintar móveis</li><li>Pintar janelas e caixilharia (de castanho para branco)</li><li>Pintar portas e rodapés</li><li>Pequenos retoques</li><li>Preparação: lixar, limpar e primário</li><li>Proteção do que fica à volta, com fita e plástico</li>', '<li>Painting furniture</li><li>Painting windows and frames (from brown to white)</li><li>Painting doors and skirting</li><li>Small touch-ups</li><li>Prep: sanding, cleaning and primer</li><li>Protecting the surroundings with tape and sheeting</li>', '<li>Pintar muebles</li><li>Pintar ventanas y carpintería (de marrón a blanco)</li><li>Pintar puertas y rodapiés</li><li>Pequeños retoques</li><li>Preparación: lijar, limpiar e imprimar</li><li>Protección de lo que queda alrededor, con cinta y plástico</li>', '<li>Peindre des meubles</li><li>Peindre fenêtres et menuiseries (du marron au blanc)</li><li>Peindre portes et plinthes</li><li>Petites retouches</li><li>Préparation : ponçage, nettoyage et primaire</li><li>Protection de l’entourage, avec adhésif et bâche</li>'],
    'pint.how': ['Vemos o que há para pintar, dizemos o que é preciso e o preço, e protegemos tudo à volta antes de abrir a lata. No fim, retiramos as fitas e limpamos.', 'We look at what needs painting, tell you what’s needed and the price, and protect everything around before opening the tin. At the end we pull the tape and clean up.', 'Vemos qué hay que pintar, decimos qué hace falta y el precio, y protegemos todo alrededor antes de abrir el bote. Al final quitamos las cintas y limpiamos.', 'On regarde ce qu’il y a à peindre, on dit ce qu’il faut et le prix, et on protège tout autour avant d’ouvrir le pot. À la fin, on retire l’adhésif et on nettoie.'],
    'pint.ex': ['Caixilharia de madeira castanha pintada de branco, a condizer com o interior — sem trocar as janelas.', 'Brown wooden window frames painted white, to match the interior — without replacing the windows.', 'Carpintería de madera marrón pintada de blanco, a juego con el interior — sin cambiar las ventanas.', 'Menuiseries en bois marron peintes en blanc, assorties à l’intérieur — sans remplacer les fenêtres.'],
    'pint.cap1': ['<b>Móveis</b><span>Pintar um móvel, com preparação e acabamento limpo.</span>', '<b>Furniture</b><span>Painting a piece of furniture, with prep and a clean finish.</span>', '<b>Muebles</b><span>Pintar un mueble, con preparación y acabado limpio.</span>', '<b>Meubles</b><span>Peindre un meuble, avec préparation et finition nette.</span>'],
    'pint.cap2': ['<b>Janelas</b><span>Caixilharia de madeira lixada e pintada.</span>', '<b>Windows</b><span>Wooden window frames sanded and painted.</span>', '<b>Ventanas</b><span>Carpintería de madera lijada y pintada.</span>', '<b>Fenêtres</b><span>Menuiseries en bois poncées et peintes.</span>'],
    'pint.cap3': ['<b>Castanho &rarr; branco</b><span>A solução para janelas antigas sem as trocar.</span>', '<b>Brown &rarr; white</b><span>The fix for old windows without replacing them.</span>', '<b>Marrón &rarr; blanco</b><span>La solución para ventanas antiguas sin cambiarlas.</span>', '<b>Marron &rarr; blanc</b><span>La solution pour les vieilles fenêtres sans les changer.</span>'],
    'pint.cap4': ['<b>Preparação</b><span>Fissuras, betume e lixagem antes da tinta.</span>', '<b>Prep</b><span>Cracks, filler and sanding before the paint.</span>', '<b>Preparación</b><span>Fisuras, masilla y lijado antes de la pintura.</span>', '<b>Préparation</b><span>Fissures, enduit et ponçage avant la peinture.</span>'],
    'pint.baLead': ['Janela de madeira: com a caixilharia castanha, antes de pintar, e depois pintada de branco, a condizer com o interior.', 'Wooden window: with the brown frame, before painting, and afterwards painted white, to match the interior.', 'Ventana de madera: con la carpintería marrón, antes de pintar, y después pintada de blanco, a juego con el interior.', 'Fenêtre en bois : avec la menuiserie marron, avant peinture, puis peinte en blanc, assortie à l’intérieur.'],
    'pint.baBeforeAlt': ['Antes: caixilharia castanha, com vista para a marina', 'Before: brown window frame, with a marina view', 'Antes: carpintería marrón, con vistas al puerto deportivo', 'Avant : menuiserie marron, vue sur la marina'],
    'pint.baAfterAlt': ['Depois: caixilharia pintada de branco, com vista para a marina', 'After: window frame painted white, with a marina view', 'Después: carpintería pintada de blanco, con vistas al puerto deportivo', 'Après : menuiserie peinte en blanc, vue sur la marina'],
    'pint.g1': ['Caixilharia pintada de branco · vista de mar', 'Window frame painted white · sea view', 'Carpintería pintada de blanco · vista al mar', 'Menuiserie peinte en blanc · vue sur mer'],
    'pint.g2': ['Janela concluída, a condizer com o interior', 'Finished window, matching the interior', 'Ventana terminada, a juego con el interior', 'Fenêtre terminée, assortie à l’intérieur'],
    'pint.g3': ['Antes: a caixilharia castanha original', 'Before: the original brown window frame', 'Antes: la carpintería marrón original', 'Avant : la menuiserie marron d’origine'],
    'pint.bandAlt': ['Rolo a aplicar tinta branca numa parede interior', 'A roller applying white paint to an interior wall', 'Un rodillo aplicando pintura blanca en una pared interior', 'Un rouleau appliquant de la peinture blanche sur un mur intérieur'],
    'pint.ctaH': ['Um móvel ou uma janela para pintar? Falamos.', 'A piece of furniture or a window to paint? Let’s talk.', '¿Un mueble o una ventana para pintar? Hablamos.', 'Un meuble ou une fenêtre à peindre ? Parlons-en.'],
    'svc.baBeforeAria': ['Comparação antes e depois', 'Before and after comparison', 'Comparación antes y después', 'Comparaison avant/après'],
    'proj.baTitle':  ['Antes &amp; depois', 'Before &amp; after', 'Antes y después', 'Avant &amp; après'],
    'proj.viewAll':  ['Ver todos os trabalhos', 'See all projects', 'Ver todos los trabajos', 'Voir toutes les réalisations'],
    'pf.gridLabel':  ['Grelha de trabalhos', 'Projects grid', 'Cuadrícula de trabajos', 'Grille des réalisations'],
    'ph.cabos-antes': ['Antes: secretária e prateleiras com cabos soltos, impressora e papéis acumulados', 'Before: desk and shelves with loose cables, a printer and piled-up papers', 'Antes: escritorio y estantes con cables sueltos, impresora y papeles acumulados', 'Avant : bureau et étagères avec câbles en vrac, imprimante et papiers entassés'],
    'ph.cabos-depois': ['Depois: secretária arrumada, com computador, impressora e cabos organizados', 'After: a tidy desk with computer, printer and organised cables', 'Después: escritorio ordenado, con ordenador, impresora y cables organizados', 'Après : bureau rangé, avec ordinateur, imprimante et câbles organisés'],
    'ph.sala-antes': ['Antes: sala com lareira em pedra e a televisão em cima do móvel', 'Before: living room with a stone fireplace and the TV on the unit', 'Antes: salón con chimenea de piedra y el televisor sobre el mueble', 'Avant : salon avec cheminée en pierre et le téléviseur sur le meuble'],
    'ph.sala-depois': ['Depois: a mesma sala, com prateleiras fixadas na parede de cada lado da lareira', 'After: the same room, with shelves fixed to the wall on each side of the fireplace', 'Después: el mismo salón, con estantes fijados a la pared a cada lado de la chimenea', 'Après : le même salon, avec des étagères fixées au mur de chaque côté de la cheminée'],
    'ph.tv100-antes': ['Antes: parede vazia numa sala, com a caixa da televisão de 100 polegadas no chão', 'Before: an empty living-room wall, with the 100-inch TV box on the floor', 'Antes: pared vacía en un salón, con la caja del televisor de 100 pulgadas en el suelo', 'Avant : mur vide dans un salon, avec le carton du téléviseur de 100 pouces au sol'],
    'ph.tv100-depois': ['Depois: televisão de 100 polegadas montada na parede, no ecrã de configuração', 'After: the 100-inch TV mounted on the wall, on its setup screen', 'Después: televisor de 100 pulgadas montado en la pared, en la pantalla de configuración', 'Après : téléviseur de 100 pouces monté au mur, sur l’écran de configuration'],
    'ph.tv-antes': ['Antes: televisão pousada em cima do móvel', 'Before: TV standing on the TV unit', 'Antes: televisor apoyado sobre el mueble', 'Avant : téléviseur posé sur le meuble'],
    'ph.tv-depois': ['Depois: televisão fixa na parede, por cima do móvel', 'After: TV fixed to the wall above the unit', 'Después: televisor fijado a la pared, encima del mueble', 'Après : téléviseur fixé au mur au-dessus du meuble'],
    'ph.carro-antes': ['Antes: peças de um carro infantil espalhadas no chão, por montar', 'Before: the parts of a children’s ride-on car spread on the floor, not yet assembled', 'Antes: piezas de un coche infantil esparcidas por el suelo, sin montar', 'Avant : pièces d’une voiture pour enfant éparpillées au sol, non montées'],
    'ph.carro-depois': ['Depois: o carro infantil montado', 'After: the children’s ride-on car assembled', 'Después: el coche infantil montado', 'Après : la voiture pour enfant montée'],
    'ph.janela-antes': ['Antes: janela com a caixilharia castanha, com vista para a marina', 'Before: window with the brown frame, with a marina view', 'Antes: ventana con la carpintería marrón, con vistas al puerto deportivo', 'Avant : fenêtre à la menuiserie marron, vue sur la marina'],
    'ph.janela-depois': ['Depois: a mesma janela com a caixilharia pintada de branco', 'After: the same window with the frame painted white', 'Después: la misma ventana con la carpintería pintada de blanco', 'Après : la même fenêtre avec la menuiserie peinte en blanc'],
    'ph.luz-antes': ['Antes: aplique de parede com a lâmpada e os fios à vista, numa parede de chapa', 'Before: a wall light with the bulb and wires showing, on a metal-clad wall', 'Antes: aplique de pared con la bombilla y los cables a la vista, en una pared de chapa', 'Avant : applique murale avec ampoule et fils apparents, sur un bardage métallique'],
    'ph.luz-depois': ['Depois: aplique de parede acabado, com a caixa fechada', 'After: the finished wall light, with the housing closed', 'Después: aplique de pared terminado, con la caja cerrada', 'Après : applique murale terminée, boîtier fermé'],
    'ph.ventoinha': ['Ventoinha de teto com luz, já montada', 'Ceiling fan with light, fitted', 'Ventilador de techo con luz, ya montado', 'Ventilateur de plafond avec lumière, posé'],
    'ph.exaustor': ['Exaustor montado dentro de um armário de cozinha, com o tubo de saída', 'Extractor fitted inside a kitchen cabinet, with its outlet duct', 'Extractor montado dentro de un armario de cocina, con su tubo de salida', 'Hotte posée dans un meuble de cuisine, avec son conduit de sortie'],
    'ph.baloico': ['Baloiço de rede fixado numa varanda fechada', 'A hammock chair fixed in an enclosed balcony', 'Hamaca colgante fijada en un balcón cerrado', 'Fauteuil hamac fixé sur un balcon fermé'],
    'ph.movel': ['Móvel em pinho com a máquina de laser em cima, ao lado de um armário branco', 'A pine cabinet with the laser machine on top, next to a white cupboard', 'Mueble de pino con la máquina láser encima, junto a un armario blanco', 'Meuble en pin avec la machine laser dessus, à côté d’une armoire blanche'],
    'cap.ventoinha': ['Eletricidade · ventoinha de teto com luz', 'Electrical · ceiling fan with light', 'Electricidad · ventilador de techo con luz', 'Électricité · ventilateur de plafond avec lumière'],
    'cap.exaustor': ['Carpintaria · exaustor novo montado', 'Carpentry · new extractor fitted', 'Carpintería · extractor nuevo montado', 'Menuiserie · nouvelle hotte posée'],
    'cap.baloico': ['Carpintaria · baloiço de rede fixado', 'Carpentry · hammock chair fixed', 'Carpintería · hamaca colgante fijada', 'Menuiserie · fauteuil hamac fixé'],
    'cap.movel': ['Carpintaria · móvel em pinho para uma clínica', 'Carpentry · pine cabinet for a clinic', 'Carpintería · mueble de pino para una clínica', 'Menuiserie · meuble en pin pour une clinique'],
    'cap.sala': ['Carpintaria · prateleiras numa sala', 'Carpentry · shelves in a living room', 'Carpintería · estantes en un salón', 'Menuiserie · étagères dans un salon'],
    'cap.tv100': ['Telecom · televisão de 100 polegadas', 'Telecom · 100-inch TV', 'Telecom · televisor de 100 pulgadas', 'Télécom · téléviseur de 100 pouces'],
    'cap.cabos': ['Telecom · cabos e secretária arrumados', 'Telecom · tidy cables and desk', 'Telecom · cables y escritorio ordenados', 'Télécom · câbles et bureau rangés'],
    'cap.carro': ['Montagem · carro infantil', 'Assembly · children’s ride-on car', 'Montaje · coche infantil', 'Montage · voiture pour enfant'],
    'cap.tv': ['Telecom · televisão na parede', 'Telecom · TV on the wall', 'Telecom · televisor en la pared', 'Télécom · téléviseur au mur'],
    'home.s04.sala': ['Sala · prateleiras fixadas na parede', 'Living room · shelves fixed to the wall', 'Salón · estantes fijados a la pared', 'Salon · étagères fixées au mur'],
    'home.s05.space': ['Espaço', 'Premises', 'Local', 'Local'],
    'home.s05.spacev': ['ainda sem espaço aberto ao público', 'no premises open to the public yet', 'aún sin local abierto al público', 'pas encore de local ouvert au public'],
    'home.s05.map': ['Mapa do raio de atuação de cerca de 100 km à volta do Porto', 'Map of the roughly 100 km service radius around Porto', 'Mapa del radio de actuación de unos 100 km alrededor de Oporto', 'Carte du rayon d’intervention d’environ 100 km autour de Porto'],
    'foot.where': ['No local do cliente · Grande Porto', 'At the client’s place · Greater Porto', 'En el domicilio del cliente · Gran Oporto', 'Chez le client · Grand Porto'],
    'about.sp.founded': ['Fundação', 'Founded', 'Fundación', 'Fondation'],
    'about.sp.foundedv': ['13 out 2026', '13 Oct 2026', '13 oct 2026', '13 oct. 2026'],
    'about.sp.exp': ['Experiência', 'Experience', 'Experiencia', 'Expérience'],
    'about.sp.expv': ['7 anos', '7 years', '7 años', '7 ans'],
    'about.sp.service': ['Atendimento', 'Service', 'Servicio', 'Intervention'],
    'about.sp.servicev': ['No local do cliente', 'At the client’s place', 'En el domicilio del cliente', 'Chez le client'],
    'ba.slider': ['Cursor de comparação', 'Comparison slider', 'Cursor de comparación', 'Curseur de comparaison'],
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
