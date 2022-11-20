const messages: { [key: string]: (path: string) => string } = {
  invalid_type: (path) => `The "${path}" field must be a string`,
  require: (path) => `The "${path}" field is mandatory`,
  too_small: (path) => `The minimum length of the "${path}" field is 8 characters`,
  too_big: (path) => `The maximum length of the "${path}" field is 24 characters`,
  invalid_string_email: (path) => `The "${path}" field must be a valid email`,
  invalid_string_regex: (path) =>
    `The "${path}" field must contain a number, an uppercase letter and a lowercase letter`,
};

type ParserProps = {
  validation?: string;
  code: string;
  message: string;
  path: string[];
};

function parserMessage({ code, message: defaultMessage, path, validation }: ParserProps) {
  const key = validation ? `${code}_${validation}` : code;
  const message = messages[key];

  return {
    code: key,
    message: message ? message(path.toString()) : defaultMessage,
  };
}

export { parserMessage };
