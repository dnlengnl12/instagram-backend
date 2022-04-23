import client from "../../client"

export default {
    Query: {
        seeFollowers: async(_, {userName, page}) => {
            const ok = await client.user.findUnique({where: {userName}, select: {id}})
            if(!ok) {
                return {
                    ok: false,
                    error: "User not found."
                }
            }
            const PAGE_SIZE = 5;
            const totalFollowers = await client.user.count({
                where: {following: {some: {userName}}}
            });
            const totalPages =  Math.ceil(totalFollowers/PAGE_SIZE);

            const followers = await client.user.findUnique({where:{userName}})
            .followers({
                take: PAGE_SIZE,
                skip: (page-1) * PAGE_SIZE
            });

            return {
                ok: true,
                followers,
                totalPages
            }
        }
    }
}