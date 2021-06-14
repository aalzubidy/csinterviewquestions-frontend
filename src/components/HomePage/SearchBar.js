import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Api from '../../ApiRequest';
import './SearchBar.css';

const SearchBar = (props) => {
  const [searchField, setSearchField] = useState('Questions');
  const [suggestions, setSuggestions] = useState([]);
  const [fullSuggestions, setFullSuggestions] = useState([]);

  const onSearchFieldChange = async (evt) => {
    setSearchField(evt.target.value);
    if (evt.target.value === 'Companies') {
      const companies = await Api('').get('/companies');
      setFullSuggestions(companies.data);
    } else if (evt.target.value === 'Positions') {
      const positions = await Api('').get('/positions');
      setFullSuggestions(positions.data);
    } else {
      setFullSuggestions([]);
    }
  }

  return (
    <div>
      <select onChange={onSearchFieldChange} defaultValue='Questions'>
        <option>Questions</option>
        <option>Companies</option>
        <option>Positions</option>
      </select>

      <Autosuggest
        inputProps={{
          'placeholder': `Search for ${searchField}`,
          'autoComplete': 'False',
          'name': 'searchQueryBar',
          'id': 'searchQueryBar',
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
