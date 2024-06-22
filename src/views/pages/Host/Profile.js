import { cilCamera } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Profile() {
    const [profile, setProfile] = useState({})
    useEffect(() => {
        getProfile()
    }, [])

    const fileInputRef = useRef();

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    async function getProfile() {
        const token = localStorage.getItem('token')
        const userId = JSON.parse(localStorage.getItem('user')).id
        const res = await axios.get(`http://103.189.172.172:3000/host/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setProfile(res.data.host)
    }

    const handleUploadPic = async (e) => {
        e.preventDefault();
        const file = e.target.files[0]; 
        const formData = new FormData();
        formData.append('file', file); 
        formData.append('upload_preset', 'c3k94jx2'); 
        formData.append('folder', 'ezio_vendor'); 
    
        try {
            const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/dr4iluda9/image/upload', formData);
    
            const imageUrl = await cloudinaryResponse.data.secure_url;
    
            const token = localStorage.getItem('token'); 
            const profileId = profile.id; 
            const updateProfileResponse = await axios.post(`http://103.189.172.172:3000/host/profile/${profileId}`, {photo: imageUrl}, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            console.log(updateProfileResponse.data);
    
            window.location.reload();
        } catch (error) {
            console.error('Error uploading image or updating profile:', error);
        }
    };
    

    return (
        <div>
            <h1 className='text-center mt-4 mb-4'>Profile</h1>
            <CCard className='mx-auto w-75'>
                <CCardBody className='d-flex'>
                    <div className='w-50 d-flex justify-content-center align-items-center'>
                        <div className='w-50 position-relative d-flex flex-column align-items-center'>
                            <div style={{ position: 'relative', maxWidth: '150px', height: '150px' }}>
                                {profile.photo && <img src={profile.photo} alt='profile' style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />}
                                <button onClick={handleButtonClick} className='btn-circle position-absolute' style={{ bottom: '15px', right: '20px', transform: 'translate(50%, 50%)' }}><CIcon icon={cilCamera} /></button>
                            </div>
                        </div>
                    </div>

                    <input type='file' ref={fileInputRef} onChange={handleUploadPic} style={{ display: 'none' }} />
                    <div>
                        <p><span style={{ fontWeight: 'bold' }}>Username:</span> {profile.username}</p>
                        <p><span style={{ fontWeight: 'bold' }}>Name:</span> {profile.name}</p>
                        <p><span style={{ fontWeight: 'bold' }}>Email:</span> {profile.email}</p>
                        <p><span style={{ fontWeight: 'bold' }}>Phone:</span> {profile.phone}</p>
                        <p><span style={{ fontWeight: 'bold' }}>Google Rating:</span> {profile.google_rating}</p>
                        <p><span style={{ fontWeight: 'bold' }}>Description:</span> {profile.description}</p>
                        <CButton color='primary' className='mt-3'><Link to='/profile/edit' style={{ color: 'white', textDecoration: 'none' }}>Edit Profile</Link></CButton>
                    </div>
                </CCardBody>
            </CCard>
        </div>
    )
}
