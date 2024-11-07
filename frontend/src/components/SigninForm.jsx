import React, { useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const SignInForm =()=>{

    return(
        <div>
            SignInForm
            <TextField id="outlined-basic" label="Email" variant="outlined" />
            <TextField id="outlined-basic" label="Password" variant="outlined" />

            <Button variant="contained">Submit</Button>
        </div>
    )
}

export default SignInForm