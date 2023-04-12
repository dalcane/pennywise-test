ASENNUS:

ESIVALMISTELUT:

-MariaDB 10.11 asennettuna koneelle
-SQL-hallintaohjelma (esim. HeidiSQL) asennettuna koneelle
-Node.js asennettuna koneelle
-NPM toimii

VAIHEET:

1. Kloonaa tämä repositio koneelle, tee npm install sekä budgeting appissa että root folderissa.

2. Luo .env -tiedosto näillä tiedoilla (esimerkki):

LOCALPORT='3001'
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=budgetdatabase

3. Luo tietokanta esim. HeidiSQL:ssä mukana tulevalla create database -skriptillä

4. Täydennä database Fill Database -tiedoston skriptillä


