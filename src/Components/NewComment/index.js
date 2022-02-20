import React, { useState, useContext } from 'react';
import { Button, Modal, Tooltip } from '@mui/material';
import { AlertsContext } from '../../Contexts/AlertsContext';
import { AuthContext } from '../../Contexts/AuthContext';
import API from '../../API';
import './newComment.scss';

const NewComment = (props) => {
  // Settings
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'New Comment - Uknown error, check console logs for details';
  const { token } = useContext(AuthContext);

  const { postId, newCommentDialog, setNewCommentDialog } = props;
  const [body, setBody] = useState('');
  const [solution, setSolution] = useState(false);

  // Create a new comment
  const handleNewComment = async () => {
    try {
      alertMsg('info', 'Please wait, posting your comment.');
      const { data } = await API.comments.newComment({ postId, solution, body }, token);
      if (data) {
        alertMsg('success', 'Comment posted successfully');
        setBody('');
        setSolution(false);
        setNewCommentDialog(false);
      }
    } catch (error) {
      alertMsg('error', 'could not post comment', error.message || genericError, error);
    }
  }

  return (
    <Modal
      open={newCommentDialog}
      onClose={() => setNewCommentDialog(false)}
      disableEscapeKeyDown
      hideBackdrop
    >
      <div className='container-fluid newCommentContainer'>
        <div className='row commentOptions'>
          <div className='form-check form-switch solutionsSwitchDiv'>
            <Tooltip title='Select if your comment contains a solution'>
              <div>
                <label className='form-check-label' htmlFor='commentWithSolution'>Contains Solution</label>
                <input className='form-check-input' type='checkbox' id='commentWithSolution' value={solution} checked={solution} onChange={() => setSolution(!solution)} />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className='row commentInput'>
          <div>
            <textarea className='form-control' value={body} onChange={(evt) => setBody(evt.target.value)} />
          </div>
        </div>
        <div className='row actions'>
          <div>
            <Button onClick={() => setNewCommentDialog(false)}>Cancel</Button>
            <Button variant='outlined' onClick={handleNewComment}>Post Comment</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default NewComment;
