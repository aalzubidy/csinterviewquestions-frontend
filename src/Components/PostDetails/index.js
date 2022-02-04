import React, { memo, useEffect, useState, useContext, useRef } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { Tooltip } from '@mui/material';
import { AlertsContext } from '../../Contexts/AlertsContext';
import API from '../../API';
import CommentCard from '../Comment/CommentCard';
import NewComment from '../Comment/NewComment';
import './postDetails.scss';

const PostDetails = (props) => {
  // Settings
  let isMounted = useRef(false);
  const { alertMsg } = useContext(AlertsContext);
  const companiesImagesPath = '/images/companies/';
  const genericError = 'Post Details - Uknown error, check console logs for details';

  // Handle post data
  const { postId } = useParams();
  const [post, setPost] = useState('');
  const [postSearchStatus, setPostSearchStatus] = useState('initialized');
  const [loading, setLoading] = useState(true);

  // Handle comments
  const [comments, setComments] = useState('');
  const [solutions, setSolutions] = useState(false);

  const history = useHistory();

  const { id, title, create_date, interview_date, company, body, position, views } = post;

  const createDate = create_date ? new Date(create_date).toISOString().substring(0, 10) : '';
  const interviewDate = interview_date ? new Date(interview_date).toISOString().substring(0, 10) : '';

  // Get post information
  const getPost = async () => {
    try {
      if (isMounted) setLoading(true);
      const { data } = await API.posts.getById(postId);
      if (isMounted) {
        setLoading(false);
        setPost(data);
        setPostSearchStatus('found');
      }
    } catch (error) {
      alertMsg('error', 'could not get post information', error.message || genericError, error);
      if (isMounted) {
        setLoading(false);
        setPost('');
        setPostSearchStatus('not found');
      }
    }
  };

  // Get post's comments
  const getComments = async () => {
    try {
      const { data } = await API.comments.getAllByPost({
        'postId': postId,
        'sortOrder': 'asc',
        'limit': 25,
        'offset': 0
      });
      if (isMounted) setComments(data);
    } catch (error) {
      alertMsg('error', 'could not get comments information', error.message || genericError, error);
      if (isMounted) {
        setComments('');
      }
    }
  }

  const postedNewComment = async () => {
    getComments();
  }

  useEffect(() => {
    isMounted = true;

    getPost();
    getComments();

    return () => isMounted = false;
  }, [postId, solutions]);

  return (
    <div className='container-fluid postDetailsContainer'>
      <div className='row'>
        {loading ? <h4>Loading...</h4> : ''}
        
        {postSearchStatus === 'not found' ? <h1>Sorry cannot find a post</h1> : ''}

        {postSearchStatus === 'found' ? <div className='container-fluid'>
          <div className='row postDetailsRow'>
            <div className='col-lg-2 col-md-3 postDetailsMeta text-center'>
              <div className='row'>
                <figure>
                  <img
                    src={`${companiesImagesPath}${company.toLowerCase()}.png`}
                    onError={(e) => { e.target.onError = null; e.target.src = `${companiesImagesPath}company.png` }}
                    alt={`${company}`}
                  />
                  <figcaption>{company}</figcaption>
                </figure>
              </div>

              <div className='row'>
                <div>{position}</div>
              </div>

              <div className='row'>
                <div><Tooltip title='Number of views'><span><VisibilityIcon /> {views}</span></Tooltip></div>
                <div><Tooltip title='Interview date'><span><EventIcon color='info' /> {interviewDate}</span></Tooltip></div>
                <div><Tooltip title='Post create date'><span><AccessTimeIcon /> {createDate}</span></Tooltip></div>
              </div>
            </div>

            <div className='col postDetailsMain'>
              <div><h4>{title}</h4></div>
              <div className='body'>{body}</div>
            </div>

            <div className='col-lg-2 col-md-3 postDetailsExtra'>
              <div>No attachments</div>
            </div>
          </div>
        </div> : ''}

        {postSearchStatus === 'found' && comments && comments.length > 0 ? <div>

          <NewComment postId={id} postedNewComment={postedNewComment} /> : <button onClick={() => history.push('/login')}>Login To Comment</button>

          <button onClick={() => setSolutions(!solutions)}>Filter Solution: {solutions ? 'On' : 'Off'}</button>

          {comments.map((comment) => <CommentCard key={comment.id} comment={comment} deletedComment={postedNewComment} />)}

        </div> : ''}
      </div>


      {/* {loading ? <h1>Loading ...</h1> : ''}

      {postNotFound === false && post && !loading ? <h1>Hello {id} from post page</h1> : ''}

      {postNotFound && !loading ? <h1>Sorry cannot find post</h1> : ''}

      {postNotFound === false && post && !loading ?
        <div>
          ID : {id} < br />
          Title: {title} <br />
          Create Date {createDate} <br />
          Interview Date: {interviewDate} <br />
          Company: {company} <br />
          Position: {position} <br />
          Views: {views} <br />
          Body: {body} <br />
          <hr />
        </div> : ''}

      {postNotFound === false && post && !loading && token ? <NewComment postId={id} postedNewComment={postedNewComment} /> : <button onClick={() => history.push('/login')}>Login To Comment</button>}

      {comments ? <button onClick={() => setSolutions(!solutions)}>Filter Solution: {solutions ? 'On' : 'Off'}</button> : ''}

      {comments ? comments.map((comment) => <CommentCard key={comment.id} comment={comment} deletedComment={postedNewComment} />) : ''} */}
    </div >
  )
}

export default withRouter(memo(PostDetails));
