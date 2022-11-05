const express = require('express')
const Task = require('../models/taskmodel')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {

    try {
        const newTask = new Task({
            ...req.body,
            owner: req.user._id
        })
        await newTask.save()
        res.status(201).send(newTask)
    } catch (e) {
        res.send(400).send(e.message)
    }

})


//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        console.log(req.user)
        res.status(200).send(req.user.tasks)

    } catch (e) {
        res.status(400).send(e.message)
    }

})


router.get('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id
    try {

        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)

    } catch (e) {
        res.status(400).send(e.message)
    }

})



router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed', 'note']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: `Updates must be one of ${allowedUpdates}` })
    }

    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send(`No task with ID ${_id}`)
        }

        //findByIdAndUpdate bypasses all middleware, setting up for future middleware
        // const task = await Task.findByIdAndUpdate(_id, req.body,{new: true,runValidators: true})

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e.message)
    }
})




router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const _id = req.params.id
        const deleteTask = await Task.findOneAndDelete({ _id, owner: req.user._id })

        if (!deleteTask) {
            return res.status(404).send('Task ID not found')
        }
        res.status(200).send({ deletedTask: deleteTask })

    } catch (e) {
        res.status(404).send(e.message)
    }
})


router.delete('/tasks', auth, async (req, res) => {
    try {
        await Task.deleteMany({ owner: req.user._id })
        res.status(200).send('All Tasks Deleted')
    } catch (e) {
        res.status(404).send(e.message)
    }
})


module.exports = router