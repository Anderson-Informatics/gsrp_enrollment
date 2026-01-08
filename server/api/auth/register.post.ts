import { ConnectDB } from "~~/server/utils/db";
import UserModel from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  // Clear the current user session
  await clearUserSession(event);

  await ConnectDB();

  // get email, password, name from the post body
  const body = await readBody(event);
  const { email, password, name, confirmationToken } = body;
  // check if email already exists in storage
  const existingUser = await UserModel.findOne({ email: email });
  if (existingUser) {
    return createError({
      statusCode: 400,
      statusMessage: "User already exists",
    });
  }

  const user = {
    name,
    email,
    confirmationToken,
    createdAt: new Date(),
  };

  // if it doesn't, create a new user
  await UserModel.create({
    ...user,
    // make sure to has the password for security!
    // never store plain text passwords!
    password: await hashPassword(password),
  });

  await setUserSession(event, {
    user,
    loggedInAt: new Date(),
  });

  return {
    email,
    password,
  };
});