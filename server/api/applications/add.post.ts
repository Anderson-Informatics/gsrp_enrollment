import { ConnectDB } from "~~/server/utils/db";
import ApplicationModel from "~~/server/models/application.model";

export default defineEventHandler(async (event) => {
  // Get data from body
  const data = await readBody(event);

  // Update a result
  await ConnectDB();
  try {
    const res = await ApplicationModel.create({ ...data });
    return { message: "New Intake Form Successfully Added" };
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
