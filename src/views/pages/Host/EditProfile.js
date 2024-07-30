import { CForm, CFormInput } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AppSidebar, AppHeader } from '../../../components/index'

export default function EditProfile() {
    const [profile, setProfile] = useState({})

    useEffect(() => {
        getProfile()
    }, [])

    async function getProfile() {
        const token = localStorage.getItem('token')
        const userId = JSON.parse(localStorage.getItem('user')).id
        const res = await axios.get(`http://103.189.173.132:3000/host/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setProfile(res.data.host)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        const userId = JSON.parse(localStorage.getItem('user')).id
        const res = await axios.put(`http://103.189.173.132:3000/host/profile/update/${userId}`, profile, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (res.status === 200) {
            alert("Profile updated successfully");
        } else {
            alert("Failed to update profile");
        }
    };

    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <div className="container mt-1 mb-5 lh-1">
                        <h4 className="mb-2 mx-3">Edit Profile</h4>
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <CForm>
                                    <div className="mb-3">
                                        <label htmlFor="name" className='mb-2'>Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            placeholder="Name"
                                            className="form-control"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className='mb-2'>Description</label>
                                        <textarea
                                            type="text"
                                            name="description"
                                            value={profile.description}
                                            placeholder="Description"
                                            className="form-control"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className='mb-2'>Email</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={profile.email}
                                            placeholder="Email"
                                            className="form-control"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="google_rating" className='mb-2'>Google Rating</label>
                                        <input
                                            type="text"
                                            name="google_rating"
                                            value={profile.google_rating}
                                            placeholder="Google Rating"
                                            className="form-control"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* <div className='mb-3'>
                    <label htmlFor="rating" className='mb-2'>Google Rating</label>
                    <input name='rating' type='file' onChange={handleUploadRating} />
                </div> */}
                                    <button type="submit" onClick={handleSubmit} className="btn btn-primary">
                                        Submit
                                    </button>
                                </CForm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
