const express = require('express');
const path = require('path');
const multer = require('multer');
const md = require('markdown-it')();
const fs = require('fs');
const PORT = 3000;
const app =express();

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({'storage':storage});

app.use(express.static(path.join(__dirname, 'pages')));


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
})

app.post('/upload',upload.single('file'),(req,res)=>{
    console.log(req.file);
    if(!req.file){
        return res.status(400).send('File not uploaded properly');
    }
    const filePath = path.join(__dirname,'uploads',req.file.filename);
    fs.readFile(filePath,'utf-8',(err,data)=>{
        if(err){
            return res.status(500).send('Error reading this file');
        }
        const htmlContent = md.render(data);
        res.send(htmlContent);
    });
});
    
app.listen(PORT,()=>{
    console.log(`Server is started on ${PORT}`);
})