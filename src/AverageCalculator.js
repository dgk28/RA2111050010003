// src/AverageCalculator.js

import React, { useState, useEffect } from 'react';

const AverageCalculator = () => {
  const [inputValue, setInputValue] = useState('');
  const [numbersFromAPI, setNumbersFromAPI] = useState([]);
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNumbersFromAPI = async () => {
      try {
        const response = await fetch('http://localhost:3000/numbers/e', {
          headers: {
            Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTUwNTAxLCJpYXQiOjE3MTIxNTAyMDEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM5YzVjNmRkLTMzODgtNDExNS05ZGY2LTI0MDQxODc0ZmFmNSIsInN1YiI6ImRnNjYyMUBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiYXZnQ2FsIiwiY2xpZW50SUQiOiJjOWM1YzZkZC0zMzg4LTQxMTUtOWRmNi0yNDA0MTg3NGZhZjUiLCJjbGllbnRTZWNyZXQiOiJGaFpQanpNZGVsZGptbXZEIiwib3duZXJOYW1lIjoiREVWQUwgRy4gS1VNQVIiLCJvd25lckVtYWlsIjoiZGc2NjIxQHNybWlzdC5lZHUuaW4iLCJyb2xsTm8iOiJSQTIxMTEwNTAwMTAwMDMifQ.BkchLPUjzKLJiqEtawxYS_qg_4MekOZAnYNlbT4eYiM'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch numbers from API');
        }
        const data = await response.json();
        setNumbersFromAPI(data.numbers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNumbersFromAPI();
  }, []);

  const calculateAverage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/numbers/${inputValue}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      setWindowPrevState(data.windowPrevstate);
      setWindowCurrState(data.windowCurrstate);
      setResult(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateAverage();
        }}
      >
        <label>
          Enter qualified number ID (p, f, e, r):
          <input
            type="text"
            value={inputValue}
            onChange={(v) => setInputValue(v.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          Calculate Average
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {result && (
        <div>
          <p>Previous Window State: {windowPrevState.join(', ')}</p>
          <p>Current Window State: {windowCurrState.join(', ')}</p>
          <p>Numbers Received: {result.numbers.join(', ')}</p>
          <p>Average: {result.avg}</p>
        </div>
      )}
      <hr />
      <h2>Numbers from API:</h2>
      <ul>
        {numbersFromAPI.map((number, index) => (
          <li key={index}>{number}</li>
        ))}
      </ul>
    </div>
  );
};

export default AverageCalculator;
