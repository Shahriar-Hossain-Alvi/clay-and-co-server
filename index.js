const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// clayAdmin
// vjK8aODpkaI30CiT


app.get('/', (req, res)=>{
    res.send('Clay & Co. server is running');
})

app.listen(port, ()=>{
    console.log(`Clay & Co. server is running at port ${port}`);
})
