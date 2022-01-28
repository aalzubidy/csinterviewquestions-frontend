import React from 'react';
import { withRouter, Redirect, useHistory } from "react-router-dom";

const PostCard = (props) => {
  const { id, title, create_date, interview_date, company, position, views } = props.post;

  const createDate = new Date(create_date).toISOString().substring(0, 10);
  const interviewDate = new Date(interview_date).toISOString().substring(0, 10);

  const history = useHistory();

  const viewPost = () => {
    history.push(`/post/${id}`);
  }

  return (
    <div>
      <hr />
      ID: {id} <br />
      Title: {title} <br />
      Create Date {createDate} <br />
      Interview Date: {interviewDate} <br />
      Company: {company} <br />
      Position: {position} <br />
      Views: {views} <br />
      <button onClick={viewPost}>View Post</button>
      <hr />
    </div>
  )
}

export default withRouter(PostCard);
