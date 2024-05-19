import React, { useState } from 'react'
import Form from '../components/Form'

const SearchPage = () => {
  const [pages, setPages] = useState([])
  const [results, setResults] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  return (
    <div>
      <h1>A3 - Search Engine</h1>
      <Form updateResults={setPages} updateResultsCount={setResults} updateElapsedTime={setElapsedTime} updateHasSearched={setHasSearched} />
      {pages.length === 0 ? (hasSearched ? <p>No results found</p> : null) : (
        <>
          <table id='res-table'>
            <thead>
              <tr>
                <th>Link</th>
                <th>Score</th>
                <th>Content</th>
                <th>Location</th>
                <th>PageRank</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page, i) => {
                return (
                    <tr key={i}>
                      <td><a href={page.link} target='_blank' rel="noreferrer">{page.name}</a></td>
                      <td>{page.score}</td>
                      <td>{page.content}</td>
                      <td>{page.location}</td>
                      <td>{page.rank}</td>
                    </tr>
                  )
              })}
            </tbody>
          </table>
          <p>Found {results} results in {elapsedTime} seconds</p>
        </>
      )}
    </div>
  )
}

export default SearchPage