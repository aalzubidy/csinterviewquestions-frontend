import { useState, useContext, useEffect } from 'react';
import { Button, Tooltip, TextField, Autocomplete } from '@mui/material';
import { AlertsContext } from '../../Contexts/AlertsContext';
import SiteFooter from '../SiteFooter';
import API from '../../API';
import './managePost.scss';

const ManagePost = () => {
  // Settings
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'Manage Post - Uknown error, check console logs for details';
  const baseURL = process.env.REACT_APP_BASE_URL;

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

  // Handle existing attachments
  const [existingAttachments, setExistingAttachments] = useState([]);

  // Handle validation
  const [disablePostUpdate, setDisablePostUpdate] = useState(true);

  // Get post attachments
  const getPostAttachments = async () => {
    try {
      const { data } = await API.files.getByPostId(id);
      if (data?.length > 0) setExistingAttachments(data);
    } catch (error) {
      alertMsg('error', 'could not get attachment files for post', error.message || genericError, error);
      setExistingAttachments([]);
    }
  }

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
        getPostAttachments();
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

  // Handle update post
  const handleUpdatePost = async () => {
    try {
      if (!managementPassword) {
        alertMsg('error', 'Management password is required.');
        return;
      }

      if (disablePostUpdate) {
        alertMsg('error', 'Make sure all fields are populated please.');
        return;
      }

      alertMsg('info', 'Please wait, updating post.');
      const { data } = await API.posts.updateById({
        postId: post.id,
        postPin: managementPassword,
        interviewDate: new Date(interviewDate).toISOString(),
        title,
        company,
        position,
        body
      });
      if (data) alertMsg('success', 'Post updated successfuly.');
    } catch (error) {
      console.log(error);
      alertMsg('error', 'could not update post', error.message || genericError, error);
    }
  }

  // Handle delete post
  const handleDeletePost = async () => {
    try {
      if (!managementPassword) {
        alertMsg('error', 'Management password is required');
        return;
      }

      alertMsg('info', 'Please wait, deleting post.');
      const { data } = await API.posts.deleteById(id, { postPin: managementPassword });
      if (data) alertMsg('success', 'Deleted post successfuly.');
    } catch (error) {
      alertMsg('error', 'could not delete post', error.message || genericError, error);
    }
  }

  // Handle delete attachment file
  const handleDeletePostAttachment = async () => {
    try {
      if (!managementPassword) {
        alertMsg('error', 'Management password is required');
        return;
      }

      alertMsg('info', 'Please wait, deleting post attachment.');
      const { data } = await API.files.deleteByPostId(id, { postPin: managementPassword });
      if (data) alertMsg('success', 'Deleted post attachment successfuly.');
    } catch (error) {
      alertMsg('error', 'could not delete post attachment', error.message || genericError, error);
    }
  }

  // Validate if all the fields are populated
  const validatePostUpdate = () => {
    if (!title || !company || !position || !body) {
      setDisablePostUpdate(true);
    } else {
      setDisablePostUpdate(false);
    }
  }

  // Upload and update attachment
  const handleUpdateAttachment = async (evt) => {
    try {
      if (!managementPassword) {
        alertMsg('error', 'Management password is required.');
        return;
      }

      if (!selectedFile) {
        alertMsg('error', 'File is required.');
        return;
      }

      evt.preventDefault();
      alertMsg('info', 'Please wait, updating post attachment.');

      let formData = new FormData();
      formData.append('file', selectedFile);

      const { data } = await API.posts.updateAttachmentsByPostId(id, managementPassword, formData);
      if (data) {
        alertMsg('success', 'Post attachment updated successfully');
        setSelectedFile('');
      }
    } catch (error) {
      alertMsg('error', 'could not update post attachment', error.message || genericError, error);
    }
  }

  // Get file url formatted
  const getAttachmentFileUrl = (attachmentFile) => {
    const fileName = attachmentFile.file_url.substring(attachmentFile.file_url.lastIndexOf('/') + 1);
    const fileUrl = `${baseURL}${attachmentFile.file_url}`;
    return <a href={fileUrl} target='_blank' rel='noreferrer'>{fileName}</a>
  }

  useEffect(() => {
    validatePostUpdate();
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
                <Button variant='outlined' onClick={handleUpdatePost}>Update Post</Button>
              </div>
            </div>
          </div>

          <hr />

          <div className='row postAttachments'>
            {existingAttachments ? <div>
              Existing Attachments:
              <ul>
                {existingAttachments.map((item) => {
                  return <li>{getAttachmentFileUrl(item)}</li>
                })}
              </ul>
            </div> : ''}
            <Tooltip title='Only one attachment is allowed per post. If there is another attachment it will be replaced.'>
              <input
                type='file'
                className='form-control formItem'
                onChange={(evt) => setSelectedFile(evt.target.files[0])}
              />
            </Tooltip>

            <div className='row actions'>
              <div className='col'>
                <span>
                  <Tooltip title='WARNING: THIS WILL DELETE ALL ATTACHMENTS ON THIS POST'>
                    <Button variant='outlined' color='error' onClick={handleDeletePostAttachment}>Delete All Attachments</Button>
                  </Tooltip>
                </span>
                <span>
                  <Tooltip title='WARNING: Only one attachment is allowed per post. If there is another attachment it will be replaced.'>
                    <Button variant='outlined' onClick={handleUpdateAttachment}>Update Attachment</Button>
                  </Tooltip>
                </span>
              </div>
            </div>
          </div>

          <hr />

          <div className='row'>
            <div className='col'>
              <div className='deleteButtons'>
                <Tooltip title='WARNING: THIS WILL DELETE THE POST'>
                  <Button variant='contained' color='error' onClick={handleDeletePost}>Delete Post</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div> : ''}
      </div>
      <SiteFooter />
    </div>
  )
};

export default ManagePost;
