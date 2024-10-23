const CategoryModel = require("../models/CategoryModel");
const slugify = require("slugify");
const fs = require("fs");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const picturePath = req.file?.path;
    let parentId = req.body?.parentId || null;

    if (req.body?.parentId == "undefined") {
      parentId = null;
    }
    if (!name) {
      return res.send({ msg: "Name is required" });
    }
    const categoryExist = await CategoryModel.findOne({
      name: name.toUpperCase(),
    });
    if (categoryExist) {
      picturePath && (await fs.unlinkSync(picturePath));
      return res.send({ msg: `${name} already exist` });
    }

    let category = await CategoryModel.create({
      name: name.toUpperCase(),
      slug: slugify(name),
      parentId,
      user: req.user?._id,
      picture: picturePath,
    });

    res.status(201).send({
      msg: `${name} is created successfully`,
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from Category create", error });
  }
};
// without image=========================
// const { name, parentId } = req.body;
// if (!name) {
//   return res.status(400).send({ msg: "Name is required" });
// }
// const categoryExist = await CategoryModel.findOne({ name });
// if (categoryExist) {
//   return res.status(400).send({ msg: `${name} already exist` });
// }
// let category = await CategoryModel.create({ name:name.toLowerCase(), slug:slugify(name), parentId });
// res.status(201).send({ msg: `${name} is created successfully`, category });
//====================================================
const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    let { name, parentId } = req.body;
    const picturePath = req.file?.path;
if (req.body?.parentId == "undefined") {
  parentId = null;
}

    const nameExist = await CategoryModel.findOne({
      name: name.toUpperCase(),
    });
     if (nameExist) {
       return res.send({ msg: `${name} already exist` });
     }
    let categoryExist = await CategoryModel.findById(id);
    if (!categoryExist) {
      return res.send({ msg: "No data found" });
    }

    if (name) categoryExist.name= name.toUpperCase();
    if (name) categoryExist.slug = slugify(name);
     categoryExist.parentId = parentId;

    // upload and delete image on cloudinary
    if (picturePath) {
      try {
        fs.unlinkSync(categoryExist.picture);
      } catch (error) {
        console.log(error);
      }
      categoryExist.picture = picturePath;
    }

    await categoryExist.save();
    res.status(201).send({
      success: true,
      msg: `${categoryExist.name} has been updated successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from Category update", error });
  }
};
//==============================================
let deleteCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let cat = await CategoryModel.findById(id);
    if (cat.picture) {
      try {
        fs.unlinkSync(cat.picture);
      } catch (error) {
        console.log(error);
      }
    }
    let deleteItem = await CategoryModel.findByIdAndDelete(id);
    res
      .status(200)
      .send({ msg: `${deleteItem} has been deleted successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from delete Category", error });
  }
};
//======================================
let createCategories = async (category, parentId = null) => {
  let categoryList = [];
  let filteredCat;
  if (parentId == null) {
    filteredCat = await category.filter((item) => item.parentId == undefined);
  } else {
    filteredCat = await category.filter((item) => item.parentId == parentId);
    // console.log(filteredCat);
  }
  for (let v of filteredCat) {
    await categoryList.push({
      _id: v._id,
      name: v.name,
      slug: v.slug,
      user: v.user,
      picture: v.picture,
      parentId: v.parentId,
      updatedAt: v.updatedAt,
      children: await createCategories(category, v._id),
    });
    // console.log(v);
  }
  return categoryList;
};

const categoryList = async (req, res) => {
  try {
    const category = await CategoryModel.find({});
    if (!category || category?.length === 0) {
      return res.status(400).send({ msg: "No data found", category });
    }
    let categoryList = await createCategories(category);

    //  let categoryList = category.sort((a, b) => {
    //    a = a.name.toLowerCase();
    //    b = b.name.toLowerCase();
    //    return a > b ? 1 : -1;
    //  });
    res.status(200).send(categoryList);
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "error from category List", error });
  }
};

//=======================================================
const singleCategory = async (req, res) => {
  try {
    const singleCategory = await CategoryModel.findOne({
      slug: req.params.slug,
    });
    if (!categoryList) {
      return res.status(400).send("No data found");
    }
    res.status(200).send(singleCategory);
  } catch (error) {
    res.status(401).json({ msg: "error from singleCategory", error });
  }
};
//=============================================================
const getSearchCategory = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    const searchCat = await CategoryModel.find({
      name: { $regex: keyword, $options: "i" },
    })
    res.status(200).send({
      msg: "got user from search",
      searchCat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from userSearch", error });
  }
};

module.exports = {
  createCategory,
  getSearchCategory,
  updateCategory,
  categoryList,
  singleCategory,
  deleteCategory,
};
