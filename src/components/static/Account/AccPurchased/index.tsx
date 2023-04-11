import Button from '@/components/Button';
import axios from '@/libs/axiosApi';
import { fCurrency } from '@/libs/utils/numberal';
import { UserOrder } from '@/pages/api/user/order';
import { Transition } from '@headlessui/react';
import { Status } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import {
    ColDef, GetRowIdFunc,
    GetRowIdParams, ValueFormatterParams
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import OrderProductsGrid from './OrderProductsGrid';


export default function AccPurchased() {
    //CustomState
    const [detailOrder, setDetailOrder] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<{ id: string, updateAt: string }>()

    //AG-GRID
    const [rowData, setRowData] = useState<UserOrder[]>();
    console.log("🚀 ~ file: index.tsx:24 ~ AccPurchased ~ rowData:", rowData)
    const gridRef = useRef<AgGridReact<UserOrder>>(null);

    const { data: userOrder, isLoading, isError } = useQuery({
        queryKey: ['PurchasedOrders'],
        queryFn: () => axios.getUserOrders(0, Status.completed),
        onSuccess: (data) => setRowData(data)
    })

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { headerName: 'Order ID', field: 'id', filter: "agTextColumnFilter", flex: 1, minWidth: 120 },
        { headerName: 'Billing address', field: 'billingAddress', filter: "agTextColumnFilter", minWidth: 120, maxWidth: 180 },
        { headerName: 'Shipping address', field: 'shippingAddress', filter: "agTextColumnFilter", minWidth: 120, maxWidth: 180 },
        {
            headerName: 'Shipping',
            field: 'shippingFee',
            valueFormatter: (params: ValueFormatterParams<UserOrder, number>) => {
                // params.value: number
                const formatedNum = fCurrency(params.value)
                return formatedNum;
            },
            filter: "agNumberColumnFilter",
            width: 125,
            cellStyle: { textAlign: 'end' }
        },
        {
            headerName: 'Sub total',
            field: 'subTotal',
            valueFormatter: (params: ValueFormatterParams<UserOrder, number>) => {
                // params.value: number
                const formatedNum = fCurrency(params.value)
                return formatedNum;
            },
            filter: "agNumberColumnFilter",
            width: 150,
            cellStyle: { textAlign: 'end' }
        },
        {
            headerName: 'Total',
            field: 'total',
            valueFormatter: (params: ValueFormatterParams<UserOrder, number>) => {
                // params.value: number
                const formatedNum = fCurrency(params.value)
                return formatedNum;
            },
            filter: "agNumberColumnFilter",
            width: 150,
            cellStyle: { textAlign: 'end' }
        },
        { headerName: 'Purchased date', field: 'createdDate', filter: "agDateColumnFilter", width: 200, cellStyle: { textAlign: "center" } },
        { headerName: 'Completed date', field: 'updatedAt', filter: "agDateColumnFilter", width: 200, cellStyle: { textAlign: "center" } },
    ]);

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            sortable: true,
            editable: false,
            resizable: true,
        };
    }, []);

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams<UserOrder>) => {
            // params.data : UserOrder
            return params.data.id;
        };
    }, []);

    const onSelectionChanged = useCallback(
        () => {
            const selectedRow = gridRef.current!.api.getSelectedRows()
            if (selectedRow.length === 1) setSelectedRow({ id: selectedRow[0].id, updateAt: selectedRow[0].updatedAt })
        },
        [],
    )


    function handleOnClick() {
        if (selectedRow) setDetailOrder(true)
    }

    return (
        <div className='h-full w-full space-y-8'>
            {/* UserOrders - paginated on clientside */}
            <div className="relative ag-theme-material w-full border rounded-lg shadow-lg">
                <AgGridReact<UserOrder>
                    //Data
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}

                    //Table functions - params - filter - pagination
                    getRowId={getRowId}
                    onSelectionChanged={onSelectionChanged}
                    rowSelection={'single'}
                    paginationPageSize={!detailOrder ? 10 : 5}
                    pagination={true}
                    domLayout={'autoHeight'}
                />
                <Transition
                    as="div"
                    className='absolute left-2 bottom-3'
                    show={Boolean(selectedRow) && !detailOrder}
                    enter='transform transition duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                >
                    <Button text='Get Detail' modifier='px-10 py-2' glowModify='noAnimation' onClick={handleOnClick} />
                </Transition>
            </div>


            {/* Selected detailOrders */}
            {/* {selectedRow && <OrderProductsGrid orderId={selectedRow} />} */}
            <Transition
                show={detailOrder}
                enter='transform transition duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='transform transition duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
            >
                {selectedRow && <div>
                    <div className='mb-2 flex justify-between text-lg font-semibold'>
                        <p>Detail Orders: {selectedRow.id}</p>
                        <p>Compeleted Date: {new Date(selectedRow.updateAt).toISOString().substring(0, 10)}</p>
                    </div>
                    <OrderProductsGrid orderId={selectedRow.id} defaultColDef={defaultColDef} />
                </div>}
            </Transition>
        </div>
    );
};
