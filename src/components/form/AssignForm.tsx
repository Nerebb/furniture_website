import { BASE_URL } from '@/utils/envVariables';
import { loginSchemaValidate, registerSchemaValidate } from '@/utils/schemaValitdate';
import { Gender, IRegister, UserProfile } from '@types';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers } from 'formik';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import Button from '../Button';
import NotFoundPage from '../NotFoundPage';
import FormikField from './FormikField';

export type TFormProps = {
    type:
    | 'register'
    | 'profile'
    | 'login'
    formData?: UserProfile[]
}

const registerUser: UserProfile[] = [
    { id: 0, label: "Login ID", name: 'loginId', inputType: 'text', content: 'Account ID' },
    { id: 1, label: "Password", name: 'password', inputType: 'password', content: 'Account password' },
    { id: 2, label: "Confirm password", name: 'confirmPassword', inputType: 'password', content: 'Confirm password' },
    { id: 3, label: "Email", name: 'email', inputType: 'email', content: 'Account email' },
    { id: 4, label: "Gender", name: 'gender', inputType: 'select', content: Object.values(Gender) },
]

const loginUser: UserProfile[] = [
    { id: 0, label: "Login ID", name: 'loginId', inputType: 'text', content: 'Account ID' },
    { id: 1, label: "Password", name: 'password', inputType: 'password', content: 'Account password' },
]


const FormikForm = ({ formData, type = 'profile' }: TFormProps) => {

    let initValues: IRegister = {
        loginId: "",
        password: '',
        confirmPassword: '',
        email: "",
        gender: Gender.others,
    }

    const validationSchema = type === 'login'
        ? loginSchemaValidate
        : type === 'register' ? registerSchemaValidate
            : {}

    function handleSignIn(auth: string) {
        signIn(auth, { callbackUrl: BASE_URL })
    }

    async function handleSubmit(values: IRegister, { setSubmitting, resetForm }: FormikHelpers<IRegister>) {
        toast.info("Submit create account inprogress", { autoClose: false, toastId: 'submit' })

        await new Promise(r => setTimeout(r, 5000)); // Debounce
        signIn('credentials', { ...values })

        setSubmitting(false);
        toast.update('submit', { type: toast.TYPE.SUCCESS, render: "Account created", autoClose: 2000 })
    }

    switch (type) {
        case 'register':
            formData = registerUser
            break;
        case 'login':
            initValues = {
                loginId: "",
                password: '',
            }
            formData = loginUser
            break;
        default:
            return <NotFoundPage />
    }

    return (
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object(validationSchema)}
            onSubmit={handleSubmit}
        >
            {({ handleReset }) => (
                <Form className={classNames(
                    'flex flex-col space-y-10'
                )}>
                    {formData?.map(row => (
                        <FormikField
                            key={row.id}
                            type={row.inputType}
                            id={row.id}
                            label={row.label}
                            content={row.content}
                            name={row.name}
                        />
                    ))}

                    {/* Button - sub */}
                    <div className={classNames(
                        'space-y-5'
                    )}>
                        <Button text={type === 'register' ? 'Create an account' : 'Login'} type='submit' modifier='w-full flex justify-center py-4 gap-2 text-xl' />
                        <Button text='Sign in with google' modifier='w-full flex justify-center py-4 gap-2 text-xl' variant='outline'
                            onClick={() => handleSignIn('google')}
                        >
                            {/* GoogleSVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                        </Button>
                        <Button text='Sign in with github' modifier='w-full flex justify-center py-4 gap-2 text-xl' variant='outline'
                            onClick={() => handleSignIn('github')}
                        >
                            {/* GitHubkSVG */}
                            <div className='flex justify-center items-center rounded-sm w-8 h-8 p-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="25px" height="24px" viewBox="0 0 24 24" version="1.1">
                                    <g id="surface1">
                                        <path style={{ stroke: "none", fillRule: "evenodd", fill: "rgb(14.117647%,16.078431%,18.431373%)", fillOpacity: "1", }} d="M 11.964844 0 C 5.347656 0 0 5.5 0 12.304688 C 0 17.742188 3.425781 22.347656 8.179688 23.976562 C 8.773438 24.097656 8.992188 23.710938 8.992188 23.386719 C 8.992188 23.101562 8.972656 22.125 8.972656 21.105469 C 5.644531 21.839844 4.953125 19.636719 4.953125 19.636719 C 4.417969 18.210938 3.625 17.84375 3.625 17.84375 C 2.535156 17.089844 3.703125 17.089844 3.703125 17.089844 C 4.914062 17.171875 5.546875 18.355469 5.546875 18.355469 C 6.617188 20.226562 8.339844 19.699219 9.03125 19.371094 C 9.132812 18.578125 9.449219 18.027344 9.785156 17.722656 C 7.132812 17.4375 4.339844 16.378906 4.339844 11.652344 C 4.339844 10.308594 4.8125 9.207031 5.566406 8.351562 C 5.445312 8.046875 5.03125 6.785156 5.683594 5.09375 C 5.683594 5.09375 6.695312 4.765625 8.972656 6.355469 C 9.949219 6.085938 10.953125 5.949219 11.964844 5.949219 C 12.972656 5.949219 14.003906 6.089844 14.957031 6.355469 C 17.234375 4.765625 18.242188 5.09375 18.242188 5.09375 C 18.898438 6.785156 18.480469 8.046875 18.363281 8.351562 C 19.136719 9.207031 19.589844 10.308594 19.589844 11.652344 C 19.589844 16.378906 16.796875 17.417969 14.125 17.722656 C 14.558594 18.109375 14.933594 18.84375 14.933594 20.003906 C 14.933594 21.65625 14.914062 22.980469 14.914062 23.386719 C 14.914062 23.710938 15.132812 24.097656 15.726562 23.976562 C 20.480469 22.347656 23.910156 17.742188 23.910156 12.304688 C 23.929688 5.5 18.558594 0 11.964844 0 Z M 11.964844 0 " />
                                    </g>
                                </svg>
                            </div>
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default FormikForm