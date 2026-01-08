import { ConnectDB } from "~~/server/utils/db";
import UserModel from "~~/server/models/user.model";
import { User } from "~~/types/user";

export default defineEventHandler(async (event) => {
  await ConnectDB();
  const { email, password } = await readBody(event);
  const user = await UserModel.findOne<User & { password?: string }>({ email: email }).lean();
  if (!user) {
    return createError({
      statusCode: 400,
      statusMessage: "Please check your email and password.",
    });
  }

  const isPasswordValid = await verifyPassword(String(user?.password ?? ""), String(password));

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