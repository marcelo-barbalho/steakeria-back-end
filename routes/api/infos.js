const express = require('express');
const Content = require('../../models/content');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleaware/auth')
const MSGS = require('../../messages')
const file = require('../../middleaware/file')
const complete_link = require('../../service/complete_link')
const get_max_order = require('../../service/get_max_order')


// @route    PATCH /infos/:contentId-:infoId
// @desc     UPDATE infos
// @access   Private
router.put('/:contentId-:infoId', auth, file, async (req, res, next) => {
  try {
    const contentId = req.params.contentId
    const infoId = req.params.infoId
    let content = await Content.findOne({_id : contentId})
    if (req.body.photo_name) {
      req.body.photo=`infos/${req.body.photo_name}`
    }
    if (content) {
      for(let index in content.infos){
        if (content.infos[index]._id == infoId) {
          content.infos[index] = req.body
        }
      }
      content = complete_link(content)
      await content.save()
      if (content.id) {
        res.json(content)
      }
    } else {
      res.status(404).send({ "error": MSGS.CONTENT404  })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR})
  }
})


// @route    POST /infos/:contentId
// @desc     CREATE infos
// @access   Private
router.post('/:contentId', auth, file, async (req, res, next) => {
  try {
    const id = req.params.contentId
    if (req.body.photo_name) {
      req.body.photo=`infos/${req.body.photo_name}`
    }
    let content = await Content.findOne({_id : id})
    if (!req.body.order) {      
      req.body.order = get_max_order(content, 'infos')
    }
    content = await Content.findOneAndUpdate({_id : id}, { $push: { infos: req.body } }, { new: true })
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

// @route    DELETE /infos/:contentId
// @desc     DELETE infos
// @access   Private
router.delete('/:contentId', auth, async (req, res, next) => {
  try {
    const id = req.params.contentId
    const content = await Content.findOneAndUpdate({_id : id}, { $pull: { infos: req.body } }, { new: true })  
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
