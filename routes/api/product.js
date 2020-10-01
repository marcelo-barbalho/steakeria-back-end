const express = require('express');
const Product = require('../../models/product');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const MSGS = require('../../messages')


// @route    GET /product/:id
// @desc     DETAIL product
// @access   Public
router.get('/:id',[], async (req, res, next) => {
    try {
        const id = req.params.id
        const product = await Product.findOne({_id : id})
        if(product){
            res.json(product)
        }else{
            res.status(404).send({ "error": MSGS.PRODUCT404 }) 
        }
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }
})


// @route    PATCH /product/:id
// @desc     PARTIAL UPDATE product
// @access   Public
router.patch('/:id',[], async (req, res, next) => {
  try {
      const product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      if(product){
          res.json(product)
      }else{
          res.status(404).send({ "error": MSGS.PRODUCT404 }) 
      }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR })
  }
})

// @route    DELETE /product/:id
// @desc     DELETE product
// @access   Public
router.delete('/:id',[], async (req, res, next) => {
  try {
      const id = req.params.id
      const product = await Product.findOneAndDelete({_id : id})
      if(product){
          res.json(product)
      }else{
          res.status(404).send({ "error": MSGS.PRODUCT404 }) 
      }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR })
  }
})


// @route    GET /product
// @desc     LIST product
// @access   Public
router.get('/', async (req, res, next) => {
    try {
      const product = await Product.find({})
      res.json(product)
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }
  })
  

// @route    POST /product
// @desc     CREATE product
// @access   Public
router.post('/', [
    
  ], async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      } else {
        // TODO: get last_modified_by by req.user after code auth
        let product = new Product(req.body)
        await product.save()
        if (product.id) {
          res.json(product);
        }
      }
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }
  })


module.exports = router;