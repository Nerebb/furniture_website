import { Gender } from '@types'
import * as Yup from 'yup'
const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

export const UserSchemaValidate = {
    name: Yup.string().lowercase().max(10, 'Must lesser than 10 characters'),
    nickName: Yup.string().lowercase().max(10, "Must lesser than 10 characters"),
    address: Yup.string().lowercase().max(50, "Must lesser than 10 characters"),
    email: Yup.string().email().typeError("Invalid email"),
    gender: Yup.string().lowercase().oneOf(['male', 'female', 'others'], "Allowed field: male, female, others"),
    phoneNumber: Yup.string().matches(phoneRegExp, "Invalid phone number"),
    birthDay: Yup.string().typeError("Invalid date"),
}

export const registerSchemaValidate = {
    loginId: UserSchemaValidate.name.required("Login ID field missing"),
    password: Yup.string().max(20, 'Must lesser than 20 characters').required('Password field missing'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords dont match').required('Password field missing'),
    email: Yup.string().email().typeError("Invalid email").required("Email field missing"),
    gender: Yup.string().lowercase().oneOf(Object.values(Gender), "Invalid gender")
}

export const loginSchemaValidate = {
    loginId: registerSchemaValidate.loginId,
    password: registerSchemaValidate.password,
}