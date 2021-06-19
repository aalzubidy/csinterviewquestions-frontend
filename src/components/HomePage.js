import React, { memo, useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import Api from '../ApiRequest';
import SearchBar from './HomePage/SearchBar';
import PostCard from './Post/PostCard';

const HomePage = () => {

  const [searchFor, setSearchFor] = useState('');
  const [questionsQuery, setQuestionsQuery] = useState('');
  const [companiesQueries, setCompaniesQuery] = useState('');
  const [positionsQuery, setPositionsQuery] = useState('');

  const [isLoadedPosts, setIsLoadedPosts] = useState(false);
  const [posts, setPosts] = useState([]);

  const [sortKey, setSortKey] = useState('create_date');

  const handleBasicSearch = async () => {
    if (searchFor) {
      if (searchFor === 'companies' && companiesQueries) {
        const getPosts = await Api('').post('/posts/company', {
          "sortKey": sortKey,
          "sortOrder": "desc",
          "limit": 25,
          "offset": 0,
          "company": companiesQueries
        });
        setIsLoadedPosts(true);
        setPosts(getPosts.data);
      } else if (searchFor === 'positions' && positionsQuery) {
        const getPosts = await Api('').post('/posts/position', {
          "sortKey": sortKey,
          "sortOrder": "desc",
          "limit": 25,
          "offset": 0,
          "position": positionsQuery
        });
        setIsLoadedPosts(true);
        setPosts(getPosts.data);
      } else if (searchFor === 'questions' && questionsQuery) {
        alert('Not implemented yet');
      } else {
        getAllPosts();
      }
    }
  }

  const handlePositionCompanySearch = async () => {
    if (searchFor && companiesQueries && positionsQuery) {
      const getPosts = await Api('').post('/posts/position/company', {
        "sortKey": sortKey,
        "sortOrder": "desc",
        "limit": 25,
        "offset": 0,
        "position": positionsQuery,
        "company": companiesQueries
      });
      setIsLoadedPosts(true);
      setPosts(getPosts.data);
    }
  }

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

  const handleSortKey = async (evt) => {
    evt.preventDefault();
    setSortKey(evt.target.value);
    setIsLoadedPosts(false);
  }

  if (!isLoadedPosts) {
    getAllPosts();
  }

  // useEffect(() => {
  //   if (!isLoadedPosts) {
  //     getAllPosts();
  //   }
  // }, [isLoadedPosts, sortKey])

  return (
    <div>
      <h1>Hi from HomePage</h1>
      <h4>Login</h4>
      <br />

      <SearchBar searchQuery={questionsQuery} setSearchQuery={setQuestionsQuery} searchField='questions' setSearchFor={setSearchFor} />
      <SearchBar searchQuery={companiesQueries} setSearchQuery={setCompaniesQuery} searchField='companies' setSearchFor={setSearchFor} />
      <SearchBar searchQuery={positionsQuery} setSearchQuery={setPositionsQuery} searchField='positions' setSearchFor={setSearchFor} />
      <br />
      <button onClick={handleBasicSearch}>Search</button>
      <br />
      <button onClick={handlePositionCompanySearch}>Search Company & Position</button>

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
