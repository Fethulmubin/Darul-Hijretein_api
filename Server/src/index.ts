import express from 'express'
import cors from 'cors'
import userRoute from './routes/userRoute'

const app = express()
const PORT = process.env.PORT || 3500

app.use(cors())
app.use(express.json())
 //routes

app.use('/user', userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
)
