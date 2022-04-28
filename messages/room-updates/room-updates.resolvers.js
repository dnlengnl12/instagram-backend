import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      subscrib: () => pubsub.asyncIterator(["ROOM_UPDATES"]),
    },
  },
};
