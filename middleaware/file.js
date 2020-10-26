const MSGS=require("../messages")

module.exports = function (req, res, next) {

    try {
        if (!req.files) {
        res.status(204).send({error:MSGS.FILE_NOT_SENT})
    } else{
        let photo = req.files.photo
        if (photo.mimetype.includes('image/')){
        photo.mv('./uploads/' + photo.name)
        
        next()
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

