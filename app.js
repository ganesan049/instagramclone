require("dotenv").config();

const express = require("express")
const app  = express()
const mongoose = require("mongoose")
const cors = require("cors")
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.use('/uploads',express.static('uploads'))
app.use(require("./routes/index"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))


mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
},function(err) {
  if (err) {
      console.error('System could not connect to mongo server.')
      console.log(err)     
  } else {
      console.log('System connected to mongo server.')
  }
})

if(process.env.NODE_ENV === "production"){
  app.use(express.static('client/build'))
  const path = require("path")
  app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,'./client','build','index.html'))
  })
}

app.listen(PORT,() => {
  console.log(`server is running at ${PORT}`)
})
