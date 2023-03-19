import { ProductSearch } from '@/pages/api/products'
import { Gender } from '@prisma/client'
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

export const ProductSearchSchemaValidate = {
    limit: Yup.number().integer().positive(),
    skip: Yup.number().integer().positive(),
    rating: Yup.number().integer().positive().max(5),
    fromPrice: Yup.number().integer().positive(),
    toPrice: Yup.number().integer().positive(),
    available: Yup.boolean(),
    cateId: Yup.array().of(Yup.number().positive().required()),
    colorHex: Yup.array().of(Yup.string().max(7).required()),
    roomId: Yup.array().of(Yup.number().positive().required()),
    createdDate: Yup.date(),
    name: Yup.string().max(50),
    creatorName: Yup.string(),
    isFeatureProduct: Yup.boolean(),
}

export const ProductCreateSchemaValidate = {
    name: Yup.string().max(50).required(),
    description: Yup.string().min(100).required(),
    price: Yup.number().integer().positive().required(),
    available: Yup.number().integer().positive().required(),
    creatorId: Yup.string().uuid().required(),
    colors: ProductSearchSchemaValidate.colorHex,
    roomIds: Yup.array().of(Yup.object({ id: Yup.number().positive().required() })),
    cateIds: Yup.array().of(Yup.object({ id: Yup.number().positive().required() })),
    imageUrls: Yup.array().of(Yup.object({ id: Yup.number().positive().required() })),
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

