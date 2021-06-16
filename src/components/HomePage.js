import React, { useState, useEffect } from 'react';
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

  const handleBasicSearch = async () => {
    if (searchFor) {
      if (searchFor === 'companies' && companiesQueries) {
        const getPosts = await Api('').post('/posts/company', {
          "sortKey": "create_date",
          "sortOrder": "asc",
          "limit": 25,
          "offset": 0,
          "company": companiesQueries
        });
        setIsLoadedPosts(true);
        setPosts(getPosts.data);
      } else if (searchFor === 'positions' && positionsQuery) {
        const getPosts = await Api('').post('/posts/position', {
          "sortKey": "create_date",
          "sortOrder": "asc",
          "limit": 25,
          "offset": 0,
          "position": positionsQuery
        });
        setIsLoadedPosts(true);
        setPosts(getPosts.data);
      } else if (searchFor === 'questions' && questionsQuery) {
        alert('Not implemented yet');
      }
    }
  }

  useEffect(async () => {
    if (!isLoadedPosts) {
      const getPosts = await Api('').post('/posts/all', {
        "sortKey": "create_date",
        "sortOrder": "asc",
        "limit": 25,
        "offset": 0
      });
      setIsLoadedPosts(true);
      setPosts(getPosts.data);
    }
  }, [])

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
      <button>Search Company & Position</button>

      {posts.length > 0 ? posts.map((post) => {
        return <PostCard post={post} key={post.id} />
      }) : ''}

    </div>
  )
};

export default withRouter(HomePage);
