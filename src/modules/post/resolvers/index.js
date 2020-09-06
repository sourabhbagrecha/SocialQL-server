const Post = require("../../../models/Post");
const { getUserId } = require("../../../middlewares/auth");
const User = require("../../../models/User");
const {
  singleUploadStream,
  getSignedUrl,
} = require("../../../utils/awsS3Upload");
const Like = require("../../../models/Like");

module.exports = {
  Query: {
    feed: async (root, args, context, info) => {
      return await Post.find();
    },
    getS3SignedUrl: async (root, { key }) => {
      const url = await getSignedUrl({ Key: key });
      return {
        url,
        key,
      };
    },
  },
  Mutation: {
    createPost: async (root, { input: { caption, sources } }, context) => {
      const user = getUserId(context);
      const newPost = await Post.create({
        caption,
        sources,
        user,
      });
      return newPost;
    },
    likePost: async (root, args, context, info) => {
      const { postId } = args;
      const userId = getUserId(context);
      const like = await Like.findOne(
        { user: userId, post: postId },
        { _id: 1 }
      );
      if (like) {
        await Like.findByIdAndDelete(like._id);
        return "Post unliked successfully!";
      } else {
        const post = await Post.findById(postId, { _id: 1 });
        if (!post) {
          throw new Error("Post unavailable!");
        }
        await Like.create({
          user: userId,
          post: postId,
        });
        return "Post liked successfully!";
      }
    },
    singleUploadStream,
  },
  Post: {
    user: async (root) => {
      const user = await User.findById(root.user);
      return user;
    },
  },
};
