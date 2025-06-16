import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/client';
import validator from 'validator';


const Signup = async (req, res) => {

    //validating the request body
    const { name, email, password, confirmPassword } = req.body;
    
    //registering user
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            return res.status(400).json({ status: false, message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //creating the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'STUDENT',
            },
        });
        //generating token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ status: true, message: "Account created successfully", user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });

    }
}

const Login = async (req, res) => {
    const { email, password } = req.body;
    // if (!email || !password) {
    //     return res.status(400).json({ status: false, message: 'Email and password are required' });
    // }
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
        if (!existingUser) {
            return res.status(400).json({ status: false, message: 'User does not exist, Create One' });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: false, message: 'Invalid credentials' });
        }
        //generating token
        const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ status: true, message: 'Login successful', user: { id: existingUser.id, name: existingUser.name, email: existingUser.email }, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });

    }

}

export { Signup, Login };