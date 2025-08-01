import React from 'react';

const EditProfileModal = ({ isOpen, toggle, member }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2>Edit Profile</h2>
        <form>
          <input type="text" placeholder="Name" defaultValue={member.name} />
          <input type="email" placeholder="Email" defaultValue={member.email} />
          <input type="password" placeholder="Password" />
          <button onClick={toggle}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
