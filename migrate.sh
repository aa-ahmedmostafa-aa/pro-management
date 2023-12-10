#!/bin/bash

# The `source` command is used to read and execute the contents of a file in the current shell environment.
source .env.local

# Remove initial migration from migrations folder
rm -f src/config/db/migrations/*.ts

# Use the `uname` command to get the name of the operating system and store it in the `os` variable
os=$(uname -s)

# Check a operating system
if [ "$os" = "Linux" ]; then

    # Delete the database on postgres
    PGPASSWORD=$DB_PASSWORD dropdb -U postgres --if-exists -h localhost -f $DB_INSTANCE

    # Create a new database with the same name
    PGPASSWORD=$DB_PASSWORD createdb -U postgres -h localhost $DB_INSTANCE
else
    postgres_version=$(ls "C:\Program Files\PostgreSQL")

    # Delete the database on postgres
    PGPASSWORD=$DB_PASSWORD "C:\Program Files\PostgreSQL\\${postgres_version}\bin\dropdb.exe" -U postgres --if-exists -f $DB_INSTANCE

    # Create a new database with the same name
    PGPASSWORD=$DB_PASSWORD "C:\Program Files\PostgreSQL\\${postgres_version}\bin\createdb.exe" -U postgres $DB_INSTANCE
fi

# Run the npm command to generate a new migration
npm run migration:generate --name="initial-migration"

# Run the npm command to run a new migration
npm run migration:run

echo "Successful command"
