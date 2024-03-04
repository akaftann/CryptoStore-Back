import crypto from 'crypto'

export const isSignatureCompatible = (SUMSUB_PRIVATE_KEY, headers)=>{
    console.log('start checking of signature: ', headers)
    const algo = {
        'HMAC_SHA1_HEX': 'sha1',
        'HMAC_SHA256_HEX': 'sha256',
        'HMAC_SHA512_HEX': 'sha512',
       }[headers['X-Payload-Digest-Alg']]
    if (!algo) {
    throw new Error('Unsupported algorithm')
    }

    const receivedSignature = headers['x-payload-digest']
    const computedSignature = crypto
                            .createHmac(algo, SUMSUB_PRIVATE_KEY)
                            .update(req.rawBody)
                            .digest('hex')

    return computedSignature === receivedSignature
}
