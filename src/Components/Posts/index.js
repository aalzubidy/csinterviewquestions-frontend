import { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import { AlertsContext } from '../../Contexts/AlertsContext';
import { AuthContext } from '../../Contexts/AuthContext';
import API from '../../API';
import PostCard from '../PostCard';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import { Button, TextField, Fab, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PieChartPosts from '../Stats/PieChartPosts';
import './posts.scss';
import NewPost from '../NewPost';
import SiteFooter from '../SiteFooter';

const Posts = () => {
  // Settings
  let isMounted = useRef(false);
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'Posts - Uknown error, check console logs for details';
  const { token } = useContext(AuthContext);
  const history = useHistory();

  // Handle search
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');

  // Handle suggestions
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [positionSuggestions, setPositionSuggestions] = useState([]);

  // Handle posts
  const [posts, setPosts] = useState([]);
  const [sortKey, setSortKey] = useState('create_date');
  const [newPostDialog, setNewPostDialog] = useState(false);

  // Handle scroll page - pagination
  const listInnerRef = useRef();
  const postsLimit = 25;
  const [postsOffset, setPostsOffset] = useState(0);
  const [getPostsFlag, setGetPostsFlag] = useState(true);

  // Search for company and/or position posts
  const searchPosts = async (replaceResults, postsOffset = 0) => {
    try {
      if (!getPostsFlag) return;

      const body = {
        'sortKey': sortKey,
        'sortOrder': 'desc',
        'limit': postsLimit,
        'offset': postsOffset,
      };

      let response = '';
      // If statement to decide which API to call
      if (selectedCompany || selectedPosition) {
        if (selectedCompany && !selectedPosition) {
          body['company'] = selectedCompany;
          response = await API.posts.getByCompany(body);
        } else if (!selectedCompany && selectedPosition) {
          body['position'] = selectedPosition;
          response = await API.posts.getByPosition(body);
        } else if (selectedCompany && selectedPosition) {
          body['company'] = selectedCompany;
          body['position'] = selectedPosition;
          response = await API.posts.getByCompanyPosition(body);
        }
      } else {
        response = await API.posts.getAll(body);
      }

      // If statement to check to replace results or append to it
      if (response.data && isMounted && replaceResults) {
        setPosts(response.data);
      } else if (response.data && isMounted && !replaceResults) {
        let newPosts = posts.concat(response.data);
        newPosts = newPosts.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
        setPosts(newPosts);
      } else if (!response || !response.data) {
        setGetPostsFlag(false);
      }
    } catch (error) {
      alertMsg('error', 'Could not search for posts', error.message || genericError, error);
    }
  }

  // Switch the sorting key
  const handleSortKey = async (evt) => {
    evt.preventDefault();
    if (isMounted) {
      setGetPostsFlag(true);
      setSortKey(evt.target.value);
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
    return <TextField {...params} label={<Typography><BusinessIcon /> {labelText}</Typography>} />;
  }

  // Autocomplete position - renderInput function
  const getPositionRenderInput = (params, labelText) => {
    return <TextField {...params} label={<Typography><WorkIcon /> {labelText}</Typography>} />
  }

  // Check if there are any posts to display
  const postsAvailable = () => {
    return posts && posts.length;
  }

  // Get list of posts
  const getPostCards = () => {
    return posts.map((post) => {
      return <PostCard post={post} key={post.id} />
    })
  }

  // Handle new post
  const handleNewPost = () => {
    if (!token) {
      history.push('/login');
    } else {
      setNewPostDialog(true);
    }
  }

  // Track scroll in post list div
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setPostsOffset(postsOffset + postsLimit);
        searchPosts(false, postsOffset + postsLimit);
      }
    }
  };

  useEffect(() => {
    isMounted = true;

    searchPosts(true);

    return () => { isMounted = false }
  }, [getPostsFlag]);

  return (
    <div className='container-fluid overflow-auto postsContainer'>

      <NewPost newPostDialog={newPostDialog} setNewPostDialog={setNewPostDialog} />

      <div className='row'>
        <div className='col-md-4 mainColumns searchBarDiv'>
          <div className='searchBox'>
            <div className='row'>
              <Tooltip title='Search for posts by a company'>
                <Autocomplete
                  className='searchCompany'
                  freeSolo
                  options={companySuggestions}
                  renderInput={(params) => getCompanyRenderInput(params, 'Search by Company')}
                  onSelect={(evt) => { setSelectedCompany(evt.target.value) }}
                  onFocus={() => getCompanies()}
                />
              </Tooltip>
            </div>
            <div className='row'>
              <Tooltip title='Search for posts by job title'>
                <Autocomplete
                  className='searchPosition'
                  freeSolo
                  options={positionSuggestions}
                  renderInput={(params) => getPositionRenderInput(params, 'Search by Title')}
                  onSelect={(evt) => { setSelectedPosition(evt.target.value) }}
                  onFocus={() => getPositions()}
                />
              </Tooltip>
            </div>
            <div className='row searchBtnDiv'>
              <Tooltip title='Search for posts'>
                <Button className='searchBtn' variant='outlined' color='primary' onClick={() => setGetPostsFlag(true)}>Search</Button>
              </Tooltip>
            </div>
          </div>
          <div className='row'>
            <PieChartPosts statType='positions' />
          </div>
          <div className='row'>
            <PieChartPosts statType='companies' />
          </div>
        </div>
        <div className='col mainColumns'>
          {postsAvailable() ?
            <div>
              <div className='sortKeyDiv'>
                <label htmlFor='sortKey'>Sort</label>
                <Select value={sortKey} id='sortKey' placeholder='Sort by' variant='standard' onChange={handleSortKey}>
                  <MenuItem value='create_date'>Create Date</MenuItem>
                  <MenuItem value='interview_date'>Interview Date</MenuItem>
                  <MenuItem value='views'>Views</MenuItem>
                </Select>
              </div>

              <div className='postsList' onScroll={() => onScroll()} ref={listInnerRef}>
                {getPostCards()}
              </div>
            </div> : ''}
        </div>
      </div>

      <div className='newPostButtonDiv'>
        <Tooltip title='Create new post'>
          <Fab color='primary' size='large'>
            <AddIcon onClick={handleNewPost} />
          </Fab>
        </Tooltip>
      </div>

      <SiteFooter />
    </div>
  )
};

export default (Posts);
