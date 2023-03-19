import useProductFilter from '@/hooks/useProductFilter'
import FilterCard from '../form/FilterCard'
import FilterForm from '../form/FilterForm'
import FormikField from '../form/FormikField'

type Props = {}

export default function ProductSideMenu({ }: Props) {
    const categories = useProductFilter({ filter: 'category' })
    const colors = useProductFilter({ filter: 'color' })
    const rooms = useProductFilter({ filter: 'room' })

    return (
        <FilterForm classname='space-y-5 sticky top-25'>
            <FilterCard title='categories' name="cateId" data={categories.data} isLoading={categories.isLoading} />
            <FilterCard title='colors' name="colorHex" data={colors.data} isLoading={colors.isLoading} />
            <FilterCard title='rooms' name="roomId" data={rooms.data} isLoading={rooms.isLoading} />
            <FilterCard title='price' isLoading={false}>
                <div className='flex-center py-5'>
                    <FormikField type='priceInput' id='fromPrice' name="fromPrice" label='From price' />
                    <p className='text-center w-20'>-</p>
                    <FormikField type='priceInput' id='toPrice' name="toPrice" label='To price' />
                </div>
            </FilterCard>
        </FilterForm>
    )
}