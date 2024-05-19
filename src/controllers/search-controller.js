/**
 * Module represents search controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import createError from 'http-errors'
import { SearchEngine } from '../search-engine/SearchEngine.js'

/**
 * Class represents Lits controller.
 */
export class SearchController {
  /**
   * Class constructor.
   *
   * @param {object} searchEngine - Search engine.
   */
  constructor (searchEngine = new SearchEngine()) {
    this.searchEngine = searchEngine
  }

  /**
   * Returns search results based on a word.
   *
   * @param {object} req - Request object.
   * @param {object} res - Response object.
   * @param {Function} next - Next function.
   */
  getSearch (req, res, next) {
    try {
      const { query } = req.query

      const queryWords = query.split(' ')
      if (queryWords.length !== 1) { // Max 1 word
        res.json({ msg: 'Too many words (max 1)' })
        return
      }

      const data = this.searchEngine.getSearchResult(query)
      const slicedData = data.slice(0, 5)
      const responseData = this.formatResponseData(slicedData)

      res.json({ msg: 'Search result', data: responseData, results: data.length })
    } catch (err) {
      next(createError(500))
    }
  }

  /**
   * Returns formatted response data.
   *
   * @param {Array} dataToReturn - Data to format.
   * @returns {Array} - formatted response data.
   */
  formatResponseData (dataToReturn) {
    const responseData = []
    for (let i = 0; i < dataToReturn.length; i++) {
      const pageData = {
        name: dataToReturn[i].page.name,
        link: dataToReturn[i].page.url,
        score: dataToReturn[i].score.toFixed(2),
        content: dataToReturn[i].score.toFixed(2),
        location: 0,
        rank: 0
      }
      responseData.push(pageData)
    }
    return responseData
  }
}
