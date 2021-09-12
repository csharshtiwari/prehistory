import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import bcrypt from 'bcryptjs'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT
const uri = process.env.URI

const userSch = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model('User', userSch)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.post('/api/register', (req, res) => {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    User.find({ email:req.body.email }).then(user => {
        if(user[0] != undefined){
            res.json({outcome: "400"})
        }
        else{
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    })
                    user.save().then(result => {
                        res.json({outcome:"200"})
                        mongoose.connection.close()
                    })
                })
            })
        }
    })
})

app.post('/api/login', (req, res) => {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    User.find({ email: req.body.email }).then(user => {
        if(user){
            bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                if(result === true){
                    res.json({ outcome:"200" })
                    mongoose.connection.close()
                }
                else{
                    res.json({ outcome:"401" })
                    mongoose.connection.close()
                }
            })
        }
        else{
            res.json({ outcome:"400" })
            mongoose.connection.close()
        }
    })
})