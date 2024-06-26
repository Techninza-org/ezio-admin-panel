import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CForm } from "@coreui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppSidebar, AppHeader } from '../../../components/index'

const ser = [
    {
        id: 1,
        name: "Pool",
    },
    {
        id: 2,
        name: "Wifi",
    },
    {
        id: 3,
        name: "Parking",
    },
    {
        id: 4,
        name: "Restaurant",
    },
];

const EditService = () => {
    const [options, setOptions] = useState([])
    const [service, setService] = useState({});
    const [files, setFiles] = useState([]);

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
        console.log(files);
        try {
            const cloudinaryResponses = await Promise.all(files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'c3k94jx2');
                formData.append('folder', 'ezio_vendor');

                const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/dr4iluda9/image/upload', formData);
                return cloudinaryResponse.data.secure_url;
            }));
            console.log(cloudinaryResponses);
            const imageUrls = cloudinaryResponses
            console.log(imageUrls);

            const token = localStorage.getItem('token');
            const updateProfileResponse = await axios.put(`http://103.189.173.132:3000/service/servicePics/${id}`, imageUrls, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(updateProfileResponse.data);

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
        console.log(res.data.serviceOptions);
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
                    <div className="container mt-5 mb-5">
                        <h1 className="mb-4 text-center">Edit Service</h1>
                        <CForm className="p-4 rounded shadow-sm">
                            <div className="mb-5">
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
                            <div className="mb-5">
                                <label htmlFor="description" className="form-label">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={service.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-5">
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
                            <div className="mb-5">
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
                            <div className="mb-5">
                                <h5 className="mb-3">Services</h5>
                                <div className="row">
                                    {options?.map((service) => (
                                        <div key={service.id} className="col-md-3">
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
                            <div className="mb-5">
                                <h5 className="mb-3">Itinerary</h5>
                                {renderItineraryInputs()}
                            </div>
                            <div className="mb-5">
                                <h5 className="mb-3">Images</h5>
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
        </>
    )
}

export default EditService