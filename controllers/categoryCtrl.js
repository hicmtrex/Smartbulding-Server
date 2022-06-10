const Categories = require('../models/categoryModel')
const Posts = require('../models/postModel')

const categoryCtrl = {
    createCategory: async (req, res) =>{ 
        try {
            // if user have role = admin ---> admin
            // only admin can create , delete  category
            const {name} = req.body
            const category = await Categories.findOne({name})
            if(category) return res.status(400).json({msg: "This category already exists."})

            const newCategory = new Categories({name})

            await newCategory.save()
            res.json({
                 msg: 'Created a category!',
                newCategory:{
                    ...newCategory._doc
                } 
                })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getCategories: async (req, res) =>{
        try {
            const categories = await Categories.find()
            res.json({categories}) 
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }, 
    getCategory: async (req, res) => {
        try {
            const category = await Categories.findById(req.params.id)
            .populate("category ")
            
            if(!category) return res.status(400).json({msg: 'This category does not exist.'})

            res.json({
               category
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCategory: async(req, res) =>{
        try {
            const posts = await Posts.findOne({category: req.params.id})
            if(posts) return res.status(400).json({
                msg: "Please delete all posts with a relationship."
            })
            
           await Categories.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted Category"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
   
}


module.exports = categoryCtrl