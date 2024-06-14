import { CCard, CCardBody, CCardText, CCardTitle } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function ServiceDetails() {
    const [service, setService] = useState({})
    const { id } = useParams()
    async function getService() {
        const token = localStorage.getItem('token')
        const res = await axios.get(`http://103.189.172.172:3000/service/${id}`, {
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
        <div >
            <h1 className='text-center mt-4 mb-4'>{service.name}</h1>
            <div className='col-md-6 mx-auto'>
                <CCard className='d-flex justify-content-center '>
                    <CCardBody>
                        <div>
                            <p><span style={{ fontWeight: 'bold' }}>Destination:</span> {service.destination}</p>
                            <p><span style={{ fontWeight: 'bold' }}>Description:</span> {service.description}</p>
                            <p><span style={{ fontWeight: 'bold' }}>Duration:</span> {service.duration} days</p>
                            <p><span style={{ fontWeight: 'bold' }}>Price:</span> Rs. {service.price} / Night</p>
                            <p><span style={{ fontWeight: 'bold' }}>Rating:</span> {service.rating}</p>
                            <p><span style={{ fontWeight: 'bold' }}>Services:</span></p>
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
                                        <img key={index} src={image} alt='service' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ))
                                }
                            </div>
                        </div>
                    </CCardBody>
                </CCard>
            </div>
        </div>
    )
}
