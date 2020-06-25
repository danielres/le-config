import { expect } from "chai";
import validate from "../src";
import * as int from "../src/checks/int";
import * as env from "./support/env";

describe("given env vars present", () => {
  const envVars = {
    OK1: "150",
    OK2: "200",
  };

  beforeEach(() => env.add(envVars));
  afterEach(() => env.del(envVars));

  describe("and a valid config definition", () => {
    let config;

    beforeEach(() => {
      config = {
        OK1: [process.env.OK1, int.min(100)],
        nested: {
          OK2: [process.env.OK2, int.min(100)],
        },
      };
    });

    it("returns a valid project config", () => {
      const actual = validate(config);
      const expected = {
        OK1: 150,
        nested: {
          OK2: 200,
        },
      };

      expect(actual).to.deep.equal(expected);
    });
  });
});
