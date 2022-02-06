import React, { memo, useEffect, useState, useContext, useRef } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { Tooltip, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AlertsContext } from '../../Contexts/AlertsContext';
import { AuthContext } from '../../Contexts/AuthContext';
import API from '../../API';
import CommentCard from '../CommentCard';
// import NewComment from '../Comment/NewComment';
import './postDetails.scss';
import LoadingScreen from '../LoadingScreen';
import { useHistory } from 'react-router-dom';

const PostDetails = () => {
  // Settings
  let isMounted = useRef(false);
  const { alertMsg } = useContext(AlertsContext);
  const companiesImagesPath = '/images/companies/';
  const genericError = 'Post Details - Uknown error, check console logs for details';
  const history = useHistory();
  const { token } = useContext(AuthContext);

  // Handle post data
  const { postId } = useParams();
  const [post, setPost] = useState('');
  const [postSearchStatus, setPostSearchStatus] = useState('initialized');
  const [loading, setLoading] = useState(true);

  // Handle comments
  const [comments, setComments] = useState('');
  const [solutions, setSolutions] = useState(false);

  const { title, create_date, interview_date, company, body, position, views } = post;

  const createDate = create_date ? new Date(create_date).toISOString().substring(0, 10) : '';
  const interviewDate = interview_date ? new Date(interview_date).toISOString().substring(0, 10) : '';

  // Get post information
  const getPost = async () => {
    try {
      if (!post) {
        if (isMounted) setLoading(true);
        const { data } = await API.posts.getById(postId);
        if (isMounted) {
          setLoading(false);
          setPost(data);
          setPostSearchStatus('found');
        }
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
      if (solutions) {
        const { data } = await API.comments.getSolutionsByPost({
          'postId': postId,
          'sortOrder': 'asc',
          'limit': 25,
          'offset': 0
        });
        if (isMounted) setComments(data);
      } else {
        const { data } = await API.comments.getAllByPost({
          'postId': postId,
          'sortOrder': 'asc',
          'limit': 25,
          'offset': 0
        });
        if (isMounted) setComments(data);
      }
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

  const handleNewComment = () => {
    if (!token) {
      history.push('/login');
    } else {
      console.log('not implemented yet');
    }
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
        {loading ? <LoadingScreen /> : ''}

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

        {postSearchStatus === 'found' && comments && comments.length > 0 ? <div className='row commentsRow'>

          <div className='col-sm-2'>
            <div className="form-check form-switch solutionsSwitchDiv">
              <Tooltip title='Filter comments and display only comments that contain a solution'>
                <div>
                  <label className="form-check-label" for="flexSwitchCheckDefault">Show Solutions Only</label>
                  <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" value={solutions} checked={solutions} onChange={() => setSolutions(!solutions)} />
                </div>
              </Tooltip>
            </div>

            <div className='newCommentButtonDiv'>
              <Tooltip title='Add new comment'>
                <Fab color='primary' size='large'>
                  <AddIcon onClick={handleNewComment} />
                </Fab>
              </Tooltip>
            </div>
          </div>

          <div className='col-sm-10'>
            {comments.map((comment) => <CommentCard key={comment.id} comment={comment} deletedComment={postedNewComment} />)}
          </div>
        </div> : ''}
      </div>
    </div >
  )
}

export default withRouter(memo(PostDetails));
