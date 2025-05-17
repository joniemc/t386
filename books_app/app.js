const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 3000;

app.use(express.json());

function reedBooks(){
    const data = fs.readFileSync('books.json', 'utf-8');
        return JSON.parse(data);
}

function writeBooks(books){
    fs.writeFileSync('books.json',JSON.stringify(books,null,2));
}

function autoIncrementalId(){
    const books = reedBooks();
    let lastId = books.length>0 ? books[books.length-1].id : 0;
    let newId = lastId+1;
    return newId;
}

app.get('/api/books',(req,res)=>{
    res.json(reedBooks());
});

app.get('/api/books/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const books = reedBooks();
    const book = books.find(cbook => cbook.id === id);
    
    if(book){
        res.json({status:200, message:'Success',data:book});
    }else{
        res.status(400).json({status:400, message:'Registro no encontrado..',data:null});
    }
    
});

app.post('/api/books',(req,res)=>{
    const book = req.body;
    book.id = autoIncrementalId();
    const books = reedBooks();
    books.push(book);
    writeBooks(books);
    res.json({status:200,message:'Registro Exitoso',data:book});
});

app.put('/api/books/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const book = req.body;
    const books = reedBooks();
    let exists = false;
    books.forEach(cbook => {
        if(cbook.id === id){
            exists = true;
            cbook.titulo = book.titulo;
            cbook.autor = book.autor;
            cbook.genero = book.genero;
            cbook.anioPublicacion = book.anioPublicacion;
        }        
    });

    if(exists){
        writeBooks(books);
        res.json({status:200,message:'Actualizado con exito',data:book});
    }else{
        res.status(400).json({status:400,message:'Registro no encontrado',data:null});
    }
});

app.delete('/api/books/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const books = reedBooks();

    const filterBooks = books.filter(cbook => cbook.id !== id);

    if(filterBooks.length !== books.length){
        writeBooks(filterBooks);
        res.json({status:200,message:'Registro eliminado',data:null});
    }
    else{
        res.status(400).json({status:400,message:'Registro no encontrado',data:null});
    }
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
