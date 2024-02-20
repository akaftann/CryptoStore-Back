import crypto from 'crypto'

export const isSignatureCompatible = (secret, body, headers)=>{
    if (!headers['x-webhook-signature']) {
        return false;
    }

    const receivedSignature = headers['x-webhook-signature'].split('=');
    let computedSignature;

    switch (receivedSignature[0]) {
        case 'sha256':
            const secretBuffer = Buffer.from(secret, 'utf-8');
            const hasher = crypto.createHmac('sha256', secretBuffer);
            const dataBuffer = Buffer.from(body, 'utf-8');
            const hash = hasher.update(dataBuffer).digest('hex');
            computedSignature = hash;
            break;
        default:
            throw new Error('Unsupported signature algorithm');
    }

    return computedSignature === receivedSignature[1];
}
