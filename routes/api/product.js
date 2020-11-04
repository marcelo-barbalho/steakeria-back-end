const express = require('express');
const Product = require('../../models/product');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const MSGS = require('../../messages')
const auth = require('../../middleaware/auth')
const file = require('../../middleaware/file')
const config = require('config')




// @route    GET /product/:id
// @desc     DETAIL product
// @access   Public
router.get('/:id',[], async (req, res, next) => {
    try {
        const id = req.params.id
        const product = await Product.findOne({_id : id})
        const BUCKET_PUBLIC_PATH = process.env.BUCKET_PUBLIC_PATH || config.get('BUCKET_PUBLIC_PATH')
        product.photo = `${BUCKET_PUBLIC_PATH}${product.photo}`
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
// @access   Private
router.patch('/:id',auth, file, async (req, res, next) => {
  try {
      req.body.last_modified_by=req.user.id
      if (req.body.photo_name) {
        req.body.photo=`product/${req.body.photo_name}`
      }
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
      let products = await Product.find(req.query)
      const BUCKET_PUBLIC_PATH = process.env.BUCKET_PUBLIC_PATH || config.get('BUCKET_PUBLIC_PATH')
      products = products.map(function(product){
        product.photo = `${BUCKET_PUBLIC_PATH}${product.photo}`
        return product
      })
      res.json(products)
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }
  })
  

// @route    POST /product
// @desc     CREATE product
// @access   Private
router.post('/',auth, file, async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      } else {
        req.body.photo=`product/${req.body.photo_name}`
        let product = new Product(req.body)
        product.last_modified_by=req.user.id
        await product.save()
        if (product.id) {
          
          const BUCKET_PUBLIC_PATH = process.env.BUCKET_PUBLIC_PATH || config.get('BUCKET_PUBLIC_PATH')
          product.photo = `${BUCKET_PUBLIC_PATH}${product.photo}`
          res.json(product);
        }
      }
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }
  })


module.exports = router;