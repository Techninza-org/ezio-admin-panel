import { CCard, CCardBody, CCardText, CCardTitle } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppSidebar, AppHeader } from '../../../components/index'

export default function ServiceDetails() {
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
                    <div >
                        <h4 className='text-center mb-2'>{service.name}</h4>
                        <div className='col-md-6 mx-auto mb-3'>
                            <CCard className='d-flex justify-content-center'>
                                <CCardBody>
                                    <div className='lh-1'>
                                        <p><span style={{ fontWeight: 'bold', marginRight: '20px' }}>Destination:</span> {service.destination}</p>
                                        <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Description:</span> {service.description}</p>
                                        <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Duration:</span> {service.duration} days</p>
                                        <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Price:</span> Rs. {service.price} / Night</p>
                                        <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Rating:</span> {service.rating}</p>
                                        <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Services:</span></p>
                                        <ul className="">
                                            {
                                                service.services?.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))
                                            }
                                        </ul>
                                        <p><span style={{ fontWeight: 'bold' }}>Itinerary:</span></p>
                                        <ol className="">
                                            {
                                                service?.itinerary?.map((itinerary, index) => (
                                                    <li key={index}>{itinerary}</li>
                                                ))
                                            }
                                        </ol>
                                        <p><span style={{ fontWeight: 'bold' }}>Images</span></p>
                                        <div style={{ display: 'flex', overflowX: 'auto', gap: '10px' }}>
                                            {
                                                service?.images?.map((image, index) => (
                                                    <img key={index} src={image} alt='service' style={{ width: '50%', height: '100%', objectFit: 'cover' }} />
                                                ))
                                            }
                                        </div>
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
