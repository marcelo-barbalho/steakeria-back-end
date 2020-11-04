
const config = require('config')





function complete_link(content){
const BUCKET_PUBLIC_PATH = process.env.BUCKET_PUBLIC_PATH || config.get('BUCKET_PUBLIC_PATH')
content.about.photo = `${BUCKET_PUBLIC_PATH}${content.about.photo}`
content.services.service.map(function(services){
  services.photo = `${BUCKET_PUBLIC_PATH}${services.photo}`
})
content.banner.map(function(banner){
  banner.photo = `${BUCKET_PUBLIC_PATH}${banner.photo}`
})
content.infos.map(function(infos){
  infos.photo = `${BUCKET_PUBLIC_PATH}${infos.photo}`
})
return content
}
module.exports = complete_link