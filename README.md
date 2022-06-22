# Veriff ekyc Node.js Library

> An open-source Veriff API client for Node.JS
eKYC using Veriff. User identify can be verified like Passport, Government ID etc.

## Documentation

See the [Veriff API docs](https://developers.veriff.com/#api-reference) for the offical docs, below is a list of methods supported by this library.

## How to find your API keys

Your API keys are stored in the Veriff Station. Choose [Integration](https://station.veriff.com/integrations) in the top menu, then integration you need.

Once you open integration you'll see Publishable key and Private key. Private key is your API secret and Publishable key is the API Key

There are two types of Integrations that can be created by Station user:

- Test Integrations are used for development and sessions will not count towards paid usage. Veriff will not provide decisions on sessions created for test integrations. Stress testing without prior agreement is not allowed
- Live Integrations are used for production and sessions created will count towards paid usage and Veriff will be providing decisions for those

**NB: Requires Node >= 12**

## Methods
Currently only supports methods listed below.

### Create session :: 

**Request**

**`GET http://localhost:3003/api/veriff/sessions`**

**description**

Creates a session with specified verification data. you can use this api in registration time or the document resubmission time it is always generate the new session in veriff dashboard.  

**Example Request:**

```shell
curl 
    --location --request POST 'http://localhost:3003/api/veriff/sessions' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "firstName":"Daps",
        "lastName":"Chavhan"
    }'
```

**Example Response:**

```json
{
    "message": "Veriff session has been started.",
    "result": {
        "sessionId": "a606847d-437a-46c4-b5de-0140f01ec185",
        "sessionURL": "https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiYTYwNjg0N2QtNDM3YS00NmM0LWI1ZGUtMDE0MGYwMWVjMTg1IiwiaWF0IjoxNjU1ODgyNjQ4fQ.AQO9Bh2aoAvrg4Dm5yMBf1qXK0r_8ysOWxLWif6ttYk",
        "vendorId": "1e096bb9-3ca6-490e-9e77-c92e0e99fafb",
        "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiYTYwNjg0N2QtNDM3YS00NmM0LWI1ZGUtMDE0MGYwMWVjMTg1IiwiaWF0IjoxNjU1ODgyNjQ4fQ.AQO9Bh2aoAvrg4Dm5yMBf1qXK0r_8ysOWxLWif6ttYk",
        "status": "created"
    }
}
```

### List All Attempts :: 

**Request**

**`POST http://localhost:3003/api/veriff/:sessionId/attempts`**

**description**

Get the list of attempt objects with sessionId = {sessionId}

**Example Request:**

```shell
curl --location --request GET 'http://localhost:3003/api/veriff/<session-id>/attempts'
```

**Example Response:**
```json
{
    "message": "Veriff session has been started.",
    "result": [
        {
            "id": "554f9276-7da7-44ce-8e7f-4f4aa3b7db58",
            "status": "created",
            "createdTime": "2022-06-22T07:24:08.689Z"
        }
    ]
}
```

## Webhook Verification

TransferWise signs all Webhook events, and it is recommended that you [verify this signature](https://api-docs.transferwise.com/#webhook-events-list-signature-header) . Luckily this library can do that for you.

Similarly to how `stripe node` works, you should only use the event returned from the method below.

```js
const event = tw.webhooks.constructEvent("<webhookMsg>", "<signature>");
```

Please note that you must pass the **raw** request body, exactly as recieved from TransferWise to the `constructEvent()` function; this will not work with a parsed (i.e., JSON) request body.

You can find an example of how to use this with [Express](https://expressjs.com/) below:

```js
app.post("/", bodyParser.raw({ type: "application.json" }), (req, res) => {
  const sig = req.headers["x-signature"];
  const event = tw.webhooks.constructEvent(req.body, sig);
  // ...
});
```

## Known Sandbox Issues

Below is a series of issues that l have found out through various email chains with TransferWise API team.

**1. Create a Transfer**

When creating a transfer, the field **targetValue** will always be populated as `0` regardless, therefore you should only rely on this field in production.

**2. Simulate a Transfer**

When funding a transfer, the transfer state might show `processing`, however this state is misleading. When simulating, you will still need to simulate from `incoming_payment_waiting` to `processing`.

## Development

Run build command:

```bash
$ npm run build
```

Run start command:

```bash
$ npm run start
```

This library is used to both the mobile and web application.
