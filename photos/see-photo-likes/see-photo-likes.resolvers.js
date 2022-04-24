import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (_, { id }) => {
      const likeUsers = await client.like.findMany({
        where: {
          photoId: id,
        },
        select: {
          user: true,
        },
      });
      console.log(likeUsers);
      return likeUsers.map((like) => like.user);
    },
  },
};
