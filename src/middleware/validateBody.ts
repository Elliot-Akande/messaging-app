import ajvModule from "ajv";
import { NextFunction, Request, Response } from "express";
const Ajv = ajvModule.default;
const ajv = new Ajv();

const validateBody = (schema: object) => {
  const validate = ajv.compile(schema);

  return (req: Request, res: Response, next: NextFunction) => {
    if (!validate(req.body)) {
      return res.status(400).json(validate.errors);
    }
    return next();
  };
};

export default validateBody;
