import client from "../../client"
//todo : search pagination
export default {
    Query: {
        searchUsers: async(_, {keyword}) => {
            const users = await client.user.findMany({
                where: {
                    userName: {
                        startsWith: keyword.toLowerCase()
                    }
                }
            })

            return users;
        }
    }
}