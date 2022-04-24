import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload }, { loggedInUser }) => {
        const _comment = await client.comment.findUnique({
          where: {
            id,
          },
          select: {
            userId: true,
          },
        });

        if (!_comment) {
          return {
            ok: false,
            error: "Comment not found.",
          };
        } else if (_comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "Not authorized.",
          };
        }

        await client.comment.update({
          where: {
            id,
          },
          data: {
            payload,
          },
        });

        return {
          ok: true,
        };
      }
    ),
  },
};
