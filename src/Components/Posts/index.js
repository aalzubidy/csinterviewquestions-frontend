import React, { memo, useState, useEffect, useContext, useRef } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { AuthContext } from '../../Contexts/AuthContext';
import { AlertsContext } from '../../Contexts/AlertsContext';
import API from '../../API';
import SearchBar from '../HomePage/SearchBar';
import PostCard from '../Post/PostCard';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import { Button, Grid, MenuItem, Select, Tooltip } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import './posts.scss';

const Posts = () => {
  // Settings
  const history = useHistory();
  let isMounted = useRef(false);
  const [postsAttempts, setPostsAttempts] = useState(0);
  const postsAttemptsLimit = 3;
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'Posts - Uknown error, check console logs for details';

  // Authentication
  const { token } = useContext(AuthContext);

  // Handle search
  const [searchFor, setSearchFor] = useState('');
  const [questionsQuery, setQuestionsQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');

  // Handle suggestions
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [positionSuggestions, setPositionSuggestions] = useState([]);

  // Handle posts
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sortKey, setSortKey] = useState('create_date');

  // Search for company and/or position posts
  const searchPosts = async () => {
    try {
      setLoading(true);
      if (selectedCompany || selectedPosition) {
        const body = {
          "sortKey": sortKey,
          "sortOrder": "desc",
          "limit": 25,
          "offset": 0,
        };

        let response = '';
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

        setPosts(response ? response.data : []);
      } else {
        getAllPosts();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alertMsg('error', 'Could not search for posts', error.message || genericError, error);
    }
  }

  // Switch the sorting key
  const handleSortKey = async (evt) => {
    evt.preventDefault();
    if (isMounted) {
      setSortKey(evt.target.value);
    }
  }

  // Search for all posts in general
  const getAllPosts = async () => {
    try {
      if (isMounted) setLoading(true);
      if (isMounted) setPostsAttempts(postsAttempts + 1);
      const { data } = await API.posts.getAll({
        "sortKey": sortKey,
        "sortOrder": "desc",
        "limit": 25,
        "offset": 0
      });
      if (isMounted) {
        setLoading(false);
        setPosts(data);
      }
    } catch (error) {
      alertMsg('error', 'could not get posts', error.message || genericError, error);
      if (isMounted) {
        setLoading(false);
        setPosts([]);
      }
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

  useEffect(() => {
    isMounted = true;

    getAllPosts();

    return () => { isMounted = false }
  }, [sortKey]);

  return (
    <div className='postsContainer'>
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs={4}>
          <Tooltip title='Search for posts by a company'>
            <Autocomplete
              className="searchCompany"
              freeSolo
              options={companySuggestions}
              renderInput={(params) => <TextField {...params} label={<Grid container direction="row" alignItems='center'> <BusinessIcon /><span className='searchBarLabel'>Search by Company</span></Grid>} />}
              onSelect={(evt) => { setSelectedCompany(evt.target.value) }}
              onFocus={() => getCompanies()}
            />
          </Tooltip>
        </Grid>

        <Grid item xs={6}>
          <Tooltip title='Sort for posts by job title'>
            <Autocomplete
              id="searchPosition"
              freeSolo
              options={positionSuggestions}
              renderInput={(params) => <TextField {...params} label={<Grid container direction="row" alignItems="center"> <WorkIcon /><span className='searchBarLabel'>Search by Title</span></Grid>} />}
              onSelect={(evt) => { setSelectedPosition(evt.target.value) }}
              onFocus={() => getPositions()}
            />
          </Tooltip>
        </Grid>

        <Grid item xs={2}>
          <Tooltip title='Search for posts'>
            <Button variant='outlined' color='primary' size='large' onClick={searchPosts}>Search</Button>
          </Tooltip>
        </Grid>
      </Grid>

      {posts && posts.length > 0 ?
        <Select
          value={sortKey}
          placeholder='Sort by'
          variant='standard'
          onChange={handleSortKey}
          sx={{
            marginTop: '16px',
          }}
        >
          <MenuItem value='create_date'>Create Date</MenuItem>
          <MenuItem value='interview_date'>Interview Date</MenuItem>
          <MenuItem value='views'>Views</MenuItem>
        </Select> : ''}

      {posts && posts.length > 0 ? posts.map((post) => {
        return <PostCard post={post} key={post.id} />
      }) : ''}

    </div>
  )
};

export default withRouter(memo(Posts));
