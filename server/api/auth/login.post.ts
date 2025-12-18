import { User } from "#auth-utils";
import { ConnectDB } from "~~/server/utils/db";
import UserModel from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  await ConnectDB();
  const { email, password } = await readBody(event);
  //const user = await storage.getItem<User & { password?: string }>(email);
  const user = await UserModel.findOne({ email: email }).lean();
  if (!user) {
    return createError({
      statusCode: 400,
      statusMessage: "Please check your email and password.",
    });
  }

  const isPasswordValid = await verifyPassword(user?.password || "", password);

  if (!isPasswordValid) {
    return createError({
      statusCode: 400,
      statusMessage: "Please check your email and password.",
    });
  }

  delete user.password;
  await setUserSession(event, {
    user,
    loggedInAt: new Date(),
  });

  return await getUserSession(event);
});