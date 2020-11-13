# TeamChallenge
A team leaderboard for Strava athletes working together towards charitable goals

Currently in early testing at https://teamchallenge.herokuapp.com

INSTALLATION

1. Postgres setup

You will need to install Postgres DB, using Homebrew or whatever. Also install a tool to access the database content such as pgAdmin.

There is a SQL script to create a database called "teamchallenge" and initialise it with some basic data.

pgsql teamchallenge.sql

Use pgAdmin to check that the database is configured with tables in the "teamchallenge" schema.

2. Strava app

Set up your strava app at https://www.strava.com/settings/api and make a note of the client ID and secret, which you will need to set in environment vars (see below).

Once you deploy into production you will need to set the "Authorization callback domain" to your production domain so that the app can receive webhooks.

3. AWS S3 Bucket

The app stores images on AWS S3. You can register a free account and create an S3 bucket, which should have public access enabled. Create an access token for your account, and make a note of the access key and secret key. You will need to set these as environment vars (see below).

4. Environment vars

The following environment vars should be set for the app to run properly:

DATABASE_URL - database connection URL, e.g. "postgres://user/pass@host:port/database"

STRAVA_CLIENT_ID - your Strava app client ID
STRAVA_CLIENT_SECRET - your Strava app secret ID
OWNER_ID - your strava athlete ID, so you can sign in as an admin
VERIFY_TOKEN - a hard-to-guess string used to authenticate for webhooks

S3_BUCKET - name of your image store bucket
AWS_ACCESS_KEY_ID - AWS access key for your S3 account
AWS_SECRET_ACCESS_KEY - AWS secret key for your S3 account

EVENT_ID - the default event (configured in the database)
SESSION_SECRET - a hard-to-guess string used to secure session cookies

5. Local setup

Use 'npm install' to fetch all required NPM dependencies

Run the server locally with

./bin/www [environment vars]

Access it at:

localhost:3000/


