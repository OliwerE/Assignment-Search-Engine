import React from 'react'

const Form = ({ getData, updateResults, updateResultsCount, updateElapsedTime, updateHasSearched }) => {

  const handleFormSubmit = (e) => {
    e.preventDefault()
  
    if (e.target.query.value.split(' ').length !== 1) {
      return alert('Too many words! (max 1)')
    }

    const startTime = performance.now()
    let endTime
    fetch(`http://localhost:8080/search?query=${encodeURIComponent(e.target.query.value)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'No-Store'
      }
    }).then(res => {
      endTime = performance.now()
      return res.json()
    }).then(json => {
      const elapsedTime = endTime - startTime
      updateResults(json.data)
      updateResultsCount(json.results)
      updateElapsedTime((elapsedTime / 1000).toFixed(3)) // Convert milliseconds to seconds
      updateHasSearched(true)
    })
  } 

  return (
    <>
      <form id='search-form' onSubmit={handleFormSubmit}>
        <div style={{ float: 'left', marginLeft: '20px' }}>
          <label htmlFor="query">Query: </label>
          <input type="text" id="query" name="query" autocomplete="off" required/>
        </div>
        <input id='submit' type='submit' value='Search' />
      </form>
    </>
  )
}

export default Form