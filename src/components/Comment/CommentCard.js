import React from 'react';
import { withRouter, Redirect, useHistory } from "react-router-dom";

const CommentCard = (props) => {
  const { id, username, create_date, body, solution } = props.comment;

  const createDate = new Date(create_date).toISOString().substring(0, 10);

  return (
    <div>
      <hr />
      ID: {id} <br />
      User: {username} <br />
      Create Date {createDate} <br />
      Solution: {solution ? 'Yes' : 'No'} <br />
      Body: {body} <br />
      <button>Expand Post</button>
    </div>
  )
}

export default withRouter(CommentCard);
