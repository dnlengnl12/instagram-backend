import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
    Mutation: {
        followUser: protectedResolver(
            async(_, {userName}, {loggedInUser}) => {
                const toFollowUser = await client.user.findUnique({where: {userName}});
                if(!toFollowUser) {
                    return {
                        ok: false,
                        error: "That user does not exist."
                    }
                }
                await client.user.update({
                    where: {
                        id: loggedInUser.id
                    },
                    data: {
                        following: {
                            connect: {
                                userName
                            }
                        }
                    }
                });
                return {
                    ok: true
                }
            }
        )
    }
}