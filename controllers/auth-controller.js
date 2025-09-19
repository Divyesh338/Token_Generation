const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            password: hashedPassword,
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
        const { username, password } = req.body;

        // find if the current user is exist in DB 
        const existingUser = await user.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Invalid username'
            });
        }

        // if password is correc or not 
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid username'
            });
        }

        // create user token
        const accessToken = jwt.sign({
            userId: existingUser._id,
            username: existingUser.username,
            role: existingUser.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '5m'
        });

        res.status(200).json({
            success: true
            ,
            message: 'Loged In successfully...',
            accessToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'some error occured...'
        })
    }
};

module.exports = { loginUser, registerUser };