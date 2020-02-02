module.exports.verifyRequest = (event, done) => {
  let exit = false;
  switch (event.httpMethod) {
    case "GET":
      if (!event.queryStringParameters || !event.queryStringParameters.email) {
        done(
          new Error("You must supply an email query paramter to get an item")
        );
        exit = true;
      }
      break;

    case "POST":
      let body;

      try {
        body = JSON.parse(event.body);
      } catch (err) {
        done(new Error("Could not parse request body: ", err));
        exit = true;
      }

      if (!body || !body.email || !body.info || !Array.isArray(body.info)) {
        done(
          new Error(
            "you must supply both email string and info array in the body of the request"
          )
        );
        exit = true;
      }
      break;

    default:
      console.log("No recognized request to verify?");
      exit = true;
  }
  return exit;
};
