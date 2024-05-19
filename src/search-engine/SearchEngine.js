import * as fs from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { Page } from './Page.js'
import { PageDB } from './PageDB.js'

// Get path to application
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Class represents a search engine.
 */
export class SearchEngine {
  /**
   * Class constructor.
   *
   */
  constructor () {
    this.pageDB = new PageDB()

    // Configure page objects
    this.#indexPages()
  }

  /**
   * Creates pages from data files.
   */
  async #indexPages () {
    try {
      await this.#createPagesFromDir('../../data/wikipedia/Words/Games')
      await this.#createPagesFromDir('../../data/wikipedia/Words/Programming')
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Creates page objects for all files in a folder.
   *
   * @param {string} folderUrl - Folder to read filenames from.
   */
  async #createPagesFromDir (folderUrl) {
    const pages = await this.#getPages(folderUrl)

    for (let i = 0; i < pages.length; i++) {
      const pageUrl = folderUrl + '/' + pages[i]
      const pageWordArray = await this.#getPageWordsArray(pageUrl)
      const pageWordIdArray = this.#getPageWordIdArray(pageWordArray) // Convert all page words to array with id

      const pageName = pages[i]
      const url = `https://wikipedia.org/wiki/${pages[i]}`
      const page = new Page(pageName, url, pageWordIdArray)
      this.pageDB.addPage(page)
    }
  }

  /**
   * Returns all file names in a specific folder.
   *
   * @param {string} folderUrl - Path to a folder.
   * @returns {Array} - All file names in the folder.
   */
  async #getPages (folderUrl) {
    const pageNames = await fs.readdir(path.resolve(__dirname, folderUrl))
    return pageNames
  }

  /**
   * Returns all words from a page file.
   *
   * @param {string} pageUrl - Path to a file.
   * @returns {Array} - All words in the file.
   */
  async #getPageWordsArray (pageUrl) {
    const fileString = await (await fs.readFile(path.resolve(__dirname, pageUrl), 'utf8')).toString()
    return fileString.split(' ')
  }

  /**
   * Converts page words to list of word id:s.
   *
   * @param {Array} pageWordArray - List of words.
   * @returns {Array} - List of word id:s.
   */
  #getPageWordIdArray (pageWordArray) {
    const pageWordIdArray = []
    for (let i = 0; i < pageWordArray.length; i++) {
      const wordId = this.pageDB.getWordId(pageWordArray[i])
      pageWordIdArray.push(wordId)
    }
    return pageWordIdArray
  }

  /**
   * Returns search results based on a word query.
   *
   * @param {string} query - Search word.
   * @returns {Array} - List of search results.
   */
  getSearchResult (query) {
    const results = []
    const scores = [] // index = index of page in this.pageDB.pages

    // Each page score
    for (let i = 0; i < this.pageDB.pages.length; i++) {
      const page = this.pageDB.pages[i]
      const wordFrequencyScore = this.#wordFrequencyMetric(page, query)
      scores.push(wordFrequencyScore)
    }

    // Normalize all page scores
    this.#normalizeScores(scores, false)

    // Create result array
    for (let i = 0; i < this.pageDB.pages.length; i++) {
      const page = this.pageDB.pages[i]
      if (scores[i] > 0) {
        // Add score to result array
        results.push({ page, score: scores[i] })
      }
    }

    // Sort result, highest score first
    const sortedResults = []
    for (let i = 0; i < results.length; i++) {
      const result = results[i]

      // Find sorted index for result
      let index
      for (index = 0; index < sortedResults.length; index++) {
        if (sortedResults[index].score < result.score) {
          break
        }
      }

      // Add result to index
      sortedResults.splice(index, 0, result)
    }
    return sortedResults
  }

  /**
   * Word frequency metrig algorithm.
   *
   * @param {object} page - A wikipedia page.
   * @param {string} queryWord - A user query.
   * @returns {number} - word frequency Score.
   */
  #wordFrequencyMetric (page, queryWord) {
    let score = 0
    const queryWordId = this.pageDB.getWordId(queryWord)
    for (let w = 0; w < page.words.length; w++) {
      if (page.words[w] === queryWordId) {
        score += 1
      }
    }
    return score
  }

  /**
   * Normalizes scores array to scores between 0 and 1.
   *
   * @param {Array} scoresArray - Page scores
   * @param {boolean} smallIsBetter - If 0 is better than 1.
   */
  #normalizeScores (scoresArray, smallIsBetter) {
    // Find max value
    let maxValue = Number.MIN_VALUE
    for (let i = 0; i < scoresArray.length; i++) {
      if (scoresArray[i] > maxValue) {
        maxValue = scoresArray[i]
      }
    }

    // Max value must be at least 0.00001
    if (maxValue === 0) {
      maxValue = 0.00001
    }

    if (smallIsBetter) {
      // Find min value
      let minValue = Number.MAX_VALUE
      for (let i = 0; i < scoresArray.length; i++) {
        if (minValue > scoresArray[i]) {
          minValue = scoresArray[i]
        }
      }

      // Divide all scores with min value
      for (let i = 0; i < scoresArray.length; i++) {
        scoresArray[i] = minValue / maxValue
      }
    } else { // Higher is better
      for (let i = 0; i < scoresArray.length; i++) {
        scoresArray[i] = scoresArray[i] / maxValue
      }
    }
  }
}
