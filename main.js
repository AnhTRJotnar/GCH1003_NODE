const { urlencoded } = require('express')
var express = require('express')
const { deleteProductById, getAllProducts, insertNewProduct, updateProduct, findProductById, findProductByName } = require('./databaseHandler')
var app = express()
var hbs = require('hbs')

hbs.registerHelper('func', function(price){
    if(price < 50){
        return "red";
    }else if (price >= 50 && price <= 70){
        return"green";
    }else{
        return "yellow"
    }
})
app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    await deleteProductById(id)
    res.redirect('/all')
})

app.get('/all',async (req,res)=>{
    let results = await getAllProducts()
    console.log(results)
    res.render('allProduct',{results:results})
})

app.post('/new',async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picUrl = req.body.txtPic
    if (name.length < 2){
        res.render('newProduct', {  nameError:'Name should be over 2 characters' })
    }else if (picUrl.length==0){
        res.render('newProduct', {  picError:'You have not uploaded a picture' })
    }else if (isNaN(price) == true){
        res.render('newProduct', {  priceError:'You have not uploaded a picture' })
    }else{
        const newProduct = {
            name :name,
            price: Number.parseFloat(price),
            picture: picUrl
        }
        await insertNewProduct(newProduct)
        res.redirect('/all')
        }
})

app.post('/search', async (req, res)=>{
    const name = req.body.Search
    let results = await findProductByName(name)
    res.render('allProduct', {results:results})
})

app.post('/edit',async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picUrl =req.body.txtPic
    const id = req.body.id 
    await updateProduct(id,name, price, picUrl)
    res.redirect('/all')
})

app.get('/edit', async (req,res)=>{
    const id = req.query.id
    const product = await findProductById(id)

    res.render('edit', {product:product})
})

app.get('/new', async (req,res)=>{
    res.render('newProduct')
})

app.get('/', async (req,res)=>{
    res.render('home')
})


const PORT = process.env.PORT || 3000
app.listen(PORT, (req,res)=>{
    console.log("Server is running")
})