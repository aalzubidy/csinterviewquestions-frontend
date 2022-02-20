import { useState, useContext, useEffect } from 'react';
import { Button, Tooltip, TextField, Autocomplete } from '@mui/material';
import { AlertsContext } from '../../Contexts/AlertsContext';
import API from '../../API';
import './managePost.scss';

const ManagePost = () => {
  // Settings
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'Manage Post - Uknown error, check console logs for details';

  const [id, setId] = useState('');
  const [post, setPost] = useState('');
  const [managementPassword, setManagementPassword] = useState('');

  // Handle suggestions
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [positionSuggestions, setPositionSuggestions] = useState([]);

  // Handle form
  const [title, setTitle] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [body, setBody] = useState('');
  const [selectedFile, setSelectedFile] = useState('');

  // Handle validation
  const [disablePostButton, setDisablePostButton] = useState(true);

  // Get post information
  const getPost = async () => {
    try {
      alertMsg('info', 'Please wait, getting post information.');
      const { data } = await API.posts.getById(id);
      if (data) {
        setPost(data);
        const currentInterviewDate = data.interview_date.substring(0, data.interview_date.indexOf('T'));
        setTitle(data.title);
        setInterviewDate(currentInterviewDate);
        setCompany(data.company);
        setPosition(data.position);
        setBody(data.body);
      } else {
        throw new Error('could not find post');
      }
    } catch (error) {
      alertMsg('error', 'could not get post', error.message || genericError, error);
    }
  }

  // Get list of companies
  const getCompanies = async () => {
    try {
      const { data } = await API.getAllCompanies('');
      if (data) setCompanySuggestions(data);
    } catch (error) {
      alertMsg('error', 'could not get companies', error.message || genericError, error);
    }
  }

  // Get list of positions
  const getPositions = async () => {
    try {
      const { data } = await API.getAllPositions('');
      if (data) setPositionSuggestions(data);
    } catch (error) {
      alertMsg('error', 'could not get positions', error.message || genericError, error);
    }
  }

  // Autocomplete company - renderInput function
  const getCompanyRenderInput = (params, labelText) => {
    return <TextField {...params} label={labelText} required />;
  }

  // Autocomplete position - renderInput function
  const getPositionRenderInput = (params, labelText) => {
    return <TextField {...params} label={labelText} required />
  }

  // Get today's date formatted for date picker 
  const getMaxInterviewDate = () => {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;

    return (`${yyyy}-${mm}-${dd}`);
  }

  // Handle delete post
  const handleDeletePost = async () => {
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
  const handleUpdatePost = async () => {
    try {
      if (!managementPassword) {
        alertMsg('error', 'Management password is required');
        return;
      }

      alertMsg('info', 'Please wait, updating post.');
      const { data } = await API.posts.updateById({ id: post.id, title, interviewDate: new Date(interviewDate).toISOString(), company, position, body });
      if (data) alertMsg('success', 'Post updated successfuly.');
    } catch (error) {
      alertMsg('error', 'could not update post', error.message || genericError, error);
    }
  }

  // Validate if all the fields are populated
  const validatePostButton = () => {
    if (!title || !company || !position || !body) {
      setDisablePostButton(true);
    } else {
      setDisablePostButton(false);
    }
  }

  useEffect(() => {
    validatePostButton();
  }, [title, position, company, body]);

  return (
    <div className='container-fluid managePostContainer'>
      <div className='row'>
        <div className='col-md-3'>
          <div className='getItemDiv'>
            <Tooltip title='Enter post id you want to manage'>
              <input type='text' className='form-control formItem' placeholder='Post id *' value={id} onChange={(evt) => setId(evt.target.value)} required />
            </Tooltip>
            <Button variant='outlined' onClick={getPost}>Get Post</Button>
          </div>

          {post ? <div className='postDeleteActions'>
            <Tooltip title='This password was sent to OP email address when post was created.'>
              <input type='text' className='form-control formItem' placeholder='Post management password *' value={managementPassword} onChange={(evt) => setManagementPassword(evt.target.value)} required />
            </Tooltip>
            <div className='deleteButtons'>
              <Button variant='outlined' color='error' onClick={getPost}>Delete Post Attachment Only</Button>
            </div>
            <div className='deleteButtons'>
              <Button variant='contained' color='error' onClick={handleDeletePost}>Delete Post</Button>
            </div>
          </div> : ''}
        </div>

        {post ? <div className='col editAreaCol'>
          <div className='row postInformation'>

            <Tooltip title='Enter title for the post'>
              <input type='text' className='form-control formItem' placeholder='Post title *' value={title} onChange={(evt) => setTitle(evt.target.value)} required />
            </Tooltip>

            <Tooltip title='Select interview date (approximately)'>
              <input type='date' className='form-control formItem' onChange={(evt) => setInterviewDate(evt.target.value)} value={interviewDate} max={getMaxInterviewDate()} />
            </Tooltip>

            <Tooltip title='Search or enter company name'>
              <Autocomplete
                className='searchCompany autoCompleteInput formItem'
                freeSolo
                size='small'
                options={companySuggestions}
                renderInput={(params) => getCompanyRenderInput(params, 'Enter company name')}
                onSelect={(evt) => { setCompany(evt.target.value) }}
                onFocus={() => getCompanies()}
                value={company}
              />
            </Tooltip>


            <Tooltip title='Search or enter position/job title'>
              <Autocomplete
                className='searchPosition autoCompleteInput formItem'
                freeSolo
                size='small'
                options={positionSuggestions}
                renderInput={(params) => getPositionRenderInput(params, 'Enter position title')}
                onSelect={(evt) => { setPosition(evt.target.value) }}
                onFocus={() => getPositions()}
                value={position}
              />
            </Tooltip>

            <textarea type='text' className='form-control' placeholder='Tell us more about your interview quesiton, and you can use markdown! *' value={body} onChange={(evt) => setBody(evt.target.value)} required />

            <div className='row actions'>
              <div className='col'>
                <Button variant='outlined' onClick={handleUpdatePost} disabled={disablePostButton}>Update Post</Button>
              </div>
            </div>
          </div>

          <hr />

          <div className='row postAttachments'>
            <Tooltip title='Only one attachment is allowed per post. If there is another attachment it will be replaced.'>
              <input
                type='file'
                className='form-control formItem'
                onChange={(evt) => setSelectedFile(evt.target.files[0])}
              />
            </Tooltip>

            <div className='row actions'>
              <div className='col'>
                <Tooltip title='Only one attachment is allowed per post. If there is another attachment it will be replaced.'>
                  <Button variant='outlined' onClick={handleUpdatePost} disabled={disablePostButton}>Update Attachment</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div> : ''}
      </div>
    </div>
  )
};

export default ManagePost;
