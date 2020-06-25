import * as log from "../helpers/log";

export default class LeConfigValidationError extends Error {
  errors: any;

  constructor(messages) {
    super();
    const count = messages.length;
    this.message = `${count} config validation error${count === 1 ? "" : "s"}`;
    this.name = "LeConfigValidationError";
    this.errors = messages;
  }
}

export const prettyPrint = (error: LeConfigValidationError) => {
  const { errors, message } = error;

  log.ln();
  log.hr();
  log.errorSummary(message);
  errors.map(log.error);
  log.hr();
  log.ln();
};
