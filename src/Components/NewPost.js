// import React, { useState, useContext } from 'react';
// import { withRouter, useHistory } from "react-router-dom";
// import DayPickerInput from 'react-day-picker/DayPickerInput';
// import { formatDate, parseDate } from 'react-day-picker/moment';
// import { AuthContext } from '../Contexts/AuthContext';
// import API from '../API';
// import SearchBar from './HomePage/SearchBar';
// import 'react-day-picker/lib/style.css';

const NewPost = () => {
  // const history = useHistory();
  // const { token } = useContext(AuthContext);

  // const [title, setTitle] = useState('');
  // const [interviewDate, setInterviewDate] = useState('');
  // const [company, setCompany] = useState('');
  // const [position, setPosition] = useState('');
  // const [body, setBody] = useState('');
  // const [postCreationMessage, setPostCreationMessage] = useState('');
  // const [selectedFile, setSelectedFile] = useState('');

  // console.log(token);

  // const handleFormSubmit = async (evt) => {
  //   evt.preventDefault();
  //   try {
  //     let formData = new FormData();
  //     formData.append('file', selectedFile);
  //     formData.append('title', title);
  //     formData.append('interviewDate', interviewDate.toISOString());
  //     formData.append('company', company);
  //     formData.append('position', position);
  //     formData.append('body', body);

  //     const response = await API(token).post('/posts', formData);
  //     if (response && response.data && response.data.id) {
  //       history.push(`/post/${response.data.id}`);
  //     }
  //   } catch (error) {
  //     setPostCreationMessage(`Could not create post :( error details ${error}`)
  //   }
  // }

  return (
    <div>
      {/* <br />
      <form onSubmit={handleFormSubmit}>
        <input type="text" placeholder="Post Title" value={title} onChange={(evt) => setTitle(evt.target.value)} /> <br />

        <DayPickerInput onDayChange={day => setInterviewDate(day)} dayPickerProps={{ todayButton: 'Today' }} formatDate={formatDate} parseDate={parseDate} placeholder='Select interview date (approximate)' /> <br />

        <SearchBar searchQuery={company} setSearchQuery={setCompany} searchField='company' />

        <SearchBar searchQuery={position} setSearchQuery={setPosition} searchField='position' />

        <input type="text" placeholder="Body" value={body} onChange={(evt) => setBody(evt.target.value)} /> <br />

        <input
          type="file"
          onChange={(evt) => setSelectedFile(evt.target.files[0])}
        />

        <br />

        <button type='submit'>Create Post</button>
      </form>
      <h1>{postCreationMessage}</h1> */}
    </div>
  )
}

export default (NewPost);
