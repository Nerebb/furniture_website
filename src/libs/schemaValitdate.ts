import { ProductCard } from '@/pages/api/products'
import { UserRelation } from '@/pages/api/user'
import { Gender, Order, ProductReview, Role, Status, User } from '@prisma/client'
import * as Yup from 'yup'


export const AllowedUserSearch = ['id', 'name', 'nickName', 'address', 'email', 'gender', 'role', 'phoneNumber', 'birthDay', 'createdDate', 'updatedAt', 'userVerified', 'emailVerified', 'deleted', 'image'] satisfies Array<keyof User>
export const AllowedUserRelationFilter = ['reviewLiked', 'writedContents', 'wishlist', 'shoppingCart', 'carts', 'accounts', 'productsReviewed'] satisfies Array<keyof UserRelation>
export const AllowedProductFilters: Array<keyof Omit<ProductCard, 'totalProduct'>> = [
    'available', 'avgRating', 'cateIds', 'colors', 'createdDate', 'creatorId', 'description',
    'description', 'id', 'name', 'price', 'totalRating', 'updatedAt'
]
export const AllowedProductReviewFilters: Array<keyof ProductReview> = [
    'content', 'createdDate', 'id', 'ownerId', 'productId', 'rating', 'totalLike', 'updatedAt'
]
export const AllowedOrderFilters: Array<keyof Order> = [
    'billingAddress', 'createdDate', 'id', 'ownerId', 'shippingAddress', 'shippingFee', 'status', 'subTotal', 'total', 'updatedAt'
]

export const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

export const UserSchemaValidate = {
    name: Yup.string().lowercase().max(20).required("Name required"),
    nickName: Yup.string().lowercase().max(50),
    address: Yup.string().lowercase().max(255).required('Address required'),
    email: Yup.string().email().typeError("Invalid email").required('Email required'),
    gender: Yup.string().oneOf(Object.values(Gender), "Invalid gender").required(),
    phoneNumber: Yup.string().required("Phone number required"),
    role: Yup.string().oneOf(Object.values(Role)),
    userVerified: Yup.boolean(),
    emailVerified: Yup.boolean(),
    deleted: Yup.boolean(),
    birthDay: Yup.date().max(new Date()).typeError("Invalid date")
}

export const RegisterSchemaValidate = {
    loginId: Yup.string().required("Login ID field missing"),
    password: Yup.string().max(20, 'Must lesser than 20 characters').required('Password field missing'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords dont match').required('Password field missing'),
    email: Yup.string().email().typeError("Invalid email").required("Email field missing"),
}

export const RegisterByAdminSchemaValidate = {
    name: Yup.string().lowercase().max(20),
    nickName: Yup.string().lowercase().max(20),
    address: Yup.string().lowercase().max(255),
    gender: Yup.string().oneOf(Object.values(Gender), "Invalid gender"),
    phoneNumber: Yup.string().required("Phone number required"),
    birthDay: Yup.date().max(new Date()).typeError("Invalid date"),
    role: Yup.string().oneOf(Object.values(Role)),
    userVerified: Yup.boolean(),
    emailVerified: Yup.boolean(),
    deleted: Yup.boolean(),
}

export const LoginSchemaValidate = {
    loginId: RegisterSchemaValidate.loginId,
    password: RegisterSchemaValidate.password,
}

export const AdminUserUpdateSchemaValidate = {
    ...UserSchemaValidate,
    userVerified: Yup.boolean(),
    emailVerified: Yup.boolean(),
    deleted: Yup.boolean(),
}
export const isUUID: Yup.StringSchema<string> =
    Yup.string().uuid('BAD REQUEST - Invalid Object ID').required('Object ID not found')

export const isValidNum: Yup.NumberSchema<number | undefined> =
    Yup.number().integer().moreThan(-1)

export const isValidStatus: Yup.StringSchema<Status | undefined> =
    Yup.string().oneOf(Object.values(Status))


export const ProductSearchSchemaValidate = {
    id: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(Yup.string().uuid().required())
            default:
                return Yup.string().uuid()
        }
    }),
    limit: Yup.number().integer().moreThan(-1),
    skip: Yup.number().integer().moreThan(-1),
    rating: Yup.number().integer().moreThan(-1).max(5),
    fromPrice: Yup.number().integer().moreThan(-1),
    toPrice: Yup.number().integer().moreThan(-1),
    available: Yup.boolean(),
    cateId: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(Yup.number().integer().min(0).required())
            default:
                return Yup.number().integer().min(0)
        }
    }),
    colorHex: Yup.array().of(Yup.string().max(7).required()),
    roomId: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(Yup.number().integer().min(0).required())
            default:
                return Yup.number().integer().min(0)
        }
    }),
    createdDate: Yup.date(),
    name: Yup.string().max(50),
    creatorName: Yup.string(),
    isFeatureProduct: Yup.boolean(),
    filter: Yup.string().oneOf(AllowedProductFilters),
    sort: Yup.string().lowercase().oneOf(['asc', 'desc'])
}

