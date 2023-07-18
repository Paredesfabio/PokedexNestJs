<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Local environment

1. Clone the project

2. Run
```
  npm install
```

3. Install NestJS CLI

4. Create BD
```
  docker-compose up -d
```

5. Clone the file __.env.template__ and rename to __.env__

6. Populate the environment variables defined in ```.env```

7. Run applicatio in dev environment:
```
  npm run start:dev
```

8. Rebuild the BD with seed
```
http://localhost:3000/api/v2/seed
```

## Stack
  * MongoDB
  * Nest

# Production Build

1. Create the file ```env.prod```

2. Populate prod environment variables

3. Create new image
```
  docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# Notes
Heroku redeploy without changes:
```
  git commit --allow-empty -m "Trigger Heroku"
  git push heroku <master|main>
```