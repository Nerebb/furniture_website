import useBrowserWidth from '@/hooks/useBrowserWidth'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React from 'react'

interface SearchBoxProps {
    modifier?: string,
    onChange?: () => string
    onClick?: () => void
}

const SearchBox: React.FC<SearchBoxProps> = ({
    modifier,
    onClick,
    onChange,
}) => {
    return (
        <div className="relative mx-3 w-full h-[36px] flex-1 flex justify-end group">
            <input
                id='searchbox'
                className={classNames(
                    'w-0 opacity-0 h-full pl-2 border-solid border-0.5 rounded-lg outline-priBlue-500 transition-all duration-1000',
                    'group-hover:opacity-100 group-hover:xl:w-4/5 group-hover:border group-hover:border-b group-hover:border-priBlue-400 group-focus:outline-0.5',
                    'focus:opacity-100 focus:w-full focus:xl:w-4/5',
                    //Darkmode,
                    'dark:outline-priBlack-500 dark:text-black',
                )}
                placeholder='Type keywords ...'
                onClick={onClick}
                onChange={onChange}
            >
            </input>
            <label htmlFor='searchbox'>
                <MagnifyingGlassIcon className='w-6 h-6 absolute right-2 top-[6px] text-priBlack cursor-pointer' />
            </label>
        </div>
    )
}

export default SearchBox