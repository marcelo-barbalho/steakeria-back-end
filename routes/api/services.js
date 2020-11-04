const express = require('express');
const Content = require('../../models/content');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleaware/auth')
const MSGS = require('../../messages')
const file = require('../../middleaware/file')
const complete_link = require('../../service/complete_link')
const get_max_order = require('../../service/get_max_order')

// @route    POST /services/:contentId
// @desc     CREATE services
// @access   Private
router.post('/:contentId', auth, file, async (req, res, next) => {
  try {
    const id = req.params.contentId
    if (req.body.photo_name) {
      req.body.photo=`services/${req.body.photo_name}`
    }
    let content = await Content.findOne({_id : id})
    if (!req.body.order) {      
      req.body.order = get_max_order(content, 'services')
    }
    content = await Content.findOneAndUpdate({_id : id}, { $push: {'services.service' : req.body} }, { new: true })
    if (content) {
      content = complete_link(content)
      res.json(content)
    } else {
      res.status(404).send({ "error": MSGS.CONTENT404  })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR})
  }
})

// @route    DELETE /services/:contentId
// @desc     DELETE services
// @access   Private
router.delete('/:contentId', auth, async (req, res, next) => {
  try {
    const id = req.params.contentId
    let query = { ['services.service'] : req.body }
    const content = await Content.findOneAndUpdate({_id : id}, { $pull: query}, { new: true })  
    if (content) {
      res.json(content)
    } else {
      res.status(404).send({ "error": MSGS.CONTENT404})
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR})
  }
})

module.exports = router;
