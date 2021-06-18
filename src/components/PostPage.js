import React, { memo, useEffect, useState } from 'react';
import { withRouter, useHistory, useParams } from "react-router-dom";
import Api from '../ApiRequest';
import CommentCard from './Comment/CommentCard';

const PostPage = (props) => {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);

  const [post, setPost] = useState('');
  const [postNotFound, setPostNotFound] = useState(false);

  const [comments, setComments] = useState('');

  const { id, title, create_date, interview_date, company, body, position, views } = post;

  const createDate = create_date ? new Date(create_date).toISOString().substring(0, 10) : '';
  const interviewDate = interview_date ? new Date(interview_date).toISOString().substring(0, 10) : '';

  const getPost = async () => {
    try {
      const postResponse = await Api('').get(`/posts/${postId}`);
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
      const getCommentResponse = await Api('').post('/comments/post', {
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

  useEffect(() => {
    if (!post) getPost();
    if (id && !comments) getComments();
  }, [post]);

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

      {comments ? comments.map((comment) => <CommentCard key={comment.id} comment={comment} />) : ''}

    </div>
  )
}

export default withRouter(memo(PostPage));
