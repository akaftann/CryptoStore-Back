import express from 'express'
export  const rawBodyMiddleware = (req, res, next) => {
    const isRawEndpoint = req.path === '/api/webhook-handler';
    if (isRawEndpoint) {
        express.raw({ type: '*/*' })(req, res, next);
    } else {
        express.json()(req, res, next);
    }
};