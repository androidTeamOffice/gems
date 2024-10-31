// components/TextFieldPair.js
import React from 'react';
import { Grid, TextField } from '@mui/material';

const TextFieldPair = ({ label1, label2 }) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <TextField label={label1} fullWidth margin="normal" />
    </Grid>
    <Grid item xs={6}>
      <TextField label={label2} fullWidth margin="normal" />
    </Grid>
  </Grid>
);

export default TextFieldPair;
