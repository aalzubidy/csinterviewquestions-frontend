import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import Api from '../ApiRequest';
import SearchBar from './HomePage/SearchBar';
import PostCard from './Post/PostCard';

const HomePage = () => {

  const [searchQuery, setSearchQuery] = useState('');

  const [isLoadedPosts, setIsLoadedPosts] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    if(!isLoadedPosts) {
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
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <button>Search</button>
      
      <br />

      {posts.length > 0 ? posts.map((post)=>{
        return <PostCard post={post} key={post.id}/>
      }) : '' }

    </div>
  )
};

export default withRouter(HomePage);