export const ProductUpdateSchemaValidate = {
    name: Yup.string().max(20),
    description: Yup.string().min(1),
    price: Yup.number().min(0),
    available: Yup.number().min(0),
    isFeatureProduct: Yup.boolean(),
    colors: ProductSearchSchemaValidate.colorHex,
    cateIds: Yup.array().of(Yup.number().moreThan(-1).required()),
    roomIds: Yup.array().of(Yup.number().moreThan(-1).required()),
    imageIds: Yup.array().of(Yup.number().moreThan(-1).required()),

    creatorId: Yup.string().uuid(),
    avgRating: Yup.number().min(0).max(5),
}


export const ProductCreateSchemaValidate = {
    name: ProductUpdateSchemaValidate.name.required(),
    description: ProductUpdateSchemaValidate.description.required(),
    price: ProductUpdateSchemaValidate.price.required(),
    available: ProductUpdateSchemaValidate.available.required(),
    creatorId: ProductUpdateSchemaValidate.creatorId.required(),
    colors: ProductUpdateSchemaValidate.colors.required('Color must be array type'),
    roomIds: ProductUpdateSchemaValidate.roomIds.required(),
    cateIds: ProductUpdateSchemaValidate.cateIds.required(),
    imageIds: ProductUpdateSchemaValidate.imageIds.required(),
}

export const ShoppingCartUpdateSchemaValidate = {
    cartItemId: Yup.string().uuid().required(),
    color: Yup.string().max(7, "Color must be hex type"),
    quantities: Yup.number().typeError("Invalid quanitities").moreThan(0)
}

export const ShoppingCartCreateSchemaValidate = {
    productId: Yup.string().uuid().required(),
    color: Yup.string().max(7, "Color must be hex type").required(),
    quantities: Yup.number().moreThan(0).required()
}

export const ShoppingCartDeleteSchemaValidate = {
    cartItemId: Yup.string().uuid().required()
}

export const OrderSearchSchemaValidate = {
    id: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(Yup.string().uuid().required())
            default:
                return Yup.string().uuid()
        }
    }),
    subTotal: Yup.number().integer().min(0),
    shippingFee: Yup.number().integer().min(0),
    total: Yup.number().integer().min(0),
    billingAddress: Yup.string(),
    shippingAddress: Yup.string(),
    status: Yup.string().oneOf(Object.values(Status)),
    ownerId: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(Yup.string().uuid().required())
            default:
                return Yup.string().uuid()
        }
    }),
    limit: Yup.number().integer().min(0),
    filter: Yup.string().oneOf(AllowedOrderFilters),
    sort: Yup.string().lowercase().oneOf(['asc', 'desc']),
    skip: Yup.number().integer().min(0),
    createdDate: Yup.date(),
    updatedAt: Yup.date()
}

export const UserOrderSchemaValidate = {
    orderId: Yup.string().uuid("Invalid orderId"),
    limit: ProductSearchSchemaValidate.limit,
    skip: ProductSearchSchemaValidate.skip,
    status: isValidStatus
}

export const NewOrderSchemaValidate = {
    products: Yup.array().of(Yup.object(ShoppingCartCreateSchemaValidate).required()).required(),
    billingAddress: Yup.string().max(255).required(),
    shippingAddress: Yup.string().max(255).required(),
}

export const CheckoutFormSchemaValidate = {
    name: UserSchemaValidate.name,
    phoneNumber: UserSchemaValidate.phoneNumber,
    email: UserSchemaValidate.email,
    billingAddress: NewOrderSchemaValidate.billingAddress,
    shippingAddress: NewOrderSchemaValidate.shippingAddress,
}

export const GetProductReviewSchemaValidate = {
    productId: Yup.string().uuid("Invalid productId"),
    ownerId: Yup.string().uuid("Invalid ownerId"),
    userId: Yup.string().uuid("Invalid userId"),
    limit: Yup.number().integer().moreThan(-1),
    skip: Yup.number().integer().moreThan(-1),
    rating: Yup.array().of(Yup.number().integer().moreThan(-1).max(5)),
}

export const CreateProductReviewSchemaValidate = {
    productId: Yup.string().uuid("Invalid productId").required(),
    content: Yup.string().max(255).required(),
    rating: Yup.number().integer().moreThan(-1).max(5).required(),
}

