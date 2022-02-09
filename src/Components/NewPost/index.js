import { useState, useContext, useEffect, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Modal, Button, Tooltip, TextField } from '@mui/material';
import { AuthContext } from '../../Contexts/AuthContext';
import { AlertsContext } from '../../Contexts/AlertsContext';
import API from '../../API';
import 'react-day-picker/lib/style.css';
import './newPost.scss';

const NewPost = (props) => {
  // Settings
  const { token } = useContext(AuthContext);
  let isMounted = useRef(false);
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'New Post - Uknown error, check console logs for details';

  // Handle dialog window
  const { newPostDialog, setNewPostDialog } = props;

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

  // Create a new post
  const handleNewPost = async (evt) => {
    try {
      evt.preventDefault();
      alertMsg('info', 'Please wait, creating your post.');

      let formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('interviewDate', new Date(interviewDate).toISOString());
      formData.append('company', company);
      formData.append('position', position);
      formData.append('body', body);

      const { data } = await API.posts.newPost(formData, token);
      if (data && data.id) {
        alertMsg('success', 'Post published successfully');
        setTitle('');
        setInterviewDate('');
        setCompany('');
        setPosition('');
        setBody('');
        setSelectedFile('');
        setNewPostDialog(false);
      }
    } catch (error) {
      alertMsg('error', 'could not publish post', error.message || genericError, error);
    }
  }

  // Get list of companies
  const getCompanies = async () => {
    try {
      const { data } = await API.getAllCompanies('');
      if (isMounted) setCompanySuggestions(data);
    } catch (error) {
      alertMsg('error', 'could not get companies', error.message || genericError, error);
    }
  }

  // Get list of positions
  const getPositions = async () => {
    try {
      const { data } = await API.getAllPositions('');
      if (isMounted) setPositionSuggestions(data);
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

  // Validate if all the fields are populated
  const validatePostButton = () => {
    if (!title || !company || !position || !body) {
      setDisablePostButton(true);
    } else {
      setDisablePostButton(false);
    }
  }

  useEffect(() => {
    isMounted = true;

    validatePostButton();

    return () => {
      isMounted = false;
    };
  }, [title, position, company, body]);

  return (
    <Modal
      open={newPostDialog}
      onClose={() => setNewPostDialog(false)}
      disableEscapeKeyDown
      hideBackdrop
    >
      <div className='container-fluid newPostContainer'>
        <div className='newPostBox'>
          <div className='row newPostFormRow'>
            <div className='col col-md-3 newPostFormCol'>

              <Tooltip title='Enter title for the post'>
                <input type='text' className='form-control formItem' placeholder="Post's title *" value={title} onChange={(evt) => setTitle(evt.target.value)} required />
              </Tooltip>

              <Tooltip title='Select interview date (approximately)'>
                <input type="date" className='form-control formItem' onChange={(evt) => setInterviewDate(evt.target.value)} value={interviewDate} max={getMaxInterviewDate()} />
              </Tooltip>

              <Tooltip title='Search or enter company name'>
                <Autocomplete
                  className='searchCompany formItem'
                  freeSolo
                  size='small'
                  options={companySuggestions}
                  renderInput={(params) => getCompanyRenderInput(params, 'Enter company name')}
                  onSelect={(evt) => { setCompany(evt.target.value) }}
                  onFocus={() => getCompanies()}
                />
              </Tooltip>


              <Tooltip title='Search or enter position/job title'>
                <Autocomplete
                  className='searchPosition formItem'
                  freeSolo
                  size='small'
                  options={positionSuggestions}
                  renderInput={(params) => getPositionRenderInput(params, 'Enter position title')}
                  onSelect={(evt) => { setPosition(evt.target.value) }}
                  onFocus={() => getPositions()}
                />
              </Tooltip>

              <Tooltip title='Attach files to your post'>
                <input
                  type="file"
                  className='form-control formItem'
                  onChange={(evt) => setSelectedFile(evt.target.files[0])}
                />
              </Tooltip>

            </div>
            <div className='col col-md newPostBodyCol'>
              <textarea type="text" className='form-control' placeholder="Tell us more about your interview quesiton, and you can use markdown! *" value={body} onChange={(evt) => setBody(evt.target.value)} required />
            </div>
          </div>
          <div className='row newPostActionRow'>
            <div className='col privacyMsgDiv'>
              Reminder: your post is anonymous, your email and username will not be displayed on the post. Please, only post questions you had in an actual interview. Thank you!
            </div>
            <div className='col'>
              <Button onClick={() => setNewPostDialog(false)}>Cancel</Button>
              <Button variant='outlined' onClick={handleNewPost} disabled={disablePostButton}>Post</Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default (NewPost);
