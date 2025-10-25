import React, { useState } from "react";
import { useRaceBetting } from "../context/race_betting_context";

function AccountManagement() {
    const { user, wallet, registeredUsers, setUser } = useRaceBetting();
    const [activeTab, setActiveTab] = useState("profile");
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState(user?.name || "");
    const [editedEmail, setEditedEmail] = useState(user?.email || "");
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleEditProfile = () => {
        if (!editedName.trim()) {
            setEditError("Name cannot be empty.");
            return;
        }
        if (editedEmail && !editedEmail.includes("@")) {
            setEditError("Please enter a valid email address.");
            return;
        }

        const updatedUser = {
            ...user,
            name: editedName,
            email: editedEmail,
        };

        setUser(updatedUser);
        setEditMode(false);
        setEditSuccess("✅ Profile updated successfully!");
        setEditError("");

        setTimeout(() => setEditSuccess(""), 2000);
    };

    const handleCancel = () => {
        setEditedName(user?.name || "");
        setEditedEmail(user?.email || "");
        setEditMode(false);
        setEditError("");
    };

    const totalRacesPlayed = registeredUsers.find(u => u.username === user?.username)?.races || 0;
    const totalWinnings = registeredUsers.find(u => u.username === user?.username)?.totalWinnings || 0;

    return (
        <div className="account-management-container">
            <div className="account-header">
                <h2>👤 Account Management</h2>
                <p className="account-subtitle">Manage your profile and view statistics</p>
            </div>

            <div className="account-tabs">
                <button
                    className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    Profile
                </button>
                <button
                    className={`tab-btn ${activeTab === "statistics" ? "active" : ""}`}
                    onClick={() => setActiveTab("statistics")}
                >
                    Statistics
                </button>
                <button
                    className={`tab-btn ${activeTab === "allUsers" ? "active" : ""}`}
                    onClick={() => setActiveTab("allUsers")}
                >
                    All Users
                </button>
            </div>

            <div className="account-content">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="tab-content">
                        {editSuccess && <div className="success-message">{editSuccess}</div>}
                        {editError && <div className="error-message">{editError}</div>}

                        <div className="profile-card">
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div className="profile-title">
                                    <h3>{user?.name || "User"}</h3>
                                    <p className="username">@{user?.username}</p>
                                </div>
                            </div>

                            <div className="profile-details">
                                {editMode ? (
                                    <div className="edit-form">
                                        <div className="form-group">
                                            <label>Display Name</label>
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                value={editedEmail}
                                                onChange={(e) => setEditedEmail(e.target.value)}
                                                placeholder="Enter your email (optional)"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Username</label>
                                            <input
                                                type="text"
                                                value={user?.username}
                                                disabled
                                                placeholder="Username (cannot be changed)"
                                                className="disabled-input"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Password</label>
                                            <div className="password-input-group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={user?.password}
                                                    disabled
                                                    placeholder="Password (cannot be changed here)"
                                                    className="disabled-input"
                                                />
                                                <button
                                                    type="button"
                                                    className="toggle-password"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="button-group">
                                            <button
                                                onClick={handleEditProfile}
                                                className="btn-save"
                                            >
                                                💾 Save Changes
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="btn-cancel"
                                            >
                                                ❌ Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="profile-view">
                                        <div className="detail-row">
                                            <span className="detail-label">Display Name:</span>
                                            <span className="detail-value">{user?.name || "Not set"}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Username:</span>
                                            <span className="detail-value">{user?.username}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Email:</span>
                                            <span className="detail-value">{user?.email || "Not set"}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Current Wallet:</span>
                                            <span className="detail-value wallet-amount">💰 ${wallet.toFixed(2)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Member Since:</span>
                                            <span className="detail-value">{new Date().toLocaleDateString()}</span>
                                        </div>

                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="btn-edit-profile"
                                        >
                                            ✏️ Edit Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics Tab */}
                {activeTab === "statistics" && (
                    <div className="tab-content">
                        <div className="statistics-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🏦</div>
                                <div className="stat-info">
                                    <h4>Total Wallet</h4>
                                    <p className="stat-value">${wallet.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">🏁</div>
                                <div className="stat-info">
                                    <h4>Races Played</h4>
                                    <p className="stat-value">{totalRacesPlayed}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-info">
                                    <h4>Total Winnings</h4>
                                    <p className="stat-value">${totalWinnings.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-info">
                                    <h4>Win Rate</h4>
                                    <p className="stat-value">
                                        {totalRacesPlayed > 0
                                            ? ((totalWinnings / totalRacesPlayed) * 100).toFixed(1)
                                            : "0"}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="statistics-note">
                            <p>📈 Statistics are updated in real-time as you play races and manage your account.</p>
                        </div>
                    </div>
                )}

                {/* All Users Tab */}
                {activeTab === "allUsers" && (
                    <div className="tab-content">
                        <div className="users-list-header">
                            <h3>Registered Users ({registeredUsers.length})</h3>
                            <p className="users-note">Browse all registered players and their balances</p>
                        </div>

                        {registeredUsers.length > 0 ? (
                            <div className="users-table">
                                <div className="table-header">
                                    <div className="table-col col-username">Username</div>
                                    <div className="table-col col-name">Display Name</div>
                                    <div className="table-col col-wallet">Wallet Balance</div>
                                    <div className="table-col col-status">Status</div>
                                </div>
                                {registeredUsers.map((u, idx) => (
                                    <div key={idx} className="table-row">
                                        <div className="table-col col-username">
                                            {u.username}
                                            {u.username === user?.username && (
                                                <span className="badge-current"> (You)</span>
                                            )}
                                        </div>
                                        <div className="table-col col-name">{u.name || "—"}</div>
                                        <div className="table-col col-wallet">${u.wallet?.toFixed(2) || "0.00"}</div>
                                        <div className="table-col col-status">
                                            {u.username === user?.username ? (
                                                <span className="status-online">🟢 Online</span>
                                            ) : (
                                                <span className="status-offline">⚪ Offline</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No users registered yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AccountManagement;
