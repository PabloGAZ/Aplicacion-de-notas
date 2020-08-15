const express = require('express');
const router = express.Router();

const Note = require('../models/Note.js');
const {isAuthenticated} = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, function(req, res){
    res.render('notes/new-note');
})

router.post('/notes/new-note', async function(req, res){
    const {title, description} = req.body;
    const errors = [];
   const newNote = new Note({title, description});
   newNote.user = req.user.id;
   await newNote.save();
   req.flash('success_msg', 'Nota agregada correctamente');
   res.redirect('/notes');
})


router.get('/notes',  isAuthenticated, async function(req, res){
  const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
  res.render('notes/all-notes', { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async function(req, res){
  const note = await Note.findById(req.params.id);
  res.render('notes/edit-note', {note});
})

router.put('/notes/edit-note/:id', isAuthenticated, async function(req,res){
  const {title, description} = req.body;
  await Note.findByIdAndUpdate(req.params.id, {title, description});
  req.flash('success_msg', 'Nota actualizada correctamente');
  res.redirect('/notes')
});

router.delete('/notes/delete/:id', isAuthenticated, async function(req, res){
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Nota borrada correctamente');
  res.redirect('/notes');
});

module.exports = router;