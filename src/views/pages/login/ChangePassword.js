import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppSidebar, AppHeader } from '../../../components/index'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const userId = JSON.parse(localStorage.getItem('user')).id
  const token = localStorage.getItem('token')
  async function handlePasswordChange() {
    try {
      const creds = {
        newPassword: newPassword,
        oldPassword: oldPassword,
      }
      const response = await axios.put(
        `http://103.189.173.132:3000/host/password/${userId}`,
        creds, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
      );
      if(response.data.status === 400) {
            alert("Current Password is Incorrect!");
        }else{
            alert("Password Changed Successfully!");
            navigate("/dashboard")
      }
    } catch (error) {
      alert("Password Change Failed!");
    }
  }
  return (

    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Change Password</h1>
                    <CInputGroup className="mb-3 mt-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Current Password" autoComplete='off' name='oldPassword' onChange={e => setOldPassword(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="New Password"
                        name='newPassword'
                        autoComplete='off'
                        onChange={e => setNewPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handlePasswordChange}>
                          Submit
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ChangePassword
