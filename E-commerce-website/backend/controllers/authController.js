import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Signup User
// export const signupUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Check if user already exists

//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(400).json({message: "User already exists"});
//         }

//         //Hash password

//         const hashPassword = await bcrypt.hash(password, 10);

//         //Create User

//         await User.create({
//             name,
//             email,
//             password: hashPassword
//         });

//         res.json({ message: "User registered successfully"});


//     } catch (error) {
//         res.status(500).json({message: "Server error", error});
//     }
// };

export const signupUser = async (req, res) => {
    try {

        // 👇 Request में क्या आ रहा है
        console.log("Request Body:", req.body);

        const { name, email, password } = req.body;

        // 👇 Check user exists
        const userExists = await User.findOne({ email });
        console.log("User Exists:", userExists);

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // 👇 User create
        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        });

        // 👇 Check user saved or not
        console.log("Saved User:", newUser);

        res.json({
            message: "User registered successfully"
        });

    } catch (error) {

        // 👇 Agar koi error aata hai to yahan print hoga
        console.error("Signup Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


//Login User

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        // Compare password

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials"})
        }

        // Genrate JWT Token 

       const token = jwt.sign(
        {id: user.id},
        process.env.JWT_SECRET,
        { expiresIn: "7d"}
       );

       res.json({
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
       });


    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};