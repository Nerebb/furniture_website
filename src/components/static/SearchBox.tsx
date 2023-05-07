import { useSearchContext } from '@/contexts/searchProductContext'
import useBrowserWidth from '@/hooks/useBrowserWidth'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { ChangeEvent } from 'react'

interface SearchBoxProps {
    modifier?: string,
}

const SearchBox: React.FC<SearchBoxProps> = ({
    modifier,
}) => {
    const { searchContext, setSearchContext } = useSearchContext()
    const router = useRouter()

    async function handleOnchange(e: React.ChangeEvent<HTMLInputElement>) {
        await new Promise(r => setTimeout(r, 1000))//Debounce
        setSearchContext({ ...searchContext, name: e.target.value })

    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' && router.asPath !== '/products') handleOnClickIcon()
    }

    function handleOnClickIcon() {
        if (!searchContext.name) return
        router.push('/products')
    }

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
                    {
                        'w-4/5 opacity-100': searchContext.name
                    }
                )}
                placeholder='Type keywords ...'
                onChange={handleOnchange}
                onKeyDown={handleKeyDown}
            >
            </input>
            <label htmlFor='searchbox'>
                <MagnifyingGlassIcon
                    className='w-6 h-6 absolute right-2 top-[6px] text-priBlack cursor-pointer'
                    onClick={handleOnClickIcon}
                />
            </label>
        </div>
    )
}

export default SearchBox