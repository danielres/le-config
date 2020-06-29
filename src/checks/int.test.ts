import { expect } from "chai";
import validate from "..";
import LeConfigValidationError from "../errors/LeConfigValidationError";
import * as int from "./int";

describe("given invalid + missing vars", () => {
  const env = {
    OK1: "150",
    OK2: "200",
    OK3: "-1",
    NOK1: "1",
    NOK2: undefined,
    NOK3: "0.5",
    NOK4: "hello",
    NOK5: "4/4",
  };

  it("throws a LeConfigValidationError with summary + details", () => {
    const config = {
      OK1: [env.OK1, int.int],
      NOK1: [env.NOK1, int.min(100)],
      nested: {
        OK2: [env.OK2, int.min(100)],
        OK3: [env.OK3, int.int],
        NOK1: [env.NOK1, int.int],
        NOK2: [env.NOK2, int.int],
        NOK3: [env.NOK3, int.int],
        NOK4: [env.NOK4, int.int],
        NOK5: [env.NOK5, int.int],
      },
    };

    try {
      validate(config);
    } catch (e) {
      expect(e.name).to.eql(LeConfigValidationError.name);
      expect(e.message).to.eql("5 config validation errors");
      expect(e.errors).to.eql([
        { key: "NOK1", error: "should be an integer ≥ 100", actual: "1" },
        { key: "NOK2", error: "should be an integer", actual: undefined },
        { key: "NOK3", error: "should be an integer", actual: "0.5" },
        { key: "NOK4", error: "should be an integer", actual: "hello" },
        { key: "NOK5", error: "should be an integer", actual: "4/4" },
      ]);
    }
  });
});
