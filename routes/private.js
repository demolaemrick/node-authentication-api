const router = require('express').Router();
const verify = require('../middlewares/verifyToken')

router.get('/', verify, (req, res) => {
    // console.log(req.user) //to get the logged the user
    res.json({
        posts: {
            title: 'Blog post one',
            content: 'Just some blah blah blah that is protected.'
        }
    })
})

module.exports = router