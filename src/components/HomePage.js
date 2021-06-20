import React, { memo, useState, useEffect, useContext } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Api from '../ApiRequest';
import SearchBar from './HomePage/SearchBar';
import PostCard from './Post/PostCard';

const HomePage = () => {
  // Settings
  const history = useHistory();

  // Authentication
  const { token } = useContext(AuthContext);

  // Handle search
  const [searchFor, setSearchFor] = useState('');
  const [questionsQuery, setQuestionsQuery] = useState('');
  const [companiesQueries, setCompaniesQuery] = useState('');
  const [positionsQuery, setPositionsQuery] = useState('');

  // Handle posts
  const [isLoadedPosts, setIsLoadedPosts] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sortKey, setSortKey] = useState('create_date');

  // Search for questions, company, position, or position/company posts
  const searchPosts = async () => {
    if (questionsQuery || companiesQueries || positionsQuery) {
      let url = '/posts';
      const body = {
        "sortKey": sortKey,
        "sortOrder": "desc",
        "limit": 25,
        "offset": 0,
      };

      if (companiesQueries && !positionsQuery) {
        url += '/company';
        body['company'] = companiesQueries;
      } else if (!companiesQueries && positionsQuery) {
        url += '/position';
        body['position'] = positionsQuery;
      } else if (questionsQuery) {
        alert('Search for questions is not implemented yet');
      } else if (companiesQueries && positionsQuery) {
        url += '/position/company';
        body['company'] = companiesQueries;
        body['position'] = positionsQuery;
      }

      const getPosts = await Api('').post(url, body);
      setIsLoadedPosts(true);
      setPosts(getPosts.data);
    } else {
      getAllPosts();
    }
  }

  // Search for all posts in general
  const getAllPosts = async () => {
    const getPosts = await Api('').post('/posts/all', {
      "sortKey": sortKey,
      "sortOrder": "desc",
      "limit": 25,
      "offset": 0
    });
    setIsLoadedPosts(true);
    setPosts(getPosts.data);
  }

  // Switch the sorting key
  const handleSortKey = async (evt) => {
    evt.preventDefault();
    setSortKey(evt.target.value);
    setIsLoadedPosts(false);
  }

  // If there are no posts loaded then get all the posts
  if (!isLoadedPosts) {
    getAllPosts();
  }

  useEffect(() => {
    if (searchFor === 'question') {
      setCompaniesQuery('');
      setPositionsQuery('');
    } else {
      setQuestionsQuery('');
    }
  }, [searchFor])

  return (
    <div>
      <br />
      <br />

      <span onClick={() => setSearchFor('question')}><SearchBar searchQuery={questionsQuery} setSearchQuery={setQuestionsQuery} searchField='question' /></span>
      <span onClick={() => setSearchFor('company')}><SearchBar searchQuery={companiesQueries} setSearchQuery={setCompaniesQuery} searchField='company' /></span>
      <span onClick={() => setSearchFor('position')}><SearchBar searchQuery={positionsQuery} setSearchQuery={setPositionsQuery} searchField='position' /></span>
      <br />
      <button onClick={searchPosts}>Search</button>

      <br />
      <br />

      {posts.length > 0 ? <div>
        <label htmlFor='sortByKey'>Sort By: </label>
        <select name='sortByKey' value={sortKey} onChange={handleSortKey}>
          <option value='create_date'>Create Date</option>
          <option value='interview_date'>Interview Date</option>
          <option value='views'>Views</option>
        </select>
      </div> : ''}

      {posts.length > 0 ? posts.map((post) => {
        return <PostCard post={post} key={post.id} />
      }) : ''}

    </div>
  )
};

export default withRouter(memo(HomePage));
