import React, { useState, useEffect, useCallback } from "react";
import { useRaceBetting } from "../context/race_betting_context";

function AdminPanel() {
  const { user, suspendUser, unsuspendUser, deleteUserPermanently, getAllUsers } = useRaceBetting();

  // All hooks must be called unconditionally FIRST, before any logic
  const [activeTab, setActiveTab] = useState("active");
  const [activeUsers, setActiveUsers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Define loadUsers with useCallback to memoize it
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const users = await getAllUsers();
      
      if (users) {
        setActiveUsers(users.filter(u => u.accountStatus === 'active' && !u.isAdmin));
        setSuspendedUsers(users.filter(u => u.accountStatus === 'suspended'));
        setDeletedUsers(users.filter(u => u.accountStatus === 'deleted'));
      }
    } catch (err) {
      setError("Failed to load users");
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  }, [getAllUsers]);

  // Load users on component mount - useEffect must come BEFORE any conditional returns
  useEffect(() => {
    if (user?.isAdmin) {
      loadUsers();
    }
  }, [loadUsers, user?.isAdmin]);

  // Security check: Only allow admins to view this panel
  if (!user?.isAdmin) {
    return (
      <div className="admin-panel-container">
        <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          <h2>❌ Access Denied</h2>
          <p>You do not have permission to access the Admin Control Panel.</p>
        </div>
      </div>
    );
  }

  const handleSuspendUser = async (targetUser) => {
    try {
      setLoading(true);
      await suspendUser(targetUser._id, user._id);
      setSuccess(`User ${targetUser.username} has been suspended`);
      await loadUsers();
      setShowConfirmDialog(false);
      setSelectedUser(null);
    } catch (err) {
      setError(`Failed to suspend user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsuspendUser = async (targetUser) => {
    try {
      setLoading(true);
      await unsuspendUser(targetUser._id, user._id);
      setSuccess(`User ${targetUser.username} has been unsuspended`);
      await loadUsers();
      setShowConfirmDialog(false);
      setSelectedUser(null);
    } catch (err) {
      setError(`Failed to unsuspend user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    try {
      setLoading(true);
      await deleteUserPermanently(targetUser._id, user._id);
      setSuccess(`User ${targetUser.username} has been permanently deleted`);
      await loadUsers();
      setShowConfirmDialog(false);
      setSelectedUser(null);
    } catch (err) {
      setError(`Failed to delete user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'suspend') {
      handleSuspendUser(selectedUser);
    } else if (confirmAction === 'unsuspend') {
      handleUnsuspendUser(selectedUser);
    } else if (confirmAction === 'delete') {
      handleDeleteUser(selectedUser);
    }
  };

  const openConfirmDialog = (action, targetUser) => {
    setSelectedUser(targetUser);
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const getConfirmMessage = () => {
    if (!selectedUser) return "";
    switch (confirmAction) {
      case 'suspend':
        return `Are you sure you want to suspend ${selectedUser.username}'s account? They will not be able to login until unsuspended.`;
      case 'unsuspend':
        return `Are you sure you want to unsuspend ${selectedUser.username}'s account?`;
      case 'delete':
        return `Are you sure you want to permanently delete ${selectedUser.username}'s account? This action cannot be undone.`;
      default:
        return "";
    }
  };

  const UserRow = ({ user, onSuspend, onUnsuspend, onDelete, isSuspended, isDeleted }) => (
    <div className="admin-user-row">
      <div className="user-info">
        <div className="user-avatar">{user.name?.charAt(0).toUpperCase() || "U"}</div>
        <div className="user-details">
          <h4>{user.name || user.username}</h4>
          <p>@{user.username}</p>
        </div>
      </div>
      <div className="user-wallet">
        <span className="wallet-label">Wallet:</span>
        <span className="wallet-value">${user.wallet?.toFixed(2) || "0.00"}</span>
      </div>
      <div className="user-status">
        {isSuspended && <span className="status-badge suspended">🚫 Suspended</span>}
        {isDeleted && <span className="status-badge deleted">❌ Deleted</span>}
        {!isSuspended && !isDeleted && <span className="status-badge active">✅ Active</span>}
      </div>
      <div className="user-actions">
        {!isSuspended && !isDeleted && (
          <button
            onClick={() => openConfirmDialog('suspend', user)}
            className="btn-action btn-suspend"
            disabled={loading}
          >
            🚫 Suspend
          </button>
        )}
        {isSuspended && (
          <button
            onClick={() => openConfirmDialog('unsuspend', user)}
            className="btn-action btn-unsuspend"
            disabled={loading}
          >
            ✅ Unsuspend
          </button>
        )}
        {!isDeleted && (
          <button
            onClick={() => openConfirmDialog('delete', user)}
            className="btn-action btn-delete"
            disabled={loading}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h2>👑 Admin Control Panel</h2>
        <p className="admin-subtitle">Manage user accounts and monitor platform activity</p>
      </div>

      {success && (
        <div className="success-message">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="close-msg">✕</button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError("")} className="close-msg">✕</button>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          ✅ Active Users ({activeUsers.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "suspended" ? "active" : ""}`}
          onClick={() => setActiveTab("suspended")}
        >
          🚫 Suspended ({suspendedUsers.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "deleted" ? "active" : ""}`}
          onClick={() => setActiveTab("deleted")}
        >
          ❌ Deleted ({deletedUsers.length})
        </button>
      </div>

      <div className="admin-content">
        {loading && (
          <div className="loading-indicator">
            <p>Loading users...</p>
          </div>
        )}

        {/* Active Users Tab */}
        {activeTab === "active" && !loading && (
          <div className="tab-content">
            {activeUsers.length > 0 ? (
              <div className="users-list">
                {activeUsers.map((u) => (
                  <UserRow
                    key={u._id || u.username}
                    user={u}
                    onSuspend={() => openConfirmDialog('suspend', u)}
                    isSuspended={false}
                    isDeleted={false}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No active users to display</p>
              </div>
            )}
          </div>
        )}

        {/* Suspended Users Tab */}
        {activeTab === "suspended" && !loading && (
          <div className="tab-content">
            {suspendedUsers.length > 0 ? (
              <div className="users-list">
                {suspendedUsers.map((u) => (
                  <UserRow
                    key={u._id || u.username}
                    user={u}
                    onUnsuspend={() => openConfirmDialog('unsuspend', u)}
                    onDelete={() => openConfirmDialog('delete', u)}
                    isSuspended={true}
                    isDeleted={false}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No suspended users</p>
              </div>
            )}
          </div>
        )}

        {/* Deleted Users Tab */}
        {activeTab === "deleted" && !loading && (
          <div className="tab-content">
            {deletedUsers.length > 0 ? (
              <div className="users-list">
                {deletedUsers.map((u) => (
                  <UserRow
                    key={u._id || u.username}
                    user={u}
                    isSuspended={false}
                    isDeleted={true}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No deleted users</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="dialog-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Action</h3>
            <p>{getConfirmMessage()}</p>
            <div className="dialog-actions">
              <button
                onClick={handleConfirmAction}
                className="btn-confirm"
                disabled={loading}
              >
                {loading ? "Processing..." : confirmAction === 'delete' ? "Yes, Delete" : "Confirm"}
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setSelectedUser(null);
                  setConfirmAction(null);
                }}
                className="btn-cancel"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
