import { CCard, CCardBody, CCardHeader, CCardTitle } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Profile() {
    const [profile, setProfile] = useState({})
    useEffect(() => {
        async function getProfile() {
            const token = localStorage.getItem('token')
            const userId = JSON.parse(localStorage.getItem('user')).id
            const res = await axios.get(`http://localhost:3000/host/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data);
            setProfile(res.data.host)
        }
        getProfile()
    }, [])
    return (
        <div>
            <h1 className='text-center mt-4 mb-4'>Profile</h1>
            <CCard className='mx-auto w-75'>
                <CCardBody className='d-flex'>
                    <div className='w-50 d-flex justify-content-center'>
                        <p>Image</p>
                    </div>
                    <div >
                        <p><span style={{ fontWeight: 'bold' }}>Username:</span> {profile.username}</p>
                        <p><span style={{ fontWeight: 'bold' }}>Name:</span> {profile.name}</p>
                        <p><span style={{ fontWeight: 'bold' }}>Email:</span> {profile.email}</p>
                        <p><span style={{ fontWeight: 'bold' }}>Phone:</span> {profile.phone}</p>
                    </div>
                </CCardBody>
            </CCard>
        </div>
    )
}
