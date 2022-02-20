import { useState, useContext } from 'react';
import { Button, Tooltip } from '@mui/material';
import { AlertsContext } from '../../Contexts/AlertsContext';
import API from '../../API';
import './managePost.scss';

const ManagePost = () => {
  // Settings
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'Manage Comment - Uknown error, check console logs for details';

  const [id, setId] = useState('');
  const [body, setBody] = useState('');
  const [solution, setSolution] = useState(false);
  const [managementPassword, setManagementPassword] = useState('');

  // Get comment information
  const getComment = async () => {
    try {
      alertMsg('info', 'Please wait, getting your comment information.');
      const { data } = await API.comments.getById(id);
      if (data) {
        setBody(data.body || '');
        setSolution(data.solution || false);
      }
    } catch (error) {
      alertMsg('error', 'could not get comment', error.message || genericError, error);
    }
  }

  // Handle delete comment
  const handleDelete = async () => {
    try {
      if (!managementPassword) {
        alertMsg('error', 'Management password is required');
        return;
      }

      alertMsg('info', 'Please wait, deleting comment.');
      const { data } = await API.comments.deleteById(id);
      if (data) alertMsg('success', 'Deleted your comment successfuly.');
    } catch (error) {
      alertMsg('error', 'could not delete comment', error.message || genericError, error);
    }
  }

  // Handle update comment
  const handleUpdate = async () => {
    try {
      if (!managementPassword) {
        alertMsg('error', 'Management password is required');
        return;
      }

      alertMsg('info', 'Please wait, deleting comment.');
      const { data } = await API.comments.deleteById(id);
      if (data) alertMsg('success', 'Deleted your comment successfuly.');
    } catch (error) {
      alertMsg('error', 'could not delete comment', error.message || genericError, error);
    }
  }

  return (
    <div className='container-fluid manageCommentContainer'>
      <div className='row'>
        <div className='col-md-3'>
          <div className='getItemDiv'>
            <Tooltip title='Enter comment id you want to manage'>
              <input type='text' className='form-control formItem' placeholder='Comment id *' value={id} onChange={(evt) => setId(evt.target.value)} required />
            </Tooltip>
            <Button variant='outlined' onClick={getComment}>Get Comment</Button>
          </div>

        </div>
        <div className='col editAreaDiv'>
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
          <div className='row passwordRow'>
            <Tooltip title='This password was sent to OP email when comment was created'>
              <input type='password' className='form-control' placeholder='Comment management password *' value={managementPassword} onChange={(evt) => setManagementPassword(evt.target.value)} required />
            </Tooltip>
          </div>
          <div className='row actions'>
            <div>
              <Button className='actionButton' color='error' variant='contained' onClick={handleDelete}>Delete Comment</Button>
              <Button className='actionButton' variant='outlined' onClick={handleUpdate}>Update Comment</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ManagePost;
