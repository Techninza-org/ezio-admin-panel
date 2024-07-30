import { CCard, CCardBody } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppSidebar, AppHeader } from '../../../components/index'

export default function BidDetails() {
    const [service, setService] = useState({})
    const { id } = useParams()
    async function getService() {
        const token = localStorage.getItem('token')
        const res = await axios.get(`http://103.189.173.132:3000/service/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setService(res.data.service)
    }
    useEffect(() => {
        getService()
    }, [])

    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <div className='mb-4'>
                        <h4 className='mt-2 mb-2 text-center'>{service.name}</h4>
                        <div className='col-md-6 mx-auto'>
                            <CCard className='d-flex justify-content-center '>
                                <CCardBody>
                                    <div>
                                        <p><span style={{ fontWeight: 'bold' }}>Name:</span> {service.name}</p>
                                        <p><span style={{ fontWeight: 'bold' }}>Description:</span> {service.description}</p>
                                        <p><span style={{ fontWeight: 'bold' }}>Duration:</span> {service.duration} days</p>
                                        <p><span style={{ fontWeight: 'bold' }}>Price:</span> Rs. {service.price}</p>
                                        <p><span style={{ fontWeight: 'bold' }}>Itinerary:</span></p>
                                        <ul>
                                            {
                                                service.itinerary?.map((item, index) => (
                                                    <li key={index}>
                                                        <p><span style={{ fontWeight: 'bold' }}>Day {index + 1}</span></p>
                                                        <p><span style={{ fontWeight: 'bold' }}>Destination:</span> {item.destination}</p>
                                                        <p><span style={{ fontWeight: 'bold' }}>Activities:</span> {item.activities[0].map(activity => activity.activity).join(', ')}</p>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