export const UpdateProductReviewSchemaValidate = {
    id: Yup.string().uuid("Invalid reviewId").required(),
    content: Yup.string().max(255),
    rating: Yup.number().integer().min(0).max(5),
}

export const SearchFilterSchemaValidate = {
    id: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(Yup.number().min(1).required())
            default:
                return Yup.number().min(1)
        }
    }),
    filter: Yup.string().lowercase().oneOf(['id', 'label']),
    sort: Yup.string().lowercase().oneOf(['asc', 'desc']),
    limit: Yup.number().min(1).max(50),
    skip: Yup.number().moreThan(-1),
}

export const CreateFilterSchemaValidate = {
    id: Yup.number().min(1),
    label: Yup.string().required().max(20).required(),
}

export const CreateColorSchemaValidate = {
    id: Yup.string().max(7).required(),
    label: Yup.string(),
}

export const SearchColorSchemaValidate = {
    ...SearchFilterSchemaValidate,
    id: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(CreateColorSchemaValidate.id)
            default:
                return Yup.string().max(7)
        }
    }),
    filter: Yup.string().lowercase().oneOf(['hex', 'label']),
}

export const SearchUserSchemaValidate = {
    //SearchParams
    id: Yup.lazy((value) => {
        switch (typeof value) {
            case 'string':
                return Yup.string().uuid()
            default:
                return Yup.array().of(Yup.string().uuid().required())
        }
    }),
    name: Yup.string().lowercase().max(100),
    nickName: Yup.string().lowercase().max(50),
    address: Yup.string().lowercase().max(255),
    email: Yup.string().email().typeError("Invalid email"),
    gender: Yup.string().oneOf(Object.values(Gender), "Invalid gender"),
    role: Yup.string().oneOf(Object.values(Role)),
    phoneNumber: Yup.string().matches(phoneRegExp).max(15),
    birthDay: UserSchemaValidate.birthDay,
    createdDate: UserSchemaValidate.birthDay,
    updatedAt: UserSchemaValidate.birthDay,
    userVerified: UserSchemaValidate.birthDay,
    emailVerified: UserSchemaValidate.birthDay,
    deleted: UserSchemaValidate.birthDay,

    //FilterParams
    filter: Yup.string().oneOf([...AllowedUserSearch, ...AllowedUserRelationFilter]),
    sort: Yup.string().lowercase().oneOf(['asc', 'desc']),
    limit: Yup.number().integer().min(0)
}

export const SearchProductReviewSchemaValidate = {
    id: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(Yup.string().uuid().required())
            default:
                return Yup.string().uuid()
        }
    }),
    ownerId: Yup.string().uuid(),
    productId: Yup.string().uuid(),
    content: Yup.string(),
    rating: Yup.number().min(0).max(5),
    totalLike: Yup.number().min(0),
    likedUsers: Yup.array().of(Yup.string().uuid().required()),
    createdDate: Yup.date(),
    updatedAt: Yup.date(),
    filter: Yup.string().oneOf(AllowedProductReviewFilters),
    sort: Yup.string().lowercase().oneOf(['asc', 'desc']),
    limit: Yup.number().integer().min(0).max(50),
    skip: Yup.number().moreThan(-1),
}

export const DeleteProductReviewSchemaValidate = {
    id: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(Yup.string().uuid().required())
            default:
                return Yup.string().uuid().required()
        }
    })
}

const NewOrderItemSchemaValidateByAdmin = {
    ...ShoppingCartCreateSchemaValidate,
    salePrice: Yup.number().integer().min(0)
}

export const NewOrderSchemaValidateByAdmin = {
    userId: Yup.string().uuid().required(),
    billingAddress: Yup.string().max(255).required(),
    shippingAddress: Yup.string().max(255).required(),
    products: Yup.array().of(Yup.object(NewOrderItemSchemaValidateByAdmin).required()).required(),
}

export const DeleteColorsSchemaValidate = {
    id: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(Yup.string().max(7).required()).required()
            default:
                return Yup.string().max(7).required()
        }
    })
}

export const DeleteFilterSchemaValidate = {
    id: Yup.lazy(value => {
        switch (typeof value) {
            case 'object':
                return Yup.array().of(Yup.number().integer().min(1).required()).required()
            default:
                return Yup.number().integer().min(1).required()
        }
    })
}

export const UpdateFilterSchemaValidate = {
    id: CreateFilterSchemaValidate.id.required(),
    label: CreateFilterSchemaValidate.label.required()
}

//Shorten Validations
// async function YupObjectValidator<T>(schema: T, validateObject: T): Promise<T> {
//     const validator: Yup.ObjectSchema<T> = Yup.object(schema)
//     try {
//         const result = await validator.validate(validateObject)
//         return result
//     } catch (error) {
//         throw error
//     }
// }

