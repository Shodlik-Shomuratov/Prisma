# Prisma Quickstart

In this Quickstart guide, you'll learn how to get started with Prisma from scratch using a plain TypeScript project and a local SQLite database file. It covers data modeling, migrations and querying a database.



## Prerequisites
- Node.js v16.13.0 or higher



## 1. Create TypeScript project and set up Prisma

As a first step, create a project directory and navigate into it:
```
mkdir prisma-quickstart
cd prisma-quickstart
```
Next, initialize a TypeScript project using npm:
```
npm init -y 
npm install typescript ts-node @types/node --save-dev
```
Now, initialize TypeScript:
```
npx tsc --init
```
Then, install the Prisma CLI as a development dependency in the project:
```
npm install prisma --save-dev
```
Finally, set up Prisma with the init command of the Prisma CLI:
```
npx prisma init --datasource-provider sqlite
```
This creates a new prisma directory with your Prisma schema file and configures SQLite as your database. You're now ready to model your data and create your database with some tables.



## 2. Model your data in the Prisma schema

The Prisma schema provides an intuitive way to model data. Add the following models to your `schema.prisma` file:
> prisma/schema.prisma
```
model User {
  id          Int       @id       @default(autoincrement())
  email       String    @unique   
  name        String?
  posts       Post[]
}


model Post {
  id          Int       @id       @default(autoincrement())
  title       String
  content     String?
  published   Boolean   @default(false)
  author      User      @relation(fields: [authorId], references: [id])
  authorId    Int
}
```



## 3. Run a migration to create your database tables with Prisma Migrate

At this point, you have a Prisma schema but no database yet. Run the following command in your terminal to create the SQLite database and the `User` and `Post` tables represented by your models:
```
npx prisma migrate dev --name init
```

This command did two things:

 - It creates a new SQL migration file for this migration in the `prisma/migrations` directory.
 - It runs the SQL migration file against the database.

Because the SQLite database file didn't exist before, the command also created it inside the `prisma` directory with the name `dev.db` as defined via the environment variable in the `.env` file.



## 4. Explore how to send queries to your database with Prisma Client
To send queries to the database, you will need a TypeScript file to execute your Prisma Client queries. Create a new file called `script.ts` for this purpose:
```
touch script.ts
```

Then, paste the following boilerplate into it:
```
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
.then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})
```



### 4.1. Create a new `User` record

Let's start with a small query to create a new `User` record in the database and log the resulting object to the console. Add the following code to inside the `main` function in your `script.ts` file:
```
    const user = await prisma.user.create({
        data: {
            name: 'Shodlik',
            email: 'shodlik@gmail.com',
        },
    })

    console.log(user)
```

Instead of copying the code, you can type it out in your editor to experience the autocompletion Prisma Client provides. You can also actively invoke the autocompletion by pressing the `CTRL` + `SPACE` keys on your keyboard.

Next, execute the script with the following command:
```
npx ts-node script.ts
```

Result: 
```
{ id: 1, email: 'shodlik@gmail.com', name: 'Shodlik' }
```



### 4.2. Retrieve all `User` records

Prisma Client offers various queries to read data from your database. In this section, you'll use the `findMany` query that returns all the records in the database for a given model.

Delete the previous Prisma Client query and add the new `findMany` query instead:
```
const users = await prisma.user.findMany()

console.log(users)
```

Execute the script again:
```
npx ts-node script.ts
```

Result:
```
[{ id: 1, email: 'shodlik@gmail.com', name: 'Shodlik' }]
```



### 4.3. Explore relation queries with Prisma

One of the main features of Prisma Client is the ease of working with [relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations). In this section, you'll learn how to create a `User` and a `Post` record in a nested write query. Afterwards, you'll see how you can retrieve the relation from the database using the `include` option.

First, adjust your script to include the nested query:
> script.ts
```
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@prisma.io',
      posts: {
        create: {
          title: 'Hello World',
        },
      },
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

Run the query by executing the script again:
```
{ id: 2, email: 'bob@prisma.io', name: 'Bob' }
```
