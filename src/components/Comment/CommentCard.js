import React from 'react';
import { withRouter, Redirect, useHistory } from "react-router-dom";

const CommentCard = (props) => {
  const { id, create_date, body, solution } = props.post;

  const createDate = new Date(create_date).toISOString().substring(0, 10);

  // const history = useHistory();

  return (
    <div>
      <hr />
      ID: {id} <br />
      Create Date {createDate} <br />
      Solution: {solution} <br />
      Body: {body} <br />
      <button>Expand Post</button>
      <hr />
    </div>
  )
}

export default withRouter(CommentCard);
