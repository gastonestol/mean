const express = require('express');

const PostsController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");

const fileManager = require("../middleware/file-manager");

const router = express.Router();

router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPost);

router.post("", checkAuth, fileManager, PostsController.createPost);

router.delete("/:id", checkAuth, PostsController.deletePost);

router.put("/:id", checkAuth, fileManager, PostsController.updatePost);

module.exports = router;
