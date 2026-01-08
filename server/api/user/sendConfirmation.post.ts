import { sendConfirmationMessage } from "~~/server/utils/mg";

export default defineEventHandler(async (event) => {
  // Get data from body
  const data = await readBody(event);
  console.log("sendConfirmation POST data:", data);

  try {
    await sendConfirmationMessage(data);
    return 'Completed sending email';
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});