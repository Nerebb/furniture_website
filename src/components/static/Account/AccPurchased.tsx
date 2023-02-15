import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ColDef,
    ColGroupDef,
    GetRowIdFunc,
    GetRowIdParams,
    Grid,
    GridOptions,
    RowSelectedEvent,
    ValueFormatterParams,
} from 'ag-grid-community';
import { IProduct } from 'type';

interface IProductTable extends IProduct {

}

export default function ProductTable() {
    const gridRef = useRef<AgGridReact<IProductTable>>(null);

    const [rowData, setRowData] = useState<IProductTable[]>([
        { id: 0, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 1, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 2, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 3, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 4, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 5, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 6, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 7, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 8, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 9, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 10, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 11, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 12, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 13, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 14, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 15, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 16, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
        { id: 17, category: ["sofa"], name: 'test', color: "Grey", price: 5000, available: 10, createdDate: "12/12/21", description: "", shiper: "Test", imageUrl: [""], updatedDate: "12/12/23" },
    ]);

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { headerName: 'Name', field: 'name', filter: "agTextColumnFilter", flex: 1 },
        { headerName: 'Category', field: 'category', filter: "agTextColumnFilter", minWidth: 120, maxWidth: 180 },
        { headerName: 'Color', field: 'color', filter: "agTextColumnFilter", width: 120, cellStyle: { textAlign: 'center' } },
        {
            headerName: 'Price',
            field: 'price',
            valueFormatter: (params: ValueFormatterParams<IProductTable, number>) => {
                // params.value: number
                return params.value + " ₫";
            },
            filter: "agNumberColumnFilter",
            width: 120,
            cellStyle: { textAlign: 'end' }
        },
        { headerName: 'Shiper', field: 'shiper', filter: "agTextColumnFilter", width: 110, },
        { headerName: 'Purchased date', field: 'createdDate', filter: "agDateColumnFilter", width: 200, cellStyle: { textAlign: "center" } },
    ]);

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            sortable: true,
            editable: false,
            // enable floating filters by default
            // floatingFilter: true,
            // make columns resizable
            resizable: true,
        };
    }, []);
    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams<IProductTable>) => {
            // params.data : IProductTable
            return params.data.id + params.data.name;
        };
    }, []);

    const onRowSelected = useCallback((event: RowSelectedEvent<IProductTable>) => {
        // event.data: IProductTable | undefined
        if (event.data) {
            const price = event.data.price;
            console.log('Price with 10% discount:', price * 0.9);
        }
    }, []);

    const setAutoHeight = useCallback(() => {
        gridRef.current!.api.setDomLayout('autoHeight');
        // auto height will get the grid to fill the height of the contents,
        // so the grid div should have no height set, the height is dynamic.
        (document.querySelector<HTMLElement>('#myGrid')! as any).style.height = '';
    }, []);

    return (
        <div className='h-full w-full'>
            <div className="ag-theme-material w-full border rounded-lg shadow-lg">
                <AgGridReact<IProductTable>
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowSelection={'multiple'}
                    getRowId={getRowId}
                    onRowSelected={onRowSelected}

                    paginationPageSize={10}
                    domLayout={'autoHeight'}
                    pagination={true}
                ></AgGridReact>
            </div>
        </div>
    );
};
