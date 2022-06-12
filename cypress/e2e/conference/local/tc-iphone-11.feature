Feature: Tester l'application en version mobile

    Background: Configuration environnement
        Given je teste sur l'environnement local
        And le navigateur est paramétré pour "iphone-11"
        And j'ouvre l'application "Conférences"
        Then je suis sur l'onglet "Conférences"

    Scenario: Rechercher un évenement        
        When je recherche la conférence "The evolution of Ionicons"
        Then la conférence est affichée dans le résultat de recherches
        When je clique sur la conférence
        Then le détail de la conférence est affiché

    Scenario: Rechercher un conférencier
        When je clique sur l'onglet Conférenciers
        And je clique sur le conférencier "Burt Bear"
        Then le profil du conférencier est affiché