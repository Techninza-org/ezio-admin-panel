import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Link } from 'react-router-dom';
import { cilDescription, cilPencil, cilTransfer } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { AppSidebar, AppHeader } from '../../../components/index'

export default function CustomTripsToBid() {
    const [trips, setTrips] = useState([]);
    useEffect(() => {
        async function getTrips() {
            const token = localStorage.getItem('token')
            const res = await axios.get(`http://103.189.173.132:3000/custom/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const trips = res.data.custom_trips;
            setTrips(trips);
        }
        getTrips();
    }, [])

    const columns = useMemo(
        () => [
            {
                header: 'Details',
                accessorFn: (dataRow) => <Link to={`/bidding/details/${dataRow.id}`}><CIcon icon={cilDescription} /></Link>,
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
                        <h4 className=' mb-2 text-sm'>TRIPS FOR BIDDING</h4>
                        <MantineReactTable table={table} />
                    </div>
                </div>
            </div>
        </>
    )
}