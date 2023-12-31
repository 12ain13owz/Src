const express = require("express");
const multer = require("multer");
const fs = require("fs");

const Post = require("../models/post.model.js");
const checkAuth = require("../middleware/check-auth.js");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const path = "server/images";
    let error = new Error("Invalid mime type");

    if (isValid) error = null;

    fs.mkdirSync(path, { recursive: true });
    cb(error, path);
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .replace(/\.[^.]+$/, "") // ตัดนามสกุลไฟล์ออก
      .replace(/\s+/g, "-"); // แทนที่ช่องว่างด้วยขีด
    const ext = MIME_TYPE_MAP[file.mimetype];

    cb(null, name + "-" + Date.now() + "." + ext);
    cb(null, `${name}-${Date.now()}.${ext}`);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
    });

    post
      .save()
      .then((createPost) => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            id: createPost._id,
            ...createPost,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({ message: "Error creating post" });
      });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });

    Post.updateOne({ _id: req.params.id }, post).then((result) => {
      res.status(200).json({ message: "Update successful!", imagePath: null });
    });
  }
);

router.get("", async (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then(async (documents) => {
      fetchedPosts = documents;
      return await Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched succesfully!",
        posts: fetchedPosts,
        maxPost: count,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) res.status(200).json(post);
      else res.status(404).json({ message: "Post not found!" });
    })
    .catch((err) => res.status(404).json("Not found post"));
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
