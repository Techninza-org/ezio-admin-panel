import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { AppSidebar, AppHeader } from '../../../components/index'

const AllServices = () => {
    const [services, setServices] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')
    async function getServices() {
        const res = await axios.get(`http://103.189.173.132:3000/service/host/${user.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const ser = res.data.services;
        setServices(ser);
    }

    const columns = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                accessorFn: (dataRow) => <Link to={`/service/${dataRow.id}`} style={{ textDecoration: 'none' }}>{dataRow.name}</Link>,
            },
            {
                header: 'Destination',
                accessorKey: 'destination',
            },
            {
                header: 'Duration (days)',
                accessorKey: 'duration',
            },
            {
                header: 'Price / Night',
                accessorKey: 'price',
            },
            {
                header: 'Edit',
                accessorFn: (dataRow) => <Link to={`/service/edit/${dataRow.id}`} className="btn btn-primary"><CIcon icon={cilPencil} /></Link>,
            },
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
                    <div className='mt-1 mx-3'>
                        <h4 className='mb-2'>ALL SERVICES</h4>
                        <MantineReactTable table={table} />
                    </div>
                </div>
            </div>
        </>

    )
}
export default AllServices
