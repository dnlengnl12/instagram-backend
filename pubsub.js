import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

pubsub.publish("ROOM_UPDATES", {
  roomUpdates: {
    payload: "hi",
  },
});

export default pubsub;
