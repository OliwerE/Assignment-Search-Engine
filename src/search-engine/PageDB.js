/**
 * Class represents Wikipedia pages.
 */
export class PageDB {
  /**
   * PageDB constructor.
   */
  constructor () {
    this.wordToId = new Map()
    this.pages = []
  }

  /**
   * Returns word id.
   *
   * @param {string} word - A word.
   * @returns {number} - Word id.
   */
  getWordId (word) {
    if (this.wordToId.has(word)) { // Return Id
      return this.wordToId.get(word)
    } else { // Create and return Id
      const newId = this.wordToId.size
      this.wordToId.set(word, newId)
      return newId
    }
  }

  /**
   * Add page to pages.
   *
   * @param {object} page - Page object.
   */
  addPage (page) {
    this.pages.push(page)
  }
}
