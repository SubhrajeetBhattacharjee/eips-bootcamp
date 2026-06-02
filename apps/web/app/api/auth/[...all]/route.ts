import { auth } from "../../../lib/auth"; // Adjust path to lib/auth
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
