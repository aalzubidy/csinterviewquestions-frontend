import React, { memo, useEffect, useState } from 'react';
import { withRouter, useHistory, useParams } from "react-router-dom";
import Api from '../ApiRequest';

const PostPage = (props) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [post, setPost] = useState('');
  const [postNotFound, setPostNotFound] = useState(false);
  const getPost = async () => {
    const postResponse = await Api('').get(`/posts/${id}`);
    if (postResponse && postResponse.data) {
      setPost(postResponse.data);
      setLoading(false);
    } else {
      setLoading(false);
      setPostNotFound(true);
    }
  };

  useEffect(() => {
    if (!post) getPost();
  }, []);

  return (
    <div>
      {loading ? <h1>Loading ...</h1> : ''}

      {postNotFound === false && post && !loading ? <h1>Hello {id} from post page</h1> : ''}

      {postNotFound && !loading ? <h1>Sorry cannot find post</h1> : ''}
    </div>
  )
}

export default withRouter(memo(PostPage));

