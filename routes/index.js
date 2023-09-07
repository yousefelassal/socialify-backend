const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'API Endpoints',
    endpoints: [
      {
        method: 'GET',
        path: '/api/posts',
        description: 'Get all posts',
        example_request: '{}',
        example_response: `{
    id: '5e0e0d8b0b1d2b1d2b1d2b1d',
    content: 'Post content',
    createdAt: '2020-01-01T00:00:00.000Z',
    user_name: 'User Name',
    comments: [
      {
        content: 'Comment content',
        user_name: 'User Name',
        createdAt: '2020-01-01T00:00:00.000Z'
      }
    ],
    likes: 7
}`
      },
      {
        method: 'GET',
        path: '/api/posts/:id',
        description: 'Get a post by id',
        example_request: '{}',
        example_response: `{ //same as above }`
      },
      {
        method: 'POST',
        path: '/api/posts',
        description: 'Create a new post',
        example_request: '{ "content": "Post content", "user_name": "User Name" }',
        example_response: '{ success: true, data: { ... } }'
      },
      {
        method: 'PUT',
        path: '/api/posts/:id',
        description: 'Update a post by id',
        example_request: '{ "content": "Post content", "user_name": "User Name" }',
        example_response: '{ success: true, data: { ... } }'
      },
      {
        method: 'DELETE',
        path: '/api/posts/:id',
        description: 'Delete a post by id',
        example_response: '{ success: true }'
      }
    ]
  });
});

module.exports = router;
