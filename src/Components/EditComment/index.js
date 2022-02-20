import React, { useState, useContext } from 'react';
import { Button, Modal, Tooltip } from '@mui/material';
import { AlertsContext } from '../../Contexts/AlertsContext';
import { AuthContext } from '../../Contexts/AuthContext';
import API from '../../API';
import './editComment.scss';

const EditComment = (props) => {
  // Settings
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'Edit Comment - Uknown error, check console logs for details';
  const { token } = useContext(AuthContext);

  const { commentId, commentBody, commentSolution, displayEditDialog, setDisplayEditDialog } = props;

  const [body, setBody] = useState(commentBody);
  const [solution, setSolution] = useState(commentSolution);

  // Update comment
  const handleUpdateComment = async () => {
    try {
      alertMsg('info', 'Please wait, updating your comment.');
      const { data } = await API.comments.updateById({ commentId, body, solution }, token);
      if (data) {
        alertMsg('success', 'Comment updated successfully');
        setBody('');
        setSolution(false);
        setDisplayEditDialog(false);
      }
    } catch (error) {
      alertMsg('error', 'could not update comment', error.message || genericError, error);
    }
  }

  return (
    <Modal
      open={displayEditDialog}
      onClose={() => setDisplayEditDialog(false)}
      disableEscapeKeyDown
      hideBackdrop
    >
      <div className='container-fluid editCommentContainer'>
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
            <Button onClick={() => setDisplayEditDialog(false)}>Cancel</Button>
            <Button variant='outlined' onClick={handleUpdateComment}>Update Comment</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
};

export default EditComment;
