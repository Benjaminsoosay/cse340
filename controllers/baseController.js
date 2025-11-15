const utilities = require("../utilities/")

/* ****************************************
 *  Deliver Home View
 * **************************************** */
async function buildHome(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("index", { title: "Home", nav })
  } catch (error) {
    next(error)
  }
}

module.exports = { buildHome }
