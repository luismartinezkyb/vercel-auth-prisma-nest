# Auth Application template using Prisma + Nesjts + JWT 

Before installing the dependencies you'll need to set your environment variables like this in the `.env` file

```
DATABASE_URL=""
PORT_APP=3000
JWT_SECRET=''
JWT_EXPIRES_IN=''
```

After creating the .env file you'll have to run this commands 


```bash

$ npm install
$ npx prisma generate
$ npx prisma migrate dev

```

Then you're ready to see your Nestjs + Prisma + JWT Auth + Passport Strategy Application run and all set!
