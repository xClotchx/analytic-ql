import crypto from 'crypto';
const key=()=>crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY||'').digest();
export const seal=o=>{const iv=crypto.randomBytes(12),c=crypto.createCipheriv('aes-256-gcm',key(),iv);const e=Buffer.concat([c.update(JSON.stringify(o)),c.final()]);return Buffer.concat([iv,c.getAuthTag(),e]).toString('base64url')};
export const open=s=>{const b=Buffer.from(s,'base64url'),d=crypto.createDecipheriv('aes-256-gcm',key(),b.subarray(0,12));d.setAuthTag(b.subarray(12,28));return JSON.parse(Buffer.concat([d.update(b.subarray(28)),d.final()]).toString())};
