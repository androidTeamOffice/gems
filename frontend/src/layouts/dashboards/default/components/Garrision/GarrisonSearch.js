// src/layouts/garrisonverifier/GarrisonSearch.js
import React, { useState } from 'react';
import { TextField } from '@mui/material';

const GarrisonSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <TextField
      label="Search by Name or CNIC"
      variant="outlined"
      fullWidth
      value={query}
      onChange={handleSearch}
    />
  );
};

export default GarrisonSearch;
