// const url = 'http://checkip.amazonaws.com/';
const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const utils = require("./utils.js");

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = (event, context, callback) => {
  console.log("METHOD: ", event.httpMethod);
  console.log("event: ", event);

  const done = (err, res) => {
    callback(null, {
      statusCode: err ? "400" : "200",
      body: err ? err.message : JSON.stringify(res),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  };

  let params = {
    TableName: "weddingGuests"
  };

  // If error, done is invoked but it waits for the event loop to become
  // empty before returning, which this "hack" solves.
  const exit = utils.verifyRequest(event, done);
  if (exit) return;

  switch (event.httpMethod) {
    // TODO: Add this functionality
    // case "DELETE":
    // dynamo.deleteItem(JSON.parse(event.body), done);
    //   break;

    case "GET":
      params.Key = {
        email: event.queryStringParameters.email
      };

      dynamo.get(params, done);

      break;

    case "POST":
      const body = JSON.parse(event.body);
      params.Item = {
        email: body.email,
        info: body.info
      };

      dynamo.put(params, done);

      break;

    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
