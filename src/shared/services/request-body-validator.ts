import Validator from "validatorjs";

export class RequestBodyValidator {
  public static validateWithRules(
    body: any,
    validationRules: Validator.Rules,
    callBack: Function,
    customMessages?: Validator.ErrorMessages
  ): void {
    const bodyValidation = new Validator(body, validationRules, customMessages);
    bodyValidation.passes(() => callBack(null, true));
    bodyValidation.fails(() => callBack(bodyValidation.errors, false));
  }
}
