import { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { Tooltip, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AlertsContext } from '../../Contexts/AlertsContext';
import { AuthContext } from '../../Contexts/AuthContext';
import API from '../../API';
import CommentCard from '../CommentCard';
import NewComment from '../NewComment';
import './postDetails.scss';
import LoadingScreen from '../LoadingScreen';
import { useHistory } from 'react-router-dom';
import SiteFooter from '../SiteFooter';

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
  const [comments, setComments] = useState([]);
  const [solutions, setSolutions] = useState(false);
  const [newCommentDialog, setNewCommentDialog] = useState(false);

  const { title, create_date, interview_date, company, body, position, views } = post;

  const createDate = create_date ? new Date(create_date).toISOString().substring(0, 10) : '';
  const interviewDate = interview_date ? new Date(interview_date).toISOString().substring(0, 10) : '';

  // Handle scroll page - pagination
  const listInnerRef = useRef();
  const commentsLimit = 25;
  const [commentsOffset, setCommentsOffset] = useState(0);
  const [getCommentsFlag, setGetCommentsFlag] = useState(true);

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
  const getComments = async (replaceResults, commentsOffset = 0) => {
    try {
      if (!getCommentsFlag) return;

      const body = {
        'postId': postId,
        'sortOrder': 'asc',
        'limit': commentsLimit,
        'offset': commentsOffset
      };

      let response = '';
      if (solutions) {
        response = await API.comments.getSolutionsByPost(body);
      } else {
        response = await API.comments.getAllByPost(body);
      }

      if (response && response.data && isMounted && !replaceResults) {
        let newComments = comments.concat(response.data);
        newComments = newComments.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);;
        setComments(newComments);
      } else if (response && response.data && isMounted && replaceResults) {
        setComments(response.data);
      } else if (!response || !response.data) {
        setGetCommentsFlag(false);
      }
    } catch (error) {
      alertMsg('error', 'could not get comments information', error.message || genericError, error);
      if (isMounted) {
        setComments('');
      }
    }
  }

  // Handle new comment
  const handleNewComment = () => {
    if (!token) {
      history.push('/login');
    } else {
      setNewCommentDialog(true);
    }
  }

  // Track scroll in comments list div
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setCommentsOffset(commentsOffset + commentsLimit);
        getComments(false, commentsOffset + commentsLimit);
      }
    }
  };

  useEffect(() => {
    isMounted = true;

    getPost();
    getComments(true);

    return () => isMounted = false;
  }, [postId, getCommentsFlag, newCommentDialog]);

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
              <div className='body'><ReactMarkdown children={body} remarkPlugins={[remarkGfm]} /></div>
            </div>

            <div className='col-lg-2 col-md-3 postDetailsExtra'>
              <div>No attachments</div>
            </div>
          </div>

          <div className='newCommentButtonDiv'>
            <Tooltip title='Add new comment'>
              <Fab color='primary' size='large'>
                <AddIcon onClick={handleNewComment} />
              </Fab>
            </Tooltip>
          </div>

          <NewComment postId={postId} newCommentDialog={newCommentDialog} setNewCommentDialog={setNewCommentDialog} />
        </div> : ''}

        {postSearchStatus === 'found' && comments && comments.length > 0 ? <div className='row commentsRow'>

          <div className='col-sm-2'>
            <div className='form-check form-switch solutionsSwitchDiv'>
              <Tooltip title='Filter comments and display only comments that contain a solution'>
                <div>
                  <label className='form-check-label' htmlFor='flexSwitchCheckDefault'>Show Solutions Only</label>
                  <input className='form-check-input' type='checkbox' id='flexSwitchCheckDefault' value={solutions} checked={solutions} onChange={() => { setSolutions(!solutions); setGetCommentsFlag(true); }} />
                </div>
              </Tooltip>
            </div>
          </div>

          <div className='col-sm-10 commentsList' onScroll={() => onScroll()} ref={listInnerRef}>
            {comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)}
          </div>
        </div> : ''
        }
      </div >

      <SiteFooter />
    </div >
  )
}

export default (PostDetails);
