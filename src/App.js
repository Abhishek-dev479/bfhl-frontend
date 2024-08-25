import React, { useState } from 'react';
import './App.css'

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const base_url = 'http://localhost:3001';

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput); // Validate JSON format
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON format. 'data' should be an array.");
      }

      setError(null); // Clear previous errors
      console.log('good json ' + parsedData);
      
      // Send the request to your backend /bfhl endpoint
      const response = await fetch(`${base_url}/bfhl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      const result = await response.json();
      setResponseData(result);
      console.log(result);
    } catch (err) {
      console.log("error", err);
      setError(err.message);
      setResponseData(null);
    }
  };

  const handleOptionChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(selectedValues);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
    return (
      <div>
        {selectedOptions.includes('Numbers') && (
          <div>Numbers: {numbers.join(', ')}</div>
        )}
        {selectedOptions.includes('Alphabets') && (
          <div>Alphabets: {alphabets.join(', ')}</div>
        )}
        {selectedOptions.includes('Highest Lowercase Alphabet') && (
          <div>Highest Lowercase Alphabet: {highest_lowercase_alphabet}</div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL Frontend</h1>
      <input
        type="text"
        value={jsonInput}
        onChange={handleInputChange}
        placeholder='Enter JSON: { "data": ["A","C","z"] }'
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {responseData && (
        <div>
          <select multiple={true} value={selectedOptions} onChange={handleOptionChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
          </select>

          <div>{renderResponse()}</div>
        </div>
      )}
    </div>
  );
}

export default App;
