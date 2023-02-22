# DWACN (DiscordBot without a cool name)

This library is a small library that adds some extra fun to your Discord server. The bot adds more commands for minigames, memes and currency (a full list of features and command coming soon™).

The bot is written using `TypeScript` and the `Discord.JS` library.

## Requirements

-   An editor with TypeScript support ([Visual Studio Code](https://code.visualstudio.com/)) is recommended.
-   [Yarn](https://classic.yarnpkg.com/en/docs/install/)
-   [Node](https://nodejs.org/en/download/) (preferably V10)

## Getting started

1. Open the project and install all dependencies using: `yarn`
2. Copy the `.env-example` file in the root of the project and rename it to `.env`. Fill the requested data.

-   **_DISCORD_API_KEY_**: This is the token that gives access the Discord API. You can fill it if you already have one, or [request one using this guide]().

3. The project is using a SQL database to store data. [Knex.js](http://knexjs.org/) is used as a query builder library. First, make sure you have an empty database ready. Open the `.env` file that you've created in step 2. Add the following keys:

-   **_DATABASE_HOST_**: This is the host of the database (for example: `127.0.0.1`)
-   **_DATABASE_PORT_**: This is the port of the database. This defaults to `3306`.
-   **_DATABASE_USER_**: This is the user that has access to the database.
-   **_DATABASE_PASSWORD_**: This is the password of the user that has access.
-   **_DATABASE_NAME_**: This is the name of the database you want to connect to.

We use database migrations to make maintaining the database as easy as possible. Run `yarn migrate` to run all migrations. This creates the database with all it's tables. New migrations can be added with the commands: `npx knex migrate:make MIGRATION_NAME -x ts --knexfile ./src/database/knexFile.ts`. Make sure that the migration name is descriptive of what it does. A good example is: `create_currency_table` or `add_id_currency_table`. A bad example is `currency_table` or `edit_currency_table`.

4. Run `yarn dev` to start a development server. the terminal logs: `Logged in as NAME_OF_YOUR_BOT!` and you see that your bot is online in your server (can take a minute). You can also choose to make a production build using `yarn build`. The production build will be available in the `./build` folder.

## Dialogflow (optional)

We use Dialogflow to add natural language support to commands. This means users are able to write complete sentences to execute a command. This provides us with multiple benefits such as:

-   Multiple inputs for commands (example: `!Can you show me the weather` or `!What's the weather today`)
-   Multiple responses for commands.
-   Variable parameter detection (example: `today` in `!What's the weather today` or `tomorrow` and `London` in `!What temperature will it be tomorrow in London?`.

Dialogflow will be used when you provide a `DIALOGFLOW_PROJECT_ID` inside the `.env` file. To setup dialogflow follow the steps below.

### Setup Dialogflow

1.  [Select or create a Cloud Platform project](https://console.cloud.google.com/project).
2.  [Enable the Dialogflow API](https://console.cloud.google.com/flows/enableapi?apiid=dialogflow.googleapis.com).
3.  Go to the [Dialogflow console](https://dialogflow.cloud.google.com/) and create a new agent and select the previously created Cloud Platform project.
4.  Import the provided intents by going to your agent's settings and navigate to `Export and import`. Choose `import from zip` and upload the provided zipfile in `assets`.
5.  [Set up authentication with a service account](https://cloud.google.com/docs/authentication/getting-started) so you can access the API from your local workstation (as role choose `Dialogflow API Admin`). To not commit the json file please rename this file to `GoogleCloudAccess.json`.
6.  Add your `Project ID` to the `.env` file (after `DIALOGFLOW_PROJECT_ID`).

### Be aware (Windows)

-   Your environment variable will reset after a reboot of your device if you set them through a terminal. This means you have to re-add the environment variable after every reboot of your device [Setting the environment variable](https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable)
-   I would recommend you set it manually through the environment variables window available in Windows.

## Pull requests

Pull requests are required to add a new feature or bug fix to the bot. The project is using `Eslint` and `Prettier` to enforce a codestyle and these tests are required to merge to the `master` branch.
