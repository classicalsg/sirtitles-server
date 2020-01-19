const Hapi = require("@hapi/hapi");
const Nes = require("@hapi/nes");
const PORT = process.env.PORT || 5000

const init = async () => {
  const server = Hapi.server({
    port: PORT
  });
  await server.register(Nes);
  server.subscription("/slides/{id}");
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello World!!!";
    }
  });
  server.route({
    method: "GET",
    path: "/slide/{deck}/next",
    config: {
      handler: (r, h) => {
        r.server.publish(`/slides/${r.params.deck}`, {
          action: "next"
        });
        return { result: "SENT" };
      }
    }
  });
  server.route({
    method: "GET",
    path: "/slide/{deck}/previous",
    config: {
      handler: (r, h) => {
        r.server.publish(`/slides/${r.params.deck}`, {
          action: "previous"
        });
        return { result: "SENT" };
      }
    }
  });
  server.route({
    method: "GET",
    path: "/slide/{deck}/goto",
    config: {
      handler: (r, h) => {
        r.server.publish(`/slides/${r.params.deck}`, {
          action: "goto",
          slide: r.query.slide
        });
        return { result: "SENT" };
      }
    }
  });
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
