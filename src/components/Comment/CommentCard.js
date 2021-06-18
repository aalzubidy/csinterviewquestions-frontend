import React from 'react';
import { withRouter, Redirect, useHistory } from "react-router-dom";

const CommentCard = (props) => {
  const { id, create_date, body, solution } = props.comment;

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
    </div>
  )
}

export default withRouter(CommentCard);
