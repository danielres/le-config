import validate, { checks } from "../../../2020-06-le-config/dist/index.esm.js";

const config = {
  PORT: [process.env.PORT, checks.int.port()],
};

export default validate(config);
