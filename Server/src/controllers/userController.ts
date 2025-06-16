import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/client';


const Signup = async (req, res) => {
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/

    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ status: false, message: 'All fields are required' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ status: false, message: 'Passwords do not match' });
    }
    if (!strongPassword.test(password)) {
        return res.status(400).json({
          message:
            'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
        });
      }
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
        res.status(201).json({status: true, message: "Account created successfully", user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {

    }
}

const Login = async (req, res) => {

}

export { Signup, Login };