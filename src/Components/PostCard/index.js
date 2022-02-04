import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Button, Tooltip, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import './postCard.scss';

const PostCard = (props) => {
  const { id, title, create_date, interview_date, company, position, views } = props.post;
  const imagesPath = '/images/companies/';
  const createDate = new Date(create_date).toISOString().substring(0, 10);
  const interviewDate = new Date(interview_date).toISOString().substring(0, 10);

  const history = useHistory();

  const viewPost = () => {
    history.push(`/post/${id}`);
  }

  return (
    <div className='card postCard'>
      <div className='card-body'>
        <div className='row'>
          <div className='col-lg-1 col-md-2 cardImg'>
            <figure>
              <img
                src={`${imagesPath}${company.toLowerCase()}.png`}
                onError={(e) => { e.target.onError = null; e.target.src = `${imagesPath}company.png` }}
                alt={`${company}`}
              />
              <figcaption>{company}</figcaption>
            </figure>
          </div>
          <div className='col'>
            <b onClick={viewPost}>{title}</b>
            <div>{position}</div>
            <Button size='small' onClick={viewPost}>Read More</Button>
          </div>
          <div className='col-lg-2 col-md-3'>
            <Tooltip title='Number of views'><Typography><VisibilityIcon /> {views}</Typography></Tooltip>
            <Tooltip title='Interview date'><Typography><EventIcon color='info' /> {interviewDate}</Typography></Tooltip>
            <Tooltip title='Post create date'><Typography><AccessTimeIcon /> {createDate}</Typography></Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(PostCard);
