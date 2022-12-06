export default {
  async fetch(request: Request, ctx: ExecutionContext): Promise<Response> {
    let { pathname } = new URL(request.url);
    const jsonHeaders = {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };
    switch (pathname) {
      case "/":
        return new Response(
          JSON.stringify({
            status: "ok",
            error: null,
            fun: {
              url: "https://api.auravoid.dev/fun/:type",
              path: "/fun/:type",
              type: ["joke", "pickup", "roast", "toast", "topic", "quote"],
            },
            "zero-two": {
              url: "https://api.auravoid.dev/zero-two",
              path: "/zero-two",
            },
            "ai-ohto": {
              url: "https://api.auravoid.dev/ai-ohto",
              path: "/ai-ohto",
            },
          }),
          jsonHeaders
        );
      case "/fun":
        return new Response(
          JSON.stringify({
            status: "not ok",
            error: "no type specified",
            type: ["joke", "pickup", "roast", "toast", "topic", "quote"],
          }),
          jsonHeaders
        );
      case "/fun/joke":
      case "/fun/pickup":
      case "/fun/roast":
      case "/fun/toast":
      case "/fun/topic":
      case "/fun/quote":
        let responses = await fetch(
          "https://cors.auravoid.dev/https://cdn.auravoid.dev/data/fun.json",
          { headers: { "x-requested-with": "https://api.auravoid.dev" } }
        );
        let data: any = await responses.json();
        let type = pathname.split("/")[2];
        return new Response(
          JSON.stringify({
            status: "ok",
            error: null,
            type: type,
            data: data[type][Math.floor(Math.random() * data[type].length)],
          }),
          jsonHeaders
        );
      case "/zero-two":
      case "/ai-ohto":
        let path = pathname.split("/")[1];
        if (path === "ai-ohto") {
          path = "ai-ohto/gifs";
        }
        let images = await fetch(
          "https://cors.auravoid.dev/https://cdn.auravoid.dev/images/" +
            path +
            "/index.json",
          { headers: { "x-requested-with": "https://api.auravoid.dev" } }
        );
        let image: any = await images.json();
        return new Response(
          JSON.stringify({
            status: "ok",
            error: null,
            data: image[Math.floor(Math.random() * image.length)],
          }),
          jsonHeaders
        );
      default:
        return new Response(
          JSON.stringify({
            status: "not ok",
            error: "invalid path",
            fun: {
              url: "https://api.auravoid.dev/fun/:type",
              path: "/fun/:type",
              type: ["joke", "pickup", "roast", "toast", "topic", "quote"],
            },
            "zero-two": {
              url: "https://api.auravoid.dev/zero-two",
              path: "/zero-two",
            },
            "ai-ohto": {
              url: "https://api.auravoid.dev/ai-ohto",
              path: "/ai-ohto",
            },
          }),
          jsonHeaders
        );
    }
  },
};
