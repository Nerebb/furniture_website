import { Category, Color, Gender, MediaGallery, Prisma, PrismaClient, Product, ProductRating, OrderItem, Role, Room, User, Order, Status } from "@prisma/client";
import { hash } from "bcrypt";
import { GetColorName } from "hex-color-to-color-name";
import prismaClient from "../src/libs/prismaClient";
import { generateString } from "../src/libs/utils/generateString";
import { uuidv4 } from "../src/libs/utils/uuidv4";

const prisma = new PrismaClient();

/**
 * @Method :post
 * @description: generate base DB - all previous data deleted
 */

async function main() {
    // cleaning data
    await prisma.category.deleteMany()
    await prisma.room.deleteMany()
    await prisma.color.deleteMany()
    await prisma.mediaGallery.deleteMany()
    await prisma.wishlist.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.productRating.deleteMany()
    await prisma.product.deleteMany()
    await prisma.user.deleteMany()
    await prisma.account.deleteMany()

    //Functional
    function randomNum(maxLength?: number, noZero?: boolean): number {
        maxLength = maxLength ?? 10
        if (noZero) {
            return Math.floor((Math.random() * maxLength) + 1)
        } else {
            return Math.floor(Math.random() * maxLength)
        }
    }

    function randomField(field: string, data: any, noZero?: Boolean, maxLength?: number) {
        let randomFields: string[] = [];
        maxLength = maxLength ?? randomNum(data.length, noZero = noZero ? true : false)
        for (let index = 0; index < maxLength; index++) {
            let idx = randomNum(data.length);
            let rd = data[idx][field]
            randomFields.push(rd)
        }
        return [...new Set(randomFields)]
    }

    //admin
    const hashPassword = await hash('admin', 12)
    const randomString = generateString(5)
    const provider = `mysql-${randomString}`
    const providerAccountId = generateString(10)

    const admin = await prisma.user.create({
        data: {
            id: uuidv4(),
            nickName: 'Nereb',
            email: '123@admin.com',
            role: Role.admin,
            accounts: {
                create: {
                    loginId: 'admin',
                    password: hashPassword,
                    type: 'credentials',
                    provider,
                    providerAccountId
                }
            }
        }
    })

    //user
    const AllowedRole = Object.values(Role).filter(i => i != Role.admin)
    const AllowedGender = Object.values(Gender)
    const userName = ['robin', 'enstein', 'gorrila', 'elbert', 'Jk', 'brypt', 'mona', 'daisy', 'john', 'dat']
    const nameSuffix = ['-personal', '-shopping', '-work', '-supper', '-random']
    const UserPromise = [];
    for (let i = 0; i < 20; i++) {
        const fakeName: string = userName[randomNum(userName.length)]
        const fakeNickName: string = userName[randomNum(userName.length)] + nameSuffix[randomNum(nameSuffix.length)] + '-' + generateString(5)
        let phoneNumber: string = "0";
        for (let phoneDigit = 0; phoneDigit <= 10; phoneDigit++) {
            phoneNumber += randomNum()
        }
        const user: Omit<User,
            'createdDate'
            | 'deleted'
            | 'emailVerified'
            | 'updatedAt'
            | 'userVerified'
            | 'image'> = {
            id: uuidv4(),
            name: fakeName,
            nickName: fakeNickName,
            address: generateString(50),
            birthDay: new Date(randomNum(100000000)),
            phoneNumber,
            email: generateString(10) + "@mysql.com",
            role: AllowedRole[randomNum(AllowedRole.length)],
            gender: AllowedGender[randomNum(AllowedGender.length)],
        }
        const userCredentials = {
            loginId: "test" + generateString(10),
            password: "test" + generateString(2),
            type: 'credentials',
            provider: "mysql" + generateString(5),
            providerAccountId: generateString(10),
        }
        const promise = prisma.user.create({
            data: {
                ...user,
                accounts: {
                    create: {
                        ...userCredentials
                    }
                }
            }
        })
        UserPromise.push(promise)
    }
    const userDb = await Promise.all(UserPromise)

    //Products
    const categories = ['cabinets', 'accessories', 'beds', 'ottomans', 'shelves', 'dining chairs', 'dining tables', 'armchairs', 'stools', 'office desks', 'sofas', 'coffee tables', 'lounge chair', 'benches', 'games', 'side tables', 'counter/bar chair']
    const rooms = ['living room', 'bedroom', 'dining room', 'office', 'entertaining room']
    const color = ['000000', '000080', '001B1C', '003366', '008080', '01A368']

    //Category
    const cateDb: Category[] = categories.map((i, idx) => ({ id: idx + 1, name: i }))
    await prisma.category.createMany({
        data: cateDb
    })

    //Rooms
    const roomsDb: Room[] = rooms.map((i, idx) => ({ id: idx + 1, name: i }))
    await prisma.room.createMany({
        data: roomsDb
    })

    //Color
    const colorDb: Color[] = color.map(i => ({ name: GetColorName(i), hex: i }))
    await prisma.color.createMany({
        data: colorDb
    })

    //ImageGallery
    const images = ['/images/OliverSofa_RS.jpg', '/images/CoffeTable.jpg', '/images/Console.jpg', '/images/mirror.jpg']
    const mediaDb: MediaGallery[] = images.map((i, idx) => (
        {
            id: idx + 1,
            imageUrl: i
        }
    ))
    await prisma.mediaGallery.createMany({
        data: mediaDb
    })

    //Products
    const Price = 100000
    const mediaDbById = mediaDb.map(i => { return { id: i.id } })
    const roomsDbById = roomsDb.map(i => { return { id: i.id } })
    const cateDbById = cateDb.map(i => { return { id: i.id } })
    const status = Object.values(Status)

    type testProduct = Omit<Product,
        | 'createdDate'
        | 'updatedAt'
        | 'deleted'
        | 'wishlistId'
    > & {
        JsonColor: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined
    }

    const productPromise = [];
    for (let i = 0; i < 100; i++) {
        const testProduct: testProduct =
        {
            id: uuidv4(),
            name: 'testProduct',
            description: 'Testing...',
            creatorId: admin.id,
            price: Price + (randomNum(Price) * 1000),
            available: randomNum(100, true),

            //JsonArray
            JsonColor: randomField("hex", colorDb, true),
        }
        const prom = await prisma.product.create({
            data: {
                ...testProduct,
                category: {
                    connect: randomField("id", cateDbById, true, randomNum(cateDbById.length, true)).map(i => { return { id: i } }) as Prisma.CategoryWhereUniqueInput
                },
                image: {
                    connect: randomField("id", mediaDbById, true).map(i => { return { id: i } }) as Prisma.MediaGalleryWhereUniqueInput
                },
                room: {
                    connect: randomField('id', roomsDbById, true, randomNum(5, true)).map(i => { return { id: i } }) as Prisma.RoomWhereUniqueInput
                }
            }

        })
        productPromise.push(prom)
    }

    const productDb = await Promise.all(productPromise)
    const productDbById = productDb.map(i => { return { id: i.id } })

    //wishList
    const wishListDb = [];
    for (let i = 0; i < 20; i++) {
        const productIds = randomField("id", productDbById, false, randomNum(15))
        let fakeWishList = prismaClient.wishlist.create({
            data: {
                id: uuidv4(),
                ownerId: userDb[randomNum(userDb.length)].id,
                products: {
                    connect: productIds.map(i => { return { id: i } }) as Prisma.Enumerable<Prisma.ProductWhereUniqueInput>,
                }
            },
        })
        wishListDb.push(fakeWishList)
    }
    await Promise.all(wishListDb)

    //Order --- OrderItem
    const cartDb = [];
    for (let i = 0; i < 30; i++) {
        const productbyId = randomField("id", productDb, true)

        //CreatePurchasedItems
        const OrderItems: Omit<OrderItem, 'id' | 'orderId'>[] = productbyId.map(i => {
            let quantities = 0;
            const color: { id: string, quantities: number }[] = randomField('hex', colorDb, true).map((i, idx) => {
                const colorQuantities = randomNum(10, true);
                quantities += colorQuantities
                return {
                    id: i,
                    quantities: colorQuantities
                }
            })//{id,quantities}[]
            return {
                salePrice: productDb.find(item => item.id === i)!.price + (randomNum(Price) * 1000),
                quantities,
                color,
                productId: i,
            }
        })

        //CreateOrder
        let subTotal = 0;
        const shippingFee = 20000 + (randomNum(10) * 1000);
        OrderItems.forEach(item => {
            subTotal += item.salePrice * item.quantities;
        })

        const fakeOrder = prismaClient.order.create({
            data: {
                ownerId: userDb[randomNum(userDb.length)].id,
                billingAddress: userDb[randomNum(userDb.length)].address as string,
                shippingAddress: userDb[randomNum(userDb.length)].address as string,
                shippingFee,
                subTotal,
                total: subTotal + shippingFee,
                status: status[randomNum(status.length)],
                product: {
                    create: OrderItems as Prisma.OrderItemUncheckedCreateWithoutOrderInput[]
                }
            }
        })
        cartDb.push(fakeOrder)
    }
    await Promise.all(cartDb)

    //Product rating
    const ratingDb: Omit<ProductRating, 'id'>[] = [];
    for (let i = 0; i < 10000; i++) {
        const fakeRating: Omit<ProductRating, 'id'> = {
            ownerId: userDb[randomNum(userDb.length)].id,
            productId: productDb[randomNum(productDb.length)].id,
            rating: randomNum(5, true)
        }
        ratingDb.push(fakeRating)
    }

    await prisma.productRating.createMany({
        data: ratingDb
    })
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

