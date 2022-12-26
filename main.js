var express = require('express')
const { deleteProductById, getAllProducts, insertNewProduct, updateProduct, findProductById, findProductByName } = require('./databaseHandler')
var app = express()

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
    const newProduct = {
        name :name,
        price: Number.parseFloat(price),
        picture: picUrl
    }
    await insertNewProduct(newProduct)
    res.redirect('/all')

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