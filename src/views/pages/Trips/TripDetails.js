import { CCard, CCardBody, CCardText, CCardTitle } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppSidebar, AppHeader } from '../../../components/index'

export default function TripDetails() {
    const [trip, setTrip] = useState({})
    const [service, setService] = useState({})
    const { id } = useParams()
    useEffect(() => {
        async function getTrip() {
            const token = localStorage.getItem('token')
            const res = await axios.get(`https://eziotravels.com/api/host/trip/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setTrip(res.data.trip)
            setService(res.data.trip.service)
        }
        getTrip()
    }, [])

    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <div >
                        <h4 className='text-center mt-2 mb-2'>{trip.user?.username}</h4>
                        <div className="container my-4">
                            <div className="row justify-content-center">
                                <div className="col-md-8">
                                    <div className="shadow-sm">
                                        <div className="card-body">
                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">Destination</th>
                                                        <td>{service?.destination}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Description</th>
                                                        <td>{service?.description}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">No. of People</th>
                                                        <td>{trip.number_of_people}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Phone</th>
                                                        <td>{trip.user?.phone}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Duration</th>
                                                        <td>{service?.duration} days</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Start Date</th>
                                                        <td>{trip.start_date}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">End Date</th>
                                                        <td>{trip.end_date}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Booking Price</th>
                                                        <td>Rs. {trip.cost}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Service Name</th>
                                                        <td>{trip.service?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Services</th>
                                                        <td>
                                                            <ul className="mb-0 ps-3">
                                                                {service?.services?.map((s, i) => (
                                                                    <li key={i}>{s}</li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Itinerary</th>
                                                        <td>
                                                            <ol className="mb-0 ps-3">
                                                                {service?.itinerary?.map((item, idx) => (
                                                                    <li key={idx}>{item}</li>
                                                                ))}
                                                            </ol>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
