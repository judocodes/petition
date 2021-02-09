### What is this?

When first learning to work with NodeJS and SQL, we created this Petition project in the Spiced Academy.
You can sign up as a user and insert your signature on a HTML Canvas Element. The user data and signature can be changed or even deleted. The app stores this in a SQL database. For rendering DOM Elements, it uses Handlebars with Express.

The petition theme is just nonsense, but it seemed fun to me. Feel free to leave a signature if you support the cause!

### Tech Stack

The petition uses:
- Handlebars for templating engine
- Postgres to store user data and signatures
- Heroku to host the application (Note: Heroku uses „Dynamos“, they freeze if they haven’t been accessed in some time, so it might take a while to load the site).
- Tailwindcss for styling
- NodeJS & Express for serving the app and connecting to the DB
