import React, { useState } from "react";
import { useRaceBetting } from "../context/race_betting_context";

function DeleteDriver() {
    const { drivers, setDrivers } = useRaceBetting();
    const [selectedDriver, setSelectedDriver] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = async () => {
        if (!selectedDriver) {
            setError("Please select a driver to delete.");
            return;
        }

        setIsLoading(true);
        try {
            // Find the driver object to get their MongoDB ID
            const driverToDelete = drivers.find(d => d.number === parseInt(selectedDriver));
            
            if (!driverToDelete || !driverToDelete._id) {
                setError("Driver not found or invalid ID.");
                return;
            }

            const response = await fetch(`http://localhost:5001/api/drivers/${driverToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete driver');
            }

            // Update local state by removing the deleted driver
            setDrivers(drivers.filter(d => d.number !== parseInt(selectedDriver)));
            setSuccess(`✅ Driver "${driverToDelete.name}" deleted successfully!`);
            setSelectedDriver("");
            setConfirmDelete(false);
            setError("");

            // Clear success message after 2 seconds
            setTimeout(() => setSuccess(""), 2000);
        } catch (err) {
            console.error('Error deleting driver:', err);
            setError(`Error: ${err.message}`);
            setConfirmDelete(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="driver-management-section">
            <div className="delete-driver-form">
                <h3>🗑️ Delete Driver</h3>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-group">
                    <label htmlFor="driver-select">Select Driver to Delete:</label>
                    <select
                        id="driver-select"
                        value={selectedDriver}
                        onChange={(e) => {
                            setSelectedDriver(e.target.value);
                            setConfirmDelete(false);
                            setError("");
                        }}
                        disabled={isLoading}
                    >
                        <option value="">-- Choose Driver --</option>
                        {drivers.map(driver => (
                            <option key={driver.number} value={driver.number}>
                                Car #{driver.number} - {driver.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedDriver && (
                    <div className="driver-preview">
                        {drivers.find(d => d.number === parseInt(selectedDriver)) && (
                            <div>
                                <p><strong>Selected Driver:</strong> {drivers.find(d => d.number === parseInt(selectedDriver)).name}</p>
                                <p><strong>Number:</strong> {selectedDriver}</p>
                                <p><strong>Status:</strong> {drivers.find(d => d.number === parseInt(selectedDriver)).status ? "✅ Active" : "❌ Inactive"}</p>
                            </div>
                        )}
                    </div>
                )}

                {confirmDelete ? (
                    <div className="confirm-delete">
                        <p className="warning">⚠️ Are you sure you want to delete this driver? This action cannot be undone.</p>
                        <div className="button-group">
                            <button 
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="btn-confirm-delete"
                            >
                                {isLoading ? 'Deleting...' : 'Yes, Delete Driver'}
                            </button>
                            <button 
                                onClick={() => setConfirmDelete(false)}
                                disabled={isLoading}
                                className="btn-cancel-delete"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setConfirmDelete(true)}
                        disabled={!selectedDriver || isLoading}
                        className="btn-delete"
                    >
                        🗑️ Delete Selected Driver
                    </button>
                )}
            </div>
        </div>
    );
}

export default DeleteDriver;
