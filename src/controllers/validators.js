const { body } = require('express-validator');

const organizationValidation = [
    body('name').notEmpty().withMessage('Organization name is required'),
    body('contactEmail').isEmail().withMessage('Please provide a valid email address'),
    // Add any other rules you need
];

module.exports = { organizationValidation };