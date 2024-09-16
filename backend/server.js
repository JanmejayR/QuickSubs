import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
dotenv.config();
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
const __dirname = path.resolve();

const app = express();
app.use(cors({
    credentials:true,
    origin: 'http://localhost:5173'
}))
app.use(express.json())



app.use('/api/auth' , authRoutes)
app.use('/api/user', userRoutes)

app.use(express.static(path.join(__dirname , "/frontend/dist")))

app.get("*" , (req,res)=> {
    res.sendFile(path.join(__dirname , "frontend" , "dist" , "index.html"
    ))
})


app.listen(process.env.PORT , ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})