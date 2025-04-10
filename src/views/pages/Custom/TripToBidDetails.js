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
            const res = await axios.get(`https://eziotravels.com/api/custom/${id}`, {
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
                    <div className="container my-4">
  <div className="row justify-content-center">
    <div className="col-md-8">
      <div className="shadow-sm">
        <div className="card-body lh-sm">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>User</th>
                <td>{trip.user?.username}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{trip.user?.phone}</td>
              </tr>
              <tr>
                <th>No. of People</th>
                <td>{trip.number_of_people}</td>
              </tr>
              <tr>
                <th>Start Date</th>
                <td>{trip.start_date}</td>
              </tr>
              <tr>
                <th>End Date</th>
                <td>{trip.end_date}</td>
              </tr>
              <tr>
                <th>Itinerary</th>
                <td>
                  <ul className="mb-0 ps-3">
                    {trip.itinerary?.map((item, index) => (
                      <li key={index} className="mb-2">
                        <div><strong>Day {index + 1}</strong></div>
                        <div><strong>Destination:</strong> {item.destination}</div>
                        <div><strong>Activities:</strong> {item.selectedActivities?.join(', ') ?? ''}</div>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-end">
            <Link to={`/bidding/service/${id}`}>
              <button className="btn btn-primary">Bid Your Service</button>
            </Link>
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
