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
        const res = await axios.get(`https://eziotravels.com/api/service/${id}`, {
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
                        <div className="container my-4">
  <div className="row justify-content-center">
    <div className="col-md-6">
      <div className="shadow-sm">
        <div className="card-body">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{service.name}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{service.description}</td>
              </tr>
              <tr>
                <th>Duration</th>
                <td>{service.duration} days</td>
              </tr>
              <tr>
                <th>Price</th>
                <td>Rs. {service.price}</td>
              </tr>
              <tr>
                <th>Itinerary</th>
                <td>
                  <ul className="mb-0 ps-3">
                    {service.itinerary?.map((item, index) => (
                      <li key={index} className="mb-2">
                        <div><strong>Day {index + 1}</strong></div>
                        <div><strong>Destination:</strong> {item.destination}</div>
                        <div><strong>Activities:</strong> {item.activities[0]?.map(a => a.activity).join(', ')}</div>
                      </li>
                    ))}
                  </ul>
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
