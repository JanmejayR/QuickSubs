# Installation and Setup 

use this command install the required packages in root folder
```
npm install
```
then navigate to the frontend folder and install the required packages
```
cd frontend
npm install
```

### If you don't have a hosted database and have Postgress locally, then Create a Database in PostgreSQL , you can use this command to setup the table schema 
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);
```

## Setup the ENV File
Create a .env file in root directory, after setting up the database and creating the table, get the required credentials and use them in the commented code in /backend/database/db.js if your database is not hosted.
If your database is hosted then you just need the database url, copy it and paste it in DATABASE_URL

Open Git bash terminal and use this command to generate a secure string for JWT_SECRET variable, alternatively, you can use any random string
```
 openssl rand -base64 32
```

## Get the API keys
you will need to signup to a free account of assembly AI, copy the api key and put it into env, do the same for signing up to DeepL's website as well and get the api key , store it into env.


### Once env is setup, use this command to get the app running
```
npm run start
```
