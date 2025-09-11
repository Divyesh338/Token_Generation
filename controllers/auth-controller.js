const user = require('../models/user');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        // extract use info from req body
        const { username, email, password, role } = req.body;

        // if that user is already exist into database
        const checkExistingUser = await user.findOne({ $or: [{ username }, { email }] });
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User is already exist.. please try difffernt user name...'
            })
        }

        //hash user password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user and same in DB
        const newlyCreatedUser = new user({
            username,
            email,
            hashedPassword,
            role: role || user
        })

        await newlyCreatedUser.save();
        if (newlyCreatedUser) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully...'
            })
        }
        // } else {
        //     res.status(201).json({
        //         success: false,
        //         message: 'Unable to register user..'
        //     })
        // }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'some error occured...'
        })
    }
};

const loginUser = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'some error occured...'
        })
    }
};

module.exports = { loginUser, registerUser };