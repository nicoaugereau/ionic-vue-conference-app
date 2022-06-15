#language: fr
Fonctionnalité: Tester l'application en version mobile

    Contexte: Configuration environnement
        Soit je teste sur l'environnement local
        Et le navigateur est paramétré pour "iphone-11"
        Et j'ouvre l'application "Conférences"
        Alors je suis sur l'onglet "Conférences"

    Scénario: Rechercher un évenement 
        Quand je recherche la conférence "The evolution of Ionicons"
        Alors la conférence est affichée dans le résultat de recherches
        Quand je clique sur la conférence
        Alors le détail de la conférence est affiché
    
    Scénario: Rechercher un conférencier
        Quand je clique sur l'onglet Conférenciers
        Et je clique sur le conférencier "Burt Bear"
        Alors le profil du conférencier est affiché