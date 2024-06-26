import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { AppSidebar, AppHeader } from '../../../components/index'

const AllBids = () => {
    const [services, setServices] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')
    async function getServices() {
        const res = await axios.get(`http://103.189.173.132:3000/service/host/bids/${user.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const ser = res.data.bids;
        console.log(ser);
        setServices(ser);
    }

    const columns = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                accessorFn: (dataRow) => <Link to={`/service/bid/${dataRow.id}`} style={{ textDecoration: 'none' }}>{dataRow.name}</Link>,
            },
            {
                header: 'Duration (days)',
                accessorKey: 'duration',
            },
            {
                header: 'Total Price',
                accessorKey: 'price',
            },
            // {
            //     header: 'Edit',
            //     accessorFn: (dataRow) => <Link to={`/service/edit/${dataRow.id}`} className="btn btn-primary"><CIcon icon={cilPencil} /></Link>,
            // },
        ],
        [],
    );

    useEffect(() => {
        getServices();
    }, [])

    const table = useMantineReactTable({
        columns,
        data: services,
        enableRowSelection: false,
        enableColumnOrdering: false,
        enableGlobalFilter: true,
    });

    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <div className='mt-3 mx-5'>
                        <h1 className='text-center mb-4'>My Bids</h1>
                        <MantineReactTable table={table} />
                    </div>
                </div>
            </div>
        </>

    )
}
export default AllBids
