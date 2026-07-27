/* ============================================================
   BTS – i18n.js
   Motor de traduções (PT / EN / ES / FR) + seletor de idioma
   + injeção consistente do link "Área Reservada" em todas as
   páginas públicas.

   Como funciona:
   - Cada string tem uma chave (ex: "nav.home") e um array
     [pt, en, es, fr] com a tradução em cada idioma.
   - Elementos HTML marcam-se com data-i18n="chave" (substitui
     innerHTML), data-i18n-content="chave" (atributo content,
     usado na meta description), data-i18n-placeholder="chave",
     data-i18n-aria-label="chave" ou data-i18n-title="chave".
   - O idioma escolhido fica guardado em localStorage e aplica-se
     automaticamente em todas as páginas na próxima visita.
   ============================================================ */

(function () {
  'use strict';

  var LANGS = ['pt', 'en', 'es', 'fr'];
  var LANG_LABELS = { pt: 'Português', en: 'English', es: 'Español', fr: 'Français' };
  var LANG_FLAGS  = { pt: '🇵🇹', en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷' };
  var LANG_KEY = 'bts-lang';

  /* ---------- Dicionário ---------- */
  var D = {
    /* ===== Comum a todas as páginas ===== */
    'nav.home':     ['Home', 'Home', 'Inicio', 'Accueil'],
    'nav.services': ['Serviços', 'Services', 'Servicios', 'Services'],
    'nav.portfolio':['Portfólio', 'Portfolio', 'Portafolio', 'Portfolio'],
    'nav.about':    ['Sobre Nós', 'About Us', 'Sobre Nosotros', 'À Propos'],
    'nav.contact':  ['Contactos', 'Contact', 'Contacto', 'Contact'],
    'nav.quote':    ['Pedir Orçamento', 'Get a Quote', 'Pedir Presupuesto', 'Demander un Devis'],
    'nav.reservedArea': ['Área reservada (gestão interna)', 'Reserved area (internal management)', 'Área reservada (gestión interna)', 'Espace réservé (gestion interne)'],
    'nav.hamburger': ['Abrir menu', 'Open menu', 'Abrir menú', 'Ouvrir le menu'],
    'nav.themeToggle': ['Alternar tema', 'Toggle theme', 'Cambiar tema', 'Changer de thème'],
    'nav.lang': ['Idioma', 'Language', 'Idioma', 'Langue'],

    'common.electricity': ['Eletricidade', 'Electrical', 'Electricidad', 'Électricité'],
    'common.telecom':     ['Telecomunicações', 'Telecommunications', 'Telecomunicaciones', 'Télécommunications'],
    'common.carpentry':   ['Carpintaria', 'Carpentry', 'Carpintería', 'Menuiserie'],
    'common.quoteLink':   ['Pedir Orçamento', 'Get a Quote', 'Pedir Presupuesto', 'Demander un Devis'],
    'common.contactLink': ['Contactar', 'Contact Us', 'Contactar', 'Contacter'],
    'common.learnMore':   ['Saber mais →', 'Learn more →', 'Saber más →', 'En savoir plus →'],
    'common.whatsapp':    ['💬 WhatsApp', '💬 WhatsApp', '💬 WhatsApp', '💬 WhatsApp'],
    'common.whatsappAria':['Contactar por WhatsApp', 'Contact via WhatsApp', 'Contactar por WhatsApp', 'Contacter via WhatsApp'],
    'common.backTopAria': ['Voltar ao topo', 'Back to top', 'Volver arriba', 'Retour en haut'],
    'common.musicLabel':  ['Ambiente', 'Ambient', 'Ambiente', 'Ambiance'],
    'common.musicAria':   ['Reproduzir música ambiente', 'Play ambient music', 'Reproducir música ambiente', "Jouer la musique d'ambiance"],
    'common.loaderAria':  ['A carregar…', 'Loading…', 'Cargando…', 'Chargement…'],

    'footer.pagesTitle':    ['Páginas', 'Pages', 'Páginas', 'Pages'],
    'footer.servicesTitle': ['Serviços', 'Services', 'Servicios', 'Services'],
    'footer.contactsTitle': ['Contactos', 'Contact', 'Contacto', 'Contact'],
    'footer.descLong':  ['Soluções profissionais em Eletricidade, Carpintaria e Telecomunicações. Baseados em Padrão da Légua, Porto. Disponíveis num raio de 100 km.', 'Professional solutions in Electrical, Carpentry and Telecommunications. Based in Padrão da Légua, Porto. Available within a 100 km radius.', 'Soluciones profesionales en Electricidad, Carpintería y Telecomunicaciones. Con base en Padrão da Légua, Oporto. Disponibles en un radio de 100 km.', 'Solutions professionnelles en Électricité, Menuiserie et Télécommunications. Basés à Padrão da Légua, Porto. Disponibles dans un rayon de 100 km.'],
    'footer.descShort': ['Soluções profissionais em Eletricidade, Carpintaria e Telecomunicações. Porto e arredores, 100 km de raio.', 'Professional solutions in Electrical, Carpentry and Telecommunications. Porto and surroundings, 100 km radius.', 'Soluciones profesionales en Electricidad, Carpintería y Telecomunicaciones. Oporto y alrededores, radio de 100 km.', 'Solutions professionnelles en Électricité, Menuiserie et Télécommunications. Porto et environs, rayon de 100 km.'],
    'footer.rights': ['© 2025 BTS – Bizarro Total Solutions · Todos os direitos reservados', '© 2025 BTS – Bizarro Total Solutions · All rights reserved', '© 2025 BTS – Bizarro Total Solutions · Todos los derechos reservados', '© 2025 BTS – Bizarro Total Solutions · Tous droits réservés'],
    'footer.slogan': ['Soluções Inteligentes, Resultados Excelentes · Padrão da Légua, Porto', 'Smart Solutions, Excellent Results · Padrão da Légua, Porto', 'Soluciones Inteligentes, Resultados Excelentes · Padrão da Légua, Porto', 'Solutions Intelligentes, Résultats Excellents · Padrão da Légua, Porto'],

    'why.label': ['Porquê a BTS?', 'Why BTS?', '¿Por qué BTS?', 'Pourquoi BTS ?'],
    'why.title': ['O que nos <span class="accent">diferencia</span>', 'What sets us <span class="accent">apart</span>', 'Lo que nos <span class="accent">diferencia</span>', 'Ce qui nous <span class="accent">distingue</span>'],
    'why.sub':   ['Comprometidos com a excelência em cada projeto, grande ou pequeno.', 'Committed to excellence in every project, big or small.', 'Comprometidos con la excelencia en cada proyecto, grande o pequeño.', "Engagés dans l'excellence pour chaque projet, petit ou grand."],
    'why.1.title': ['Eficácia garantida', 'Guaranteed effectiveness', 'Eficacia garantizada', 'Efficacité garantie'],
    'why.1.desc':  ['Identificamos o problema e aplicamos a solução certa. Sem voltas desnecessárias.', 'We identify the problem and apply the right solution. No unnecessary detours.', 'Identificamos el problema y aplicamos la solución correcta. Sin rodeos innecesarios.', 'Nous identifions le problème et appliquons la bonne solution. Sans détours inutiles.'],
    'why.2.title': ['Comunicação total', 'Total communication', 'Comunicación total', 'Communication totale'],
    'why.2.desc':  ['Informamos em cada fase. Sabes sempre o que está a acontecer e quanto custa.', "We keep you informed at every stage. You always know what's happening and what it costs.", 'Te informamos en cada fase. Siempre sabes qué está pasando y cuánto cuesta.', 'Nous vous informons à chaque étape. Vous savez toujours ce qui se passe et combien ça coûte.'],
    'why.3.title': ['Pontualidade', 'Punctuality', 'Puntualidad', 'Ponctualité'],
    'why.3.desc':  ['Cumprimos o horário e o prazo acordado. O teu tempo é valioso para nós.', 'We keep to the agreed schedule and deadline. Your time matters to us.', 'Cumplimos el horario y el plazo acordado. Tu tiempo es valioso para nosotros.', 'Nous respectons l\'horaire et le délai convenus. Votre temps compte pour nous.'],
    'why.4.title': ['Qualidade premium', 'Premium quality', 'Calidad premium', 'Qualité premium'],
    'why.4.desc':  ['Utilizamos materiais de qualidade e técnicas profissionais em cada trabalho.', 'We use quality materials and professional techniques on every job.', 'Utilizamos materiales de calidad y técnicas profesionales en cada trabajo.', 'Nous utilisons des matériaux de qualité et des techniques professionnelles pour chaque travail.'],
    'why.5.title': ['Garantia incluída', 'Warranty included', 'Garantía incluida', 'Garantie incluse'],
    'why.5.desc':  ['Todos os trabalhos têm garantia. Se algo não ficar bem, voltamos sem custo.', "All work is covered by warranty. If something isn't right, we come back at no cost.", 'Todos los trabajos tienen garantía. Si algo no queda bien, volvemos sin costo.', "Tous les travaux sont garantis. Si quelque chose ne va pas, nous revenons sans frais."],
    'why.6.title': ['Atenção ao detalhe', 'Attention to detail', 'Atención al detalle', 'Souci du détail'],
    'why.6.desc':  ['Os pequenos detalhes fazem a diferença. Cuidamos de cada pormenor do trabalho.', 'The small details make the difference. We take care of every detail of the job.', 'Los pequeños detalles marcan la diferencia. Cuidamos cada detalle del trabajo.', 'Les petits détails font la différence. Nous soignons chaque détail du travail.'],

    /* ===== index.html ===== */
    'home.meta.title': ['BTS – Bizarro Total Solutions | Eletricidade, Carpintaria & Telecomunicações', 'BTS – Bizarro Total Solutions | Electrical, Carpentry & Telecommunications', 'BTS – Bizarro Total Solutions | Electricidad, Carpintería y Telecomunicaciones', 'BTS – Bizarro Total Solutions | Électricité, Menuiserie et Télécommunications'],
    'home.meta.desc': ['BTS – Bizarro Total Solutions. Soluções profissionais em Eletricidade, Carpintaria e Telecomunicações na região do Porto. Orçamento gratuito. Contacta-nos hoje!', 'BTS – Bizarro Total Solutions. Professional Electrical, Carpentry and Telecommunications solutions across the Porto region. Free quote. Contact us today!', 'BTS – Bizarro Total Solutions. Soluciones profesionales en Electricidad, Carpintería y Telecomunicaciones en la región de Oporto. Presupuesto gratuito. ¡Contáctanos hoy!', "BTS – Bizarro Total Solutions. Solutions professionnelles en Électricité, Menuiserie et Télécommunications dans la région de Porto. Devis gratuit. Contactez-nous dès aujourd'hui !"],

    'home.hero.eyebrow': ['⚡ Soluções Inteligentes, Resultados Excelentes', '⚡ Smart Solutions, Excellent Results', '⚡ Soluciones Inteligentes, Resultados Excelentes', '⚡ Solutions Intelligentes, Résultats Excellents'],
    'home.hero.title': ['Especialistas em<br><span class="accent">Eletricidade</span>,<br><span class="accent-blue">Carpintaria</span><br>&amp; Telecomunicações', 'Specialists in<br><span class="accent">Electrical</span>,<br><span class="accent-blue">Carpentry</span><br>&amp; Telecommunications', 'Especialistas en<br><span class="accent">Electricidad</span>,<br><span class="accent-blue">Carpintería</span><br>y Telecomunicaciones', 'Spécialistes en<br><span class="accent">Électricité</span>,<br><span class="accent-blue">Menuiserie</span><br>&amp; Télécommunications'],
    'home.hero.desc': ['Com 7 anos de experiência, a BTS oferece soluções técnicas de qualidade na região do Porto. Trabalho sério, preço justo e garantia total.', 'With 7 years of experience, BTS delivers quality technical solutions across the Porto region. Serious work, fair prices and full warranty.', 'Con 7 años de experiencia, BTS ofrece soluciones técnicas de calidad en la región de Oporto. Trabajo serio, precio justo y garantía total.', "Avec 7 ans d'expérience, BTS propose des solutions techniques de qualité dans la région de Porto. Travail sérieux, prix juste et garantie totale."],
    'home.hero.btnQuote': ['Pedir Orçamento Grátis', 'Get a Free Quote', 'Pedir Presupuesto Gratis', 'Devis Gratuit'],
    'home.hero.btnServices': ['Ver Serviços', 'View Services', 'Ver Servicios', 'Voir les Services'],
    'home.hero.trust1': ['Projetos concluídos', 'Completed projects', 'Proyectos completados', 'Projets réalisés'],
    'home.hero.trust2': ['Experiência', 'Experience', 'Experiencia', 'Expérience'],
    'home.hero.trust3': ['Clientes satisfeitos', 'Satisfied clients', 'Clientes satisfechos', 'Clients satisfaits'],
    'home.hero.cardLocation': ['Porto &amp; Arredores · 100 km raio', 'Porto &amp; Surroundings · 100 km radius', 'Oporto y alrededores · radio de 100 km', 'Porto et environs · rayon de 100 km'],
    'home.hero.cardElecDesc': ['Instalações, reparações, certificações', 'Installations, repairs, certifications', 'Instalaciones, reparaciones, certificaciones', 'Installations, réparations, certifications'],
    'home.hero.cardTelDesc': ['CCTV, redes, fibra, alarmes', 'CCTV, networks, fiber, alarms', 'CCTV, redes, fibra, alarmas', 'Vidéosurveillance, réseaux, fibre, alarmes'],
    'home.hero.cardCarpDesc': ['Móveis, decks, restauro, medida', 'Furniture, decks, restoration, custom', 'Muebles, decks, restauración, a medida', 'Meubles, terrasses, restauration, sur mesure'],
    'home.hero.cardBtnQuote': ['Orçamento', 'Quote', 'Presupuesto', 'Devis'],
    'home.hero.cardBadge': ['Disponível · Resposta em &lt; 24h', 'Available · Response in &lt; 24h', 'Disponible · Respuesta en &lt; 24h', 'Disponible · Réponse en &lt; 24h'],

    'home.services.label': ['O que fazemos', 'What we do', 'Lo que hacemos', 'Ce que nous faisons'],
    'home.services.title': ['Três áreas de <span class="accent">especialização</span>', 'Three areas of <span class="accent">expertise</span>', 'Tres áreas de <span class="accent">especialización</span>', 'Trois domaines de <span class="accent">spécialisation</span>'],
    'home.services.sub': ['Soluções técnicas completas para particulares e empresas, com qualidade comprovada e preços justos.', 'Complete technical solutions for individuals and businesses, with proven quality and fair prices.', 'Soluciones técnicas completas para particulares y empresas, con calidad comprobada y precios justos.', 'Solutions techniques complètes pour particuliers et entreprises, avec une qualité éprouvée et des prix justes.'],

    'home.elec.desc': ['Instalações elétricas residenciais, comerciais e industriais com toda a conformidade legal.', 'Residential, commercial and industrial electrical installations, fully compliant with regulations.', 'Instalaciones eléctricas residenciales, comerciales e industriales con total conformidad legal.', 'Installations électriques résidentielles, commerciales et industrielles, en totale conformité légale.'],
    'home.elec.l1': ['Instalações novas e remodelações', 'New installations and renovations', 'Instalaciones nuevas y remodelaciones', 'Nouvelles installations et rénovations'],
    'home.elec.l2': ['Quadros elétricos e diferenciais', 'Electrical panels and breakers', 'Cuadros eléctricos y diferenciales', 'Tableaux électriques et disjoncteurs'],
    'home.elec.l3': ['Reparações e diagnóstico de avarias', 'Repairs and fault diagnostics', 'Reparaciones y diagnóstico de averías', 'Réparations et diagnostic de pannes'],
    'home.elec.l4': ['Certificações ITED/ITUR', 'ITED/ITUR certifications', 'Certificaciones ITED/ITUR', 'Certifications ITED/ITUR'],
    'home.elec.l5': ['Iluminação LED eficiente', 'Efficient LED lighting', 'Iluminación LED eficiente', 'Éclairage LED efficace'],

    'home.tel.desc': ['Sistemas de segurança, redes profissionais e infraestruturas de comunicação modernas.', 'Security systems, professional networks and modern communication infrastructure.', 'Sistemas de seguridad, redes profesionales e infraestructuras de comunicación modernas.', 'Systèmes de sécurité, réseaux professionnels et infrastructures de communication modernes.'],
    'home.tel.l1': ['CCTV e sistemas de alarme', 'CCTV and alarm systems', 'CCTV y sistemas de alarma', 'Vidéosurveillance et systèmes d\'alarme'],
    'home.tel.l2': ['Redes estruturadas Cat6/Cat6A', 'Cat6/Cat6A structured networks', 'Redes estructuradas Cat6/Cat6A', 'Réseaux structurés Cat6/Cat6A'],
    'home.tel.l3': ['Instalação de fibra ótica', 'Fiber optic installation', 'Instalación de fibra óptica', 'Installation de fibre optique'],
    'home.tel.l4': ['Controlo de acessos', 'Access control', 'Control de accesos', "Contrôle d'accès"],
    'home.tel.l5': ['Domótica e automação', 'Home automation', 'Domótica y automatización', 'Domotique et automatisation'],

    'home.carp.desc': ['Mobiliário à medida, remodelações de interiores e trabalhos em madeira com acabamentos de qualidade.', 'Custom furniture, interior renovations and woodwork with quality finishes.', 'Mobiliario a medida, remodelaciones de interiores y trabajos en madera con acabados de calidad.', 'Mobilier sur mesure, rénovations intérieures et menuiserie avec finitions de qualité.'],
    'home.carp.l1': ['Móveis à medida', 'Custom furniture', 'Muebles a medida', 'Meubles sur mesure'],
    'home.carp.l2': ['Roupeiros e armários embutidos', 'Built-in wardrobes and cabinets', 'Armarios y roperos empotrados', 'Armoires et placards intégrés'],
    'home.carp.l3': ['Soalhos e revestimentos', 'Flooring and coverings', 'Suelos y revestimientos', 'Parquets et revêtements'],
    'home.carp.l4': ['Decks e estruturas exteriores', 'Decks and outdoor structures', 'Decks y estructuras exteriores', 'Terrasses et structures extérieures'],
    'home.carp.l5': ['Restauro de móveis', 'Furniture restoration', 'Restauración de muebles', 'Restauration de meubles'],

    'home.stats.1': ['Projetos concluídos', 'Completed projects', 'Proyectos completados', 'Projets réalisés'],
    'home.stats.2': ['Anos de experiência', 'Years of experience', 'Años de experiencia', "Années d'expérience"],
    'home.stats.3': ['Clientes satisfeitos', 'Satisfied clients', 'Clientes satisfechos', 'Clients satisfaits'],
    'home.stats.4': ['Raio de atuação', 'Service radius', 'Radio de acción', "Rayon d'action"],

    'home.testi.label': ['Testemunhos', 'Testimonials', 'Testimonios', 'Témoignages'],
    'home.testi.title': ['O que dizem os <span class="accent">nossos clientes</span>', 'What our <span class="accent">clients say</span>', 'Lo que dicen <span class="accent">nuestros clientes</span>', 'Ce que disent <span class="accent">nos clients</span>'],
    'home.testi.1.text': ['"O Diogo foi profissional e muito rápido na prestação do serviço. Respondeu-me e veio no mesmo dia para substituir as lâmpadas eletrónicas. Depois de instalar as lâmpadas inteligentes, também me ajudou a configurá-las com o Apple Home. Fiquei muito satisfeito e certamente voltarei a contactá-lo para substituir outras lâmpadas inteligentes — recomendo o Diogo a todos!"', '"Diogo was professional and very quick with the service. He replied and came the same day to replace the electronic bulbs. After installing the smart bulbs, he also helped me set them up with Apple Home. I was very satisfied and will definitely contact him again to replace other smart bulbs — I recommend Diogo to everyone!"', '"Diogo fue profesional y muy rápido en la prestación del servicio. Me respondió y vino el mismo día para sustituir las bombillas electrónicas. Después de instalar las bombillas inteligentes, también me ayudó a configurarlas con Apple Home. Quedé muy satisfecho y sin duda volveré a contactarlo para sustituir otras bombillas inteligentes: ¡recomiendo a Diogo a todos!"', '"Diogo a été professionnel et très rapide dans la prestation du service. Il m\'a répondu et est venu le jour même pour remplacer les ampoules électroniques. Après avoir installé les ampoules connectées, il m\'a aussi aidé à les configurer avec Apple Home. J\'ai été très satisfait et je le recontacterai certainement pour remplacer d\'autres ampoules connectées — je recommande Diogo à tous !"'],
    'home.testi.1.loc': ['Vila do Conde · Eletricidade', 'Vila do Conde · Electrical', 'Vila do Conde · Electricidad', 'Vila do Conde · Électricité'],
    'home.testi.2.text': ['"Excelente profissional, muito educado, transparente e rápido. Fez a troca de todos os cabos antigos de tv dentro da parede por cabos de rede para todos os cómodos da casa, recomendo altamente!"', '"Excellent professional, very polite, transparent and fast. He replaced all the old TV cables inside the wall with network cables for every room in the house — highly recommended!"', '"Excelente profesional, muy educado, transparente y rápido. Sustituyó todos los cables antiguos de TV dentro de la pared por cables de red para todas las habitaciones de la casa. ¡Lo recomiendo totalmente!"', '"Excellent professionnel, très poli, transparent et rapide. Il a remplacé tous les anciens câbles TV encastrés dans le mur par des câbles réseau pour toutes les pièces de la maison — je recommande vivement !"'],
    'home.testi.2.loc': ['Aveiro · Telecomunicações', 'Aveiro · Telecommunications', 'Aveiro · Telecomunicaciones', 'Aveiro · Télécommunications'],
    'home.testi.3.text': ['"Tive um problema com um armário de cozinha, o Diogo deslocou-se mostrou e informou as melhores hipóteses para criar segurança e o preço foi acordado. Trouxe todo o material demonstrando um know how e uma facilidade a perceber o problema. No fim ainda mencionou que caso necessário poderia sempre ligar caso algo não esteja bem. Profissionais deste gênero nos dias que correm são raros. Estou satisfeito!"', '"I had a problem with a kitchen cabinet. Diogo came over, showed me and explained the best options to make it secure, and we agreed on a price. He brought all the materials, showing great know-how and ease in understanding the problem. At the end he even mentioned I could always call if anything wasn\'t right. Professionals like this are rare these days. I\'m satisfied!"', '"Tuve un problema con un armario de cocina. Diogo se desplazó, me mostró e informó las mejores opciones para garantizar la seguridad y acordamos el precio. Trajo todo el material demostrando un gran conocimiento y facilidad para entender el problema. Al final incluso mencionó que, si era necesario, siempre podía llamarlo si algo no estaba bien. Profesionales de este tipo son escasos hoy en día. ¡Estoy satisfecho!"', '"J\'avais un problème avec un meuble de cuisine. Diogo s\'est déplacé, m\'a montré et expliqué les meilleures options pour garantir la sécurité, et nous avons convenu d\'un prix. Il a apporté tout le matériel, faisant preuve d\'un vrai savoir-faire et d\'une grande facilité à comprendre le problème. À la fin, il a même mentionné que je pouvais toujours l\'appeler si quelque chose n\'allait pas. Des professionnels de ce genre sont rares de nos jours. Je suis satisfait !"'],
    'home.testi.3.loc': ['Vila do Conde · Carpintaria', 'Vila do Conde · Carpentry', 'Vila do Conde · Carpintería', 'Vila do Conde · Menuiserie'],

    'home.mapa.label': ['Onde trabalhamos', 'Where we work', 'Dónde trabajamos', 'Où nous travaillons'],
    'home.mapa.title': ['Zona de <span class="accent">atuação</span>', 'Service <span class="accent">area</span>', 'Zona de <span class="accent">actuación</span>', 'Zone d\'<span class="accent">intervention</span>'],
    'home.mapa.sub': ['Baseados em Padrão da Légua, Porto, cobrimos um raio de aproximadamente 100 km.', 'Based in Padrão da Légua, Porto, we cover a radius of approximately 100 km.', 'Con base en Padrão da Légua, Oporto, cubrimos un radio de aproximadamente 100 km.', "Basés à Padrão da Légua, Porto, nous couvrons un rayon d'environ 100 km."],
    'home.mapa.availTitle': ['Disponíveis para si', 'Available for you', 'Disponibles para ti', 'Disponibles pour vous'],
    'home.mapa.availDesc': ['Prestamos serviços em toda a região Norte de Portugal, com resposta rápida em toda a Área Metropolitana do Porto.', 'We provide services throughout Northern Portugal, with fast response across the Porto Metropolitan Area.', 'Prestamos servicios en toda la región Norte de Portugal, con respuesta rápida en toda el Área Metropolitana de Oporto.', "Nous intervenons dans toute la région Nord du Portugal, avec une réponse rapide dans toute l'aire métropolitaine de Porto."],
    'home.mapa.hqLabel': ['Sede', 'Headquarters', 'Sede', 'Siège'],
    'home.mapa.radiusLabel': ['Raio de atuação', 'Service radius', 'Radio de actuación', "Rayon d'action"],
    'home.mapa.radiusValue': ['≈ 100 km (Porto, Braga, Aveiro e arredores)', '≈ 100 km (Porto, Braga, Aveiro and surroundings)', '≈ 100 km (Oporto, Braga, Aveiro y alrededores)', '≈ 100 km (Porto, Braga, Aveiro et environs)'],
    'home.mapa.urgentLabel': ['Urgências', 'Emergencies', 'Urgencias', 'Urgences'],
    'home.mapa.urgentValue': ['Disponíveis para emergências dentro da Área Metropolitana', 'Available for emergencies within the Metropolitan Area', 'Disponibles para emergencias dentro del Área Metropolitana', "Disponibles pour les urgences dans l'aire métropolitaine"],
    'home.mapa.cta': ['💬 Contactar agora', '💬 Contact now', '💬 Contactar ahora', '💬 Contacter maintenant'],

    'home.faq.label': ['FAQ', 'FAQ', 'FAQ', 'FAQ'],
    'home.faq.title': ['Perguntas <span class="accent">frequentes</span>', 'Frequently Asked <span class="accent">Questions</span>', 'Preguntas <span class="accent">frecuentes</span>', 'Questions <span class="accent">fréquentes</span>'],
    'home.faq.q1': ['Qual é a vossa zona de atuação?', 'What is your service area?', '¿Cuál es su zona de actuación?', "Quelle est votre zone d'intervention ?"],
    'home.faq.a1': ['Estamos baseados em Padrão da Légua, Porto, e trabalhamos num raio de aproximadamente 100 km. Isso inclui toda a Área Metropolitana do Porto, Braga, Aveiro e arredores. Contacta-nos para confirmar se chegamos à tua localização.', 'We are based in Padrão da Légua, Porto, and work within a radius of approximately 100 km. This covers the entire Porto Metropolitan Area, Braga, Aveiro and surroundings. Contact us to confirm we can reach your location.', 'Estamos ubicados en Padrão da Légua, Oporto, y trabajamos en un radio de aproximadamente 100 km. Esto incluye toda el Área Metropolitana de Oporto, Braga, Aveiro y alrededores. Contáctanos para confirmar si llegamos a tu ubicación.', "Nous sommes basés à Padrão da Légua, Porto, et intervenons dans un rayon d'environ 100 km. Cela couvre toute l'aire métropolitaine de Porto, Braga, Aveiro et ses environs. Contactez-nous pour confirmer que nous couvrons votre localisation."],
    'home.faq.q2': ['O orçamento tem algum custo?', 'Does the quote cost anything?', '¿El presupuesto tiene algún costo?', 'Le devis est-il payant ?'],
    'home.faq.a2': ['Não! O orçamento é completamente gratuito e sem compromisso. Podes pedir um orçamento online através do formulário ou pelo WhatsApp e responderemos sem qualquer custo.', "No! The quote is completely free and with no obligation. You can request a quote online through the form or via WhatsApp, and we'll respond at no cost.", '¡No! El presupuesto es completamente gratuito y sin compromiso. Puedes solicitar un presupuesto en línea a través del formulario o por WhatsApp, y te responderemos sin ningún costo.', 'Non ! Le devis est entièrement gratuit et sans engagement. Vous pouvez demander un devis en ligne via le formulaire ou par WhatsApp, et nous répondrons sans aucun frais.'],
    'home.faq.q3': ['Têm garantia nos trabalhos realizados?', 'Do you offer a warranty on completed work?', '¿Tienen garantía en los trabajos realizados?', 'Les travaux réalisés sont-ils garantis ?'],
    'home.faq.a3': ['Todos os trabalhos têm garantia. O prazo varia conforme o tipo de serviço, mas em geral oferecemos 12 meses de garantia em instalações e 6 meses em reparações.', 'All work is covered by warranty. The period varies depending on the type of service, but generally we offer 12 months warranty on installations and 6 months on repairs.', 'Todos los trabajos tienen garantía. El plazo varía según el tipo de servicio, pero en general ofrecemos 12 meses de garantía en instalaciones y 6 meses en reparaciones.', 'Tous les travaux sont garantis. La durée varie selon le type de service, mais en général nous offrons 12 mois de garantie sur les installations et 6 mois sur les réparations.'],
    'home.faq.q4': ['Qual é o tempo de resposta ao pedido de orçamento?', "What's the response time for a quote request?", '¿Cuál es el tiempo de respuesta a la solicitud de presupuesto?', 'Quel est le délai de réponse à une demande de devis ?'],
    'home.faq.a4': ['Respondemos a todos os pedidos em menos de 24 horas em dias úteis. Para urgências, podes contactar-nos diretamente por WhatsApp e responderemos ainda mais rápido.', "We respond to all requests within less than 24 hours on business days. For emergencies, you can contact us directly via WhatsApp and we'll respond even faster.", 'Respondemos a todas las solicitudes en menos de 24 horas en días hábiles. Para urgencias, puedes contactarnos directamente por WhatsApp y responderemos aún más rápido.', 'Nous répondons à toutes les demandes en moins de 24 heures les jours ouvrables. Pour les urgences, vous pouvez nous contacter directement par WhatsApp et nous répondrons encore plus vite.'],
    'home.faq.q5': ['Trabalham com particulares e empresas?', 'Do you work with individuals and businesses?', '¿Trabajan con particulares y empresas?', 'Travaillez-vous avec des particuliers et des entreprises ?'],
    'home.faq.a5': ['Sim! Trabalhamos tanto com clientes particulares como com empresas. Temos experiência em projetos residenciais, comerciais e industriais de diferentes dimensões.', 'Yes! We work with both individual clients and businesses. We have experience in residential, commercial and industrial projects of all sizes.', '¡Sí! Trabajamos tanto con clientes particulares como con empresas. Tenemos experiencia en proyectos residenciales, comerciales e industriales de diferentes tamaños.', 'Oui ! Nous travaillons aussi bien avec des particuliers qu\'avec des entreprises. Nous avons de l\'expérience dans des projets résidentiels, commerciaux et industriels de toutes tailles.'],
    'home.faq.q6': ['Quais os meios de pagamento aceites?', 'What payment methods do you accept?', '¿Qué medios de pago aceptan?', 'Quels moyens de paiement acceptez-vous ?'],
    'home.faq.a6': ['Aceitamos transferência bancária, multibanco/MB Way e numerário. Para obras de maior dimensão é comum dividir o pagamento em fases: sinal, durante a obra e conclusão.', "We accept bank transfer, Multibanco/MB Way and cash. For larger projects it's common to split payment into stages: deposit, during the work and completion.", 'Aceptamos transferencia bancaria, Multibanco/MB Way y efectivo. Para obras de mayor envergadura es común dividir el pago en fases: señal, durante la obra y finalización.', 'Nous acceptons le virement bancaire, Multibanco/MB Way et les espèces. Pour les projets plus importants, il est courant de répartir le paiement en plusieurs phases : acompte, en cours de chantier et à la fin.'],

    'home.cta.title': ['Pronto para começar o<br><span>teu projeto</span>?', 'Ready to start<br><span>your project</span>?', '¿Listo para comenzar<br><span>tu proyecto</span>?', 'Prêt à démarrer<br><span>votre projet</span> ?'],
    'home.cta.desc': ['Pede um orçamento gratuito hoje. Sem compromisso, sem letras pequenas — apenas soluções que funcionam.', 'Request a free quote today. No commitment, no fine print — just solutions that work.', 'Solicita un presupuesto gratuito hoy. Sin compromiso, sin letra pequeña, solo soluciones que funcionan.', 'Demandez un devis gratuit dès aujourd\'hui. Sans engagement, sans petites lignes — juste des solutions qui fonctionnent.'],

    /* ===== pages/servicos.html ===== */
    'services.meta.title': ['Serviços – BTS Bizarro Total Solutions', 'Services – BTS Bizarro Total Solutions', 'Servicios – BTS Bizarro Total Solutions', 'Services – BTS Bizarro Total Solutions'],
    'services.meta.desc': ['Eletricidade, Carpintaria e Telecomunicações profissionais em Porto. Instalações, reparações, CCTV, redes, mobiliário à medida. Orçamento gratuito.', 'Professional Electrical, Carpentry and Telecommunications services in Porto. Installations, repairs, CCTV, networks, custom furniture. Free quote.', 'Electricidad, Carpintería y Telecomunicaciones profesionales en Oporto. Instalaciones, reparaciones, CCTV, redes, mobiliario a medida. Presupuesto gratuito.', 'Électricité, Menuiserie et Télécommunications professionnelles à Porto. Installations, réparations, vidéosurveillance, réseaux, mobilier sur mesure. Devis gratuit.'],
    'services.page.title': ['Os nossos <span>Serviços</span>', 'Our <span>Services</span>', 'Nuestros <span>Servicios</span>', 'Nos <span>Services</span>'],
    'services.page.sub': ['Soluções técnicas completas para particulares e empresas. Qualidade comprovada, preços justos e total transparência.', 'Complete technical solutions for individuals and businesses. Proven quality, fair prices and full transparency.', 'Soluciones técnicas completas para particulares y empresas. Calidad comprobada, precios justos y total transparencia.', 'Solutions techniques complètes pour particuliers et entreprises. Qualité éprouvée, prix justes et transparence totale.'],
    'services.crumb': ['Serviços', 'Services', 'Servicios', 'Services'],
    'services.label2': ['O que fazemos', 'What we do', 'Lo que hacemos', 'Ce que nous faisons'],
    'services.title2': ['Especialistas em <span class="accent">três áreas</span>', 'Experts in <span class="accent">three fields</span>', 'Especialistas en <span class="accent">tres áreas</span>', 'Experts dans <span class="accent">trois domaines</span>'],
    'services.sub2': ["Cada serviço é tratado com o mesmo nível de exigência e profissionalismo, seja um trabalho pequeno ou um projeto de grande dimensão.", "Every service is handled with the same level of rigor and professionalism, whether it's a small job or a large-scale project.", 'Cada servicio se trata con el mismo nivel de exigencia y profesionalismo, ya sea un trabajo pequeño o un proyecto de gran envergadura.', "Chaque service est traité avec le même niveau d'exigence et de professionnalisme, qu'il s'agisse d'un petit travail ou d'un projet de grande envergure."],

    'services.elec.f1': ['Instalações elétricas novas e remodelações', 'New electrical installations and renovations', 'Instalaciones eléctricas nuevas y remodelaciones', 'Nouvelles installations électriques et rénovations'],
    'services.elec.f2': ['Quadros elétricos e diferenciais', 'Electrical panels and breakers', 'Cuadros eléctricos y diferenciales', 'Tableaux électriques et disjoncteurs'],
    'services.elec.f3': ['Reparações e diagnóstico de avarias', 'Repairs and fault diagnostics', 'Reparaciones y diagnóstico de averías', 'Réparations et diagnostic de pannes'],
    'services.elec.f4': ['Certificações ITED/ITUR e conformidade RSIUEE', 'ITED/ITUR certifications and RSIUEE compliance', 'Certificaciones ITED/ITUR y conformidad RSIUEE', 'Certifications ITED/ITUR et conformité RSIUEE'],
    'services.elec.f5': ['Iluminação LED e eficiência energética', 'LED lighting and energy efficiency', 'Iluminación LED y eficiencia energética', 'Éclairage LED et efficacité énergétique'],
    'services.elec.f6': ['Tomadas, interruptores e iluminação exterior', 'Outlets, switches and outdoor lighting', 'Enchufes, interruptores e iluminación exterior', 'Prises, interrupteurs et éclairage extérieur'],

    'services.tel.f1': ['Sistemas CCTV e videovigilância', 'CCTV and video surveillance systems', 'Sistemas CCTV y videovigilancia', 'Systèmes de vidéosurveillance CCTV'],
    'services.tel.f2': ['Redes estruturadas Cat6 / Cat6A', 'Cat6 / Cat6A structured networks', 'Redes estructuradas Cat6 / Cat6A', 'Réseaux structurés Cat6 / Cat6A'],
    'services.tel.f3': ['Instalação e fusão de fibra ótica', 'Fiber optic installation and splicing', 'Instalación y fusión de fibra óptica', 'Installation et soudure de fibre optique'],
    'services.tel.f4': ['Alarmes e sistemas de segurança', 'Alarms and security systems', 'Alarmas y sistemas de seguridad', 'Alarmes et systèmes de sécurité'],
    'services.tel.f5': ['Controlo de acessos e interfones', 'Access control and intercoms', 'Control de accesos e interfonos', 'Contrôle d\'accès et interphones'],
    'services.tel.f6': ['Domótica e automação residencial', 'Home automation', 'Domótica y automatización residencial', 'Domotique et automatisation résidentielle'],

    'services.carp.f1': ['Móveis à medida (cozinhas, quartos, salas)', 'Custom furniture (kitchens, bedrooms, living rooms)', 'Muebles a medida (cocinas, dormitorios, salas)', 'Meubles sur mesure (cuisines, chambres, salons)'],
    'services.carp.f2': ['Roupeiros e armários embutidos', 'Built-in wardrobes and cabinets', 'Armarios y roperos empotrados', 'Armoires et placards intégrés'],
    'services.carp.f3': ['Soalhos, rodapés e revestimentos', 'Flooring, skirting boards and coverings', 'Suelos, rodapiés y revestimientos', 'Parquets, plinthes et revêtements'],
    'services.carp.f4': ['Portas e janelas em madeira', 'Wooden doors and windows', 'Puertas y ventanas de madera', 'Portes et fenêtres en bois'],
    'services.carp.f5': ['Terraços, decks e estruturas exteriores', 'Terraces, decks and outdoor structures', 'Terrazas, decks y estructuras exteriores', 'Terrasses, decks et structures extérieures'],
    'services.carp.f6': ['Restauro e reparação de móveis', 'Furniture restoration and repair', 'Restauración y reparación de muebles', 'Restauration et réparation de meubles'],

    'services.cta.title': ['Pronto para <span>avançar</span>?', 'Ready to <span>move forward</span>?', '¿Listo para <span>avanzar</span>?', 'Prêt à <span>passer à l\'action</span> ?'],
    'services.cta.desc': ['Pede um orçamento gratuito e sem compromisso. Respondemos em menos de 24 horas.', 'Request a free, no-obligation quote. We respond in less than 24 hours.', 'Solicita un presupuesto gratuito y sin compromiso. Respondemos en menos de 24 horas.', 'Demandez un devis gratuit et sans engagement. Nous répondons en moins de 24 heures.'],

    /* ===== pages/portfolio.html ===== */
    'portfolio.meta.title': ['Portfólio – BTS', 'Portfolio – BTS', 'Portafolio – BTS', 'Portfolio – BTS'],
    'portfolio.meta.desc': ['Veja projetos realizados pela BTS em eletricidade, carpintaria e telecomunicações na região do Porto.', 'See projects completed by BTS in electrical, carpentry and telecommunications across the Porto region.', 'Mira los proyectos realizados por BTS en electricidad, carpintería y telecomunicaciones en la región de Oporto.', 'Découvrez les projets réalisés par BTS en électricité, menuiserie et télécommunications dans la région de Porto.'],
    'portfolio.page.title': ['O nosso <span>Portfólio</span>', 'Our <span>Portfolio</span>', 'Nuestro <span>Portafolio</span>', 'Notre <span>Portfolio</span>'],
    'portfolio.page.sub': ['Conheça alguns dos projetos concluídos pela nossa equipa nas áreas de eletricidade, carpintaria e infraestruturas técnicas.', 'Discover some of the projects completed by our team in electrical, carpentry and technical infrastructure.', 'Conoce algunos de los proyectos completados por nuestro equipo en las áreas de electricidad, carpintería e infraestructuras técnicas.', 'Découvrez quelques-uns des projets réalisés par notre équipe en électricité, menuiserie et infrastructures techniques.'],
    'portfolio.crumb': ['Portfólio', 'Portfolio', 'Portafolio', 'Portfolio'],
    'portfolio.filter.all': ['Todos', 'All', 'Todos', 'Tous'],
    'portfolio.item1.title': ['Instalação Elétrica Residencial Completa', 'Complete Residential Electrical Installation', 'Instalación Eléctrica Residencial Completa', 'Installation Électrique Résidentielle Complète'],
    'portfolio.item1.name': ['Moradia Premium', 'Premium Villa', 'Vivienda Premium', 'Villa Premium'],
    'portfolio.item1.loc': ['Moradia T4 — Matosinhos', '4-Bedroom House — Matosinhos', 'Vivienda T4 — Matosinhos', 'Maison T4 — Matosinhos'],
    'portfolio.item2.title': ['Circuito CCTV & Redes Estruturadas', 'CCTV Circuit & Structured Networks', 'Circuito CCTV y Redes Estructuradas', 'Circuit CCTV et Réseaux Structurés'],
    'portfolio.item2.name': ['Escritório Corporativo', 'Corporate Office', 'Oficina Corporativa', 'Bureau d\'Entreprise'],
    'portfolio.item2.loc': ['CCTV & TI — Porto', 'CCTV & IT — Porto', 'CCTV y TI — Oporto', 'CCTV et IT — Porto'],
    'portfolio.item3.title': ['Mobiliário de Cozinha à Medida', 'Custom Kitchen Furniture', 'Mobiliario de Cocina a Medida', 'Mobilier de Cuisine sur Mesure'],
    'portfolio.item3.name': ['Cozinha Moderna Lacada', 'Modern Lacquered Kitchen', 'Cocina Moderna Lacada', 'Cuisine Moderne Laquée'],
    'portfolio.item3.loc': ['Carpintaria — Maia', 'Carpentry — Maia', 'Carpintería — Maia', 'Menuiserie — Maia'],

    /* ===== pages/sobre.html ===== */
    'about.meta.title': ['Sobre Nós – BTS', 'About Us – BTS', 'Sobre Nosotros – BTS', 'À Propos – BTS'],
    'about.meta.desc': ['Conheça a BTS – Bizarro Total Solutions: 7 anos de experiência em eletricidade, carpintaria e telecomunicações no Porto.', 'Get to know BTS – Bizarro Total Solutions: 7 years of experience in electrical, carpentry and telecommunications in Porto.', 'Conoce BTS – Bizarro Total Solutions: 7 años de experiencia en electricidad, carpintería y telecomunicaciones en Oporto.', 'Découvrez BTS – Bizarro Total Solutions : 7 ans d\'expérience en électricité, menuiserie et télécommunications à Porto.'],
    'about.page.title': ['A nossa <span>História</span>', 'Our <span>Story</span>', 'Nuestra <span>Historia</span>', 'Notre <span>Histoire</span>'],
    'about.page.sub': ['Conheça o compromisso de rigor técnico e profissionalismo que nos move diariamente na BTS.', 'Discover the commitment to technical rigor and professionalism that drives us every day at BTS.', 'Conoce el compromiso de rigor técnico y profesionalismo que nos mueve diariamente en BTS.', 'Découvrez l\'engagement de rigueur technique et de professionnalisme qui nous anime chaque jour chez BTS.'],
    'about.crumb': ['Sobre Nós', 'About Us', 'Sobre Nosotros', 'À Propos'],
    'about.badge': ['7 Anos de Excelência', '7 Years of Excellence', '7 Años de Excelencia', '7 Ans d\'Excellence'],
    'about.label': ['Quem Somos', 'Who We Are', 'Quiénes Somos', 'Qui Sommes-Nous'],
    'about.title': ['Soluções Inteligentes, <span class="accent">Resultados Excelentes</span>', 'Smart Solutions, <span class="accent">Excellent Results</span>', 'Soluciones Inteligentes, <span class="accent">Resultados Excelentes</span>', 'Solutions Intelligentes, <span class="accent">Résultats Excellents</span>'],
    'about.p1': ['A Bizarro Total Solutions nasceu com o propósito claro de colmatar a falha de compromisso e falta de qualidade no setor das reparações e instalações técnicas.', 'Bizarro Total Solutions was founded with a clear purpose: to close the gap in commitment and quality in the technical repair and installation sector.', 'Bizarro Total Solutions nació con el propósito claro de subsanar la falta de compromiso y calidad en el sector de las reparaciones e instalaciones técnicas.', 'Bizarro Total Solutions est née avec un objectif clair : combler le manque d\'engagement et de qualité dans le secteur des réparations et installations techniques.'],
    'about.p2': ['Ao longo de 7 anos, construímos uma reputação sólida na zona metropolitana do Porto, unificando competências avançadas em sistemas elétricos, carpintaria fina e infraestruturas tecnológicas modernas.', 'Over 7 years, we\'ve built a solid reputation across the Porto metropolitan area, combining advanced skills in electrical systems, fine carpentry and modern technology infrastructure.', 'A lo largo de 7 años, hemos construido una sólida reputación en el área metropolitana de Oporto, combinando competencias avanzadas en sistemas eléctricos, carpintería fina e infraestructuras tecnológicas modernas.', 'En 7 ans, nous avons bâti une solide réputation dans la région métropolitaine de Porto, en combinant des compétences avancées en systèmes électriques, menuiserie fine et infrastructures technologiques modernes.'],
    'about.value1': ['Transparência nos orçamentos', 'Transparent quotes', 'Transparencia en los presupuestos', 'Transparence des devis'],
    'about.value2': ['Pontualidade britânica', 'British-style punctuality', 'Puntualidad británica', 'Ponctualité britannique'],
    'about.value3': ['Garantia total de obra', 'Full workmanship warranty', 'Garantía total de obra', 'Garantie totale des travaux'],
    'about.value4': ['Materiais de topo certificados', 'Certified top-grade materials', 'Materiales de primera certificados', 'Matériaux certifiés haut de gamme'],
    'about.team.label': ['A Nossa Equipa', 'Our Team', 'Nuestro Equipo', 'Notre Équipe'],
    'about.team.title': ['Liderança e <span class="accent">Competência</span>', 'Leadership and <span class="accent">Expertise</span>', 'Liderazgo y <span class="accent">Competencia</span>', 'Leadership et <span class="accent">Compétence</span>'],
    'about.team.role': ['Fundador & Diretor Técnico', 'Founder & Technical Director', 'Fundador y Director Técnico', 'Fondateur et Directeur Technique'],
    'about.team.desc': ['Especialista em telecomunicações complexas, gestão de projetos integrados e controlo de qualidade final.', 'Specialist in complex telecommunications, integrated project management and final quality control.', 'Especialista en telecomunicaciones complejas, gestión de proyectos integrados y control de calidad final.', 'Spécialiste des télécommunications complexes, de la gestion de projets intégrés et du contrôle qualité final.'],

    /* ===== pages/contactos.html ===== */
    'contact.meta.title': ['Contactos – BTS', 'Contact – BTS', 'Contacto – BTS', 'Contact – BTS'],
    'contact.meta.desc': ['Contacte a BTS – Bizarro Total Solutions para eletricidade, carpintaria ou telecomunicações no Porto. Telefone, WhatsApp, e-mail e formulário de contacto.', 'Contact BTS – Bizarro Total Solutions for electrical, carpentry or telecommunications work in Porto. Phone, WhatsApp, email and contact form.', 'Contacta con BTS – Bizarro Total Solutions para electricidad, carpintería o telecomunicaciones en Oporto. Teléfono, WhatsApp, correo y formulario de contacto.', 'Contactez BTS – Bizarro Total Solutions pour l\'électricité, la menuiserie ou les télécommunications à Porto. Téléphone, WhatsApp, e-mail et formulaire de contact.'],
    'contact.page.title': ['Fale <span>Connosco</span>', 'Get in <span>Touch</span>', 'Habla <span>con Nosotros</span>', 'Contactez-<span>Nous</span>'],
    'contact.page.sub': ['Dúvidas ou urgências técnicas? Entre em contacto direto ou envie-nos uma mensagem pelo formulário.', 'Questions or technical emergencies? Reach out directly or send us a message through the form.', '¿Dudas o urgencias técnicas? Contáctanos directamente o envíanos un mensaje a través del formulario.', 'Des questions ou une urgence technique ? Contactez-nous directement ou envoyez-nous un message via le formulaire.'],
    'contact.crumb': ['Contactos', 'Contact', 'Contacto', 'Contact'],
    'contact.phoneLabel': ['Telefone', 'Phone', 'Teléfono', 'Téléphone'],
    'contact.emailLabel': ['E-mail', 'Email', 'Correo electrónico', 'E-mail'],
    'contact.locLabel': ['Localização', 'Location', 'Ubicación', 'Localisation'],
    'contact.form.title': ['Enviar Mensagem', 'Send Message', 'Enviar Mensaje', 'Envoyer un Message'],
    'contact.form.subtitle': ['Prometemos ser breves no retorno.', 'We promise a quick reply.', 'Prometemos ser breves en la respuesta.', 'Nous promettons une réponse rapide.'],
    'contact.form.success': ['✅ Mensagem enviada com sucesso! Entraremos em contacto brevemente.', '✅ Message sent successfully! We\'ll be in touch shortly.', '✅ ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', '✅ Message envoyé avec succès ! Nous vous contacterons bientôt.'],
    'contact.form.name': ['Nome', 'Name', 'Nombre', 'Nom'],
    'contact.form.email': ['E-mail', 'Email', 'Correo electrónico', 'E-mail'],
    'contact.form.subject': ['Assunto', 'Subject', 'Asunto', 'Sujet'],
    'contact.form.message': ['Mensagem', 'Message', 'Mensaje', 'Message'],
    'contact.form.errName': ['Por favor insira o seu nome.', 'Please enter your name.', 'Por favor, introduce tu nombre.', 'Veuillez saisir votre nom.'],
    'contact.form.errEmail': ['Por favor insira um e-mail válido.', 'Please enter a valid email.', 'Por favor, introduce un correo válido.', 'Veuillez saisir un e-mail valide.'],
    'contact.form.errSubject': ['Por favor insira o assunto.', 'Please enter the subject.', 'Por favor, introduce el asunto.', 'Veuillez saisir le sujet.'],
    'contact.form.errMessage': ['Por favor escreva a sua mensagem.', 'Please write your message.', 'Por favor, escribe tu mensaje.', 'Veuillez écrire votre message.'],
    'contact.form.submit': ['Enviar Mensagem', 'Send Message', 'Enviar Mensaje', 'Envoyer le Message'],
    'contact.form.note': ['🔒 Os seus dados nunca serão partilhados.', '🔒 Your data will never be shared.', '🔒 Tus datos nunca serán compartidos.', '🔒 Vos données ne seront jamais partagées.'],

    /* ===== pages/orcamento.html ===== */
    'quote.meta.title': ['Pedir Orçamento – BTS', 'Get a Quote – BTS', 'Pedir Presupuesto – BTS', 'Demander un Devis – BTS'],
    'quote.meta.desc': ['Peça um orçamento gratuito e sem compromisso à BTS para eletricidade, carpintaria ou telecomunicações no Porto. Resposta em menos de 24 horas.', 'Request a free, no-obligation quote from BTS for electrical, carpentry or telecommunications work in Porto. Response in less than 24 hours.', 'Solicita un presupuesto gratuito y sin compromiso a BTS para electricidad, carpintería o telecomunicaciones en Oporto. Respuesta en menos de 24 horas.', 'Demandez un devis gratuit et sans engagement à BTS pour l\'électricité, la menuiserie ou les télécommunications à Porto. Réponse en moins de 24 heures.'],
    'quote.page.title': ['Orçamento <span>Gratuito</span>', 'Free <span>Quote</span>', 'Presupuesto <span>Gratuito</span>', 'Devis <span>Gratuit</span>'],
    'quote.page.sub': ['Preencha os dados do projeto abaixo. Garantimos uma resposta formal detalhada em menos de 24 horas.', 'Fill in your project details below. We guarantee a detailed formal response within 24 hours.', 'Completa los datos del proyecto a continuación. Garantizamos una respuesta formal detallada en menos de 24 horas.', 'Renseignez les détails du projet ci-dessous. Nous garantissons une réponse formelle détaillée sous 24 heures.'],
    'quote.crumb': ['Orçamento', 'Quote', 'Presupuesto', 'Devis'],
    'quote.form.title': ['Detalhes do Projeto', 'Project Details', 'Detalles del Proyecto', 'Détails du Projet'],
    'quote.form.subtitle': ['Insira o máximo de pormenores possíveis para um cálculo rigoroso.', 'Provide as much detail as possible for an accurate estimate.', 'Ingresa el máximo de detalles posibles para un cálculo preciso.', 'Indiquez un maximum de détails pour un calcul précis.'],
    'quote.form.success': ['✅ Pedido enviado com sucesso! Responderemos em menos de 24 horas.', '✅ Request sent successfully! We\'ll respond within 24 hours.', '✅ ¡Solicitud enviada con éxito! Responderemos en menos de 24 horas.', '✅ Demande envoyée avec succès ! Nous répondrons sous 24 heures.'],
    'quote.form.name': ['Nome Completo', 'Full Name', 'Nombre Completo', 'Nom Complet'],
    'quote.form.phone': ['Contacto Telefónico', 'Phone Number', 'Contacto Telefónico', 'Numéro de Téléphone'],
    'quote.form.area': ['Área de Serviço', 'Service Area', 'Área de Servicio', 'Domaine de Service'],
    'quote.form.areaPlaceholder': ['Selecione uma especialidade...', 'Select a specialty...', 'Selecciona una especialidad...', 'Sélectionnez une spécialité...'],
    'quote.form.areaMulti': ['Múltiplas Áreas', 'Multiple Areas', 'Múltiples Áreas', 'Domaines Multiples'],
    'quote.form.local': ['Localidade da Obra', 'Project Location', 'Localidad de la Obra', 'Lieu du Projet'],
    'quote.form.localPlaceholder': ['Ex: Matosinhos, Porto', 'E.g.: Matosinhos, Porto', 'Ej.: Matosinhos, Porto', 'Ex. : Matosinhos, Porto'],
    'quote.form.desc': ['Descrição Detalhada do Trabalho', 'Detailed Description of the Work', 'Descripción Detallada del Trabajo', 'Description Détaillée du Travail'],
    'quote.form.descPlaceholder': ['Descreva o que necessita (ex: número de tomadas, tipo de móvel à medida, instalação de X câmeras...)', 'Describe what you need (e.g., number of outlets, type of custom furniture, installation of X cameras...)', 'Describe lo que necesitas (ej: número de enchufes, tipo de mueble a medida, instalación de X cámaras...)', 'Décrivez vos besoins (ex : nombre de prises, type de meuble sur mesure, installation de X caméras...)'],
    'quote.form.errName': ['Por favor insira o seu nome.', 'Please enter your name.', 'Por favor, introduce tu nombre.', 'Veuillez saisir votre nom.'],
    'quote.form.errPhone': ['Por favor insira um contacto válido.', 'Please enter a valid contact number.', 'Por favor, introduce un contacto válido.', 'Veuillez saisir un numéro valide.'],
    'quote.form.errArea': ['Por favor selecione uma área.', 'Please select an area.', 'Por favor, selecciona un área.', 'Veuillez sélectionner un domaine.'],
    'quote.form.errLocal': ['Por favor insira a localidade.', 'Please enter the location.', 'Por favor, introduce la localidad.', 'Veuillez saisir le lieu.'],
    'quote.form.errDesc': ['Por favor descreva o trabalho pretendido.', 'Please describe the work you need.', 'Por favor, describe el trabajo deseado.', 'Veuillez décrire le travail souhaité.'],
    'quote.form.submit': ['Submeter Pedido', 'Submit Request', 'Enviar Solicitud', 'Envoyer la Demande'],
    'quote.form.note': ['🔒 Os seus dados nunca serão partilhados.', '🔒 Your data will never be shared.', '🔒 Tus datos nunca serán compartidos.', '🔒 Vos données ne seront jamais partagées.'],
    'quote.sidebar.title1': ['⚡ Resposta Expresso', '⚡ Express Response', '⚡ Respuesta Exprés', '⚡ Réponse Express'],
    'quote.sidebar.item1': ['Análise em menos de 24 horas úteis.', 'Review within less than 24 business hours.', 'Análisis en menos de 24 horas hábiles.', 'Analyse en moins de 24 heures ouvrables.'],
    'quote.sidebar.item2': ['Totalmente gratuito e sem qualquer compromisso.', 'Completely free and with no obligation.', 'Totalmente gratuito y sin ningún compromiso.', 'Totalement gratuit et sans aucun engagement.'],
    'quote.sidebar.title2': ['📍 Raio de Atuação', '📍 Service Radius', '📍 Radio de Actuación', '📍 Rayon d\'Action'],
    'quote.sidebar.desc2': ['Sediados no Porto, deslocamo-nos num raio de até 100km para obras e vistorias técnicas.', 'Based in Porto, we travel within a 100km radius for jobs and technical surveys.', 'Con sede en Oporto, nos desplazamos en un radio de hasta 100 km para obras e inspecciones técnicas.', 'Basés à Porto, nous nous déplaçons dans un rayon de 100 km pour les travaux et visites techniques.']
  };

  /* ---------- Helpers ---------- */
  function getLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    return 'pt';
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = 'pt';
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    apply(lang);
  }

  function translate(key, lang) {
    var entry = D[key];
    if (!entry) return null;
    var idx = LANGS.indexOf(lang);
    return entry[idx] != null ? entry[idx] : entry[0];
  }

  function apply(lang) {
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = translate(el.getAttribute('data-i18n'), lang);
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var val = translate(el.getAttribute('data-i18n-content'), lang);
      if (val != null) el.setAttribute('content', val);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var val = translate(el.getAttribute('data-i18n-placeholder'), lang);
      if (val != null) el.setAttribute('placeholder', val);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var val = translate(el.getAttribute('data-i18n-aria-label'), lang);
      if (val != null) el.setAttribute('aria-label', val);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var val = translate(el.getAttribute('data-i18n-title'), lang);
      if (val != null) el.setAttribute('title', val);
    });

    updateLangSwitcherUI(lang);
  }

  /* ---------- Caminho para o login consoante a página ---------- */
  function loginPath() {
    return window.location.pathname.indexOf('/pages/') !== -1 ? '../login.html' : 'login.html';
  }

  /* ---------- Injeta o link discreto para a Área Reservada ---------- */
  function ensureLoginLink(navActions) {
    if (navActions.querySelector('.btn-login-link')) return;
    var a = document.createElement('a');
    a.href = loginPath();
    a.className = 'btn-circle btn-login-link';
    a.setAttribute('aria-label', translate('nav.reservedArea', getLang()));
    a.setAttribute('data-i18n-aria-label', 'nav.reservedArea');
    a.setAttribute('title', translate('nav.reservedArea', getLang()));
    a.setAttribute('data-i18n-title', 'nav.reservedArea');
    a.setAttribute('rel', 'nofollow');
    a.innerHTML = '🔒';
    var themeBtn = navActions.querySelector('.btn-theme');
    navActions.insertBefore(a, themeBtn || navActions.firstChild);
  }

  /* ---------- Injeta o seletor de idioma ---------- */
  function ensureLangSwitcher(navActions) {
    if (navActions.querySelector('.lang-switch')) return;

    var wrap = document.createElement('div');
    wrap.className = 'lang-switch';

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'btn-circle lang-current';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('data-i18n-aria-label', 'nav.lang');
    trigger.setAttribute('aria-label', translate('nav.lang', getLang()));

    var menu = document.createElement('ul');
    menu.className = 'lang-menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    LANGS.forEach(function (code) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-lang', code);
      btn.setAttribute('role', 'option');
      btn.innerHTML = LANG_FLAGS[code] + ' ' + LANG_LABELS[code];
      btn.addEventListener('click', function () {
        setLang(code);
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      });
      li.appendChild(btn);
      menu.appendChild(li);
    });

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = !menu.hidden;
      menu.hidden = isOpen;
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) {
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    wrap.appendChild(trigger);
    wrap.appendChild(menu);

    var themeBtn = navActions.querySelector('.btn-theme');
    navActions.insertBefore(wrap, themeBtn || navActions.firstChild);
  }

  function updateLangSwitcherUI(lang) {
    var trigger = document.querySelector('.lang-switch .lang-current');
    if (trigger) trigger.innerHTML = LANG_FLAGS[lang] + ' <span class="lang-code">' + lang.toUpperCase() + '</span>';
    document.querySelectorAll('.lang-menu button').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.setAttribute('aria-selected', String(active));
    });
  }

  /* ---------- Arranque ---------- */
  function init() {
    var navActions = document.querySelector('.nav-actions');
    if (navActions) {
      ensureLoginLink(navActions);
      ensureLangSwitcher(navActions);
    }
    apply(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.BTSi18n = { setLang: setLang, getLang: getLang };
})();
