import React, { useEffect, useState } from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
  const [serviceCount, setServiceCount] = useState(0)
  const [tripCount, setTripCount] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    let loggedIn = false;
    if (localStorage.getItem('user')) {
      loggedIn = true;
    }
    if (!loggedIn) {
      navigate('/login')
    }
    if (loggedIn) {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      const user_id = JSON.parse(user).id
      async function getServices() {
        const res = await axios.get(`http://103.189.173.132:3000/service/host/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setServiceCount(res.data.count)
      }
      async function getTrips() {
        const res = await axios.get(`http://103.189.173.132:3000/host/trips?id=${user_id}`,{
          headers: {
          Authorization: `Bearer ${token}`
          }
        })
        setTripCount(res.data.count)
      }

      getServices()
      getTrips()
    }
  }, [])



  return (
    <div>
      <CCard
        textBgColor={'primary'}
        className="mb-3"
        style={{ maxWidth: '18rem' }}
      >
        <CCardHeader>Services</CCardHeader>
        <CCardBody>
          <CCardTitle>Total Services: {serviceCount}</CCardTitle>
        </CCardBody>
      </CCard>
      <CCard
        textBgColor={'secondary'}
        className="mb-3"
        style={{ maxWidth: '18rem' }}
      >
        <CCardHeader>Trips</CCardHeader>
        <CCardBody>
          <CCardTitle>Total Trips: {tripCount}</CCardTitle>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Dashboard
