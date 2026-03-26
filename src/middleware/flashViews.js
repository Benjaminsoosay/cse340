// middleware/flashViews.js
function flashViewsMiddleware(req, res, next) {
    // Attach req.flash to res.locals so it's accessible in views
    res.locals.flash = req.flash;
    next();
}

module.exports = flashViewsMiddleware;