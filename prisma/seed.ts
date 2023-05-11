import { Category, Color, Gender, MediaGallery, Prisma, PrismaClient, Product, OrderItem, Role, Room, User, Order, Status, ShoppingCartItem, ShoppingCart, ProductReview } from "@prisma/client";
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
    await prisma.productReview.deleteMany()
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
    const userDbById = userDb.map(i => i.id)

    console.log("Add testUser completed: password:test")

    //Products
    const categories = ['cabinets', 'accessories', 'beds', 'ottomans', 'shelves', 'dining chairs', 'dining tables', 'armchairs', 'stools', 'office desks', 'sofas', 'coffee tables', 'lounge chair', 'benches', 'games', 'side tables', 'counter/bar chair'] as const
    const rooms = ['living room', 'bedroom', 'dining room', 'office', 'entertaining room'] as const
    const color = ['000000', '757575', 'D2DAE2', 'fff', '2B67C2', '57BDBB', '97C292', '825B2C', '73C7FF', 'F5E23B', '055E0A', '808080', 'EBB155'] as const

    //ImageGallery
    const images = [
        '/images/OliverSofa_RS.jpg',
        '/images/CoffeTable.jpg',
        '/images/Console.jpg',
        '/images/mirror.jpg',
        '/images/Elena_gray.jpg',
        '/images/Elena_green.jpg',
        '/images/Elena_white.jpg',
        '/images/Aurora_Blue.jpg',
        '/images/Aurora_Brown.jpg',
        '/images/Aurora_White.jpg',
        '/images/Davis_Brown.jpg',
        '/images/London_Black.jpg',
        '/images/Sydney_brown.jpg',
        '/images/Bordeaux_yellow.jpg',
        '/images/Bordeaux_green.jpg',
        '/images/JoyStool_white.jpg',
        '/images/Apex_black.jpg',
        '/images/Eden_white.jpg',
        '/images/Apex_Coffe_black.jpg',
        '/images/Wave_sideTable_white.jpg',
        '/images/Stetson_coffetable.jpg',
        '/images/Alisma_coffetable.jpg',
        '/images/Abin_coffetable.jpg',
        '/images/LazySac.jpg',
        '/images/Elegant_coffetable.jpg',
        '/images/Olivia_sofa.jpg',
    ] as const

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
    const Price = 100
    const mediaDbById = mediaDb.map(i => { return { id: i.id } })
    const roomsDbById = roomsDb.map(i => { return { id: i.id } })
    const cateDbById = cateDb.map(i => { return { id: i.id } })
    const status = Object.values(Status)

    const generatedProductCmt = [
        'Very useful', 'Life changer', 'Such detail!!!', 'You should have one!!!', 'etc.....'
    ]

    type JSONproduct = {
        name: string
        description: string,
        color: typeof color[number][],
        categories: typeof categories[number][],
        rooms: typeof rooms[number][],
        imageUrls: typeof images[number][],
    }
    const Products = [
        {
            name: "Elena sofa",
            description: "Sofa Giường Elena Be là mẫu sofa độc đáo cho không gian hiện đại. Sofa có thiết kế gọn nhẹ, với phần khung gỗ plywood chịu lực tốt cùng lớp đệm vải tông màu be, bề mặt vải may thành những đường sọc ngang thu hút. Ghế có cấu trúc thông minh với lưng ghế có thể gập hạ, biến hóa chiếc sofa thành chiếc giường tiện lợi.",
            color: ['2B67C2', 'fff', '97C292'],
            categories: ['lounge chair', 'benches', 'sofas'],
            imageUrls: ['/images/Elena_gray.jpg', '/images/Elena_green.jpg', '/images/Elena_white.jpg'],
            rooms: ['bedroom', 'living room']
        },
        {
            name: "Aurora sofa",
            description: "Sofa Giường Aurora Xanh Dương là mẫu nội thất thông minh tiện dụng cho không gian sống. Sofa có kiểu dáng đơn giản, với khung plywood chịu lực tốt, cùng vải bọc mịn mềm tông xanh dương hiện đại. Điểm nhấn của sofa là khả năng hạ phần lưng xuống để biến sofa thành chiếc giường trong tích tắc. Sản phẩm sofa tích hợp giường siêu tiện lợi, phù hợp với mọi không gian trong nhà.",
            color: ['fff', '73C7FF', '825B2C'],
            categories: ['lounge chair', 'benches', 'dining chairs'],
            imageUrls: ['/images/Aurora_Blue.jpg', '/images/Aurora_Brown.jpg', '/images/Aurora_White.jpg'],
            rooms: ['bedroom', 'living room']

        },
        {
            name: "Davis brown",
            description: "Sofa Davis Nâu Nhạt là mẫu sofa tinh tế cho không gian phòng khách hiện đại. Phần chân được làm từ chất liệu kim loại chắc chắn, toàn bộ đệm ngồi, nệm lưng, nệm tay được bọc bằng chất liệu da cao cấp tông màu nâu nhạt. Chiếc sofa mang đến nét hiện đại tinh tế cho không gian.",
            color: ['825B2C'],
            categories: ['lounge chair', 'dining chairs'],
            imageUrls: ['/images/Davis_Brown.jpg'],
            rooms: ['bedroom', 'living room', 'entertaining room']
        },
        {
            name: "London black",
            description: "Sofa Da Góc Phải London Đen là mẫu sofa tinh tế cho không gian phòng khách hiện đại. Phần chân được làm từ gỗ chắc chắn, phần đệm được bọc bằng da cao cấp tông màu đen. Mẫu sofa có phần ghế góc bên phải được thiết kế mở rộng, tạo sự thoải mái cho người sử dụng.",
            color: ['000000'],
            categories: ['benches', 'lounge chair'],
            imageUrls: ['/images/London_Black.jpg'],
            rooms: ['dining room', 'living room', 'entertaining room', 'office', 'bedroom'],
        },
        {
            name: "Sydney brown",
            description: "Sofa Sydney Nâu Đậm là mẫu sofa tinh tế cho không gian phòng khách hiện đại. Phần khung và chân được làm từ chất liệu gỗ bạch dương chắc chắn, toàn bộ đệm ngồi, nệm lưng, nệm tay được bọc bằng chất liệu da cao cấp tông màu nâu đậm. Chiếc sofa mang đến nét hiện đại tinh tế cho không gian.",
            color: ['825B2C'],
            categories: ['armchairs', 'lounge chair'],
            imageUrls: ['/images/Sydney_brown.jpg'],
            rooms: ['bedroom', 'entertaining room', 'living room'],
        },
        {
            name: "Bordeaux yellow",
            description: "Sofa Bordeaux Yellow Forte-Hyde là mẫu sofa tinh tế cho không gian phòng khách hiện đại. Phần khung và chân được làm từ chất liệu gỗ thông chắc chắn, toàn bộ đệm ngồi, nệm lưng, nệm tay được bọc bằng chất liệu nhung cao cấp tông màu vàng. Chiếc sofa mang đến nét hiện đại tinh tế cho không gian.",
            color: ['F5E23B', '055E0A'],
            categories: ['armchairs', 'lounge chair', 'benches'],
            imageUrls: ['/images/Bordeaux_yellow.jpg'],
            rooms: ['dining room', 'living room', 'bedroom'],
        },
        {
            name: "Joy Stool",
            description: "Ghế Đôn Joy Xám Nhạt là mẫu ghế đơn giản mà vẫn có nét độc đáo cho phòng khách. Khung ghế làm từ gỗ thông Canada cao cấp, với lớp đệm dày dặn đàn hồi tốt được bọc vải tông màu xám nhạt hiện đại. Kiểu dáng ghế khối hộp vuông hiện đại, với điểm nhấn là miếng vải nâu được may độc đáo trên bề mặt nệm ngồi.",
            color: ['fff'],
            categories: ['stools', 'ottomans'],
            imageUrls: ['/images/JoyStool_white.jpg'],
            rooms: ['living room', 'bedroom', 'entertaining room']
        },
        {
            name: "Apex black",
            description: "Bàn Bên Apex Đen là mẫu bàn phụ độc đáo cho không gian phòng khách. Mặt bàn và mặt kệ dưới được làm từ gỗ sồi mang tông màu đen tinh tế. Khung chân bàn được làm từ kim loại với thiết kế cá tính mà chắc chắn. Mặt bàn và mặt kệ mang kiểu dáng nửa hình tròn ấn tượng. Mẫu bàn hứa hẹn mang đến nét cá tính mới lạ cho không gian trong nhà.",
            color: ['000000'],
            categories: ['stools', 'side tables'],
            imageUrls: ['/images/Apex_black.jpg'],
            rooms: ['dining room', 'living room'],
        },
        {
            name: "Eden white",
            description: "Bàn Bên Eden 55cm là mẫu bàn phụ độc đáo cho không gian phòng khách. Toàn bộ bàn được làm từ kim loại mang tông màu đồng thau. Mặt bàn hình tròn, chân bàn dáng hình chóp được thiết kế với các chi tiết ấn tượng. Mẫu bàn hứa hẹn mang đến nét cá tính mới lạ cho không gian trong nhà.",
            color: ['fff'],
            categories: ['side tables', 'coffee tables'],
            imageUrls: ['/images/Eden_white.jpg'],
            rooms: ['living room', 'dining room', 'bedroom']
        },
        {
            name: "Apex coffe table",
            description: "Bàn Cà Phê Apex Đen là mẫu bàn độc đáo cho không gian phòng khách. Mặt bàn và kệ chân bàn được làm từ gỗ sồi tông màu đen tinh tế. Chân bàn làm từ chất liệu kim loại với thiết kế tinh giản mà chắc chắn. Mẫu bàn phù hợp bày trí cho những không gian đậm cá tính.",
            color: ['000000'],
            categories: ['coffee tables'],
            imageUrls: ['/images/Apex_Coffe_black.jpg'],
            rooms: ['living room'],
        },
        {
            name: "Wave side table",
            description: "Bàn Bên Wave Bạc Xám là mẫu bàn phụ độc đáo cho không gian phòng khách. Toàn bộ bàn được làm từ bê tông cứng cáp mang tông màu bạc xám. Chân bàn hình trụ cùng mang tông màu đồng nhất với mặt bàn, với chi tiết sọc dọc sang trọng. Tông màu và kiểu dáng của bàn dễ bày phối vào không gian trong nhà.",
            color: ['fff'],
            categories: ['coffee tables', 'side tables'],
            imageUrls: ['/images/Wave_sideTable_white.jpg'],
            rooms: ['living room', 'entertaining room']
        },
        {
            name: "Stetson coffetable",
            description: "Bàn Cà Phê Stetson là mẫu bàn độc đáo cho không gian phòng khách. Toàn bộ bàn được làm từ bê tông cứng cáp tông bạc xám nguyên thủy. Chân bàn được thiết kế ghép lại từ 3 khối hình trụ tạo thành một hệ chân độc đáo. Tổng thể bàn toát ra nét thô sơ nguyên bản, phù hợp bày trí cho những không gian đậm cá tính.",
            color: ['808080'],
            categories: ['coffee tables', 'stools'],
            imageUrls: ['/images/Stetson_coffetable.jpg'],
            rooms: ['living room', 'office', 'entertaining room'],
        },
        {
            name: "Alisma coffetable",
            description: "Bàn Cafe Alisma mang phong cách hiện đại và mạnh mẽ với thiết kế dạng tròn cùng không gian đặt đồ rộng rãi. Khung kim loại hỗ trợ mặt bàn đá cẩm thạch trắng, dễ dàng để vệ sinh và duy trì độ bền được tốt hơn.",
            color: ['000000'],
            categories: ['coffee tables', 'side tables'],
            imageUrls: ['/images/Alisma_coffetable.jpg'],
            rooms: ['living room', 'office', 'entertaining room']
        },
        {
            name: "Abin coffetable",
            description: "Bàn Cafe Abin là mẫu bàn đơn giản cho không gian nhà ấm cúng. Bàn được làm từ chất liệu gỗ, với mặt bàn màu trắng cùng chân bàn nâu gỗ tự nhiên. Mặt bàn kiểu tròn cơ bản cùng phần chân chắc chắn, cùng với sự kết hợp màu trắng - nâu tạo nên nét nhẹ nhàng, ấm cúng và tinh tế cho không gian sống.",
            color: ['000000'],
            categories: ['coffee tables', 'side tables'],
            imageUrls: ['/images/Abin_coffetable.jpg'],
            rooms: ['bedroom', 'living room', 'office', 'entertaining room']
        },
        {
            name: "LazySac",
            description: "Ghế Lười LazySac Nhung Gân Màu Đỏ Đất có thể nhìn giống một chiếc ghế lười Bean bag thông thường nhưng nó ẩn chứa nhiều điều thú vị hơn rất nhiều. Ghế lười sử dụng chất liệu nhung gân màu đỏ đất, mang đến cho bạn trải nghiệm thoải mái tột cùng nhờ vào công thức tạo độ êm đặc biệt “LA-Z-FOAM” đến từ đội ngũ chuyên gia của chúng tôi sau hơn 10 năm nghiên cứu.",
            color: ['EBB155'],
            categories: ['ottomans'],
            imageUrls: ['/images/LazySac.jpg'],
            rooms: ['bedroom', 'living room', 'entertaining room', 'office']
        },
        {
            name: "Elegant coffetable",
            description: "Bàn Cafe Elegant 1 là mẫu bàn tinh tế tối giản cho không gian sống. Bàn có thiết kế đơn giản với điểm nhấn là mặt bê tông và chân sắt nhưng không kém phần cá tính.",
            color: ['808080'],
            categories: ['coffee tables'],
            imageUrls: ['/images/Elegant_coffetable.jpg'],
            rooms: ['living room', 'entertaining room']
        },
        {
            name: "Olivia sofa",
            description: "Ghế Sofa Băng Oliver Xám là mẫu sofa cá tính cho không gian hiện đại. Khung ghế làm từ gỗ dầu kiềng sắt sườn, vải bọc tông xám. Sản phẩm phù hợp để trang trí cho không gian phòng khách, sảnh căn hộ, hay không gian sảnh nhà hàng, khách sạn.",
            color: ['825B2C', '808080'],
            categories: ['sofas'],
            imageUrls: ['/images/Olivia_sofa.jpg'],
            rooms: ['living room', 'dining room', 'bedroom', 'entertaining room']
        }

    ] satisfies JSONproduct[]

    const productPromise = [];
    for (const product of Products) {
        const cateIds = cateDb
            .filter(cate => product.categories.some(i => i === cate.label))
            .map(i => ({ id: i.id }))
        const roomIds = roomsDb
            .filter(room => product.rooms.some(i => i === room.label))
            .map(i => ({ id: i.id }))
        const imageIds = mediaDb
            .filter(image => product.imageUrls.some(i => i === image.imageUrl))
            .map(i => ({ id: i.id }))

        const prom = prisma.product.create({
            data: {
                name: product.name,
                price: Price + (randomNum(Price) * 1000),
                description: product.description,
                JsonColor: product.color,
                available: randomNum(100),
                creator: {
                    connect: { id: userDb[randomNum(userDb.length)].id }
                },
                cateIds: { connect: cateIds },
                roomIds: { connect: roomIds },
                imageIds: { connect: imageIds },
                isFeatureProduct: Math.floor(randomNum(10)) > 7,
            }
        })
        productPromise.push(prom)
    }

    const productDb = await Promise.all(productPromise)

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
        const OrderItems: Omit<OrderItem, 'id' | 'orderId' | 'createdDate' | 'updatedAt'>[] = productbyId.map((i, idx) => {
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
                createdDate: new Date(new Date().getTime() - (randomNum(30, true) * 1000 * 60 * 60 * 24)),
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

    // Product comment - rating
    function generateProductCmt(): Prisma.ProductReviewCreateArgs['data'] {
        const ownerId = userDb[randomNum(userDb.length)].id
        const likedUsers = [...new Set(randomField("id", userDb.filter(i => i.id !== ownerId), true, randomNum(10, true)))]
        return {
            ownerId,
            productId: productDb[randomNum(productDb.length)].id,
            content: generatedProductCmt[randomNum(generatedProductCmt.length)],
            rating: randomNum(5, true),
            totalLike: likedUsers.length,
            likedUsers: { connect: likedUsers.map(i => ({ id: i })) },
            isPending: Math.floor(randomNum(2)) ? true : false
        }
    }

    const ratingDb: Prisma.ProductReviewCreateArgs['data'][] = [];
    for (let i = 0; i < (productDb.length * userDb.length); i++) {
        let fakeRating = generateProductCmt()
        while (ratingDb.some(i => i.ownerId === fakeRating.ownerId && i.productId === fakeRating.productId)) {
            fakeRating = generateProductCmt()
        }
        ratingDb.push(fakeRating)
    }

    const promReviews = ratingDb.map(i => {
        return prisma.productReview.create({
            data: i
        })
    })

    await Promise.all(promReviews)
    console.log("ProductCmt created")

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


    //Update Product - ratings comments - Cron job
    const updateProducts = productDb.map(product => {
        const productRating = ratingDb.filter(i => i.productId === product.id)
        const productRate = Math.floor(productRating.reduce((total, rate) => total + rate.rating, 0) / productRating.length)
        const productOrdered = orderItemsDb.filter(i => i.productId === product.id)
        const productComments = productRating
        const totalSale = productOrdered.reduce((total, sale) => total + sale.quantities, 0)

        return {
            id: product.id,
            productRate,
            totalRate: productRating.length,
            totalSale,
            totalComments: productComments.length
        }
    })

    const updateProductsProms = updateProducts.map(product => (
        prisma.product.update({
            where: { id: product.id },
            data: {
                avgRating: product.productRate,
                totalSale: product.totalSale,
                totalRating: product.totalRate,
                totalComments: product.totalComments,
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

