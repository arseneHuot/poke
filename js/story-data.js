// ============================================================
// POKEMON NOVARA - Story & Dialogue Data
// ============================================================

const DIALOGUES = {
    // === SIGNS ===
    sign_borgo: [
        { text: "Village de Borgo - Un petit village paisible au coeur de Novara." }
    ],
    sign_route1: [
        { text: "Route 1 - Vers Porto City au nord." }
    ],

    // === VILLAGERS ===
    villager_borgo1: [
        { name: "Habitant", text: "Bienvenue à Borgo ! Le Prof. Oliva vit dans le grand laboratoire là-bas." }
    ],
    porto_marin: [
        { name: "Marin", text: "Porto City est le plus grand port de Novara. Des bateaux partent vers des terres lointaines !" }
    ],
    mom_dialogue: [
        { name: "Maman", text: "Mon chéri ! Le Professeur Oliva te cherchait. Va le voir dans son laboratoire !" }
    ],
    mom_house_dialogue: [
        { name: "Maman", text: "N'oublie pas de soigner tes Pokémon au Centre Pokémon quand ils sont fatigués !" }
    ],
    lab_assistant: [
        { name: "Assistant", text: "Le professeur étudie les Pokémon de la région de Novara. Il y en a 150 espèces !" }
    ],

    // === PROFESSOR STORYLINE ===
    story_professor_intro: [
        { name: "Prof. Oliva", text: "Oh, te voilà ! Je suis le Professeur Oliva, spécialiste des Pokémon de Novara." },
        { name: "Prof. Oliva", text: "J'ai quelque chose d'important à te demander. Viens me voir dans mon laboratoire !" },
        { name: "Prof. Oliva", text: "Je t'y attendrai. C'est le grand bâtiment juste à côté !" },
    ],

    story_lab_starters: [
        { name: "Prof. Oliva", text: "Bienvenue dans mon laboratoire ! J'étudie les Pokémon de la région de Novara depuis 30 ans." },
        { name: "Prof. Oliva", text: "Aujourd'hui est un jour spécial. Je voudrais que tu m'aides à compléter le Pokédex de Novara !" },
        { name: "Prof. Oliva", text: "Pour cela, tu vas avoir besoin de ton propre Pokémon. J'en ai trois ici, choisis celui qui te plaît !" },
        { action: 'choose_starter' }
    ],

    story_after_starter: [
        { name: "Prof. Oliva", text: "Excellent choix ! Prends aussi ce Pokédex, il enregistrera toutes les espèces que tu rencontreras." },
        { name: "Prof. Oliva", text: "Et voici 5 Poké Balls pour commencer ta collection !" },
        { name: "Prof. Oliva", text: "La région de Novara est vaste. Il y a 8 Arènes où tu pourras prouver ta valeur." },
        { name: "Prof. Oliva", text: "Mais fais attention... On m'a signalé l'activité d'un groupe appelé 'Team Éclipse'." },
        { name: "Prof. Oliva", text: "Ils semblent chercher les Pokémon Légendaires de Novara. Sois prudent !" },
        { name: "Prof. Oliva", text: "Bonne chance dans ton aventure ! N'hésite pas à revenir me voir." },
    ],

    // === RIVAL ===
    story_rival_intro: [
        { name: "Kaël", text: "Salut ! Tu es le nouveau dresseur dont parle le Prof. Oliva ?" },
        { name: "Kaël", text: "Moi c'est Kaël ! Je vais devenir le meilleur dresseur de Novara !" },
        { name: "Kaël", text: "On se retrouvera sur la route. Prépare-toi à perdre ! Haha !" },
    ],

    story_rival_route7: [
        { name: "Kaël", text: "Te voilà enfin ! J'ai bien progressé depuis notre dernière rencontre." },
        { name: "Kaël", text: "J'ai 7 badges maintenant. Et toi ? On fait un combat pour voir ?" },
        { action: 'trainer_battle' }
    ],

    // === TEAM ECLIPSE ===
    story_eclipse_encounter: [
        { name: "Sbire Éclipse", text: "Hé toi ! Tu n'as rien à faire ici ! La Team Éclipse contrôle cette route !" },
        { name: "Sbire Éclipse", text: "Notre boss cherche les Pokémon Légendaires de Novara." },
        { name: "Sbire Éclipse", text: "Avec Solarkos et Lunarkos, nous contrôlerons le monde ! Mais d'abord, je vais t'éliminer !" },
        { action: 'trainer_battle' }
    ],

    story_eclipse_admin: [
        { name: "Admin Nox", text: "Tu es celui qui a mis en déroute nos sbires ? Impressionnant..." },
        { name: "Admin Nox", text: "Mais tu ne pourras pas arrêter la Team Éclipse. Notre plan est déjà en marche." },
        { name: "Admin Nox", text: "Nous réveillerons Solarkos et Lunarkos, et le monde sera plongé dans l'éclipse éternelle !" },
        { name: "Admin Nox", text: "Assez parlé. Voyons si tu peux me battre !" },
        { action: 'trainer_battle' }
    ],

    // === PORTO CITY VILLAGERS ===
    porto_pescatore: [
        { name: "Pêcheur", text: "Cette mer regorge de Pokémon aquatiques ! J'ai pêché un Pokémon rare l'autre jour." },
        { name: "Pêcheur", text: "Conseil de pro : les Pokémon Eau sont vulnérables à l'Électrik et au Plante. N'oublie pas ça !" }
    ],
    porto_vieux_marin: [
        { name: "Vieux marin", text: "Ça fait 40 ans que je navigue sur les mers de Novara. J'en ai vu des choses..." },
        { name: "Vieux marin", text: "Par temps de tempête, des Pokémon légendaires remontent des profondeurs, dit-on." }
    ],
    porto_enfant: [
        { name: "Enfant", text: "Tu as vu l'Arène ? Le Champion Marco est super fort ! Mais pas autant que moi dans 10 ans !" }
    ],
    porto_dame: [
        { name: "Dame", text: "Porto City est fière de son port. Des marchands du monde entier viennent ici." },
        { name: "Dame", text: "Si tu cherches des Pokémon rares, explore bien les herbes hautes des routes voisines !" }
    ],

    // === CAMPOVERDE VILLAGERS ===
    campo_botaniste: [
        { name: "Botaniste", text: "Campoverde est célèbre pour ses jardins. Chaque fleur ici attire des Pokémon Plante." },
        { name: "Botaniste", text: "La Championne Flora a appris la botanique avant même le dressage. C'est une légende ici !" }
    ],
    campo_enfant: [
        { name: "Fillette", text: "J'ai un ami Pokémon dans la forêt ! Un tout petit, avec des feuilles vertes sur la tête." }
    ],
    campo_herboriste: [
        { name: "Herboriste", text: "Ces herbes sont utilisées pour soigner les Pokémon naturellement. La nature offre tout ce qu'il faut." }
    ],
    campo_vieux: [
        { name: "Ancien", text: "Dans ma jeunesse, la forêt derrière Campoverde était encore plus dense. Des Pokémon mystérieux y vivaient." },
        { name: "Ancien", text: "Si tu trouves un Pokémon de type Feu, méfie-toi de Flora. L'eau et la Plante ne font pas bon ménage avec le Feu !" }
    ],

    // === RIVALTA VILLAGERS ===
    rivalta_chercheur: [
        { name: "Chercheur", text: "J'étudie les propriétés électriques des Pokémon de type Électrik. Fascinant !" },
        { name: "Chercheur", text: "Saviez-vous que les attaques Électrik ne touchent pas les Pokémon Sol ? C'est de la physique pure !" }
    ],
    rivalta_nageur: [
        { name: "Nageur", text: "J'entraîne mes Pokémon Eau dans le lac de Rivalta chaque matin. L'eau froide les rend plus forts !" }
    ],
    rivalta_ingenieur: [
        { name: "Ingénieur", text: "La centrale électrique au nord de Rivalta alimente toute la région. C'est les Pokémon Électrik qui la font tourner !" }
    ],
    rivalta_ancienne: [
        { name: "Vieille dame", text: "Deux arènes dans une seule ville ! C'est unique dans toute Novara. Rivalta est vraiment spéciale." }
    ],

    // === ROUTE SIGNS ===
    sign_route2: [
        { text: "Route 2 - Vers Campoverde à l'ouest. Attention : grotte dangereuse !" }
    ],
    sign_route3: [
        { text: "Route 3 - Chemin vers Rivalta. Des membres de la Team Éclipse ont été signalés dans la zone." }
    ],
    sign_route4: [
        { text: "Route 4 - Désert aride. Emportez des Potions et des Répulsifs pour le voyage." }
    ],
    sign_campoverde: [
        { text: "Campoverde - La Ville Fleurie de Novara. Population : 832 habitants." }
    ],
    sign_rivalta: [
        { text: "Rivalta - Ville des Deux Arènes. Maîtrisez l'eau et l'électricité pour progresser !" }
    ],

    // === NURSE & MERCHANT ===
    nurse_heal: [
        { name: "Infirmière", text: "Bienvenue au Centre Pokémon ! Je vais soigner vos Pokémon." },
        { action: 'heal_pokemon' },
        { name: "Infirmière", text: "Vos Pokémon sont en pleine forme ! Bonne continuation !" }
    ],

    merchant_shop: [
        { name: "Vendeur", text: "Bienvenue ! Que puis-je faire pour vous ?" },
        { action: 'open_shop' }
    ],

    // === TRAINER BATTLES ===
    trainer_battle: [
        { action: 'trainer_battle' }
    ],

    // === GYM LEADERS ===
    gym1_dialogue: [
        { name: "Champion Marco", text: "Bienvenue dans l'Arène de Porto City ! Je suis Marco, expert du type Normal." },
        { name: "Champion Marco", text: "Les Pokémon de type Normal sont sous-estimés, mais leur polyvalence est redoutable !" },
        { name: "Champion Marco", text: "Voyons ce que tu vaux, jeune dresseur !" },
        { action: 'trainer_battle' }
    ],
    gym2_dialogue: [
        { name: "Championne Flora", text: "Bienvenue à Campoverde ! Ici, la nature règne en maître." },
        { name: "Championne Flora", text: "Mes Pokémon Plante sont en harmonie avec la forêt. Peux-tu les surpasser ?" },
        { action: 'trainer_battle' }
    ],
    gym3_dialogue: [
        { name: "Champion Ondine", text: "Bienvenue dans l'arène aquatique de Rivalta !" },
        { name: "Champion Ondine", text: "L'eau est aussi douce que destructrice. Es-tu prêt à affronter la tempête ?" },
        { action: 'trainer_battle' }
    ],
    gym4_dialogue: [
        { name: "Champion Voltaire", text: "L'électricité... la force de la nature la plus pure !" },
        { name: "Champion Voltaire", text: "Mes Pokémon Électrik vont t'électriser ! Prépare-toi !" },
        { action: 'trainer_battle' }
    ],
    gym5_dialogue: [
        { name: "Champion Blaze", text: "Le feu est ma passion ! Chaque flamme raconte une histoire." },
        { name: "Champion Blaze", text: "Voyons si tu peux résister à la chaleur de Volcania !" },
        { action: 'trainer_battle' }
    ],
    gym6_dialogue: [
        { name: "Champion Terra", text: "La terre est la fondation de tout. Solide, immuable, puissante." },
        { name: "Champion Terra", text: "Mes Pokémon Sol vont ébranler tes certitudes !" },
        { action: 'trainer_battle' }
    ],
    gym7_dialogue: [
        { name: "Championne Crysta", text: "Le froid de Glacia forge les plus forts. Bienvenue dans mon arène de glace." },
        { name: "Championne Crysta", text: "Seuls les dresseurs les plus résistants peuvent gagner ici !" },
        { action: 'trainer_battle' }
    ],
    gym8_dialogue: [
        { name: "Champion Drake", text: "Tu as réussi à arriver jusqu'ici... Impressionnant." },
        { name: "Champion Drake", text: "Je suis Drake, maître des Dragons. Le dernier badge ne sera pas facile à obtenir !" },
        { name: "Champion Drake", text: "Les Dragons sont les Pokémon les plus puissants. Es-tu prêt ?!" },
        { action: 'trainer_battle' }
    ],

    // === ELITE FOUR ===
    elite1_dialogue: [
        { name: "Umbra", text: "Je suis Umbra, premier du Conseil des 4. Les ténèbres et les spectres sont mes alliés." },
        { name: "Umbra", text: "Dans l'obscurité, seuls les plus forts survivent !" },
        { action: 'trainer_battle' }
    ],
    elite2_dialogue: [
        { name: "Aquaria", text: "Les océans de Novara m'ont donné leur pouvoir. Je suis Aquaria." },
        { name: "Aquaria", text: "Mes vagues engloutiront tes espoirs de victoire !" },
        { action: 'trainer_battle' }
    ],
    elite3_dialogue: [
        { name: "Pyrus", text: "Le feu est purification ! Je suis Pyrus, et mes flammes sont inextinguibles !" },
        { action: 'trainer_battle' }
    ],
    elite4_dialogue: [
        { name: "Drakon", text: "Les Dragons... Les maîtres absolus de Novara." },
        { name: "Drakon", text: "Je suis le dernier obstacle avant le Champion. Montre-moi ta force !" },
        { action: 'trainer_battle' }
    ],

    // === CHAMPION ===
    champion_dialogue: [
        { name: "Maître Aurion", text: "Bienvenue, challenger. Tu as vaincu le Conseil des 4..." },
        { name: "Maître Aurion", text: "Je suis Aurion, Maître de la Ligue Pokémon de Novara." },
        { name: "Maître Aurion", text: "Depuis des années, personne n'a pu me vaincre. Seras-tu le premier ?" },
        { name: "Maître Aurion", text: "Que le combat commence !" },
        { action: 'trainer_battle' }
    ],

    champion_defeated: [
        { name: "Maître Aurion", text: "... Incroyable. Tu as réussi." },
        { name: "Maître Aurion", text: "Tu es le nouveau Champion de la Ligue Pokémon de Novara !" },
        { name: "Maître Aurion", text: "Félicitations ! Ton nom restera gravé dans l'histoire de Novara !" },
        { name: "", text: "🎊 FÉLICITATIONS ! Vous êtes le nouveau Champion de Novara ! 🎊" },
        { name: "", text: "Merci d'avoir joué à Pokémon Novara ! L'aventure continue - explorez le monde pour compléter votre Pokédex !" },
    ],

    // === GYM VICTORY ===
    gym_victory: [
        { text: "Vous avez obtenu le Badge !" },
        { text: "Les Pokémon jusqu'au niveau suivant vous obéiront désormais." },
    ],
};

// Story flags system
const STORY_FLAGS_INIT = {
    met_professor: false,
    met_rival: false,
    has_starter: false,
    choose_starter: false,
    badge_0: false,
    badge_1: false,
    badge_2: false,
    badge_3: false,
    badge_4: false,
    badge_5: false,
    badge_6: false,
    badge_7: false,
    defeated_eclipse_grunt: false,
    defeated_eclipse_admin: false,
    defeated_elite1: false,
    defeated_elite2: false,
    defeated_elite3: false,
    defeated_elite4: false,
    defeated_champion: false,
    is_champion: false,
};
