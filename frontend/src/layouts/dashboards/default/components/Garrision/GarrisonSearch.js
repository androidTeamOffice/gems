// // src/layouts/garrisonverifier/GarrisonSearch.js
// import React, { useState } from 'react';
// import { TextField } from '@mui/material';

// const GarrisonSearch = ({ onSearch }) => {
//   const [query, setQuery] = useState('');

//   const handleSearch = (e) => {
//     setQuery(e.target.value);
//     onSearch(e.target.value);
//   };

//   return (
//     <TextField
//       label="Search by Name or CNIC"
//       variant="outlined"
//       fullWidth
//       value={query}
//       onChange={handleSearch}
//     />
//   );
// };

// export default GarrisonSearch;


// src/layouts/garrisonverifier/GarrisonSearch.js
import React, {
  useState,
  useCallback
} from 'react';
import {
  TextField
} from '@mui/material';
import debounce from 'lodash.debounce';

const GarrisonSearch = ({
  onSearch
}) => {
  const [query, setQuery] = useState('');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => onSearch(value), 300), // Adjust the delay (300ms) as needed
    []
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return ( <
    TextField label = "Search by Name or CNIC"
    variant = "outlined"
    fullWidth value = {
      query
    }
    onChange = {
      handleSearch
    }
    />
  );
};

export default GarrisonSearch;

