import client from "../client";

export default {
  User: {
    totalFollowing: ({ id }) => {
      return client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      });
    },
    totalFollowers: ({ id }) => {
      return client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      });
    },
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
    //   const exists = await client.user
    //     .findUnique({ where: { userName: loggedInUser.userName } })
    //     .following({
    //       where: {
    //         id,
    //       },
    //     });

        const exists = await client.user.count({
            where: {
                userName: loggedInUser.userName,
                following: {
                    some: {
                        id
                    }
                }
            }
        })
        return Boolean(exists);
    },
  },
};
