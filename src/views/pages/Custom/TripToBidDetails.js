import { CCard, CCardBody } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppSidebar, AppHeader } from '../../../components/index'

export default function TripToBidDetails() {
    const [trip, setTrip] = useState({})
    const { id } = useParams()
    useEffect(() => {
        async function getTrip() {
            const token = localStorage.getItem('token')
            const res = await axios.get(`http://103.189.173.132:3000/custom/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setTrip(res.data.custom_trip)
        }
        getTrip()
    }, [])

    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <h4 className='mt-1 mx-3 mb-4'>CUSTOM TRIP DETAILS</h4>
                    <div className='col-md-6 mx-auto mb-4 lh-1'>
                        <CCard className='d-flex justify-content-center '>
                            <CCardBody>
                                <div>
                                    <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>User:</span> {trip.user?.username}</p>
                                    <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Phone:</span> {trip.user?.phone}</p>
                                    <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>No. of people:</span> {trip.number_of_people}</p>
                                    <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Start Date:</span>{trip.start_date}</p>
                                    <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>End Date:</span>{trip.end_date}</p>
                                    <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Itinerary:</span></p>
                                    <ul>
                                        {
                                            trip.itinerary?.map((item, index) => (
                                                <li key={index}>
                                                    <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Day {index + 1}</span></p>
                                                    <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Destination:</span> {item.destination}</p>
                                                    <p><span style={{ fontWeight: 'bold', marginRight: '20px'  }}>Activities:</span> {item.selectedActivities?.join(', ') ?? ''}</p>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <Link to={`/bidding/service/${id}`}><button className='btn btn-primary'>Bid Your Service</button></Link>
                            </CCardBody>
                        </CCard>
                    </div>
                </div>
            </div>
        </>
    )
}
