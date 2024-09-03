import React, { useEffect, useState } from 'react'
import { AppHeader, AppSidebar } from '../../components'
import { CForm, CFormInput, CFormLabel } from '@coreui/react'
import axios from 'axios'

const Kyc = () => {
    const [gst, setGst] = useState('')
    const [image, setImage] = useState(null)
    const [kyc, setKyc] = useState({})

    async function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData();
        formData.append('image', image);
        formData.append('gst', gst);
        try {
            const token = localStorage.getItem('token');
            const kycRes = await axios.post(`https://eziotravels.com:5000/host/kyc`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(kycRes, 'res');
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }

    const handleUploadPic = async (e) => {
        try {
            e.preventDefault();
            const file = e.target.files[0];
            setImage(file);
        } catch (error) {
            console.error('Error setting image:', error);
        }
    };

    async function getKycDetails() {
        const token = localStorage.getItem('token')
        const res = await axios.get(`https://eziotravels.com:5000/host/kyc`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setKyc(res.data)
        console.log(res.data, 'res');
    }

    useEffect(() => {
        getKycDetails();
    }, [])

    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <div className="container mt-1 mb-5">
                        <h4 className="mb-2">KYC</h4>
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                {!kyc?.submitted && <CForm className="p-3 rounded shadow-sm">
                                    <div className="mb-4">
                                        <CFormLabel htmlFor="gst" className="form-label">GST <span className='text-danger'>*</span></CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="gst"
                                            value={gst}
                                            placeholder="GST"
                                            className="form-control"
                                            onChange={(e) => setGst(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <CFormLabel htmlFor="gst" className="form-label">Certificate of Incorporation <span className='text-muted'>(optional - image)</span></CFormLabel>
                                        <CFormInput
                                            type='file'
                                            accept='image/*'
                                            className="form-control"
                                            onChange={handleUploadPic}

                                        />
                                    </div>
                                    <button type="submit" onClick={handleSubmit} className="btn btn-primary mt-4">
                                        Submit
                                    </button>
                                </CForm>}
                                {
                                    kyc?.submitted && !kyc?.verified &&
                                    <div>KYC Status: <span className='text-warning'>Pending</span></div>
                                }
                                {
                                    kyc?.submitted && kyc?.verified &&
                                    <div>KYC Status: <span className='text-success'>Verified</span></div>
                                }
                                {
                                    kyc?.submitted &&
                                    <div className='mt-4'>
                                        Details Submitted: 
                                        <h4 className='mt-2'>GST: {kyc?.details?.gst}</h4>
                                        <h4 className='mt-2'>COI:</h4>
                                        <img src={kyc?.details?.coi} alt='coi' style={{maxWidth: "50%"}} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Kyc