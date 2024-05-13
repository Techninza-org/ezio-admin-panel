import { cilDelete, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardHeader, CCardText, CCardTitle } from '@coreui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const AllServices = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  async function getServices() {
    const res = await axios.get(`http://localhost:3000/service/host/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const ser = res.data.services;
    setServices(ser);
  }

  async function handleDelete(id) {
    try{
      if(!window.confirm('Are you sure you want to delete this service?')){
        window.location.reload();
        return;
      };
      await axios.delete(`http://localhost:3000/service/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      getServices();
      navigate('/service/all')
    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    getServices();
  }, [])

  return (
    <div className='mt-3 mx-5'>
      <h1 className='text-center mb-4'>All Services</h1>
      <div className='row row-cols-1 row-cols-md-4 g-4'>
        {services?.map((item) => (
          <div key={item.id} className='col'>
            <div className="card h-100">
              {/* <img src={item.image} className="card-img-top" alt={item.name} /> */}
              <div className="card-body">
                <Link to={`/service/${item.id}`}><h5 className="card-title">{item.name}</h5></Link>
                <p className="card-text">{item.description}</p>
                <p className="card-text">{item.duration} Days</p>
                <p className="card-text">{item.price} / Night</p>
                <div className='d-flex justify-content-between'>
                  <Link to={`/service/edit/${item.id}`} className="btn btn-primary"><CIcon icon={cilPencil} /></Link>
                  {/* <a href="#" className="btn btn-primary" onClick={() => handleDelete(item.id)}><CIcon icon={cilTrash} /></a> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  )
}
export default AllServices
