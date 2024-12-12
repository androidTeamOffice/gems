// components/TextFieldPair.js
import React from 'react';
import { Grid, TextField } from '@mui/material';

const TextFieldPair = ({ label1, label2, formDaaValue1, formDaaValue2, onChange1, onChange2 }) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <TextField
        label={label1}
        value={formDaaValue1}
        onChange={onChange1}  // Update with onChange for handling input
        fullWidth
        margin="normal"
        InputLabelProps={{
          sx: {
            fontSize: '0.9rem', // Adjust label font size
          },
        }}
        InputProps={{
          sx: {
            '&::placeholder': {
              fontSize: '0.8rem', // Adjust placeholder font size
            },
          },
        }}
        placeholder={label1} // Optional: Set placeholder text if needed
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        label={label2}
        value={formDaaValue2}
        onChange={onChange2}  // Update with onChange for handling input
        fullWidth
        margin="normal"
        InputLabelProps={{
          sx: {
            fontSize: '0.9rem', // Adjust label font size
          },
        }}
        InputProps={{
          sx: {
            '&::placeholder': {
              fontSize: '0.8rem', // Adjust placeholder font size
            },
          },
        }}
        placeholder={label2} // Optional: Set placeholder text if needed
      />
    </Grid>
  </Grid>
);

export default TextFieldPair;
