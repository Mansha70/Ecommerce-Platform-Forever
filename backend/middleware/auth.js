import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    console.log('authUser middleware', {
        path: req.path,
        tokenHeader: req.headers.token,
        authorizationHeader: req.headers.authorization,
    })

    // accept token from `token` header or `Authorization: Bearer <token>`
    let token = req.headers.token
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ')
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
            token = parts[1]
        }
    }

    if (!token) {
        console.log('authUser missing token')
        return res.status(401).json({
            success: false,
            message: 'Not Authorized. Login Again',
        })
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.log('authUser missing JWT_SECRET')
            return res.status(500).json({
                success: false,
                message: 'Server misconfigured: JWT_SECRET is missing',
            })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log('authUser token verify error', error)
        return res.status(401).json({
            success: false,
            message: error.message,
        })
    }
}

export default authUser