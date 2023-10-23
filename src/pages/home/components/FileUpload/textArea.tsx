import * as React from 'react';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';

export default function Textarea({onChange, placeholder, value}) {
  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 100%;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    outline: none;
    border:none;
    line-height: 1.5;
    padding: 15px;
    border-radius: none;
    border: none;

    &:hover {
      border-color: none;
    }

    &:focus {
      border-color: none;
      box-shadow:none;
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

  return (
    <Textarea aria-label="minimum height" minRows={1} placeholder={placeholder} value={value} onChange={(val) => onChange(val)}/>
  );
}