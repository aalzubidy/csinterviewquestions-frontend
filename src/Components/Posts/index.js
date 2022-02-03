import React, { memo, useState, useEffect, useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { AlertsContext } from '../../Contexts/AlertsContext';
import API from '../../API';
import PostCard from '../PostCard';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import { Button, Fab, MenuItem, Select, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './posts.scss';
import PieChart from '../Stats/PieChart';

const Posts = () => {
  // Settings
  let isMounted = useRef(false);
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'Posts - Uknown error, check console logs for details';

  // Handle search
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

  // Autocomplete company - renderInput function
  const getCompanyRenderInput = (params, labelText) => {
    return <TextField {...params} label={<div><BusinessIcon /><span className='searchBarLabel'>{labelText}</span></div>} />;
  }

  // Autocomplete position - renderInput function
  const getPositionRenderInput = (params, labelText) => {
    return <TextField {...params} label={<div><WorkIcon /><span className='searchBarLabel'>{labelText}</span></div>} />
  }

  // Check if there are any posts to display
  const postsAvailable = () => {
    return !loading && posts && posts.length;
  }

  useEffect(() => {
    isMounted = true;

    getAllPosts();

    return () => { isMounted = false }
  }, [sortKey]);

  return (
    <div className='container-fluid overflow-auto postsContainer'>
      <div className="row">
        <div className='col-md-4 mainColumns searchBarDiv'>
          <div className='searchBox'>
            <div className='row'>
              <Tooltip title='Search for posts by a company'>
                <Autocomplete
                  className="searchCompany"
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
                  className="searchPosition"
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
                <Button className='searchBtn' variant='outlined' color='primary' onClick={searchPosts}>Search</Button>
              </Tooltip>
            </div>
          </div>
          <div className='row'>
            <PieChart statType='positions' />
          </div>
          <div className='row'>
            <PieChart statType='companies' />
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

              <div>
                {posts.map((post) => {
                  return <PostCard post={post} key={post.id} />
                })}
              </div>
            </div> : ''}
        </div>
      </div>

      <div className='newPostButtonDiv'>
        <Tooltip title='Create new post'>
          <Fab color="primary" size='large'>
            <AddIcon />
          </Fab>
        </Tooltip>
      </div>
    </div>
  )
};

export default withRouter(memo(Posts));
