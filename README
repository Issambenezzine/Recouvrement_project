

## 📂 Structure du projet



├── client/ # Frontend React 

├── server/ # Backend Express + configuration Redis

└── .gitignore


---

## 🚀 Mise en route

### 1. Cloner le dépôt
```bash
git clone https://github.com/Issambenezzine/Recouvrement_project.git
cd votre-repo
```
### 2. Backend (Express + Redis)
Installer les dépendances
```bash
cd server
npm install
npm i multer 
```

Lancer Redis avec Docker,
Dans le dossier server/ il y a un fichier docker-compose.yml.
Pour démarrer Redis, exécutez :

```bash
docker-compose up -d
```

Cela va lancer (ou bien installer si vous n'avez pas déjà installé les images) deux conteneur Redis en arrière-plan: **redis** et **redis/insight**

Démarrer le serveur Express
```bash
npm run dev
```

### 3. Frontend (React)
Installer les dépendances
```bash
cd client
npm install
```

Lancer l’application React
```bash
npm run dev
```

⚙️ Variables d’environnement

Créez un fichier .env dans server/ et client/ si nécessaire. Exemple :

server/.env

```bash
PORT=your_port
HOST=your_host
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
JWT_SECRET_KEY=your_jwt_secret_key
DB_NAME=database_name
DB_USER=database_user
CLIENT_URL=client_url
CLIENT_PORT=client_port
CLIENT_HOST=client_host
DB_PASS=database_password
DB_DIALECT=mysql
```

client/.env
```bash
VITE_SERVER_PORT=your_client_port
VITE_SERVER_HOST=your_server_host
```

### 📝 Notes

Assurez-vous que Docker est installé et lancé avant d’exécuter docker-compose up -d.

Si vous modifiez la configuration de Redis (host/port), mettez à jour le fichier .env dans le projet server.

Si vous modifiez dans SGBD, supprimer le cache dans redis/insight

