import React from 'react'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import './styles.css'


export default function PasswordInput({ handler, touched, hasError, meta, onChange, value }) {
    const requiredError = touched && hasError("required") && `${meta.label || 'Field'} required`;
    const patternError = touched && hasError("pattern") && `Invalid ${meta.label || 'Password must contain letters and numbers'}`;
    const minLengthError = touched && hasError("minLength") && `${meta.label || 'Field'} must 7 characters long.`;
    const error = (requiredError || minLengthError || patternError) ? true : false;
    return (
        <TextField {...handler()}
            className="field"
            error={error}
            id={meta.label} 
            label={meta.label}
            type="password" 
            InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                   {meta.icon}
                  </InputAdornment>
                ),
            }}
            variant="outlined"
            required={meta.required}
            placeholder={meta.placeholder}
            helperText={requiredError || minLengthError || patternError}
            value={value}
            onChange={onChange}
        />
    )
}
