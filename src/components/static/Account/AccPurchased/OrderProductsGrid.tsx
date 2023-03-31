import axios from '@/libs/axiosApi';
import { fCurrency } from '@/libs/utils/numberal';
import { useQuery } from '@tanstack/react-query';
import { ColDef, GetRowIdFunc, GetRowIdParams, ValueFormatterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { GetColorName } from 'hex-color-to-color-name';
import React, { useMemo, useRef, useState } from 'react'

type Props = {
    orderId?: string
    defaultColDef: ColDef
}

type OrderedItemGrid = {
    productId: string,
    name: string
    color: string
    quantities: number
    salePrice: number
    totalPrice: number
}


export default function OrderProductsGrid({ orderId, defaultColDef }: Props) {
    //CustomState
    const [rowData, setRowData] = useState<OrderedItemGrid[]>();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['DetailOrder', orderId],
        queryFn: () => axios.getOrderedProducts(orderId!),
        enabled: !!orderId,
        onSuccess: (data) => {
            const responseData = data.map(orderItem => {
                const orderColors = orderItem.colors as Array<{ id: string, quantities: number }>
                const productbyColor: OrderedItemGrid[] = orderColors.map(color => ({
                    productId: orderItem.id,
                    name: orderItem.name,
                    color: GetColorName(color.id),
                    quantities: color.quantities,
                    salePrice: orderItem.salePrice,
                    totalPrice: color.quantities * orderItem.salePrice
                }))
                return productbyColor
            })

            setRowData(responseData.flat())
        }
    })

    //AG-GRID
    const gridRef = useRef<AgGridReact<OrderedItemGrid>>(null);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { headerName: 'Product ID', field: 'productId', filter: "agTextColumnFilter", flex: 1 },
        { headerName: 'Product Name', field: 'name', filter: "agTextColumnFilter", minWidth: 120, maxWidth: 180 },
        { headerName: 'Color', field: 'color', filter: "agTextColumnFilter", width: 120 },
        { headerName: 'Quantities', field: 'quantities', filter: "agTextColumnFilter", width: 125, cellStyle: { textAlign: 'center' } },
        {
            headerName: 'Sale price',
            field: 'salePrice',
            valueFormatter: (params: ValueFormatterParams<OrderedItemGrid, number>) => {
                // params.value: number
                const formatedNum = fCurrency(params.value)
                return formatedNum
            },
            filter: "agNumberColumnFilter",
            width: 135,
            cellStyle: { textAlign: 'end' }
        },
        {
            headerName: 'Total price',
            field: 'totalPrice',
            valueFormatter: (params: ValueFormatterParams<OrderedItemGrid, number>) => {
                // params.value: number
                const formatedNum = fCurrency(params.value)
                return formatedNum
            },
            filter: "agNumberColumnFilter",
            width: 135,
            cellStyle: { textAlign: 'end' }
        },
    ]);

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams<OrderedItemGrid>) => {
            // params.data : UserOrder
            return params.data.productId + params.data.color;
        };
    }, []);

    return (
        <div className="ag-theme-material w-full border rounded-lg shadow-lg">
            {rowData && <AgGridReact
                //Data
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}

                //TableFunctions
                getRowId={getRowId}
                rowSelection={'single'}
                paginationPageSize={10}
                pagination={true}
                domLayout={'autoHeight'}
            />}
        </div>
    )
}