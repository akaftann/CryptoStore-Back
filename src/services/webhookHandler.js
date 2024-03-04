import crypto from 'crypto'

export const isSignatureCompatible = (SUMSUB_PRIVATE_KEY, headers, rawBody)=>{
    console.log('start checking of signature: ', headers)
    const algo = {
        'HMAC_SHA1_HEX': 'sha1',
        'HMAC_SHA256_HEX': 'sha256',
        'HMAC_SHA512_HEX': 'sha512',
       }[headers['x-payload-digest-alg']]
    if (!algo) {
    throw new Error('Unsupported algorithm')
    }

    const receivedSignature = headers['x-payload-digest']
    const computedSignature = crypto
                            .createHmac(algo, SUMSUB_PRIVATE_KEY)
                            .update(rawBody)
                            .digest('hex')

    return computedSignature === receivedSignature
}
