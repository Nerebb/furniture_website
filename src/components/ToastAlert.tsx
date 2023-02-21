import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";

type Props = {}

export default function ToastAlert({ }: Props) {
    return (
        <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    )
}