import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main () {
    // const user = await prisma.user.create({
    //     data: {
    //         name: "Shodlik Shomuratov",
    //         email: "shodlikcoder@gmail.com"
    //     }
    // })

    // const users = await prisma.user.findMany();


    // const user = await prisma.user.create({
    //     data: {
    //         name: "Bekzod Ismoilov",
    //         email: "bekzodismailov@gmail.com",
    //         posts: {
    //             create: {
    //                 title: "This is my first relational table on prisma :)",
    //                 content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //                 published: true
    //             }
    //         }
    //     }
    // })

    const users = await prisma.user.findMany({
        include: {
            _count: true,
            posts: true
        }
    })

    console.log(users);
}


main()
.then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1)
})