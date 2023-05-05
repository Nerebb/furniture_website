import { MoonIcon } from '@heroicons/react/20/solid';
import { SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from "next-themes";
import Button, { ButtonProps } from '../Button';

type Props = Omit<ButtonProps, ''>

export default function SwitchTheme({ ...props }: Props) {
    const { systemTheme, theme, setTheme } = useTheme();

    function handleOnchange() {
        theme == "dark" ? setTheme('light') : setTheme("dark")
    }

    return (
        <Button
            variant='plain'
            glowEffect={false}
            {...props}
            onClick={handleOnchange}
        >
            {theme === 'light' ? (
                <SunIcon className='w-6 h-6' />
            ) : (
                <MoonIcon className='w-6 h-6 dark:text-white' />
            )}
        </Button>
    )
}