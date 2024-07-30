import { CForm } from "@coreui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppSidebar, AppHeader } from '../../../components/index'

const types = [
    { id: 0, type: "Default" },
    { id: 1, type: "Group" },
]
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
    const [options, setOptions] = useState([])
    const [destinations, setDestinations] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [group, setGroup] = useState(false);
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
        type: "",
        start_date: "",
        end_date: "",
        total_seats: "",
        available_seats: "",
        numberOfPickups: "",
        pickups: []
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'type') {
            if (value === '1') {
                setGroup(true);
            } else {
                setGroup(false);
            }
        }

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
            }))
        } else if (name.startsWith("pickup")) {
            const dayIndex = parseInt(name.slice(6)) - 1;
            const updatedPickups = [...formData.pickups];
            updatedPickups[dayIndex] = value;
            setFormData((prevData) => ({
                ...prevData,
                pickups: updatedPickups,
            }))
        } else if (name === "total_seats") {
            setFormData((prevData) => ({
                ...prevData,
                total_seats: value,
                available_seats: value
            }))
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        const res = await axios.post("http://103.189.173.132:3000/service", formData, {
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
            const response = await axios.get("http://103.189.173.132:3000/destination", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDestinations(response.data.destinations);
        } catch (error) {
            console.error(error);
        }
    };

    async function getServiceOptions() {
        const res = await axios.get('http://103.189.173.132:3000/superAdmin/service-options')
        const ser = res.data.serviceOptions;
        setOptions(ser);
    }

    useEffect(() => {
        getDestinations();
        getServiceOptions();
    }, []);

    const renderItineraryInputs = () => {
        const { duration } = formData;
        const numberOfDays = parseInt(duration) || 0;
        const inputs = [];
        for (let i = 1; i <= numberOfDays; i++) {
            inputs.push(
                <div key={i} className="mb-3">
                    <label htmlFor={`day${i}`} className="form-label">Day {i}</label>
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

    const renderPickupInputs = () => {
        const { numberOfPickups } = formData;
        const numOfPickups = parseInt(numberOfPickups) || 0;
        const inputs = [];
        for (let i = 1; i <= numOfPickups; i++) {
            inputs.push(
                <div key={i} className="mb-3">
                    <label htmlFor={`pickup${i}`} className="form-label">Pickup {i}</label>
                    <input
                        type="text"
                        name={`pickup${i}`}
                        value={formData.pickups[i - 1] || ""}
                        onChange={handleChange}
                        className="form-control"
                        placeholder={`Pickup ${i}`}
                    />
                </div>
            );
        }
        return inputs;
    }

    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <div className="container mt-1 mb-5">
                        <h4 className="mb-2">ADD SERVICE</h4>
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <CForm className="p-4 rounded shadow-sm lh-1">
                                    <div className="mb-3">
                                        <label htmlFor="type" className="form-label">Service Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Service Type</option>
                                            {types.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {group &&
                                        <div className="mb-3">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div style={{ width: '45%' }}>
                                                    <label htmlFor="start_date" className="form-label" style={{ marginRight: '15px' }}>Start Date</label>
                                                    <DatePicker
                                                        id="start_date"
                                                        selectsStart
                                                        selected={startDate}
                                                        onChange={(date) => {
                                                            setStartDate(date)
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                start_date: date
                                                            }))
                                                        }}
                                                        autoComplete="off"
                                                        startDate={startDate}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div style={{ width: '45%' }}>
                                                    <label htmlFor="end_date" className="form-label" style={{ marginRight: '15px' }}>End Date</label>
                                                    <DatePicker
                                                        id="end_date"
                                                        selectsEnd
                                                        selected={endDate}
                                                        onChange={(date) => {
                                                            setEndDate(date)
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                end_date: date
                                                            }))
                                                        }}
                                                        endDate={endDate}
                                                        startDate={startDate}
                                                        minDate={startDate}
                                                        autoComplete="off"
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {group && <div className="mb-3">
                                        <label htmlFor="total_seats" className="form-label">Total Seats</label>
                                        <input
                                            type="text"
                                            name="total_seats"
                                            value={formData.total_seats}
                                            onChange={handleChange}
                                            placeholder="Total Seats"
                                            pattern="[0-9]*"
                                            className="form-control"
                                        />
                                    </div>}
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Service Name</label>
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
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
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
                                            <label htmlFor="destination" className="form-label">Destination</label>
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
                                        <label htmlFor="duration" className="form-label">Duration</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            placeholder="No. of days (Example - 3)"
                                            pattern="[0-9]*"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="price" className="form-label">Price</label>
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
                                        <h5>Services</h5>
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
                                    <div className="mb-3">
                                        <h5>Itinerary</h5>
                                        {renderItineraryInputs()}
                                    </div>

                                    <div className="mb-3">
                                        <h5>Pickups</h5>
                                        <label htmlFor="numberOfPickups" className="form-label">Number of Pickup Locations</label>
                                        <input type="text" name="numberOfPickups" value={formData.numberOfPickups} onChange={handleChange} placeholder="Number of Pickup locations (Example - 2)" className="form-control mb-3" />
                                        {renderPickupInputs()}
                                    </div>



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
    );
}
