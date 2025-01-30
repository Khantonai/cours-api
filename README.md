```bash
$ npm i

```

Créer un .env en remplissant les champs manquant par les donnés de votre BDD

```bash
$ npm run migration:run

$ npm run start:dev
```

## Liste des endpoints

Pour créer un compte
/auth/register
Attendu :
{
    "firstName": "",
    "lastName": "",
    "email": "",
    "password": ""
}

Pour se connecter à son compte
/auth/login
Attendu :
{
    "email": "",
    "password": ""
}

Pour se mettre en admin, changer la colonne 'isAdmin' dans la table 'users' directement dans la BDD



Pour certifier une image
POST /images/upload
Attendu :
une image au format PNG ou JPG dans le form-body de la requête, avec comme clé 'file'

Pour vérifier l'auteur d'une image
POST /images/verify
Attendu :
une image au format PNG ou JPG dans le form-body de la requête, avec comme clé 'file'

Pour voir ses images
GET /images


Pour obtenir la liste des utilisateurs
GET /users

Pour obtenir un utilisateur
GET /users/{id}

Pour supprimer un utilisateur
DELETE  /users/{id}




