const MSGS=require("../messages")
const AWS=require('aws-sdk')
const config=require('config')
const fs=require('fs')
const slugify = require('../service/slugify')




// banner[i].product_banner_photo
// infos[i].icon
// about.photo
// services.service[i].photo


module.exports = async function (req, res, next) {

    try {

        const BUCKET_NAME = process.env.S3_BUCKET_NAME || config.get('S3_BUCKET_NAME')
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || config.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || config.get('AWS_SECRET_ACCESS_KEY')
        })


        if (!req.files) {
            if (req.method == 'PATCH') {
                next()
            }else{
                res.status(204).send({error:MSGS.FILE_NOT_SENT})
            }
    } else{
        let photo = req.files['about.photo']
        const name = slugify(photo.name)

        if (photo.mimetype.includes('image/')){
        const file = await photo.mv(`./uploads/${name}`)

        const params = {
            Bucket:BUCKET_NAME,
            ACL:'public-read',
            Key: `about/${name}`, 
            Body: fs.createReadStream(`./uploads/${name}`)
        }
        s3.upload(params, function (err, data) {
            if (err) {
                console.error(err)
                res.status(500).send(err)
                
            }else{
                console.log(`File uploaded sucefully. ${data.location}`)
                fs.unlinkSync(`./uploads/${name}`)
                req.body['about.photo']=`about/${name}`
                next()
            }
        })

        
        
    }else{
        res.status(400).send({
            message:MSGS.FILE_INVALID
        })
        }
    }
    } catch (error) {
        res.status(500).send({'Erro': error.message})
    }    
}

