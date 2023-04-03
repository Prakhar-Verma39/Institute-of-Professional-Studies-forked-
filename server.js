const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const morgan = require('morgan');


// app.use(morgan('tiny'));

const pages = require('./pages.json'); 
const navbarItems = { ...pages["home"] }.navbarItems;

// const Centres = require('./models/centres');

// mongoose.connect('mongodb://127.0.0.1:27017/IPS')
//  .then(() => {
//     console.log("CONNECTION OPEN!!!")
//  })
// .catch(err => {
//     console.log("OH NO ERROR!!!")
//     console.log(err)
// })

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, '/views'))

// app.use(express.urlencoded({extended: true}))
// app.use(methodOverride('_method'))


app.get('/', catchAsync(async (req, res) => {
        const home = await pages["home"];
        res.render('home.ejs', { ...home })
    }))

app.get('/:template', catchAsync(async (req, res) => {
    const {template} = req.params;
    const home = await pages["home"];
    res.render(`template/${template}.ejs`, {...home})
}))

app.get('/home/:centre',  catchAsync(async (req, res) =>{
    const navbarItems = await { ...pages["home"] }.navbarItems;
    const {centre} = req.params;
    const page = await pages[centre];
    res.render('centre.ejs', { ...page, navbarItems})} 
))


// app.get('/home/:centre/about', catchAsync(async (req, res) => {
//     const about = await pages['about'];
//     const navbarItems = await { ...pages["home"] }.navbarItems;
//     const {centre} = req.params;
//     const page = await pages[centre];
//     page.path = "../../"
//     res.render('template/about.ejs', {...page, navbarItems})
// }))

// app.get('/home/:centre/courses', catchAsync(async (req, res) => {
//     const courses = await pages['courses'];
//     const navbarItems = await { ...pages["home"] }.navbarItems;
//     const {centre} = req.params;
//     const page = await pages[centre];
//     page.path = "../../"
//     res.render('template/courses.ejs', {...page, navbarItems})
// }))

// app.get('/home/:centre/faculty', catchAsync(async (req, res) => {
//     const faculty = await pages['faculty'];
//     const navbarItems = await { ...pages["home"] }.navbarItems;
//     const {centre} = req.params;
//     const page = await pages[centre];
//     page.path = "../../"
//     res.render('template/faculty.ejs', {...page, navbarItems})
// }))

// app.get('/home/:centre/gallery', catchAsync(async (req, res) => {
//     const gallery = await pages['gallery'];
//     const navbarItems = await { ...pages["home"] }.navbarItems;
//     const {centre} = req.params;
//     const page = await pages[centre];
//     page.path = "../../"
//     res.render('template/gallery.ejs', {...page, navbarItems})
// }))

// app.get('/home/:centre/notice', catchAsync(async (req, res) => {
//     const notice = await pages['notice'];
//     const navbarItems = await { ...pages["home"] }.navbarItems;
//     const {centre} = req.params;
//     const page = await pages[centre];
//     page.path = "../../"
//     res.render('template/notice.ejs', {...page, navbarItems})
// }))


app.all('*', (req, res, next) => {
  next(new ExpressError('Requested Page Not Found', 404)) 
})


app.use((err, req, res, next) => {
    console.log("************************************")
    console.log("**************ERROR*****************")
    console.log("************************************")
    
    const path = "../"
    const style = "css/centre.css"
    const script = "js/centre.js"
    const title = "Error"


    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('notfound', {path, style, title,  script, navbarItems, err })
})





app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000") 
})