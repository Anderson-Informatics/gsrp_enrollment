import { ConnectDB } from "~~/server/utils/db";
import UserModel from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  await ConnectDB();
  const users = await UserModel.find(query);
  return users;
});
