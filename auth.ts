import NextAuth, { NextAuthConfig } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

export const config: NextAuthConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login", 
  },
  callbacks: {
    authorized: ({ request, auth }) => {
      try {
        const { pathname } = request.nextUrl

        if (pathname === "/profile") {
          return !!auth
        }
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },

    jwt({ token, trigger, session }){
        if (trigger === "update")
            token.name = session.user.name;
        
        return token;
    },
    async redirect({ url, baseUrl }) { return "/" },
  },
}
export const { handlers, auth, signIn, signOut } = NextAuth(config)