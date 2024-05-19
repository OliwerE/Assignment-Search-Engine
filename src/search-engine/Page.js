/**
 * Class represents a wikipedia page.
 */
export class Page {
  /**
   * Class constructor.
   *
   * @param {string} name - Url to page.
   * @param {string} url - Page name.
   * @param {Array} words - Array of words.
   */
  constructor (name, url, words) {
    this.name = name
    this.url = url
    this.words = words
  }
}
