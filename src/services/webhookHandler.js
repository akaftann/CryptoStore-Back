import crypto from 'crypto'

export const isSignatureCompatible = (SUMSUB_PRIVATE_KEY, req)=>{
    console.log('start checking of signature: ', req.headers)
    const algo = {
        'HMAC_SHA1_HEX': 'sha1',
        'HMAC_SHA256_HEX': 'sha256',
        'HMAC_SHA512_HEX': 'sha512',
       }[req.headers['x-payload-digest-alg']]
    if (!algo) {
    throw new Error('Unsupported algorithm')
    }

    const receivedSignature = req.headers['x-payload-digest']
    const computedSignature = crypto
    .createHmac(algo, SUMSUB_PRIVATE_KEY)
    .update(req.rawBody)
    .digest('hex')


     /* computedSignature = crypto
                            .createHmac(algo, SUMSUB_PRIVATE_KEY)
                            .update(rawBody)
                            .digest('hex') */

    return computedSignature === receivedSignature
}
