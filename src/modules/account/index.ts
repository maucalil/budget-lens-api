import { FastifyPluginAsync } from "fastify";
import accountRoutes from "./account.route";

const accountModule: FastifyPluginAsync = async (fastify) => {
  fastify.register(accountRoutes, {
    prefix: "/account",
  });
}

export default accountModule;