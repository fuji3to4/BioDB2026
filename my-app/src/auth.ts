import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db } from "./lib/db.ts"; 
import { authConfig } from "./auth.config";

type UserRow = {
  id: number;
  username: string;
  password_hash: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = credentials.username as string;
        const password = credentials.password as string;

        // テーブル作成クエリ
        await db.execute(sql`
          create table if not exists users (
            id serial primary key,
            username text unique,
            password_hash text
          );
        `);

        // ユーザー検索
        const result = await db.execute(sql`
          select id, username, password_hash from users where username = ${username}
        `);
        let user = (result.rows[0] ?? null) as UserRow | null;

        // 自動登録サインアップ（演習用）
        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const insertResult = await db.execute(sql`
            insert into users (username, password_hash) values (${username}, ${hashedPassword}) returning id, username, password_hash
          `);
          user = (insertResult.rows[0] ?? null) as UserRow | null;
        }

        if (user) {
          const isValid = await bcrypt.compare(password, user.password_hash);
          if (isValid) {
            return { id: user.id.toString(), name: user.username };
          }
        }
        return null;
      },
    }),
  ],
});