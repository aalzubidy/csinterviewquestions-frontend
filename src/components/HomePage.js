import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import SearchBar from './HomePage/SearchBar';

const HomePage = () => {

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <h1>Hi from HomePage</h1>
      <h4>Login</h4>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <button>Search</button>
    </div>
  )
};

export default withRouter(HomePage);
