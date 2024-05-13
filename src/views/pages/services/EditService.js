import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    const [service, setService] = useState({});
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
        const res = await axios.put(`http://localhost:3000/service/${id}`, service, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(res);
        if (res.status === 200) {
            alert("Service updated successfully");
        } else {
            alert("Failed to update service");
        }
        navigate("/service/all")
    };

    useEffect(() => {
        const getService = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await axios.get(`http://localhost:3000/service/${id}`, {
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
    }, []);

    const renderItineraryInputs = () => {
        const { duration } = service;
        const numberOfDays = parseInt(duration) || 0;
        const inputs = [];
        for (let i = 1; i <= numberOfDays; i++) {
            inputs.push(
                <div key={i} className="mb-3">
                    <label htmlFor={`day${i}`} className="form-label text-dark">Day {i}</label>
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
            const res = await axios.delete(`http://localhost:3000/service/${id}`, {
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
        <div className="container mt-5 mb-5">
            <h1 className="mb-4 text-center">Edit Service</h1>
            <form className="p-4 bg-light rounded shadow-sm">

                <div className="mb-3">
                    <input
                        type="text"
                        name="name"
                        value={service.name}
                        placeholder="Service Name"
                        className="form-control"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="description"
                        value={service.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
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
                <div className="mb-3">
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
                <div className="mb-3">
                    <h5 className="text-dark">Services</h5>
                    <div className="row">
                        {ser.map((service) => (
                            <div key={service.id} className="col-md-3 text-dark">
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
                <div className="mb-3">
                    <h5 className="text-dark">Itinerary</h5>
                    {renderItineraryInputs()}
                </div>
                <button type="submit" onClick={handleSubmit} className="btn btn-primary">
                    Submit
                </button>
            </form>
            <div className="d-flex justify-content-end"> 
                <button className="btn btn-danger mt-3" onClick={() => handleDelete(service.id)}>Delete <CIcon icon={cilTrash} /></button>
            </div>
        </div>
    )
}

export default EditService