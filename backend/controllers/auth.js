import User from "../models/user.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import validator from 'validator'
const createToken = (id) => {
    return jwt.sign({ id }, process.env.jwt_SECRECT)
}



//register user

const registerUser = async (req, res) => {
    const { username, email, password } = req.body
    try {
        //checking if user exists
        const Exists = await User.findOne({ email })
        if (Exists) {
            return res.json({ message: "User already exists", status: 400, success: false })
        }
        //validator
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password Should atlest have 8 characters" })
        }
        //hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        //new User
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)


        return res.json({ success: true, user, token, status: 200 })
    } catch (error) {
        return res.json({ message: "Server Error", status: 500, success: false })
    }

}

//Login User

const logInUser = async (req, res) => {
    const { email, password } = req.body
    try {


        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: "User doesnot exist", status: 400, success: false })
        }
        //vefify password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ message: "Invalid Password", status: 400, success: false })
        }


        const token = createToken(user._id)

        return res.json({ success: true, status: 200, message: "Logged in successfully", user, token })
    }
    catch (error) {
        return res.json({ message: "Server Error", status: 500, success: false })
    }
}











export { registerUser, logInUser }

