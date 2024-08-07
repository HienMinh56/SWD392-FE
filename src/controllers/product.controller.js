/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

"use strict";


const foodApi = require('../api/product.api');
const storeApi = require('../api/store.api');
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage instead of disk storage
const upload = multer({ storage: storage });

async function getProducts(req, res) {
  const { storeId, foodId, cate } = req.query;

  const filters = {};
  if (foodId !== undefined) filters.foodId = foodId;
  if (cate !== undefined) filters.cate = cate;

  try {
    const productData = await foodApi.getProducts(storeId, filters);

    if (productData.error) {
      res.render('./pages/store_detail', { text: 'Store', foods: []});
    } else {
      res.render('./pages/store_detail', { text: 'Store', foods: productData.foods });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.render('./pages/store_detail', { text: 'Store', foods: [] });
  }
}

async function getProductDetail(req, res) {
  let { storeId, foodId } = req.params;
  let { cate } = req.query;

  let filters = {};
  if (cate !== undefined) filters.cate = cate;

  try {
    const productData = await foodApi.getProducts(storeId, foodId, filters);

    if (productData.error) {
      res.render('./pages/product_detail', { text: 'Store', food: [] });
    } else {
      const food = productData.foods.find(food => food.foodId === foodId);
      res.render('./pages/product_detail', { text: 'Store', food: food || [] });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.render('./pages/product_detail', { text: 'Store', food: [] });
  }
}

async function getStoreData(req, res) {
  const { storeId } = req.query;
  
  try {
    const storeData = await foodApi.getProducts(storeId);
    res.json(storeData.store);
  } catch (error) {
    console.error('Error getting dataStore:', error);
    res.status(500).json({ error: 'An error occurred while getting dataStore' });
  }
}

async function addProduct(req, res) {
  const { Name, Title, Description, Price, Cate } = req.body;
  const imageFile = req.file;

  if (!Name || !Title || !Description || !Price || !Cate || !imageFile) {
    return res.status(400).json({
      type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
      title: 'One or more validation errors occurred.',
      status: 400,
      traceId: '',
      errors: {
        Name: Name ? undefined : ["Name is required"],
        Title: Title ? undefined : ["Title is required"],
        Description: Description ? undefined : ["Description is required"],
        Price: Price ? undefined : ["Price is required"],
        Cate: Cate ? undefined : ["Cate is required"],
        Image: imageFile ? undefined : ["The image field is required."]
      }
    });
  }

  const foodData = {
    Name,
    Title,
    Description,
    Price,
    Cate
  };

  try {
    const result = await foodApi.addProduct(req.query.storeId, foodData, imageFile);
    res.json(result);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'An error occurred while adding the product' });
  }
}

async function updateProduct(req, res) {
  const { Title, Description, Price, Cate } = req.body;
  const imageFile = req.file;

  if (!Title || !Description || !Price || !Cate) {
    return res.status(400).json({
      type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
      title: 'One or more validation errors occurred.',
      status: 400,
      traceId: '',
      errors: {
        Title: Title ? undefined : ["Title is required"],
        Description: Description ? undefined : ["Description is required"],
        Price: Price ? undefined : ["Price is required"],
        Cate: Cate ? undefined : ["Cate is required"]
      }
    });
  }

  const foodData = {
    Title,
    Description,
    Price,
    Cate
  };

  try {
    const result = await foodApi.updateProduct(req.query.foodId, foodData, imageFile);
    res.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'An error occurred while updating the product' });
  }
}

async function deleteProduct(req, res) {
  const { foodId } = req.body;

  try {
    const result = await foodApi.deleteProduct(foodId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product' });
  }
}

module.exports = { getProducts, addProduct, updateProduct, deleteProduct, getStoreData, getProductDetail };