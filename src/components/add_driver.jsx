import React, { useState } from "react";
import { useRaceBetting } from "../context/race_betting_context";

function AddDriver() {
    const { drivers, setDrivers } = useRaceBetting();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        number: '',
        name: '',
        status: true,
        driveBonus: 2,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : (name === 'number' || name === 'driveBonus' ? parseInt(value) : value),
        });
    };

    const validateForm = () => {
        setError("");

        if (!formData.number) {
            setError("Driver number is required.");
            return false;
        }

        if (!formData.name) {
            setError("Driver name is required.");
            return false;
        }

        if (drivers.some(d => d.number === formData.number)) {
            setError(`Driver with number ${formData.number} already exists.`);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/drivers?teamId=2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    drivers: [{
                        number: formData.number,
                        name: formData.name,
                        status: formData.status,
                        driveBonus: formData.driveBonus,
                    }]
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add driver');
            }

            const result = await response.json();
            
            // Update local state with new driver
            if (result.data && result.data.length > 0) {
                setDrivers([...drivers, result.data[0]]);
                setSuccess(`✅ Driver "${formData.name}" added successfully!`);
                
                // Reset form
                setFormData({
                    number: '',
                    name: '',
                    status: true,
                    driveBonus: 2,
                });

                // Close form after 2 seconds
                setTimeout(() => {
                    setShowForm(false);
                    setSuccess("");
                }, 2000);
            }
        } catch (err) {
            console.error('Error adding driver:', err);
            setError(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="driver-management-section">
            <button 
                onClick={() => setShowForm(!showForm)}
                className="btn-manage-drivers"
            >
                {showForm ? '✖ Cancel' : '➕ Add Driver'}
            </button>

            {showForm && (
                <div className="add-driver-form">
                    <h3>Add New Driver</h3>
                    
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="number">Driver Number:</label>
                            <input
                                type="number"
                                id="number"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                placeholder="e.g., 5"
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Driver Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Michael Johnson"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="driveBonus">Drive Bonus:</label>
                            <input
                                type="number"
                                id="driveBonus"
                                name="driveBonus"
                                value={formData.driveBonus}
                                onChange={handleChange}
                                min="0"
                                max="10"
                            />
                        </div>

                        <div className="form-group checkbox">
                            <label htmlFor="status">
                                <input
                                    type="checkbox"
                                    id="status"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                />
                                Active Status
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="btn-submit"
                        >
                            {isLoading ? 'Adding...' : 'Add Driver'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AddDriver;
