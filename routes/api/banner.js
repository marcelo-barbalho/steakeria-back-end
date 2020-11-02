const express = require('express');
const Content = require('../../models/content');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleaware/auth')
const MSGS = require('../../messages')
const file = require('../../middleaware/file')


// @route    POST /banner/:contentId
// @desc     CREATE banner
// @access   Private
router.post('/:contentId', auth, file, async (req, res, next) => {
  try {
    const id = req.params.contentId
    if (req.body.photo_name) {
      req.body.photo=`banner/${req.body.photo_name}`
    }
    const content = await Content.findOneAndUpdate({_id : id}, { $push: { banner: req.body } }, { new: true })
    if (content) {
      res.json(content)
    } else {
      res.status(404).send({ "error": MSGS.CONTENT404  })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR})
  }
})

// @route    DELETE /banner/:contentId
// @desc     DELETE banner
// @access   Private
router.delete('/:contentId', auth, async (req, res, next) => {
  try {
    const id = req.params.contentId
    const content = await Content.findOneAndUpdate({_id : id}, { $pull: { banner: req.body } }, { new: true })  
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
