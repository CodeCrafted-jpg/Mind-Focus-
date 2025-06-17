import React, { useState, useEffect } from 'react';
import { groupService } from '../../service/groupService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './group.css';
import { Link } from 'react-router-dom';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchGroups();
    fetchOtherGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedGroups = await groupService.myGroups();
      setGroups(fetchedGroups);
    } catch (err) {
      setError('Failed to fetch groups. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOtherGroups = async () => {
    try {
      const result = await groupService.groupsUserIsNotaPartOf();
      setOtherGroups(result);
    } catch (err) {
      console.error('Error fetching groups user is not in:', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      const createdGroup = await groupService.createGroup(newGroup);
      setGroups([createdGroup, ...groups]);
      setNewGroup({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create group. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await groupService.joinGroup(groupId);
      await fetchGroups();
      await fetchOtherGroups();
    } catch (err) {
      console.error('Error joining group:', err);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    try {
      if (term.trim() === '') {
        fetchOtherGroups();
      } else {
        const result = await groupService.searchGroups(term);
        setOtherGroups(result);
      }
    } catch (err) {
      console.error('Error during group search:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h1>My Groups</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-orange">
          {showCreateForm ? 'Cancel' : 'Create New Group'}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {showCreateForm && (
        <div className="create-group-form">
          <h2>Create New Group</h2>
          <form onSubmit={handleCreateGroup}>
            <div className="form-group">
              <label htmlFor="name">Group Name</label>
              <input
                type="text"
                id="name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                rows="3"
              />
            </div>
            <button type="submit" className="btn-orange full-width">Create Group</button>
          </form>
        </div>
      )}

      <div className="group-list">
        {groups.length === 0 ? (
          <div className="empty-state">
            <p>You haven't joined any groups yet.</p>
            <button onClick={() => setShowCreateForm(true)} className="text-link">
              Create your first group
            </button>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group._id} className="group-card">
              <Link to={`/groups/${group._id}`} className="group-link">
                <h3 className="group-name">{group.name}</h3>
                {group.description && <p className="description">{group.description}</p>}
                <div className="group-meta">
                  <p><strong>Created by:</strong> {group.creator?.username || group.creator?.email}</p>
                  <p><strong>Members:</strong> {group.members?.length}</p>
                  <p><strong>Created:</strong> {new Date(group.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="other-groups-section">
        <h2>Discover New Groups</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search groups to join..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {otherGroups.length === 0 ? (
          <p>No more groups to join.</p>
        ) : (
          otherGroups.map((group) => (
            <div key={group._id} className="group-card joinable-group">
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <p><strong>Created by:</strong> {group.creator?.username || group.creator?.email}</p>
              <button className="btn-green" onClick={() => handleJoinGroup(group._id)}>
                Join Group
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Groups;
