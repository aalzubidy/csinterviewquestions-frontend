import React, { memo, useEffect, useState, useContext } from 'react';
import { withRouter, useHistory, useParams } from "react-router-dom";
import { AuthContext } from '../Contexts/AuthContext';
import API from '../API';
import CommentCard from './Comment/CommentCard';
import NewComment from './Comment/NewComment';

const PostPage = (props) => {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);

  const [post, setPost] = useState('');
  const [postNotFound, setPostNotFound] = useState(false);

  const [comments, setComments] = useState('');
  const [solutions, setSolutions] = useState(false);

  const history = useHistory();

  const { token } = useContext(AuthContext);

  const { id, title, create_date, interview_date, company, body, position, views } = post;

  const createDate = create_date ? new Date(create_date).toISOString().substring(0, 10) : '';
  const interviewDate = interview_date ? new Date(interview_date).toISOString().substring(0, 10) : '';

  const getPost = async () => {
    try {
      const postResponse = await API('').get(`/posts/${postId}`);
      if (postResponse && postResponse.data) {
        setPost(postResponse.data);
        setLoading(false);
      } else {
        setLoading(false);
        setPostNotFound(true);
      }
    } catch (error) {
      setLoading(false);
      setPostNotFound(true);
    }
  };

  const getComments = async () => {
    try {
      const getCommentResponse = await API('').post(`/comments/post${solutions ? '/solutions' : ''}`, {
        "postId": id,
        "sortOrder": "asc",
        "limit": 25,
        "offset": 0
      });
      setComments(getCommentResponse.data);
    } catch (error) {
      console.log(error);
    }
  }

  const postedNewComment = async () => {
    getComments();
  }

  useEffect(() => {
    if (!post) getPost();
    if (id) getComments();
  }, [post, solutions]);

  return (
    <div>
      {loading ? <h1>Loading ...</h1> : ''}

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

      {comments ? comments.map((comment) => <CommentCard key={comment.id} comment={comment} deletedComment={postedNewComment} />) : ''}
    </div>
  )
}

export default withRouter(memo(PostPage));
