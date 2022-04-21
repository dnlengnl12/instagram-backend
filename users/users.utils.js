import jsonwebtoken from "jsonwebtoken";
import client from "../client";
export const getUser = async(Authorization) => {
    try {
        if(!Authorization) {
            return null;
        }
        const {id} = jsonwebtoken.verify(Authorization, process.env.SECRET_KEY);
        const user = await client.user.findUnique({where: {id}});
        if(user) {
            return user;
        } else {
            return null;
        }
    } catch {
        return null;
    }
    
}


export const protectedResolver = (ourResolver) => (root, args, context, info) => {
    if(!context.loggedInUser) {
        return {
            ok: false,
            error: "Please log in to perform this action."
        }
    }
    return ourResolver(root, args, context, info);
}