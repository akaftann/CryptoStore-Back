import * as users from './users.js'
import qrcode from 'qrcode'
import {authenticator} from 'otplib'
import * as db from '../lib/db.js'
import { ApiError } from '../exceptions/ap-errors.js'
import crypto from 'crypto'
import * as OTPAuth from "otpauth";
import pkg from "hi-base32";
const { encode } = pkg;

const generateRandomBase32 = () => {
    const buffer = crypto.randomBytes(15);
    const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
    return base32;
  };

export const generateOTP = async (userId) => {
    try {
        const user = await users.getById(userId)
        const base32Secret = generateRandomBase32();

        let totp = new OTPAuth.TOTP({
            issuer: "intheday.eu",
            label: "InTheDay",
            algorithm: "SHA1",
            digits: 6,
            secret: base32Secret,
        });

        const otpAuthUrl = totp.toString();
        await db.users.update({id: user.id, otpSecret: base32Secret, otpAuthUrl}, {}, {isIdempotent: true})
        return {base32: base32Secret, otpAuthUrl};
    } catch (e) {
        throw e
    }
};

export const verifyOTP = async (userId, token, firstOtpPassed) => {
    try {
        console.log('verifyOTP...', token)
        const user = await users.getById(userId)
        if(!user.otpSecret){
            throw ApiError.BadRequest('Sercet is empty')
        }
        let totp = new OTPAuth.TOTP({
            issuer: "intheday.eu",
            label: "InTheDay",
            algorithm: "SHA1",
            digits: 6,
            secret: user.otpSecret,
        });

        let delta = totp.validate({ token });

        if (delta === null) {
            throw ApiError.BadRequest('invalid 2FA code')
        }
        if(firstOtpPassed){
            await db.users.update({id: user.id, otpEnabled: 1, firstOtpPassed: 1}, {}, {isIdempotent: true})
        }else{
            await db.users.update({id: user.id, otpEnabled: 1}, {}, {isIdempotent: true})
        }
        return { otpEnabled: true}
    } catch (e) {
        throw e
    }
};

export const validateOTP = async (userId, token) => {
    try {
        const user = await users.getById(userId)
        if(!user.otpSecret){
            throw ApiError.BadRequest('Sercet is empty')
        }
        let totp = new OTPAuth.TOTP({
            issuer: "intheday.eu",
            label: "InTheDay",
            algorithm: "SHA1",
            digits: 6,
            secret: user.otpSecret,
        });

        let delta = totp.validate({ token, window: 1 });
        if (delta === null) {
            throw ApiError.BadRequest('invalid 2FA code')
        }
        
        return true
    } catch (e) {
        throw e
    }
};

export const disableOTP = async (userId) => {
    try {
        const user = await users.getById(userId)
        await db.users.update({id: user.id, otpEnabled: 0}, {}, {isIdempotent: true})
        return true
    } catch (e) {
        throw e
    }
};
  