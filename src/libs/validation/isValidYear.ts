import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidYearConstraint implements ValidatorConstraintInterface {
  validate(year: string, args: ValidationArguments) {
    const yearNumber = Number(year);
    const currentYear = new Date().getFullYear();
    return yearNumber >= 1000 && yearNumber <= currentYear; // Adjust the range as needed
  }

  defaultMessage(args: ValidationArguments) {
    return 'Published year ($value) is not a valid year!';
  }
}

export function IsValidYear(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidYearConstraint,
    });
  };
}
