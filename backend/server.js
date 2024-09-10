import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config();
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
const app = express();
app.use(cors({
    credentials:true,
    origin: 'http://localhost:5173'
}))
app.use(express.json())



app.use('/api/auth' , authRoutes)
app.use('/api/user', userRoutes)


app.listen(process.env.PORT , ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})