const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

//
// 🔐 Реєстрація
//
router.post('/register', async (req, res) => {
 try {
   const { name, email, password } = req.body;

   // перевірка чи існує користувач
   const existingUser = await User.findOne({ where: { email } });
   if (existingUser) {
     return res.status(400).json({ error: 'User already exists' });
   }

   // хешування пароля
   const hashedPassword = await bcrypt.hash(password, 10);

   const user = await User.create({
     name,
     email,
     password: hashedPassword
   });

   res.json({ message: 'User registered', user });
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
});

//
// 🔑 Логін
//
router.post('/login', async (req, res) => {
 try {
   const { email, password } = req.body;

   const user = await User.findOne({ where: { email } });
   if (!user) {
     return res.status(400).json({ error: 'Invalid email or password' });
   }

   // перевірка пароля
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
     return res.status(400).json({ error: 'Invalid email or password' });
   }

   // створення токена
   const token = jwt.sign(
     { id: user.id, email: user.email },
     process.env.JWT_SECRET,
     { expiresIn: '1h' }
   );

   res.json({ token });
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
});

//
// 👤 Поточний користувач (protected)
//
router.get('/me', authMiddleware, async (req, res) => {
 try {
   const user = await User.findByPk(req.user.id, {
     attributes: { exclude: ['password'] }
   });

   res.json(user);
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
});

module.exports = router;