import { ConnectDB } from "~~/server/utils/db";
import UserModel from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  await ConnectDB();

  // get email, password, name from the post body
  const body = await readBody(event);
  const { confirmationToken } = body;
  // check if token already exists in storage
  const existingUser = await UserModel.findOne({ confirmationToken: confirmationToken });
  if (existingUser) {
    await UserModel.updateOne(
      { confirmationToken: confirmationToken },
      { $set: { isConfirmed: true } }
    );
    return { message: "User successfully confirmed." };
  } else {
    return createError({
      statusCode: 400,
      statusMessage: "Invalid confirmation token",
    });
  }
});