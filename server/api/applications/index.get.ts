import { ConnectDB } from "~~/server/utils/db";
import ApplicationModel from "~~/server/models/application.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  await ConnectDB();
  const apps = await ApplicationModel.find(query);
  return apps;
});
