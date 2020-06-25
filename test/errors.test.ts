import { expect } from "chai";
import * as sinon from "sinon";
import validate from "../src";
import * as int from "../src/checks/int";
import LeConfigValidationError from "../src/errors/LeConfigValidationError";
import * as log from "../src/helpers/log";

const muteConsole = () => sinon.replace(log, "log", sinon.fake());

beforeEach(muteConsole);
afterEach(sinon.restore);

describe("given invalid + missing vars", () => {
  const env = {
    OK1: "150",
    OK2: "200",
    NOK1: "1",
    NOK2: undefined,
  };

  it("throws a LeConfigValidationError with summary + details", () => {
    const config = {
      OK1: [env.OK1, int.int],
      NOK1: [env.NOK1, int.min(100)],
      nested: {
        OK2: [env.OK2, int.min(100)],
        NOK2: [env.NOK2, int.int],
      },
    };

    try {
      validate(config);
    } catch (e) {
      expect(e.name).to.eql(LeConfigValidationError.name);
      expect(e.message).to.eql("2 config validation errors");
      expect(e.errors).to.eql([
        { key: "NOK1", error: "should be an integer ≥ 100", actual: "1" },
        { key: "NOK2", error: "should be an integer", actual: undefined },
      ]);
    }
  });
});
