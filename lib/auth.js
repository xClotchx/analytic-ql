import GoogleProvider from 'next-auth/providers/google'; import CredentialsProvider from 'next-auth/providers/credentials'; import {verifyUser,limit} from './users';
export const authOptions={
  providers:[GoogleProvider({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET}),
    CredentialsProvider({name:'Email',credentials:{email:{},password:{}},async authorize(c){
      try{const e=String(c?.email||'').trim().toLowerCase(); if(!e||!c?.password||!(await limit('login:'+e,10,600))) return null; return await verifyUser(e,String(c.password))}catch{return null}}})],
  pages:{signIn:'/login'},session:{strategy:'jwt',maxAge:60*60*24*30},secret:process.env.NEXTAUTH_SECRET};
