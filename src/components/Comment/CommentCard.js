import React, { useContext } from 'react';
import { withRouter, Redirect, useHistory } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext';
import Api from '../../ApiRequest';

const CommentCard = (props) => {
  const { token, user } = useContext(AuthContext);
  const { id, username, create_date, body, solution } = props.comment;

  const createDate = new Date(create_date).toISOString().substring(0, 10);

  const handleDeleteComment = async (evt) => {
    evt.preventDefault();
    try {
      const response = await Api(token).delete(`/comments/${id}`);
      if (response && response.data) {
        alert('Comment deleted successfully!');
        props.deletedComment();
      };
    } catch (error) {
      console.log(`Could not delete comment ${error}`);
      alert('Could not delete comment');
    }
  }

  return (
    <div>
      <hr />
      ID: {id} <br />
      User: {username} <br />
      Create Date {createDate} <br />
      Solution: {solution ? 'Yes' : 'No'} <br />
      Body: {body} <br />
      <button>Expand Post</button>
      {user && user.username === username ? <button onClick={handleDeleteComment}>Delete Comment</button> : ''}
    </div>
  )
}

export default withRouter(CommentCard);
