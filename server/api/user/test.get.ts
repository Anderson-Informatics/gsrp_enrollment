import { sendSimpleMessage } from "~~/server/utils/mg";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  await sendSimpleMessage();
  return 'Completed sending email';
});
