/**
 * Module represents Express router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'

import { SearchController } from '../controllers/search-controller.js'

export const router = express.Router()

const controller = new SearchController()

router.get('/search', (req, res, next) => controller.getSearch(req, res, next))

router.use('*', (req, res, next) => next(createError(404)))
