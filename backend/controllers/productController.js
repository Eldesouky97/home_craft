const { Product, Store } = require('../models')
const { validationResult } = require('express-validator')
const slugify = require('slugify')

const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const {
      name,
      description,
      price,
      comparePrice,
      cost,
      sku,
      barcode,
      trackQuantity,
      quantity,
      allowOutOfStock,
      category,
      tags,
      weight,
      dimensions,
      featured,
      seoTitle,
      seoDescription
    } = req.body

    // Check if store belongs to user
    const store = await Store.findOne({
      where: {
        id: req.body.storeId,
        userId: req.user.id
      }
    })

    if (!store) {
      return res.status(404).json({ message: 'Store not found' })
    }

    // Generate slug from name
    const slug = slugify(name, {
      lower: true,
      remove: /[*+~.()'"!:@]/g
    })

    // Check if slug already exists in the same store
    const existingProduct = await Product.findOne({
      where: { 
        slug,
        storeId: req.body.storeId
      }
    })
    if (existingProduct) {
      return res.status(400).json({ message: 'Product name already exists in this store' })
    }

    // Handle uploaded images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : []

    // Create product
    const product = await Product.create({
      storeId: req.body.storeId,
      name,
      slug,
      description,
      price,
      comparePrice,
      cost,
      sku,
      barcode,
      trackQuantity: trackQuantity || true,
      quantity: quantity || 0,
      allowOutOfStock: allowOutOfStock || false,
      images,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      weight,
      dimensions: dimensions || {},
      featured: featured || false,
      seoTitle,
      seoDescription,
      status: 'active'
    })

    res.status(201).json({
      success: true,
      product
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      storeId, 
      category, 
      status, 
      featured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query

    const offset = (page - 1) * limit

    const whereClause = {}
    if (storeId) whereClause.storeId = storeId
    if (category) whereClause.category = category
    if (status) whereClause.status = status
    if (featured) whereClause.featured = featured
    if (search) {
      whereClause.name = {
        [require('sequelize').Op.like]: `%${search}%`
      }
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      include: [{
        model: Store,
        as: 'store',
        attributes: ['id', 'name', 'slug']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]]
    })

    res.json({
      success: true,
      products: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Store,
        as: 'store',
        attributes: ['id', 'name', 'slug', 'logo']
      }]
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({
      success: true,
      product
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const product = await Product.findOne({
      where: {
        id: req.params.id,
        storeId: req.body.storeId
      },
      include: [{
        model: Store,
        as: 'store'
      }]
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Check if store belongs to user
    if (product.store.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' })
    }

    const {
      name,
      description,
      price,
      comparePrice,
      cost,
      sku,
      barcode,
      trackQuantity,
      quantity,
      allowOutOfStock,
      category,
      tags,
      weight,
      dimensions,
      featured,
      status,
      seoTitle,
      seoDescription
    } = req.body

    // Generate new slug if name changed
    let slug = product.slug
    if (name && name !== product.name) {
      slug = slugify(name, {
        lower: true,
        remove: /[*+~.()'"!:@]/g
      })
      
      // Check if new slug already exists in the same store
      const existingProduct = await Product.findOne({
        where: { 
          slug,
          storeId: product.storeId,
          id: { [require('sequelize').Op.ne]: product.id }
        }
      })
      if (existingProduct) {
        return res.status(400).json({ message: 'Product name already exists in this store' })
      }
    }

    // Handle uploaded images
    let images = product.images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`)
      images = [...images, ...newImages]
    }

    await product.update({
      name,
      slug,
      description,
      price,
      comparePrice,
      cost,
      sku,
      barcode,
      trackQuantity,
      quantity,
      allowOutOfStock,
      images,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : product.tags,
      weight,
      dimensions,
      featured,
      status,
      seoTitle,
      seoDescription
    })

    res.json({
      success: true,
      product
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: Store,
        as: 'store'
      }]
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Check if store belongs to user
    if (product.store.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' })
    }

    await product.destroy()

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getStoreProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      status = 'active',
      featured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query

    const offset = (page - 1) * limit

    const whereClause = {
      storeId: req.params.storeId,
      status
    }
    
    if (category) whereClause.category = category
    if (featured) whereClause.featured = featured
    if (search) {
      whereClause.name = {
        [require('sequelize').Op.like]: `%${search}%`
      }
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]]
    })

    res.json({
      success: true,
      products: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getStoreProducts
}