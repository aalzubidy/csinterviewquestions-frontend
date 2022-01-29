import React from 'react';
import { withRouter, useHistory } from "react-router-dom";
import { Button, Card, CardContent, Grid, Tooltip } from '@mui/material';
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
    <Card className='postCard'>
      <CardContent>

        <Grid container alignItems={'center'}>

          <Grid item xs={1} textAlign={'center'} className='cardImg'>
            <img
              src={`${imagesPath}${company.toLowerCase()}.png`}
              onError={(e) => { e.target.onError = null; e.target.src = `${imagesPath}company.png` }}
              alt={`${company} image`}
            />
            <h5>{company}</h5>
          </Grid>

          <Grid item xs={9} className='cardMain'>
            <h3 onClick={viewPost}>{title}</h3>
            <h4>{position}</h4>
            <Tooltip title='Interview date'><Grid container direction="row" alignItems="center"><EventIcon /><span className='iconText'>{interviewDate}</span></Grid></Tooltip>
            <Button size='small' onClick={viewPost}>Read More</Button>
          </Grid>

          <Grid item xs={2} textAlign={'center'} className='cardMeta'>
            <Tooltip title='Number of views'><Grid container direction="row" alignItems="center"> <VisibilityIcon color='info' /><span className='iconText'>{views}</span></Grid></Tooltip>
            <Tooltip title='Post create date'><Grid container direction="row" alignItems="center"> <AccessTimeIcon color='info' /><span className='iconText'>{createDate}</span></Grid></Tooltip>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  )
}

export default withRouter(PostCard);
