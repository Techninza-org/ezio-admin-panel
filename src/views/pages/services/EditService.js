import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CForm } from "@coreui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppSidebar, AppHeader } from '../../../components/index'
import Loader from "../../../Loader";

const EditService = () => {
    const [options, setOptions] = useState([])
    const [service, setService] = useState({});
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const ServiceCheckbox = ({ name, value, label, onChange }) => (
        <div className="form-check">
            <input
                type="checkbox"
                name={name}
                value={value}
                onChange={onChange}
                className="form-check-input"
                checked={service.services?.includes(value)}
            />
            <label htmlFor={value} className="form-check-label">
                {label}
            </label>
        </div>
    );

    const handleFiles = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const uploadPics = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData()
            files.forEach((file) => {
                formData.append('files', file)
            })

            const token = localStorage.getItem('token');
            const updateProfileResponse = await axios.put(`http://103.189.173.132:3000/service/servicePics/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setLoading(false);
            alert("Images uploaded successfully");
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "services") {
            const updatedServices = checked
                ? [...service.services, value]
                : service.services.filter((service) => service !== value);

            setService((prevData) => ({
                ...prevData,
                services: updatedServices,
            }));
        } else if (name.startsWith("day")) {
            const dayIndex = parseInt(name.slice(3)) - 1;
            const updatedItinerary = [...service.itinerary];
            updatedItinerary[dayIndex] = value;
            setService((prevData) => ({
                ...prevData,
                itinerary: updatedItinerary,
            }));
        } else {
            setService((prevData) => ({
                ...prevData,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        const res = await axios.put(`http://103.189.173.132:3000/service/${id}`, service, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (res.status === 200) {
            alert("Service updated successfully");
        } else {
            alert("Failed to update service");
        }
        navigate("/service/all")
    };

    async function getServiceOptions() {
        const res = await axios.get('http://103.189.173.132:3000/superAdmin/service-options')
        const ser = res.data.serviceOptions;
        setOptions(ser);
    }

    useEffect(() => {
        const getService = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await axios.get(`http://103.189.173.132:3000/service/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setService(res.data.service);
            } catch (error) {
                console.error(error);
            }
        };
        getService()
        getServiceOptions();
    }, []);

    const renderItineraryInputs = () => {
        const { duration } = service;
        const numberOfDays = parseInt(duration) || 0;
        const inputs = [];
        for (let i = 1; i <= numberOfDays; i++) {
            inputs.push(
                <div key={i} className="mb-3">
                    <label htmlFor={`day${i}`} className="form-label">Day {i}</label>
                    <input
                        type="text"
                        name={`day${i}`}
                        value={service.itinerary[i - 1] || ""}
                        onChange={handleChange}
                        className="form-control"
                        placeholder={`Itinerary for Day ${i}`}
                    />
                </div>
            );
        }
        return inputs;
    };

    async function handleDelete(id) {
        try {
            if (!window.confirm('Are you sure you want to delete this service?')) {
                window.location.reload();
                return;
            };
            const token = localStorage.getItem('token')
            const res = await axios.delete(`http://103.189.172.172:3000/service/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            navigate('/service/all')
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <div className="container mt-1 mb-5">
                        <h4 className="mb-2">EDIT SERVICE</h4>
                        {loading && <Loader />}
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <CForm className="p-3 rounded shadow-sm">
                                    <div className="mb-2">
                                        <label htmlFor="name" className="form-label">Service Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={service.name}
                                            placeholder="Service Name"
                                            className="form-control"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            type="text"
                                            name="description"
                                            value={service.description}
                                            onChange={handleChange}
                                            placeholder="Description"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="duration" className="form-label">Duration (Days)</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={service.duration}
                                            onChange={handleChange}
                                            placeholder="Duration (no. of days)"
                                            pattern="[0-9]*"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="price" className="form-label">Price / Night</label>
                                        <input
                                            type="text"
                                            onChange={handleChange}
                                            name="price"
                                            value={service.price}
                                            placeholder="Price / Night"
                                            pattern="[0-9]*"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <h5 className="mb-3">Services</h5>
                                        <div className="row">
                                            {options?.map((service) => (
                                                <div key={service.id} className="col-md-2">
                                                    <ServiceCheckbox
                                                        name="services"
                                                        value={service.name}
                                                        label={service.name}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <h5 className="mb-3">Itinerary</h5>
                                        {renderItineraryInputs()}
                                    </div>
                                    <div className="mb-2">
                                        <h5>Images</h5>
                                        <p>(First Image will be used as service cover image)</p>
                                        <input type="file" name="images" accept="image/*" multiple onChange={handleFiles} />
                                        <button className="btn btn-primary" onClick={uploadPics}>Upload</button>
                                    </div>
                                    <button type="submit" onClick={handleSubmit} className="btn btn-primary">
                                        Submit
                                    </button>
                                </CForm>
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-danger mt-3" onClick={() => handleDelete(service.id)}>Delete <CIcon icon={cilTrash} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditService