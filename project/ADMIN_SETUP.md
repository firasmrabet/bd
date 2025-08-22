# Configuration du Système d'Administration

## 🚀 Guide de Configuration

### Étape 1: Configuration de la Base de Données

1. **Accédez à votre tableau de bord Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Connectez-vous à votre projet

2. **Exécutez le script de migration**
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Créez une nouvelle requête
   - Copiez tout le contenu du fichier `supabase-migrations.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur "Run" pour exécuter le script

3. **Vérifiez la création des tables**
   - Allez dans "Table Editor"
   - Vous devriez voir les tables `custom_categories` et `custom_products`

### Étape 2: Accès à l'Administration

1. **Connectez-vous avec le compte admin**
   - Email: `firassmrabett111@gmail.com`
   - Mot de passe: (votre mot de passe Supabase)

2. **Accédez à la page d'administration**
   - Un bouton "Admin" apparaîtra dans le header
   - Cliquez dessus pour accéder à l'interface d'administration

## 📋 Fonctionnalités Disponibles

### Gestion des Catégories
- ✅ Créer de nouvelles catégories
- ✅ Modifier les catégories existantes
- ✅ Supprimer des catégories
- ✅ Définir des caractéristiques spécifiques par catégorie
- ✅ Ajouter des images via URL

### Gestion des Produits
- ✅ Créer de nouveaux produits
- ✅ Modifier les produits existants
- ✅ Supprimer des produits
- ✅ Associer des produits à des catégories
- ✅ Définir prix, descriptions, images
- ✅ Gérer les caractéristiques selon la catégorie
- ✅ Gérer le statut de stock

### Intégration Automatique
- ✅ Les nouvelles catégories apparaissent automatiquement dans la navbar
- ✅ Les nouveaux produits s'affichent dans les cartes de la page principale
- ✅ Fusion automatique avec les données statiques existantes

## 🔧 Structure des Données

### Table `custom_categories`
```sql
- id (UUID, Primary Key)
- name (VARCHAR, Nom de la catégorie)
- description (TEXT, Description)
- image (TEXT, URL de l'image)
- characteristics (JSONB, Liste des caractéristiques)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Table `custom_products`
```sql
- id (UUID, Primary Key)
- name (VARCHAR, Nom du produit)
- description (TEXT, Description)
- price (DECIMAL, Prix en TND)
- image (TEXT, URL de l'image)
- category_id (UUID, Référence vers custom_categories)
- characteristics (JSONB, Valeurs des caractéristiques)
- variations (JSONB, Variations du produit)
- in_stock (BOOLEAN, Statut du stock)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔒 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Lecture publique** : Tous les utilisateurs peuvent voir les catégories et produits
- **Écriture admin uniquement** : Seul l'admin peut créer/modifier/supprimer
-- **Authentification** : Basée sur l'email `firassmrabett111@gmail.com`

## 🎯 Utilisation

### Créer une Catégorie
1. Allez dans l'onglet "Gestion des Catégories"
2. Cliquez sur "Ajouter une catégorie"
3. Remplissez le formulaire :
   - **Nom** : Ex: "Transformateurs Haute Tension"
   - **Description** : Description de la catégorie
   - **URL Image** : Lien vers une image (Google Images, etc.)
   - **Caractéristiques** : Ex: "Puissance", "Tension", "Fréquence"
4. Cliquez sur "Enregistrer"

### Créer un Produit
1. Créez d'abord au moins une catégorie
2. Allez dans l'onglet "Gestion des Produits"
3. Cliquez sur "Ajouter un produit"
4. Remplissez le formulaire :
   - **Nom** : Ex: "Transformateur 100kVA"
   - **Prix** : Prix en TND
   - **Description** : Description du produit
   - **Catégorie** : Sélectionnez une catégorie
   - **URL Image** : Lien vers une image
   - **Caractéristiques** : Remplissez selon la catégorie
   - **Stock** : Cochez si en stock
5. Cliquez sur "Enregistrer"

## 🔄 Mise à Jour Automatique

Le système se met à jour automatiquement :
- Les nouvelles catégories apparaissent dans le menu de navigation
- Les nouveaux produits s'affichent sur la page principale
- Les données sont fusionnées avec les produits statiques existants
- Pas besoin de redémarrer l'application

## 🆘 Dépannage

### Problème : "Tables non trouvées"
- Vérifiez que le script SQL a été exécuté correctement
- Vérifiez les permissions dans Supabase
- Rechargez la page d'administration

### Problème : "Accès refusé"
- Vérifiez que vous êtes connecté avec `firassmrabett111@gmail.com`
- Vérifiez les politiques RLS dans Supabase

### Problème : "Images ne s'affichent pas"
- Vérifiez que les URLs d'images sont valides et accessibles
- Utilisez des liens directs vers les images (pas de pages web)

## 📞 Support

Pour toute question ou problème, vérifiez :
1. La console du navigateur pour les erreurs
2. Les logs Supabase dans le tableau de bord
3. Que toutes les étapes de configuration ont été suivies
