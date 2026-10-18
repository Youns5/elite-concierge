/* ============================================================
   ÉLITE — Données de démonstration (toutes fictives)
   ============================================================
   Aucune donnée réelle. Tous les noms, emails, téléphones
   sont inventés à des fins de démonstration.
   ============================================================ */

const DEMO_DATA = {
  user: {
    name: 'Alexandre Martin',
    role: 'Concierge Manager',
    email: 'a.martin@elite-conciergerie.fr',
    phone: '+33 1 42 86 90 12',
    initials: 'AM',
    preferences: {
      notifications: { push: true, email: true, urgentOnly: false },
      theme: 'light',
      language: 'fr'
    }
  },

  clients: [
    { id: 'c1', name: 'Claire Dubois', tier: 'VIP', status: 'active', city: 'Paris', languages: ['Français', 'Anglais'], phone: '+33 6 12 34 56 78', email: 'claire.dubois@example.fr', company: 'Groupe Dubois Holdings', lastActivity: '2026-09-03T09:12:00', joinedAt: '2022-03-14', demands: 8,
      preferences: { restaurants: 'Le Cinq, L\'Ambroisie, Plaza Athénée', cuisine: 'Gastronomique française, Japonaise', hotels: 'Le Bristol, Hôtel de Crillon, Plaza Athénée', vehicle: 'Mercedes Classe S avec chauffeur', travel: 'Cabin privé, arrivées tardives, chambre calme' },
      history: [
        { date: '2026-09-01', title: 'Réservation restaurant Le Cinq', desc: 'Table pour 2, 20h00, fenêtre' },
        { date: '2026-08-22', title: 'Séjour au Bristol', desc: 'Suite Panoramique, 3 nuits, transferts A/R' },
        { date: '2026-08-05', title: 'Chauffeur pour déplacement Lyon', desc: 'Mercedes V-Class, journée complète' },
        { date: '2026-07-18', title: 'Réservation spa au Crillon', desc: 'Soin signature 90 min' }
      ],
      notes: 'Cliente exigeante mais fidèle. Préfère un contact unique (Alexandre). Toujours confirmer les réservations par SMS. Anniversaire le 14 mars — envoyer fleurs.' },
    { id: 'c2', name: 'Lucas Bernard', tier: 'Elite', status: 'active', city: 'Lyon', languages: ['Français', 'Anglais', 'Italien'], phone: '+33 6 23 45 67 89', email: 'lucas.bernard@example.fr', company: 'Bernard & Associés', lastActivity: '2026-09-03T08:42:00', joinedAt: '2023-01-20', demands: 5,
      preferences: { restaurants: 'L\'Auberge du Pont de Collonges, Takasaka', cuisine: 'Bouchon lyonnais, Sushi omakase', hotels: 'InterContinental Lyon, Villa Maïa', vehicle: 'BMW Série 7', travel: 'Vol business, transferts privatifs' },
      history: [
        { date: '2026-08-30', title: 'Déjeuner d\'affaires', desc: 'Restaurant L\'Auberge, 4 personnes' },
        { date: '2026-08-12', title: 'Voyage d\'affaires Milan', desc: 'Vol business + hôtel Four Seasons' },
        { date: '2026-07-25', title: 'Réservation spa', desc: 'Villa Maïa, soin du dos' }
      ],
      notes: 'Souvent en déplacement. Préfère l\'email. Aime les restaurants discrets avec salons privés.' },
    { id: 'c3', name: 'Emma Laurent', tier: 'VIP', status: 'active', city: 'Paris', languages: ['Français', 'Anglais', 'Allemand'], phone: '+33 6 34 56 78 90', email: 'emma.laurent@example.fr', company: 'Laurent Capital', lastActivity: '2026-09-03T07:55:00', joinedAt: '2021-11-08', demands: 12,
      preferences: { restaurants: 'Guy Savoy, Le Jules Verne, L\'Oiseau Blanc', cuisine: 'Gastronomique, Pâtisserie fine', hotels: 'Peninsula Paris, Cheval Blanc', vehicle: 'Range Rover Autobiography', travel: 'Hélicoptère privé, Jet privé pour long-courrier' },
      history: [
        { date: '2026-09-02', title: 'Dîner Le Jules Verne', desc: 'Table pour 4, 21h00' },
        { date: '2026-08-28', title: 'Shopping personnal shopper', desc: 'Avenue Montaigne, 3h' },
        { date: '2026-08-15', title: 'Vol privé Paris-Londres', desc: 'Cessna Citation, aller-retour J' }
      ],
      notes: 'Cliente hautement exigeante. Toujours prévoir un véhicule en attente. Préfère le contact WhatsApp.' },
    { id: 'c4', name: 'Thomas Morel', tier: 'Elite', status: 'active', city: 'Paris', languages: ['Français', 'Anglais'], phone: '+33 6 45 67 89 01', email: 'thomas.morel@example.fr', company: 'Morel Invest', lastActivity: '2026-09-02T18:30:00', joinedAt: '2023-06-12', demands: 4,
      preferences: { restaurants: 'Septime, Clamato, Le Servan', cuisine: 'Néobistrot, Fruits de mer', hotels: 'Hôtel Particulier Montmartre, SO/Paris', vehicle: 'Porsche Taycan', travel: 'Train 1ère classe, vol business' },
      history: [
        { date: '2026-09-01', title: 'Déjeuner Clamato', desc: 'Table pour 2' },
        { date: '2026-08-20', title: 'Week-end SO/Paris', desc: '2 nuits, vue Seine' }
      ],
      notes: 'Profil jeune entrepreneur. Apprecie les adresses confidentielles.' },
    { id: 'c5', name: 'Sofia Martin', tier: 'Private', status: 'active', city: 'Cannes', languages: ['Français', 'Anglais', 'Espagnol'], phone: '+33 6 56 78 90 12', email: 'sofia.martin@example.fr', company: 'Martin Family Office', lastActivity: '2026-08-29T16:45:00', joinedAt: '2024-02-01', demands: 3,
      preferences: { restaurants: 'La Palme d\'Or, Le Park 45', cuisine: 'Méditerranéenne, Italienne', hotels: 'Hôtel Barrière Le Majestic, Grand-Hôtel du Cap-Ferrat', vehicle: 'Bentley Continental GT', travel: 'Yacht, hélicoptère' },
      history: [
        { date: '2026-08-25', title: 'Séjour au Majestic Cannes', desc: 'Suite, 5 nuits' },
        { date: '2026-08-10', title: 'Dîner La Palme d\'Or', desc: 'Table pour 6' }
      ],
      notes: 'Cliente saisonnière (Cannes/Nice). Préfère les contacts en fin de journée.' },
    { id: 'c6', name: 'Antoine Girard', tier: 'Elite', status: 'active', city: 'Paris', languages: ['Français', 'Anglais'], phone: '+33 6 67 89 01 23', email: 'antoine.girard@example.fr', company: 'Girard Aviation', lastActivity: '2026-09-02T14:20:00', joinedAt: '2022-09-05', demands: 9,
      preferences: { restaurants: 'L\'Abeille, Epicure, Le Bernardin', cuisine: 'Gastronomique, Fruits de mer', hotels: 'Shangri-La Paris, Mandarin Oriental', vehicle: 'Audi A8 L', travel: 'Jet privé, hélicoptère' },
      history: [
        { date: '2026-09-02', title: 'Vol privé Paris-Geneva', desc: 'Falcon 7X' },
        { date: '2026-08-18', title: 'Dîner L\'Abeille', desc: 'Table pour 6, salon privé' }
      ],
      notes: 'PDG d\'une société d\'aviation. Très à l\'aise avec la logistique aérienne.' },
    { id: 'c7', name: 'Camille Roux', tier: 'VIP', status: 'active', city: 'Genève', languages: ['Français', 'Anglais', 'Allemand'], phone: '+41 78 234 56 78', email: 'camille.roux@example.ch', company: 'Roux Private Wealth', lastActivity: '2026-09-03T06:30:00', joinedAt: '2021-05-19', demands: 11,
      preferences: { restaurants: 'Bayview, Le Chat-Botté, Le Jardin', cuisine: 'Suisse gastronomique, Française', hotels: 'Hôtel d\'Angleterre, Beau-Rivage Genève', vehicle: 'Mercedes Maybach', travel: 'Jet privé, vol business' },
      history: [
        { date: '2026-09-01', title: 'Déplacement Paris-Genève', desc: 'Transfert + hôtel d\'Angleterre' },
        { date: '2026-08-22', title: 'Dîner Bayview', desc: 'Table pour 4' }
      ],
      notes: 'Cliente binationale FR/CH. Souvent à Paris du mardi au jeudi.' },
    { id: 'c8', name: 'Hugo Petit', tier: 'Private', status: 'inactive', city: 'Bordeaux', languages: ['Français'], phone: '+33 6 78 90 12 34', email: 'hugo.petit@example.fr', company: 'Petit Vignobles', lastActivity: '2026-07-15T11:00:00', joinedAt: '2024-04-22', demands: 1,
      preferences: { restaurants: 'Le Quatrième Mur, Cordeillan-Bages', cuisine: 'Bordelaise, Bistrot', hotels: 'InterContinental Bordeaux', vehicle: 'Peugeot 508', travel: 'Train 1ère classe' },
      history: [
        { date: '2026-07-15', title: 'Dîner Le Quatrième Mur', desc: 'Table pour 2' }
      ],
      notes: 'Nouveau client, profil à développer.' },
    { id: 'c9', name: 'Léa Chevalier', tier: 'Elite', status: 'active', city: 'Paris', languages: ['Français', 'Anglais', 'Portugais'], phone: '+33 6 89 01 23 45', email: 'lea.chevalier@example.fr', company: 'Chevalier Studio', lastActivity: '2026-09-02T22:10:00', joinedAt: '2023-02-14', demands: 7,
      preferences: { restaurants: 'Piracle, Girafe, Monsieur Bleu', cuisine: 'Méditerranéenne, Poissons', hotels: 'Brach Paris, Molitor', vehicle: 'Mini Cooper S', travel: 'Vol business' },
      history: [
        { date: '2026-09-02', title: 'Dîner Girafe', desc: 'Table pour 6' },
        { date: '2026-08-26', title: 'Week-end Brach', desc: '2 nuits' }
      ],
      notes: 'Architecte d\'intérieur. Cliente soirée/week-end.' },
    { id: 'c10', name: 'Nicolas Fontaine', tier: 'VIP', status: 'active', city: 'Paris', languages: ['Français', 'Anglais', 'Russe'], phone: '+33 6 90 12 34 56', email: 'nicolas.fontaine@example.fr', company: 'Fontaine Energy', lastActivity: '2026-09-03T10:25:00', joinedAt: '2020-07-08', demands: 15,
      preferences: { restaurants: 'L\'Arpège, Le Meurice Alain Ducasse, Allard', cuisine: 'Gastronomique, Classique française', hotels: 'Le Meurice, Ritz Paris', vehicle: 'Rolls-Royce Phantom', travel: 'Jet privé Gulfstream G650' },
      history: [
        { date: '2026-09-03', title: 'Déjeuner Le Meurice', desc: 'Table pour 8, salon privé' },
        { date: '2026-08-30', title: 'Vol privé Paris-Moscou', desc: 'Gulfstream G650, A/R' },
        { date: '2026-08-18', title: 'Séjour au Ritz', desc: 'Suite Copacabana, 4 nuits' }
      ],
      notes: 'Client VIP majeur. Facturation mensuelle. Préfère le téléphone. Disponible 24/7 pour ce client.' },
    { id: 'c11', name: 'Julie Lefebvre', tier: 'Elite', status: 'active', city: 'Lille', languages: ['Français', 'Néerlandais'], phone: '+33 6 01 23 45 67', email: 'julie.lefebvre@example.fr', company: 'Lefebvre Textiles', lastActivity: '2026-08-28T17:00:00', joinedAt: '2023-09-01', demands: 4,
      preferences: { restaurants: 'L\'Huîtrière, Septime', cuisine: 'Fruits de mer, Bistrot', hotels: 'Hôtel Couvent des Minimes', vehicle: 'Audi Q7', travel: 'Train 1ère classe' },
      history: [
        { date: '2026-08-28', title: 'Déjeuner L\'Huîtrière', desc: 'Table pour 4' }
      ],
      notes: 'Cliente du Nord. Déplacements mensuels à Paris.' },
    { id: 'c12', name: 'Maxime Rousseau', tier: 'Private', status: 'active', city: 'Paris', languages: ['Français', 'Anglais'], phone: '+33 6 12 45 67 89', email: 'maxime.rousseau@example.fr', company: 'Rousseau Tech', lastActivity: '2026-09-01T19:30:00', joinedAt: '2024-06-15', demands: 2,
      preferences: { restaurants: 'Le Train Bleu, Mory Montparnasse', cuisine: 'Bistrot parisien', hotels: 'Hôtel Lutetia', vehicle: 'Tesla Model S', travel: 'Vol éco +, train' },
      history: [
        { date: '2026-09-01', title: 'Dîner Le Train Bleu', desc: 'Table pour 2' }
      ],
      notes: 'Client tech. Discret. Préfère les emails courts.' },
    { id: 'c13', name: 'Chloé Vincent', tier: 'Elite', status: 'active', city: 'Marseille', languages: ['Français', 'Italien'], phone: '+33 6 23 56 78 90', email: 'chloe.vincent@example.fr', company: 'Vincent Maritime', lastActivity: '2026-08-27T15:20:00', joinedAt: '2023-03-30', demands: 6,
      preferences: { restaurants: 'Le Petit Nice, Une Table au Sud', cuisine: 'Méditerranéenne, Poissons', hotels: 'InterContinental Marseille', vehicle: 'Mercedes Classe G', travel: 'Yacht, vol business' },
      history: [
        { date: '2026-08-27', title: 'Dîner Le Petit Nice', desc: 'Table pour 4' }
      ],
      notes: 'Cliente maritime. Souvent en mer l\'été.' },
    { id: 'c14', name: 'Gabriel Mercier', tier: 'VIP', status: 'active', city: 'Paris', languages: ['Français', 'Anglais', 'Chinois'], phone: '+33 6 34 67 89 01', email: 'gabriel.mercier@example.fr', company: 'Mercier Group', lastActivity: '2026-09-03T11:00:00', joinedAt: '2021-02-11', demands: 13,
      preferences: { restaurants: 'L\'Abeille, Kei, L\'Ecrin', cuisine: 'Japonaise, Française gastronomique', hotels: 'Shangri-La, Cheval Blanc', vehicle: 'Mercedes Maybach S680', travel: 'Jet privé, hélicoptère' },
      history: [
        { date: '2026-09-03', title: 'Réunion d\'affaires Shangri-La', desc: 'Suite, matinée' },
        { date: '2026-08-29', title: 'Dîner L\'Abeille', desc: 'Salon privé' }
      ],
      notes: 'Investisseur international. Affaires en Chine et France.' },
    { id: 'c15', name: 'Sarah Lemoine', tier: 'Private', status: 'active', city: 'Nantes', languages: ['Français', 'Anglais'], phone: '+33 6 45 78 90 12', email: 'sarah.lemoine@example.fr', company: 'Lemoine Pharma', lastActivity: '2026-08-25T09:30:00', joinedAt: '2024-01-10', demands: 2,
      preferences: { restaurants: 'L\'Épicurien, W restaurant', cuisine: 'Gastronomique, Bistrot', hotels: 'Radisson Blu Nantes', vehicle: 'Peugeot 3008', travel: 'Train 1ère' },
      history: [
        { date: '2026-08-25', title: 'Déjeuner L\'Épicurien', desc: 'Table pour 2' }
      ],
      notes: 'Cliente pharmacie. Déplacements ponctuels.' },
    { id: 'c16', name: 'Raphael Blanc', tier: 'Elite', status: 'active', city: 'Paris', languages: ['Français', 'Anglais', 'Italien'], phone: '+33 6 56 89 01 23', email: 'raphael.blanc@example.fr', company: 'Blanc & Fils', lastActivity: '2026-09-02T20:00:00', joinedAt: '2022-08-22', demands: 8,
      preferences: { restaurants: 'Pierre Gagnaire, Le Cinq, L\'Abeille', cuisine: 'Gastronomique créative', hotels: 'Four Seasons George V, Le Bristol', vehicle: 'Bentley Flying Spur', travel: 'Jet privé' },
      history: [
        { date: '2026-09-02', title: 'Dîner Pierre Gagnaire', desc: 'Table pour 4' },
        { date: '2026-08-20', title: 'Séjour Four Seasons George V', desc: 'Suite, 2 nuits' }
      ],
      notes: 'Héritier d\'une famille d\'industriels. Très exigeant sur la qualité du service.' },
    { id: 'c17', name: 'Manon Garnier', tier: 'Private', status: 'active', city: 'Strasbourg', languages: ['Français', 'Allemand'], phone: '+33 6 67 90 12 34', email: 'manon.garnier@example.fr', company: 'Garnier Vin', lastActivity: '2026-08-22T14:00:00', joinedAt: '2024-03-15', demands: 3,
      preferences: { restaurants: 'Le Buerehiesel, Crocodile', cuisine: 'Alsacienne, Gastronomique', hotels: 'Régent Petite France', vehicle: 'BMW Série 5', travel: 'Train 1ère' },
      history: [
        { date: '2026-08-22', title: 'Déjeuner Crocodile', desc: 'Table pour 3' }
      ],
      notes: 'Cliente alsacienne, spécialiste vin.' },
    { id: 'c18', name: 'Louis Faure', tier: 'Elite', status: 'active', city: 'Lyon', languages: ['Français', 'Anglais'], phone: '+33 6 78 01 23 45', email: 'louis.faure@example.fr', company: 'Faure Industrie', lastActivity: '2026-09-01T12:15:00', joinedAt: '2023-05-08', demands: 6,
      preferences: { restaurants: 'Paul Bocuse, Takasaka, L\'Auberge', cuisine: 'Bouchon, Sushi', hotels: 'InterContinental Lyon', vehicle: 'Audi A8', travel: 'Vol business' },
      history: [
        { date: '2026-09-01', title: 'Déjeuner Paul Bocuse', desc: 'Table pour 4' }
      ],
      notes: 'Industriel lyonnais. Repas d\'affaires réguliers.' },
    { id: 'c19', name: 'Alice Boyer', tier: 'VIP', status: 'active', city: 'Paris', languages: ['Français', 'Anglais', 'Arabe'], phone: '+33 6 89 12 34 56', email: 'alice.boyer@example.fr', company: 'Boyer Art Advisory', lastActivity: '2026-09-03T08:00:00', joinedAt: '2021-09-12', demands: 10,
      preferences: { restaurants: 'Le Comptoir du Louvre, L\'Abeille, Kei', cuisine: 'Gastronomique, Art de la table', hotels: 'Hôtel de Crillon, Le Meurice', vehicle: 'Mercedes Classe S', travel: 'Jet privé, hélicoptère' },
      history: [
        { date: '2026-09-03', title: 'Petit-déjeuner Crillon', desc: 'Salon privé, 8h00' },
        { date: '2026-08-28', title: 'Vernissage galerie', desc: 'Organisation complète' }
      ],
      notes: 'Conseillère en art. Organise régulièrement des événements culturels pour ses clients.' },
    { id: 'c20', name: 'Victor Henry', tier: 'Private', status: 'active', city: 'Toulouse', languages: ['Français', 'Anglais'], phone: '+33 6 90 23 45 67', email: 'victor.henry@example.fr', company: 'Henry Aerospace', lastActivity: '2026-08-20T10:00:00', joinedAt: '2024-05-20', demands: 2,
      preferences: { restaurants: 'Les Jardins de l\'Opéra, Py-r', cuisine: 'Gastronomique du Sud-Ouest', hotels: 'Hôtel des Pins', vehicle: 'Audi Q5', travel: 'Vol éco +, train' },
      history: [
        { date: '2026-08-20', title: 'Déjeuner Les Jardins de l\'Opéra', desc: 'Table pour 3' }
      ],
      notes: 'Ingénieur aérospatial. Profil discret.' }
  ],

  demands: [
    { id: 'd1', clientId: 'c1', type: 'Restaurant', description: 'Réservation pour 2 personnes, fenêtre, table calme. Versement anniversaire prévu.', date: '2026-09-05', time: '20:00', priority: 'Importante', assignee: 'Alexandre Martin', budget: 450, status: 'En cours', createdAt: '2026-09-03T08:12:00' },
    { id: 'd2', clientId: 'c10', type: 'Transport', description: 'Vol privé Paris-Moscou aller-retour, Gulfstream G650. Départ 14h.', date: '2026-09-08', time: '14:00', priority: 'Urgente', assignee: 'Alexandre Martin', budget: 85000, status: 'En cours', createdAt: '2026-09-03T07:30:00' },
    { id: 'd3', clientId: 'c3', type: 'Voyage', description: 'Week-end Londres : hôtel 5*, dîner Sketch, shopping personal shopper. 2 nuits.', date: '2026-09-12', time: null, priority: 'Importante', assignee: 'Sophie Leroy', budget: 12000, status: 'Confirmée', createdAt: '2026-09-02T16:20:00' },
    { id: 'd4', clientId: 'c14', type: 'Restaurant', description: 'Déjeuner d\'affaires 6 personnes, salon privé, cuisine japonaise.', date: '2026-09-06', time: '12:30', priority: 'Normale', assignee: 'Alexandre Martin', budget: 1200, status: 'Confirmée', createdAt: '2026-09-02T14:00:00' },
    { id: 'd5', clientId: 'c6', type: 'Billetterie', description: '2 places Fosse Orchestre pour opéra Bastille, première préférée.', date: '2026-09-15', time: '19:30', priority: 'Importante', assignee: 'Sophie Leroy', budget: 800, status: 'En attente', createdAt: '2026-09-02T11:00:00' },
    { id: 'd6', clientId: 'c19', type: 'Événement', description: 'Organisation cocktail privé galerie d\'art 50 invités. Vin & catering.', date: '2026-09-20', time: '18:30', priority: 'Urgente', assignee: 'Alexandre Martin', budget: 18000, status: 'En cours', createdAt: '2026-09-03T09:00:00' },
    { id: 'd7', clientId: 'c2', type: 'Transport', description: 'Chauffeur journée complète Lyon-Milan pour réunion. Mercedes Classe S.', date: '2026-09-04', time: '07:00', priority: 'Normale', assignee: 'Marc Dubois', budget: 1500, status: 'Confirmée', createdAt: '2026-09-01T15:00:00' },
    { id: 'd8', clientId: 'c7', type: 'Hôtel', description: 'Réservation suite au Beau-Rivage Genève, 3 nuits, vue lac.', date: '2026-09-10', time: null, priority: 'Normale', assignee: 'Sophie Leroy', budget: 5400, status: 'Confirmée', createdAt: '2026-08-30T10:30:00' },
    { id: 'd9', clientId: 'c4', type: 'Shopping', description: 'Personal shopper mode homme, 3 boutiques Avenue Montaigne.', date: '2026-09-07', time: '14:00', priority: 'Normale', assignee: 'Sophie Leroy', budget: 4000, status: 'Nouvelle', createdAt: '2026-09-03T10:00:00' },
    { id: 'd10', clientId: 'c16', type: 'Restaurant', description: 'Dîner 4 personnes Pierre Gagnaire, salon privé.', date: '2026-09-09', time: '20:30', priority: 'Importante', assignee: 'Alexandre Martin', budget: 1800, status: 'En cours', createdAt: '2026-09-02T18:00:00' },
    { id: 'd11', clientId: 'c5', type: 'Voyage', description: 'Transfert yacht Nice-St-Tropez, hélicoptère + équipage.', date: '2026-09-14', time: '10:00', priority: 'Importante', assignee: 'Marc Dubois', budget: 6500, status: 'En attente', createdAt: '2026-09-02T09:15:00' },
    { id: 'd12', clientId: 'c9', type: 'Spa', description: 'Soin du visage signature Brach, 2 personnes, 16h.', date: '2026-09-06', time: '16:00', priority: 'Normale', assignee: 'Sophie Leroy', budget: 600, status: 'Confirmée', createdAt: '2026-09-01T14:00:00' },
    { id: 'd13', clientId: 'c10', type: 'Restaurant', description: 'Déjeuner 8 personnes Le Meurice Alain Ducasse, salon privé, menu dégustation.', date: '2026-09-11', time: '12:30', priority: 'Importante', assignee: 'Alexandre Martin', budget: 3200, status: 'Confirmée', createdAt: '2026-09-02T17:00:00' },
    { id: 'd14', clientId: 'c19', type: 'Billetterie', description: 'Billets première pour exposition Louvre, créneau 11h.', date: '2026-09-08', time: '11:00', priority: 'Normale', assignee: 'Sophie Leroy', budget: 200, status: 'Confirmée', createdAt: '2026-08-31T11:00:00' },
    { id: 'd15', clientId: 'c1', type: 'Transport', description: 'Chauffeur A/R aéroport CDG, Mercedes Classe S, arrivée 18h40.', date: '2026-09-04', time: '18:40', priority: 'Normale', assignee: 'Marc Dubois', budget: 380, status: 'Confirmée', createdAt: '2026-09-01T09:00:00' },
    { id: 'd16', clientId: 'c14', type: 'Voyage', description: 'Séjour 5 nuits Shanghai, hôtel Peninsula, transferts privatifs.', date: '2026-09-25', time: null, priority: 'Importante', assignee: 'Alexandre Martin', budget: 22000, status: 'En cours', createdAt: '2026-09-02T20:00:00' },
    { id: 'd17', clientId: 'c3', type: 'Événement', description: 'Anniversaire surprise 30 invités, dîner privé avec DJ.', date: '2026-09-28', time: '20:00', priority: 'Urgente', assignee: 'Alexandre Martin', budget: 25000, status: 'En cours', createdAt: '2026-09-03T07:00:00' },
    { id: 'd18', clientId: 'c6', type: 'Hôtel', description: 'Suite Shangri-La Paris, 2 nuits, vue Tour Eiffel, petit-déjeuner inclus.', date: '2026-09-13', time: null, priority: 'Normale', assignee: 'Sophie Leroy', budget: 4200, status: 'Confirmée', createdAt: '2026-09-01T11:30:00' },
    { id: 'd19', clientId: 'c11', type: 'Transport', description: 'Train 1ère Lille-Paris A/R, même jour.', date: '2026-09-12', time: '07:30', priority: 'Normale', assignee: 'Marc Dubois', budget: 220, status: 'Confirmée', createdAt: '2026-08-29T10:00:00' },
    { id: 'd20', clientId: 'c16', type: 'Spa', description: 'Massage duo 90 min, spa du George V.', date: '2026-09-10', time: '17:00', priority: 'Normale', assignee: 'Sophie Leroy', budget: 800, status: 'Confirmée', createdAt: '2026-09-02T15:30:00' },
    { id: 'd21', clientId: 'c13', type: 'Restaurant', description: 'Dîner 4 personnes Le Petit Nice, terrasse mer.', date: '2026-09-21', time: '20:00', priority: 'Importante', assignee: 'Marc Dubois', budget: 1400, status: 'En attente', createdAt: '2026-09-02T12:00:00' },
    { id: 'd22', clientId: 'c7', type: 'Billetterie', description: '2 places loge pour concert Opera Garnier.', date: '2026-09-18', time: '20:00', priority: 'Importante', assignee: 'Sophie Leroy', budget: 1200, status: 'En attente', createdAt: '2026-09-02T16:00:00' },
    { id: 'd23', clientId: 'c10', type: 'Shopping', description: 'Montre Patek Philippe, rendez-vous boutique Vendôme.', date: '2026-09-09', time: '11:00', priority: 'Normale', assignee: 'Alexandre Martin', budget: 85000, status: 'En cours', createdAt: '2026-09-03T06:00:00' },
    { id: 'd24', clientId: 'c19', type: 'Restaurant', description: 'Déjeuner d\'affaires Crillon, 4 personnes, salon privé.', date: '2026-09-12', time: '13:00', priority: 'Normale', assignee: 'Alexandre Martin', budget: 900, status: 'Confirmée', createdAt: '2026-09-02T08:00:00' },
    { id: 'd25', clientId: 'c4', type: 'Billetterie', description: '2 places première catégorie théâtre Comédie-Française.', date: '2026-09-19', time: '20:30', priority: 'Normale', assignee: 'Sophie Leroy', budget: 320, status: 'Confirmée', createdAt: '2026-09-01T13:00:00' },
    { id: 'd26', clientId: 'c2', type: 'Restaurant', description: 'Déjeuner 4 personnes L\'Auberge, salon privé.', date: '2026-09-11', time: '12:30', priority: 'Normale', assignee: 'Marc Dubois', budget: 800, status: 'Confirmée', createdAt: '2026-09-02T09:00:00' },
    { id: 'd27', clientId: 'c8', type: 'Voyage', description: 'Week-end Bordeaux, visite châteaux privatifs avec déjeuner.', date: '2026-09-22', time: null, priority: 'Normale', assignee: 'Sophie Leroy', budget: 3500, status: 'Nouvelle', createdAt: '2026-09-03T11:30:00' },
    { id: 'd28', clientId: 'c3', type: 'Transport', description: 'Hélicoptère Paris-Deauville A/R, départ 9h.', date: '2026-09-16', time: '09:00', priority: 'Importante', assignee: 'Marc Dubois', budget: 4200, status: 'En attente', createdAt: '2026-09-02T14:30:00' },
    { id: 'd29', clientId: 'c14', type: 'Événement', description: 'Dîner gala 80 invités Cheval Blanc, orchestre privé.', date: '2026-10-04', time: '19:30', priority: 'Urgente', assignee: 'Alexandre Martin', budget: 65000, status: 'En cours', createdAt: '2026-09-03T05:30:00' },
    { id: 'd30', clientId: 'c9', type: 'Restaurant', description: 'Dîner 6 personnes Monsieur Bleu, terrasse.', date: '2026-09-13', time: '20:30', priority: 'Normale', assignee: 'Sophie Leroy', budget: 1100, status: 'Confirmée', createdAt: '2026-09-01T17:00:00' }
  ],

  reservations: [
    { id: 'r1', clientId: 'c1', service: 'Restaurant', provider: 'Le Cinq — Four Seasons', date: '2026-09-05', time: '20:00', price: 450, status: 'Confirmée' },
    { id: 'r2', clientId: 'c10', service: 'Transport', provider: 'Mercedes Classe S', date: '2026-09-08', time: '14:00', price: 380, status: 'En attente' },
    { id: 'r3', clientId: 'c3', service: 'Hôtel', provider: 'The Connaught Londres', date: '2026-09-12', time: null, price: 6800, status: 'Confirmée' },
    { id: 'r4', clientId: 'c14', service: 'Restaurant', provider: 'L\'Abeille — Shangri-La', date: '2026-09-06', time: '12:30', price: 1200, status: 'Confirmée' },
    { id: 'r5', clientId: 'c6', service: 'Billetterie', provider: 'Opéra Bastille', date: '2026-09-15', time: '19:30', price: 800, status: 'En attente' },
    { id: 'r6', clientId: 'c19', service: 'Événement', provider: 'Catering Lenôtre', date: '2026-09-20', time: '18:30', price: 18000, status: 'Confirmée' },
    { id: 'r7', clientId: 'c2', service: 'Transport', provider: 'Mercedes Classe S', date: '2026-09-04', time: '07:00', price: 1500, status: 'Confirmée' },
    { id: 'r8', clientId: 'c7', service: 'Hôtel', provider: 'Beau-Rivage Genève', date: '2026-09-10', time: null, price: 5400, status: 'Confirmée' },
    { id: 'r9', clientId: 'c4', service: 'Shopping', provider: 'Personal Shopper Léa M.', date: '2026-09-07', time: '14:00', price: 4000, status: 'En attente' },
    { id: 'r10', clientId: 'c16', service: 'Restaurant', provider: 'Pierre Gagnaire', date: '2026-09-09', time: '20:30', price: 1800, status: 'Confirmée' },
    { id: 'r11', clientId: 'c5', service: 'Voyage', provider: 'Hélicoptère Monacair', date: '2026-09-14', time: '10:00', price: 6500, status: 'En attente' },
    { id: 'r12', clientId: 'c9', service: 'Spa', provider: 'Brach Spa by La Mer', date: '2026-09-06', time: '16:00', price: 600, status: 'Confirmée' },
    { id: 'r13', clientId: 'c10', service: 'Restaurant', provider: 'Le Meurice Alain Ducasse', date: '2026-09-11', time: '12:30', price: 3200, status: 'Confirmée' },
    { id: 'r14', clientId: 'c19', service: 'Billetterie', provider: 'Musée du Louvre', date: '2026-09-08', time: '11:00', price: 200, status: 'Confirmée' },
    { id: 'r15', clientId: 'c1', service: 'Transport', provider: 'Mercedes Classe S', date: '2026-09-04', time: '18:40', price: 380, status: 'Confirmée' },
    { id: 'r16', clientId: 'c14', service: 'Hôtel', provider: 'Peninsula Shanghai', date: '2026-09-25', time: null, price: 22000, status: 'En attente' },
    { id: 'r17', clientId: 'c3', service: 'Événement', provider: 'Pavillon Ledoyen', date: '2026-09-28', time: '20:00', price: 25000, status: 'En attente' },
    { id: 'r18', clientId: 'c6', service: 'Hôtel', provider: 'Shangri-La Paris', date: '2026-09-13', time: null, price: 4200, status: 'Confirmée' },
    { id: 'r19', clientId: 'c11', service: 'Transport', provider: 'SNCF Première', date: '2026-09-12', time: '07:30', price: 220, status: 'Confirmée' },
    { id: 'r20', clientId: 'c16', service: 'Spa', provider: 'Spa Dior — George V', date: '2026-09-10', time: '17:00', price: 800, status: 'Confirmée' },
    { id: 'r21', clientId: 'c13', service: 'Restaurant', provider: 'Le Petit Nice', date: '2026-09-21', time: '20:00', price: 1400, status: 'Annulée' },
    { id: 'r22', clientId: 'c7', service: 'Billetterie', provider: 'Opéra Garnier', date: '2026-09-18', time: '20:00', price: 1200, status: 'En attente' }
  ],

  providers: [
    { id: 'p1', name: 'Le Cinq — Four Seasons', category: 'Restaurants', city: 'Paris', contact: 'Jean-Philippe Cartier', phone: '+33 1 49 52 71 00', email: 'concierge.cinq@fourseasons.com', status: 'Actif', rating: 5, note: 'Contact privilégié avec Jean-Philippe. Tables fenêtre disponibles sur demande. Préfère confirmation 48h à l\'avance.' },
    { id: 'p2', name: 'Le Bristol Paris', category: 'Hôtels', city: 'Paris', contact: 'Marie Leclerc', phone: '+33 1 53 43 43 00', email: 'reservation@lebristolparis.com', status: 'Actif', rating: 5, note: 'Suite Panoramique recommandée pour VIP. Upgrade fréquent sur réservation conciergerie.' },
    { id: 'p3', name: 'Hôtel de Crillon', category: 'Hôtels', city: 'Paris', contact: 'Antoine Vermorel', phone: '+33 1 44 71 15 00', email: 'a.vermorel@rosewoodhotels.com', status: 'Actif', rating: 5, note: 'Salons privés disponibles. Excellent pour petits déjeuners d\'affaires.' },
    { id: 'p4', name: 'Mercedes Chauffeur Privé', category: 'Transport', city: 'Paris', contact: 'Karim Bensalah', phone: '+33 6 18 22 33 44', email: 'kb@chauffeur-prive.fr', status: 'Actif', rating: 5, note: 'Flotte Mercedes Classe S, V-Class et Maybach. Disponible 24/7. Toujours demander Karim directement.' },
    { id: 'p5', name: 'Pierre Gagnaire', category: 'Restaurants', city: 'Paris', contact: 'Sandrine Gagnaire', phone: '+33 1 44 24 00 27', email: 'reservation@pierre-gagnaire.com', status: 'Actif', rating: 5, note: 'Salon privé au 1er. Réservation minimum 2 semaines à l\'avance pour le soir.' },
    { id: 'p6', name: 'Shangri-La Paris', category: 'Hôtels', city: 'Paris', contact: 'Yannick Pons', phone: '+33 1 53 67 19 98', email: 'ypons@shangri-la.com', status: 'Actif', rating: 5, note: 'Suites avec vue Tour Eiffel. Membres Shangri-La Circle = upgrade gratuit.' },
    { id: 'p7', name: 'Brach Spa by La Mer', category: 'Spa', city: 'Paris', contact: 'Céline Aubert', phone: '+33 1 44 50 00 50', email: 'spa@brachparis.com', status: 'Actif', rating: 4, note: 'Soin signature La Mer 90 min recommandé. Éviter le samedi matin (complet).' },
    { id: 'p8', name: 'Monacair', category: 'Transport', city: 'Monaco', contact: 'Alessandro Rossi', phone: '+377 97 70 22 22', email: 'a.rossi@monacair.mc', status: 'Actif', rating: 5, note: 'Hélicoptères AW109 et AW139. Liaison Nice-St-Tropez en 25 min.' },
    { id: 'p9', name: 'Opéra National de Paris', category: 'Billetterie', city: 'Paris', contact: 'Service Conciergeries', phone: '+33 1 72 29 35 35', email: 'conciergeries@operadeparis.fr', status: 'Actif', rating: 5, note: 'Loges et places d\'orchestre accessibles via convention. Pré-réservation 6 semaines.' },
    { id: 'p10', name: 'Lenôtre Catering', category: 'Événementiel', city: 'Paris', contact: 'Olivier Bajeux', phone: '+33 1 44 97 00 00', email: 'events@lenotre.com', status: 'Actif', rating: 5, note: 'Traiteur haut de gamme. Équipes mobiles jusqu\'à 200 invités. Menu dégustation signature.' },
    { id: 'p11', name: 'Personal Shopper — Léa M.', category: 'Shopping', city: 'Paris', contact: 'Léa Marchand', phone: '+33 6 11 22 33 44', email: 'lea@personalshopper-paris.fr', status: 'Actif', rating: 5, note: 'Spécialiste mode homme/femme, joaillerie. Accès privés boutiques Avenue Montaigne.' },
    { id: 'p12', name: 'Pavillon Ledoyen', category: 'Restaurants', city: 'Paris', contact: 'Éric Briffard', phone: '+33 1 53 05 10 10', email: 'contact@ledoyen.com', status: 'Actif', rating: 5, note: 'Salons privés pour événements. Cuisine Yannick Alléno. Privatise jusqu\'à 120 couverts.' },
    { id: 'p13', name: 'Beau-Rivage Genève', category: 'Hôtels', city: 'Genève', contact: 'Salomé Robert', phone: '+41 22 716 69 69', email: 'srobert@beau-rivage.ch', status: 'Actif', rating: 5, note: 'Vue lac et Jet d\'Eau. Suite Royale recommandée. Convention conciergerie = petit-déj offert.' },
    { id: 'p14', name: 'Le Petit Nice — Passédat', category: 'Restaurants', city: 'Marseille', contact: 'Mathieu Passédat', phone: '+33 4 91 59 25 92', email: 'contact@petitnice-passedat.com', status: 'Actif', rating: 5, note: 'Tables terrasse mer à réserver longtemps à l\'avance. Menu Passédat 11 services.' },
    { id: 'p15', name: 'Peninsula Shanghai', category: 'Hôtels', city: 'Shanghai', contact: 'Li Wen', phone: '+86 21 2327 2888', email: 'concierge@peninsula.com', status: 'Actif', rating: 5, note: 'Suite Peninsula à Bund view. Voiture Rolls-Royce disponible A/R aéroport.' },
    { id: 'p16', name: 'Bayview — Hôtel d\'Angleterre', category: 'Restaurants', city: 'Genève', contact: 'Laurent Perrodo', phone: '+41 22 716 34 34', email: 'bayview@angleterre.ch', status: 'Actif', rating: 5, note: 'Cuisine Michel Roth. Menu dégustation 7 services. Tables fenêtre lac impératives.' },
    { id: 'p17', name: 'Cessna Citation Jet Privé', category: 'Transport', city: 'Le Bourget', contact: 'Vincent Cassel', phone: '+33 6 45 67 89 00', email: 'dispatch@jet-prive-paris.fr', status: 'Actif', rating: 5, note: 'Citation Mustang, Latitude et Longitude. Disponibilité 24/7. Base Le Bourget LFPB.' }
  ],

  invoices: [
    { id: 'F-2026-091', clientId: 'c10', date: '2026-09-01', service: 'Vol privé Paris-Moscou A/R', amount: 87500, status: 'Payé', method: 'Virement' },
    { id: 'F-2026-090', clientId: 'c3', date: '2026-08-30', service: 'Week-end Londres + helicopter', amount: 14500, status: 'Payé', method: 'Carte' },
    { id: 'F-2026-089', clientId: 'c14', date: '2026-08-28', service: 'Séjour Shanghai (peninsula)', amount: 24500, status: 'En attente', method: 'Virement' },
    { id: 'F-2026-088', clientId: 'c1', date: '2026-08-26', service: 'Séjour Bristol + chauffeurs', amount: 9800, status: 'Payé', method: 'Carte' },
    { id: 'F-2026-087', clientId: 'c6', date: '2026-08-25', service: 'Vol privé Paris-Genève', amount: 12500, status: 'Payé', method: 'Virement' },
    { id: 'F-2026-086', clientId: 'c19', date: '2026-08-22', service: 'Vernissage galerie (organisation)', amount: 18000, status: 'Payé', method: 'Virement' },
    { id: 'F-2026-085', clientId: 'c16', date: '2026-08-20', service: 'Séjour George V + spa', amount: 8600, status: 'Payé', method: 'Carte' },
    { id: 'F-2026-084', clientId: 'c7', date: '2026-08-18', service: 'Déplacement Paris-Genève', amount: 4200, status: 'En retard', method: 'Virement' },
    { id: 'F-2026-083', clientId: 'c4', date: '2026-08-15', service: 'Week-end SO/Paris', amount: 3200, status: 'Payé', method: 'Carte' },
    { id: 'F-2026-082', clientId: 'c9', date: '2026-08-12', service: 'Week-end Brach + dîner Girafe', amount: 4500, status: 'Payé', method: 'Carte' },
    { id: 'F-2026-081', clientId: 'c2', date: '2026-08-10', service: 'Voyage d\'affaires Milan', amount: 8800, status: 'Payé', method: 'Virement' },
    { id: 'F-2026-080', clientId: 'c5', date: '2026-08-08', service: 'Séjour Majestic Cannes', amount: 12500, status: 'Payé', method: 'Virement' },
    { id: 'F-2026-079', clientId: 'c10', date: '2026-08-05', service: 'Séjour Ritz + déjeuners', amount: 28000, status: 'Payé', method: 'Virement' },
    { id: 'F-2026-078', clientId: 'c1', date: '2026-08-02', service: 'Spa Crillon + déjeuner', amount: 1200, status: 'Payé', method: 'Carte' },
    { id: 'F-2026-077', clientId: 'c13', date: '2026-07-30', service: 'Séjour InterContinental Marseille', amount: 4800, status: 'En retard', method: 'Virement' }
  ],

  activity: [
    { id: 'a1', time: 'Il y a 5 min', title: 'Nouvelle demande pour Claire Dubois', subtitle: 'Restaurant · 5 septembre · 20h00', icon: 'demand', accent: 'gold' },
    { id: 'a2', time: 'Il y a 18 min', title: 'Réservation confirmée — Hôtel de Crillon', subtitle: 'Suite · 3 nuits · Alice Boyer', icon: 'check', accent: 'success' },
    { id: 'a3', time: 'Il y a 32 min', title: 'Mission chauffeur assignée', subtitle: 'Mercedes Classe S · 4 septembre · 18h40', icon: 'car', accent: 'info' },
    { id: 'a4', time: 'Il y a 1 h', title: 'Paiement reçu — F-2026-091', subtitle: '87 500 € · Nicolas Fontaine · Virement', icon: 'payment', accent: 'success' },
    { id: 'a5', time: 'Il y a 2 h', title: 'Demande urgente — Cocktail galerie', subtitle: 'Alice Boyer · 20 septembre · 50 invités', icon: 'urgent', accent: 'danger' },
    { id: 'a6', time: 'Il y a 3 h', title: 'Nouveau client ajouté', subtitle: 'Sofia Martin · Cannes · Private', icon: 'client', accent: 'info' },
    { id: 'a7', time: 'Il y a 5 h', title: 'Demande marquée terminée', subtitle: 'Déjeuner Clamato · Thomas Morel', icon: 'check', accent: 'success' },
    { id: 'a8', time: 'Hier, 18h42', title: 'Facture émise — F-2026-091', subtitle: '87 500 € · Nicolas Fontaine', icon: 'invoice', accent: 'info' }
  ],

  notifications: [
    { id: 'n1', icon: 'demand', accent: 'gold', title: 'Nouvelle demande', message: 'Claire Dubois a soumis une demande de réservation restaurant.', time: 'Il y a 5 min', unread: true },
    { id: 'n2', icon: 'check', accent: 'success', title: 'Réservation confirmée', message: 'Hôtel de Crillon a confirmé la suite pour Alice Boyer.', time: 'Il y a 18 min', unread: true },
    { id: 'n3', icon: 'urgent', accent: 'danger', title: 'Demande urgente', message: 'Cocktail privé 50 invités — Alice Boyer — 20 sept.', time: 'Il y a 2 h', unread: true },
    { id: 'n4', icon: 'payment', accent: 'success', title: 'Paiement reçu', message: '87 500 € de Nicolas Fontaine (F-2026-091).', time: 'Il y a 1 h', unread: false },
    { id: 'n5', icon: 'client', accent: 'info', title: 'Nouveau client', message: 'Sofia Martin a été ajoutée au répertoire.', time: 'Il y a 3 h', unread: false }
  ],

  automations: [
    {
      id: 'auto1', name: 'Nouvelle demande', description: 'Assignation automatique selon la charge et notification concierge',
      trigger: { label: 'Déclencheur', title: 'Nouvelle demande', desc: 'Créée par un client ou l\'équipe' },
      steps: [
        { label: 'Action 1', title: 'Assignation auto', desc: 'Selon charge concierge', icon: 'assign' },
        { label: 'Action 2', title: 'Notification concierge', desc: 'Push + email', icon: 'bell' }
      ]
    },
    {
      id: 'auto2', name: 'Réservation confirmée', description: 'Ajout automatique au planning et notification client',
      trigger: { label: 'Déclencheur', title: 'Réservation', desc: 'Passe en statut Confirmée' },
      steps: [
        { label: 'Action 1', title: 'Ajout au planning', desc: 'Événement créé', icon: 'calendar' },
        { label: 'Action 2', title: 'Notification client', desc: 'SMS + email', icon: 'bell' }
      ]
    },
    {
      id: 'auto3', name: 'Demande urgente', description: 'Notification manager et création de tâche prioritaire',
      trigger: { label: 'Déclencheur', title: 'Priorité urgente', desc: 'Demande marquée Urgente' },
      steps: [
        { label: 'Action 1', title: 'Notification manager', desc: 'Push immédiat', icon: 'bell' },
        { label: 'Action 2', title: 'Création tâche', desc: 'Priorité haute', icon: 'task' }
      ]
    }
  ],

  monthlyRevenue: [
    { month: 'Avr', value: 142000 },
    { month: 'Mai', value: 168000 },
    { month: 'Juin', value: 155000 },
    { month: 'Juil', value: 198000 },
    { month: 'Août', value: 187000 },
    { month: 'Sep', value: 224000 }
  ],

  weeklyReservations: [
    { day: 'Lun', value: 12 },
    { day: 'Mar', value: 18 },
    { day: 'Mer', value: 15 },
    { day: 'Jeu', value: 22 },
    { day: 'Ven', value: 28 },
    { day: 'Sam', value: 24 },
    { day: 'Dim', value: 9 }
  ],

  demandsActivity: [
    { day: 'S1', value: 32 },
    { day: 'S2', value: 41 },
    { day: 'S3', value: 28 },
    { day: 'S4', value: 47 },
    { day: 'S5', value: 38 },
    { day: 'S6', value: 52 },
    { day: 'S7', value: 44 },
    { day: 'S8', value: 58 },
    { day: 'S9', value: 51 },
    { day: 'S10', value: 63 },
    { day: 'S11', value: 49 },
    { day: 'S12', value: 67 }
  ]
};

// Expose global
window.DEMO_DATA = DEMO_DATA;
