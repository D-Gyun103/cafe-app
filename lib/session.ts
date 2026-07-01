import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export interface AdminSessionData {
  adminId?: string;
  username?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.ADMIN_SESSION_SECRET!,
  cookieName: "cafe_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getAdminSession() {
  return getIronSession<AdminSessionData>(await cookies(), sessionOptions);
}
