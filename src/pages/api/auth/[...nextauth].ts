import { TypeORMLegacyAdapter } from '@next-auth/typeorm-legacy-adapter';
import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import { ConnectionOptions } from 'typeorm';

const connection: ConnectionOptions = {
  type: 'postgres',
  host: 'dga-vm1',
  port: 35432,
  username: 'sipp11',
  password: 'banshee10',
  database: 'survey',
  // namingStrategy: new SnakeNamingStrategy()
  synchronize: true,
};

export default NextAuth({
  adapter: TypeORMLegacyAdapter(connection),
  providers: [
    // OAuth authentication providers...
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
      // @ts-ignore
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      // @ts-ignore
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      // version: '2.0', // opt-in to Twitter OAuth 2.0
    }),
  ],
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   /* This should handle account creation and verification with the backend system
    //     user: {
    //       id: '11464~~~~~~159',
    //       name: 'Sipp Sippakorn',
    //       email: 'sipp~~~~~.com',
    //       image: 'https://lh3.~~~~1lirFQ=s96-c'
    //     }

    //     account: {
    //       provider: 'google',
    //       type: 'oauth',
    //       providerAccountId: '114~~~~~~~159',
    //       access_token: 'ya29.A0AR~~~~CCAU',
    //       expires_at: 1645691412,
    //       scope: 'https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email',
    //       token_type: 'Bearer',
    //       id_token:
    //     }

    //     profile: {
    //       iss: 'https://accounts.google.com',
    //       azp: '291557~~ntent.com',
    //       aud: '291557~~ntent.com',
    //       sub: '114649196620435962159',
    //       email: 'sipp11@gmail.com',
    //       email_verified: true,
    //       at_hash: 'R9uOR76gkT9NSNDaxC67Hw',
    //       name: 'Sipp Sippakorn',
    //       picture: 'https://lh3.googl~~~~FQ=s96-c',
    //       given_name: 'Sipp',
    //       family_name: 'Sippakorn',
    //       locale: 'en',
    //       iat: 1645687813,
    //       exp: 1645691413
    //     }
    //   */
    //   return true
    // },
    session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          uid: user.id,
        },
      }; // The return type will match the one returned in `useSession()`
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      // Allows relative callback URLs
      if (url.startsWith('/')) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
});
