import client from "../client";

export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
      }),
    unreadTotal: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      const unread = await client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
      return unread;
    },
  },
  Message: {
    user: async ({ id }) => client.message.findUnique({ where: { id } }).user(),
  },
};

//   client.user.findMany({
//     where: {
//       rooms: {
//           id,
//       },
//     },
//   }),
