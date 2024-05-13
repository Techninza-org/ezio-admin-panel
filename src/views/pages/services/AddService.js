import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const ServiceCheckbox = ({ name, value, label, onChange }) => (
    <div className="form-check">
        <input
            type="checkbox"
            name={name}
            value={value}
            onChange={onChange}
            className="form-check-input"
        />
        <label htmlFor={value} className="form-check-label">
            {label}
        </label>
    </div>
);

export default function AddService() {
    const [destinations, setDestinations] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        host_id: user.id,
        destination: "",
        duration: "",
        price: "",
        services: [],
        itinerary: [],
        // images: [],
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === "services") {
            const updatedServices = checked
                ? [...formData.services, value]
                : formData.services.filter((service) => service !== value);

            setFormData((prevData) => ({
                ...prevData,
                services: updatedServices,
            }));
        } else if (name.startsWith("day")) {
            const dayIndex = parseInt(name.slice(3)) - 1;
            const updatedItinerary = [...formData.itinerary];
            updatedItinerary[dayIndex] = value;
            setFormData((prevData) => ({
                ...prevData,
                itinerary: updatedItinerary,
            }));
        } else if (name === "images") {
            const updatedImages = Array.from(files)
            setFormData((prevData) => ({
                ...prevData,
                images: updatedImages,
            }));
            console.log(updatedImages, 'updatedImages');
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        console.log(formData);
        e.preventDefault();
        const token = localStorage.getItem('token')
        const res = await axios.post("http://localhost:3000/service", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        if (res.status === 200) {
            alert("Service added successfully");
        } else {
            alert("Failed to add service");
        }
        navigate("/service/all")
    };

    const getDestinations = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.get("http://localhost:3000/destination", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDestinations(response.data.destinations);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDestinations();
    }, []);

    const renderItineraryInputs = () => {
        const { duration } = formData;
        const numberOfDays = parseInt(duration) || 0;
        const inputs = [];
        for (let i = 1; i <= numberOfDays; i++) {
            inputs.push(
                <div key={i} className="mb-3">
                    <label htmlFor={`day${i}`} className="form-label text-dark">Day {i}</label>
                    <input
                        type="text"
                        name={`day${i}`}
                        value={formData.itinerary[i - 1] || ""}
                        onChange={handleChange}
                        className="form-control"
                        placeholder={`Itinerary for Day ${i}`}
                    />
                </div>
            );
        }
        return inputs;
    };

    return (
        <div className="container mt-5 mb-5">
            <h1 className="mb-4 text-center">Add Service</h1>
            <form className="p-4 bg-light rounded shadow-sm">

                <div className="mb-3">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Service Name"
                        className="form-control"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="form-control"
                    />
                </div>
                {destinations.length > 0 && (
                    <div className="mb-3">
                        <select
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">Select Destination</option>
                            {destinations.map((item) => (
                                <option key={item.id} value={item.destination}>
                                    {item.destination}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="mb-3">
                    <input
                        type="text"
                        name="duration"
                        value={formData.duration}
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
                        value={formData.price}
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
                {/* <div className="mb-3">
                    <h5 className="text-dark">Images</h5>
                    <p className="text-dark">(First Image will be used as service cover image)</p>
                    <input type="file" name="images" accept="image/*" multiple onChange={handleChange} />
                </div> */}

                <button type="submit" onClick={handleSubmit} className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
}
