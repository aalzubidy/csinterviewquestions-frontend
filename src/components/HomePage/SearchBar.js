import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Api from '../../ApiRequest';
import './SearchBar.css';

const SearchBar = (props) => {
  const { searchField } = props;
  const [suggestions, setSuggestions] = useState([]);
  const [fullSuggestions, setFullSuggestions] = useState([]);

  const getFullSuggestions = async () => {
    if (searchField === 'companies') {
      const companies = await Api('').get('/companies');
      setFullSuggestions(companies.data);
    } else if (searchField === 'positions') {
      const positions = await Api('').get('/positions');
      setFullSuggestions(positions.data);
    } else {
      setFullSuggestions([]);
    }
  }

  useEffect(async () => {
    if (fullSuggestions.length <= 0 && searchField) {
      getFullSuggestions();
    }
  }, [])

  return (
    <div onClick={() => props.setSearchFor(searchField)}>
      <Autosuggest
        inputProps={{
          'placeholder': `Search for ${searchField}`,
          'autoComplete': 'False',
          'name': `${searchField}SearchBar`,
          'id': `${searchField}SearchBar`,
          'value': props.searchQuery,
          'onChange': (evt, { newValue }) => {
            props.setSearchQuery(newValue)
          }
        }}
        suggestions={suggestions}
        onSuggestionsFetchRequested={async ({ value }) => {
          if (!value) {
            setSuggestions([]);
            return;
          }

          setSuggestions(fullSuggestions.filter((item) => {
            return item.toLowerCase().indexOf(value.toLowerCase()) > -1
          }))
        }}
        onSuggestionsClearRequested={() => setSuggestions([])}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) =>
          <span>{suggestion}</span>
        }
        onSuggestionSelected={(event, { suggestion, method }) => {
          if (method === "enter") {
            event.preventDefault();
          }
          props.setSearchQuery(suggestion)
        }}
      />
    </div>
  );
};

export default SearchBar;
