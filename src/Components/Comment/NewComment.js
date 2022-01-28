import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Contexts/AuthContext';
import API from '../../API';

const NewComment = (props) => {
  const [commentBody, setCommentBody] = useState('');
  const [solutionFlag, setSolutionFlag] = useState(false);
  const { token } = useContext(AuthContext);

  const addComment = async (evt) => {
    evt.preventDefault();
    try {
      const response = await API(token).post('/comments', {
        'postId': props.postId,
        'body': commentBody,
        'solution': solutionFlag
      });
      if (response && response.data && response.data.id) {
        props.postedNewComment();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <form onSubmit={addComment}>
        <input type='text' placeholde='Enter comment...' value={commentBody} onChange={(evt) => setCommentBody(evt.target.value)} />
        <input type='checkbox' checked={solutionFlag} onChange={(evt) => setSolutionFlag(evt.target.checked)} />
        <label htmlFor='solutionFlag'>Comment Includes Solution</label>
        <button disabled={!commentBody} onClick={addComment}>Add Comment</button>
      </form>
    </div>
  )
}

export default NewComment;
