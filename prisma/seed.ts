import { PrismaClient } from "@prisma/client";
import { Gender, IUser, Role } from "@types";

const prisma = new PrismaClient();

/**
 * @Method :post
 * @description: generate base DB - all previous data deleted
 */

async function main() {
    // //cleaning data
    // await prisma.user.deleteMany()
    // await prisma.account.deleteMany()

    //admin
    const admin = {
        loginId: 'admin',
        password: 'admin'
    }
    await prisma.user.findFirstOrThrow({
        where: {
            ...admin
        }
    })

    await prisma.user.create({
        data: {
            ...admin
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

