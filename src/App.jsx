import './App.css'
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

import Chance from 'chance'
import { TextareaAutosize } from '@mui/base';
import QRCode from "react-qr-code";
import useQueryString from 'use-query-string';

const alphabet = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ.- ';

const alphabetChars = alphabet.split('')

export default function App() {
  const [key1, setKey1] = useState('');
  const [key2, setKey2] = useState('');
  const [cipherText, setCiphertext] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [mode, setMode] = useState(1);
  const [message, setMessage] = useState('');
  const [query] = useQueryString(window.location, () => null)

  useEffect( () => {
    if (query.message) {
      setCiphertext(decodeURIComponent(query.message))
    }
  }, [query])

  const handleSubmit = () => {
    const rand = new Chance(key1 + key2);
    const decrypted = []
    for (const char of cipherText) {
      let index
      if (alphabet.includes(char)) {
        index = alphabet.indexOf(char)
      } else {
        index = alphabet.indexOf('-')
      }
      const increment = rand.integer({ min: 0, max: alphabet.length - 1 });
      
      const newIndex = ((index - increment) + alphabet.length) % alphabet.length;
      
      decrypted.push(alphabet[newIndex])
  
    }
    setPlaintext(decrypted.join(''))
  }

  const handleEncryptSubmit = () => {
    const rand = new Chance(key1 + key2);
    const encrypted = []
    
    for (const char of message) {
      if (alphabet.includes(char)) {
        const index = alphabet.indexOf(char)
        const increment = rand.integer({ min: 0, max: alphabet.length - 1 });
        
        const newIndex = (index + increment) % alphabet.length;
        
        
        encrypted.push(alphabet[newIndex])
      }
    }
    setCiphertext(encrypted.join(''))
  }

  const linkUri = 'https://lucianbuzzo.github.io/gemini?message=' + encodeURIComponent(cipherText)


  
  return (
    <main>
      {mode === 1 &&
      <div>
      <div className="key-form" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}> 
        <TextField className="key-input" variant="outlined" inputProps={{ style: { textAlign: 'center'}}} value={key1} onChange={(e) => setKey1(e.target.value.toUpperCase())} label="Key 1" />
        <TextField className="key-input" variant="outlined" inputProps={{ style: { textAlign: 'center'}}} value={key2} onChange={(e) => setKey2(e.target.value.toUpperCase())} label="Key 2" />
        
          <Button style={{height: 59, paddingLeft: 25, paddingRight: 25}} variant="contained" onClick={handleSubmit}>Decrypt</Button>
      </div>
      <div className="char-roller">
        {cipherText.split('').map((cipherChar, idx) => {
          let offset = alphabetChars.indexOf(cipherChar)
          if (plaintext) {
            offset = alphabetChars.indexOf(plaintext[idx])
          }
          return (
          <div className="char-wrapper">
            <div className="char-column" style={{top: - (offset * 20)}}>
            {alphabetChars.map(char => {
              return <span style={{height: 20 }} className="single-char">{char}</span>
            })}
            </div>
          </div>
            )
        })}
      </div>
      
      </div>}

      {mode === 0 &&
        <div className=''>
          <TextareaAutosize fullWidth
           aria-label="minimum height" minRows={3} value={message} onChange={(e) => setMessage(e.target.value.toUpperCase())} />
        <div className="key-form" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}> 
          <TextField className="key-input" variant="outlined" inputProps={{ style: { textAlign: 'center'}}} value={key1} onChange={(e) => setKey1(e.target.value.toUpperCase())} label="Key 1" />
          <TextField className="key-input" variant="outlined" inputProps={{ style: { textAlign: 'center'}}} value={key2} onChange={(e) => setKey2(e.target.value.toUpperCase())} label="Key 2" />

            <Button style={{height: 59, paddingLeft: 25, paddingRight: 25}} variant="contained" onClick={handleEncryptSubmit}>Encrypt</Button>
        </div>

          {cipherText && (
        <pre>
          {cipherText}
        </pre>)}

          {cipherText && <QRCode value={linkUri} />}


          {cipherText && (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
              <a href={linkUri} target="_blank" rel="noopener noreferrer">Share</a>
            </div>
          )}
        
        </div>}
    
      <a  style={{position: 'absolute', bottom: 34, left: 22 }} href="#" onClick={(e) => e.preventDefault() || setMode(mode ? 0 : 1)}>change mode</a>
    </main>
  )
}
