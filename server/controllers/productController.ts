import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { IProduct } from '../models/types.js';

export const getProducts = (req: Request, res: Response) => {
  try {
    let results = [...db.products];
    const { category, search, deal, organic, sort, minPrice, maxPrice } = req.query;

    if (category && category !== 'all') {
      const catLower = (category as string).toLowerCase();
      results = results.filter(
        p => p.categorySlug.toLowerCase() === catLower || p.category.toLowerCase() === catLower
      );
    }

    if (search) {
      const q = (search as string).toLowerCase().trim();
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (deal === 'true') {
      results = results.filter(p => p.isDeal || p.discount >= 25);
    }

    if (organic === 'true') {
      results = results.filter(p => p.isOrganic);
    }

    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (!isNaN(min)) results = results.filter(p => p.price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (!isNaN(max)) results = results.filter(p => p.price <= max);
    }

    // Sort
    if (sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'discount') {
      results.sort((a, b) => b.discount - a.discount);
    } else if (sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }

    return res.json({
      success: true,
      count: results.length,
      products: results
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = db.products.find(p => p._id === id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    const related = db.products
      .filter(p => p.categorySlug === product.categorySlug && p._id !== product._id)
      .slice(0, 4);

    return res.json({
      success: true,
      product,
      related
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = (_req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      categories: db.categories
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      description,
      price,
      originalPrice,
      discount,
      stock,
      unit,
      image,
      isOrganic,
      isDeal
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required.' });
    }

    const catObj = db.categories.find(c => c.name.toLowerCase() === category.toLowerCase());
    const categorySlug = catObj ? catObj.slug : category.toLowerCase().replace(/\s+/g, '-');

    const newProduct: IProduct = {
      _id: `prod_${Date.now()}`,
      name,
      category,
      categorySlug,
      description: description || 'Fresh farm grocery product.',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price) * 1.2,
      discount: discount ? parseInt(discount) : 0,
      stock: stock ? parseInt(stock) : 50,
      unit: unit || '1 unit',
      image: image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      badge: isDeal ? 'Special Deal' : isOrganic ? 'Organic' : undefined,
      rating: 4.8,
      reviewsCount: 1,
      isOrganic: Boolean(isOrganic),
      isFeatured: true,
      isDeal: Boolean(isDeal),
      createdAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);
    return res.status(201).json({ success: true, product: newProduct, message: 'Product added successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.products.findIndex(p => p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const updated = { ...db.products[index], ...req.body, _id: id };
    db.products[index] = updated;

    return res.json({ success: true, product: updated, message: 'Product updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.products.findIndex(p => p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    db.products.splice(index, 1);
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
