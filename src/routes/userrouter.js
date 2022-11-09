const express = require('express')
const User = require('../models/usermodel')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const router = new express.Router()


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpe?g|png|gif|bmp|webp)$/)) {
            return cb(new Error('Must be an image File'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    req.user.avatar = await sharp(req.file.buffer).resize(
        { width: 250, height: 250 }
    ).png().toBuffer()

    //req.user.avatar = req.file.buffer
    await req.user.save()
    res.status(200).send(`File ${req.file.originalname} has been uploaded!`)

}, (error, req, res, next) => {
    res.status(406).send({ error: error.message })
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {

        await user.save()
        const token = await user.generateAuthToken()
        //sendWelcomeEmail(user.email, user.name)
        res.status(201).send({ user, token })

    } catch (e) {
        res.send(e.message)

    }
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({ error: 'Please authenticate' })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {

        const reqToken = req.headers.authorization.replace('Bearer ', '')
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== reqToken
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

})


// router.get('/users/:id', async (req, res) => {

//     try {
//         const _id = req.params.id
//         const userById = await User.findById(_id)
//         if (!userById) {
//             return res.status(404).send({ error: 'cannot find user' })
//         }
//         res.status(200).send(userById)

//     } catch (e) {
//         res.status(400).send(e.message)
//     }
// })


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: `Updates must be one of ${allowedUpdates}` })
    }

    try {

        //using bracket notation because field is dynamic vs
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e.message)
    }
})


router.delete('/users/me', auth, async (req, res) => {

    try {
        // //user object attached to req object via auth function
        // const deleteUserById = await User.findByIdAndDelete(req.user._id)

        // if (!deleteUserById) {
        //     return res.status(404).send('User ID not found')
        // }
        await req.user.remove()
        //sendCancellationEmail(req.user.email, req.user.name)
        res.status(200).send({ deletedUser: req.user })

    } catch (e) {
        res.status(400).send(e.message)
    }
})


router.delete('/users/me/avatar', auth, async (req, res) => {

    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send({
            message: 'Avatar has been deleted!',
            user: req.user
        })

    } catch (e) {
        res.status(404).send(e.message)
    }
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send('no image found')
    }
})

module.exports = router