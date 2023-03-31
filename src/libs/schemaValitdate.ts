import { ProductSearch } from '@/pages/api/products'
import { Gender, Status } from '@prisma/client'
import * as Yup from 'yup'
const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

export const UserSchemaValidate = {
    name: Yup.string().lowercase().max(100, 'Must lesser than 100 characters').required("Name required"),
    nickName: Yup.string().lowercase().max(50, "Must lesser than 10 characters").required('Nickname required'),
    address: Yup.string().lowercase().max(50, "Must lesser than 10 characters").required('Address required'),
    email: Yup.string().email().typeError("Invalid email").required('Email required'),
    gender: Yup.string().lowercase().oneOf(Object.values(Gender), "Invalid gender"),
    phoneNumber: Yup.string().matches(phoneRegExp, "Invalid phone number").required("PhoneNumber required"),
    birthDay: Yup.date().typeError("Invalid date"),
}

export const RegisterSchemaValidate = {
    loginId: UserSchemaValidate.name.required("Login ID field missing"),
    password: Yup.string().max(20, 'Must lesser than 20 characters').required('Password field missing'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords dont match').required('Password field missing'),
    email: Yup.string().email().typeError("Invalid email").required("Email field missing"),
}

export const LoginSchemaValidate = {
    loginId: RegisterSchemaValidate.loginId,
    password: RegisterSchemaValidate.password,
}

export const isUUID: Yup.StringSchema<string> =
    Yup.string().uuid('BAD REQUEST - Invalid Object ID').required('Object ID not found')

export const isValidNum: Yup.NumberSchema<number | undefined> =
    Yup.number().integer().moreThan(-1, "Filters must be greater than -1")

export const isValidStatus: Yup.StringSchema<Status | undefined> =
    Yup.string().oneOf(Object.values(Status))

export const ProductSearchSchemaValidate = {
    limit: Yup.number().integer().moreThan(-1),
    skip: Yup.number().integer().moreThan(-1),
    rating: Yup.number().integer().moreThan(-1).max(5),
    fromPrice: Yup.number().integer().moreThan(-1),
    toPrice: Yup.number().integer().moreThan(-1),
    available: Yup.boolean(),
    cateId: Yup.array().of(Yup.number().moreThan(-1).required()),
    colorHex: Yup.array().of(Yup.string().max(7).required()),
    roomId: Yup.array().of(Yup.number().moreThan(-1).required()),
    createdDate: Yup.date(),
    name: Yup.string().max(50),
    creatorName: Yup.string(),
    isFeatureProduct: Yup.boolean(),
}

export const ProductCreateSchemaValidate = {
    name: Yup.string().max(50).required(),
    description: Yup.string().min(100).required(),
    price: Yup.number().integer().moreThan(-1).required(),
    available: Yup.number().integer().moreThan(-1).required(),
    creatorId: Yup.string().uuid().required(),
    colors: ProductSearchSchemaValidate.colorHex.required('Color must be array type'),
    roomIds: Yup.array().of(Yup.object({ id: Yup.number().moreThan(-1).required() })),
    cateIds: Yup.array().of(Yup.object({ id: Yup.number().moreThan(-1).required() })),
    imageUrl: Yup.array().of(Yup.object({ id: Yup.number().moreThan(-1).required() })),
}

export const ShoppingCartUpdateSchemaValidate = {
    cartItemId: Yup.string().uuid("Invalid cartItemId").required("cartItemId required"),
    color: Yup.string().max(7, "Color must be hex type"),
    quantities: Yup.number().typeError("Invalid quanitities").moreThan(0)
}

export const ShoppingCartCreateSchemaValidate = {
    productId: Yup.string().uuid("Invalid cartItemId").required("cartItemId required"),
    color: Yup.string().max(7, "Color must be hex type").required("Color is missing"),
    quantities: Yup.number().moreThan(0)
}

export const ShoppingCartDeleteSchemaValidate = {
    cartItemId: Yup.string().uuid("Invalid cartItemId").required("cartItemId required")
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

