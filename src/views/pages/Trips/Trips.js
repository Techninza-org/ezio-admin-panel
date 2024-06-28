import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Link } from 'react-router-dom';
import { cilDescription, cilPencil, cilTransfer } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { AppSidebar, AppHeader } from '../../../components/index'

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const user_id = JSON.parse(localStorage.getItem('user')).id
    useEffect(() => {
        async function getTrips() {
            const token = localStorage.getItem('token')
            const res = await axios.get(`http://103.189.173.132:3000/host/trips?id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const trips = res.data.trips;
            setTrips(trips);
        }
        getTrips();
    }, [])

    const columns = useMemo(
        () => [
            {
                header: 'Details',
                accessorFn: (dataRow) => <Link to={`/trip/${dataRow.id}`}><CIcon icon={cilDescription} /></Link>,
                size: 50,
            },
            {
                header: 'Name',
                accessorKey: 'user.username',
                size: 100,
            },
            {
                header: 'Phone',
                accessorKey: 'user.phone',
                size: 100,
            },
            {
                header: 'Destination',
                accessorKey: 'destination',
                size: 150
            },
            {
                header: 'Duration (days)',
                accessorKey: 'service.duration',
                size: 50,
            },
            {
                header: 'People',
                accessorKey: 'number_of_people',
                size: 50,
            },
            {
                header: 'Start Date',
                accessorKey: 'start_date',
                size: 100,
            },
            {
                header: 'End Date',
                accessorKey: 'end_date',
                size: 100,
            },
            {
                header: 'Booking Price',
                accessorKey: 'cost',
                size: 100,
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data: trips,
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
                        <h4 className='mb-2'>ALL TRIPS</h4>
                        <MantineReactTable table={table} />
                    </div>
                </div>
            </div>
        </>
    )
}