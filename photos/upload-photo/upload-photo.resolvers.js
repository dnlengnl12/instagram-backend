import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagObj = [];
        if (caption) {
          //parse caption
          // get or create Hashtags
          const hashtags =
            caption.match(/#[\d|A-Z|a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/g) || [];
          hashtagObj = hashtags.map((hashtag) => ({
            where: { hashtag },
            create: { hashtag },
          }));
        }
        return client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
        //save the photo With the Parsed hashtags
        // add the photo to the hashtags
      }
    ),
  },
};
