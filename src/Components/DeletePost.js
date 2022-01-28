import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import API from '../API';

const DeletePost = () => {
  const history = useHistory();
  const [id, setId] = useState('');
  const [postPin, setPostPin] = useState('');

  const handleDeletePost = async (evt) => {
    evt.preventDefault();
    try {
      const response = await API().post(`/deletePost/${id}`, { postPin });
      if (response && response.data) {
        alert('Post deleted successfully!');
        history.push('/');
      };
    } catch (error) {
      console.log(`Could not delete Post ${error}`);
      alert('Could not delete Post');
    }
  }

  return (
    <div>
      <form onSubmit={handleDeletePost}>
        <input value={id} onChange={(evt) => setId(evt.target.value)} placeholder='Post id' type='text' required />
        <input value={postPin} onChange={(evt) => setPostPin(evt.target.value)} placeholder='Post pin' type='password' required />
        <button onClick={handleDeletePost}>Delete Post</button>
      </form>
    </div>
  );
}

export default DeletePost;
