const express = require('express')
const router = new express.Router()


router.get('*', (req, res) => {

    res.render('404', {
        title: '404',
        pageNotFound: 'This is not the page you are looking for!'
    })
})



module.exports = router