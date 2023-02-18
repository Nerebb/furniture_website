import { PrismaClient } from "@prisma/client";
import { Gender, IUser, Role } from "@types";

const prisma = new PrismaClient();

// const admin: IUser = {
//     id: 0,
//     name: "admin",
//     password: "admin123",
//     address: "admin",
//     nickName: "Nereb",
//     email: "admin@gmail.com",
//     gender: Gender.others,
//     phoneNumber: 1234567,
//     role: Role.admin,
// }

/**
 * @Method :post
 * @description: generate base DB - all previous data deleted
 */

async function main() {
    //cleaning data
    await prisma.user.deleteMany()
    await prisma.userProfile.deleteMany()

    //admin
    await prisma.user.create({
        data: {
            //BUGS : Cannot create with id:0
            name: "admin",
            email: "admin@gmail.com",
            gender: "others",
            nickName: "Nereb",
            password: "admin123",
            phoneNumber: 1234567,
        }
    })

    //generateUser
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

