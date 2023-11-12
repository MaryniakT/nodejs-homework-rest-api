const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
 const body = req.body;
    if (Object.keys(body).length === 0) {
      throw HttpError(400, 'missing fields');
      
    }
    
// if (error) {
//     return res.status(400).json({ message: 'missing field favorite' });
//   }

    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return func;
};

module.exports = validateBody;