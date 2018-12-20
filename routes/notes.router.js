'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);



// Get All (and search by query)
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm)
    .then(list => {
      res.json(list);
    })
    .catch(err => {
      next(err);
    });
    
    
  /*, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });*/
});

// Get a single item
router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Put update an item
router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.update(id, updateObj) 
    .then(item => {
      if(item){
        res.json(item);
      } else {
        next();
      }})
    .catch(err => {
      next(err);
    });
  /*(err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });*/
});

// Post (insert) an item
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem)
    .then(item =>{
      if(item) {
        res.location(`http://${req.headers.host}/api/notes/${item.id}`).status(201).json(item);
      } else { next();
      }
    })
    .catch(err => {
      next(err);
    });
});
/* This is an unpromisfied version
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/api/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });*/

// Delete an item
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  notes.delete(id)
    .then(item => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});
    
/* Unpromisfied version
    , (err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(204);
  }); 
}); */

module.exports = router;
