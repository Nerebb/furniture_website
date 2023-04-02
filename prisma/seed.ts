import { Category, Color, Gender, MediaGallery, Prisma, PrismaClient, Product, ProductRating, OrderItem, Role, Room, User, Order, Status, ShoppingCartItem, ShoppingCart } from "@prisma/client";
import { hash } from "bcrypt";
import { GetColorName } from "hex-color-to-color-name";
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
    await prisma.shoppingCartItem.deleteMany()
    await prisma.shoppingCart.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.productRating.deleteMany()
    await prisma.product.deleteMany()
    await prisma.user.deleteMany()
    await prisma.account.deleteMany()

    console.log("CleanningDataCompelted")

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
            id: `${process.env.ADMIN_UUID}`,
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

    console.log("Adding AdminUser")

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
            password: await hash('test', 12),
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

    console.log("Add testUser completed: password:test")

    //Products
    const categories = ['cabinets', 'accessories', 'beds', 'ottomans', 'shelves', 'dining chairs', 'dining tables', 'armchairs', 'stools', 'office desks', 'sofas', 'coffee tables', 'lounge chair', 'benches', 'games', 'side tables', 'counter/bar chair']
    const rooms = ['living room', 'bedroom', 'dining room', 'office', 'entertaining room']
    const color = ['000000', '000080', '001B1C', '003366', '008080', '01A368']


    //Category
    const cateDb: Category[] = categories.map((i, idx) => ({ id: idx + 1, label: i }))
    await prisma.category.createMany({
        data: cateDb
    })

    console.log("Category created")

    //Rooms
    const roomsDb: Room[] = rooms.map((i, idx) => ({ id: idx + 1, label: i }))
    await prisma.room.createMany({
        data: roomsDb
    })

    console.log("Rooms created")


    //Color
    const colorDb: Color[] = color.map(i => ({ label: GetColorName(i), hex: i }))
    await prisma.color.createMany({
        data: colorDb
    })

    console.log("Colors created")

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

    console.log("MediaGallery created")

    //Products
    const Price = 100000
    const mediaDbById = mediaDb.map(i => { return { id: i.id } })
    const roomsDbById = roomsDb.map(i => { return { id: i.id } })
    const cateDbById = cateDb.map(i => { return { id: i.id } })
    const status = Object.values(Status)

    const generatedDescription = [
        'Looking for a comfortable place to sit? Check out our versatile and stylish Sofa! With a variety of seating options, this piece will have you feeling at home in no time. Whether you\'re watching TV or relaxing with a good book, our Sofa is perfect for any occasion. Plus, its classic style will complement any room in your home.',
        'Mirror is the perfect way to make your bedroom, study or any other space look bigger and more open. With its frameless design and thin profile, it can be mounted on virtually any wall. The elegant silver finish will match any decor, while the simple yet sophisticated design allows you to add personality to your space without taking away from it.',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    ]

    const productDb: Product[] = [];
    for (let i = 0; i < 100; i++) {
        let name = 'testProduct' + generateString(5)
        while (productDb.some(i => i.name === name)) {
            name = 'testProduct' + generateString(6)
        }
        const testProduct =
        {
            id: uuidv4(),
            name,
            description: generatedDescription[randomNum(generatedDescription.length - 1)],
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
        productDb.push(prom)
    }

    console.log("Products created")

    const productDbById = productDb.map(i => { return { id: i.id } })

    //wishList
    const wishListDb = [];
    for (let i = 0; i < userDb.length; i++) {
        const productIds = randomField("id", productDbById, false, randomNum(15))
        let fakeWishList = prisma.wishlist.create({
            data: {
                id: uuidv4(),
                ownerId: userDb[i].id,
                products: {
                    connect: productIds.map(i => { return { id: i } }) as Prisma.Enumerable<Prisma.ProductWhereUniqueInput>,
                }
            },
        })
        wishListDb.push(fakeWishList)
    }
    await Promise.all(wishListDb)

    console.log("WishList created")

    //Order --- OrderItem
    const ordersProms = [];
    for (let i = 0; i < 30; i++) {
        const productbyId = randomField("id", productDb, true)

        //CreatePurchasedItems
        const OrderItems: Omit<OrderItem, 'id' | 'orderId' | 'createdDate' | 'updatedAt'>[] = productbyId.map(i => {
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
                salePrice: productDb.find(item => item.id === i)!.price! + (randomNum(Price) * 1000),
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

        const fakeOrder = prisma.order.create({
            data: {
                ownerId: userDb[randomNum(userDb.length)].id,
                billingAddress: userDb[randomNum(userDb.length)].address as string,
                shippingAddress: userDb[randomNum(userDb.length)].address as string,
                shippingFee,
                subTotal,
                total: subTotal + shippingFee,
                status: status[randomNum(status.length)],
                orderedProducts: {
                    create: OrderItems as Prisma.OrderItemUncheckedCreateWithoutOrderInput[]
                },
            }
        })
        ordersProms.push(fakeOrder)
    }

    const orderDb = await Promise.all(ordersProms)

    const orderItemsDb = await prisma.orderItem.findMany()

    console.log("Orders created")


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

    console.log("ProductRating created")

    //ShoppingCart
    const shoppingCartDb = [];
    for (let i = 0; i < 11; i++) {
        const cartItems: Omit<ShoppingCartItem, "id" | "ShoppingCartId">[] = []
        for (let i = 0; i < 11; i++) {
            let curProduct = productDb[randomNum(productDb.length)]
            while (cartItems.some(promProduct => promProduct.productId === curProduct.id)) {
                curProduct = productDb[randomNum(productDb.length)]
            }

            const curProductColor = curProduct.JsonColor as string[]

            const shoppingCartItem: Omit<ShoppingCartItem, "id" | "ShoppingCartId"> = {
                color: curProductColor[randomNum(curProductColor.length)],
                productId: curProduct.id,
                quantities: randomNum(5, true),
            }

            cartItems.push(shoppingCartItem)
        }


        let ownerId = userDb[i].id

        const subTotal = cartItems.reduce((total, product) => {
            const price = productDb.find(i => i.id === product.productId)!.price!
            return total += price * product.quantities
        }, 0)

        const userCart = prisma.shoppingCart.create({
            data: {
                ownerId,
                subTotal,
                shoppingCartItem: {
                    create: cartItems
                }
            }
        })
        shoppingCartDb.push(userCart)
    }

    await Promise.all(shoppingCartDb)

    console.log("ShoppingCart created")


    //Update Product - ratings comments
    const updateProducts = productDb.map(product => {
        const productRating = ratingDb.filter(i => i.productId === product.id)
        const productRate = Math.floor(productRating.reduce((total, rate) => total + rate.rating, 0) / productRating.length)

        const productOrdered = orderItemsDb.filter(i => i.productId === product.id)

        const totalSale = productOrdered.reduce((total, sale) => total + sale.quantities, 0)

        return {
            id: product.id,
            productRate,
            totalRate: productRating.length,
            totalSale,
        }
    })

    const updateProductsProms = updateProducts.map(product => (
        prisma.product.update({
            where: { id: product.id },
            data: {
                avgRating: product.productRate,
                totalSale: product.totalSale,
                totalRating: product.totalRate
            }
        })
    ))

    await Promise.all(updateProductsProms)

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

