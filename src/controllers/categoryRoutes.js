import express from 'express';

const router = express.Router();

// Example in-memory data store (replace with database later)
let categories = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Health' },
  { id: 3, name: 'Lifestyle' },
];

// GET all categories
router.get('/', (req, res) => {
  res.json(categories);
});

// GET a single category by id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.find(c => c.id === id);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(category);
});

// POST create a new category
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newCategory = {
    id: categories.length + 1,
    name,
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

// PUT update an existing category
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const categoryIndex = categories.findIndex(c => c.id === id);
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  categories[categoryIndex].name = name;
  res.json(categories[categoryIndex]);
});

// DELETE a category
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const categoryIndex = categories.findIndex(c => c.id === id);
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  categories.splice(categoryIndex, 1);
  res.status(204).send(); // No content
});

export default router;