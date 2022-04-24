import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    deletePhoto: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
        },
      });
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found.",
        };
      } else if (id !== loggedInUser) {
        return {
          ok: false,
          error: "Not authorized.",
        };
      }
      await client.photo.delete({
        where: {
          id,
        },
      });

      return {
        ok: true,
      };
    }),
  },
};
