import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/drizzle/schema";
import { magicLink } from "better-auth/plugins";
import { db } from "@/db/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: { 
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    },
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Integrate your email provider here (e.g., Resend, SendGrid)
        // Send an email to `email` containing the link `url`.
        console.log(`Magic link for ${email}: ${url}`);
      },
    }),
  ], 
});