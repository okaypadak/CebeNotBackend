const jwt = require('jsonwebtoken')

function authorize(...allowedRoles) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization
        if (!authHeader) return res.status(401).json({ message: 'Token yok' })

        const token = authHeader.split(' ')[1]
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded

            // Eğer rol kontrolü istenmişse
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Yetkiniz yok' })
            }

            next()
        } catch (err) {
            return res.status(403).json({ message: 'Token geçersiz' })
        }
    }
}

module.exports = authorize
