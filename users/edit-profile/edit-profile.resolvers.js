import fs, { ReadStream } from "fs";
import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import { GraphQLUpload } from "graphql-upload";
import { uploadToS3 } from "../../shared/shared.utils";

console.log(process.cwd());
export default {
  Upload: GraphQLUpload,
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          userName,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { loggedInUser, protectResolver }
      ) => {
        let avatarUrl = null;
        if (avatar) {
          avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
          //local에 파일 저장할 때
          //const { filename, createReadStream } = await avatar;
          //const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
          // const readStream = createReadStream();
          // const writeStream = fs.createWriteStream(process.cwd()+ "/uploads/" + newFilename);
          // readStream.pipe(writeStream);
          // avatarUrl = `http://localhost:4000/static/${newFilename}`;
        }

        let uglyPassword = null;
        if (newPassword) {
          uglyPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            firstName,
            lastName,
            userName,
            email,
            bio,
            ...(uglyPassword && { password: uglyPassword }),
            ...(avatarUrl && { avatar: avatarUrl }),
          },
        });

        if (updatedUser.id) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "Could not update profile",
          };
        }
      }
    ),
  },
};
