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
        "firstName":"John",
        "lastName":"Doe"
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

To handle the response from Veriff services, you will need to implement an endpoint that accepts payloads posted by our services. Please note that Veriff does not allow custom ports to be added to the webhook URLs.

**Configuring the webhook endpoint**

Go to Veriff Station, Integrations -> Find the integration to configure -> Settings, and set one of the webhook URLs to the URL where your endpoint is accepting payloads from Veriff. There are several types of webhooks.

If there is a network connectivity issue or technical issue with delivering the notification (any non-200 response code), Veriff will retry the notification once in every hour for up to a week.

**1. Recognizing your customer**

When your server receives a payload from Veriff, you need to be able to reference a customer.There are a couple of ways to do this.

**2. Using the Veriff session ID**

The easiest way is to track the session ID provided by Veriff during session creation. All future webhooks payloads refer to the attempt ID. The attempt ID is unique for each session and it can be used to look up sessions in [Station interface](https://station.veriff.com/verifications).

**3. Using your own customer ID**

To use your own customer ID you need to provide your internal customer ID to Veriff, or some other key that uniquely identifies your customer. You can store your identifier in the vendorData property during the session creation. Please bear in mind that it is technically possible for one customer to be associated with multiple verification sessions, and this could potentially create ambiguous situations in code, if you are only recognizing customers by your own identifier, and not Veriff's session ID.

**Meaning of the various verification responses**

Verification status is one of

- approved
- resubmission_requested
- declined
- expired
- abandoned
- review

Verification response code is one of 9001, 9102, 9103, 9104, 9121.

**Explanation of the meaning of the response codes:**

- 9001 : Positive: Person was verified. The verification process is complete. Accessing the sessionURL again will show the client that nothing is to be done here.
- 9102 : Negative: Person has not been verified. The verification process is complete. Either it was a fraud case or some other severe reason that the person can not be verified. You should investigate the session further and read the "reason". If you decide to give the client another try you need to create a new session.
- 9103 : Resubmitted: Resubmission has been requested. The verification process is not completed. Something was missing from the client and she or he needs to go through the flow once more. The same sessionURL can and should be used for this purpose.
- 9104 : Negative: Verification has been expired. The verification process is complete. After 7 days the session get's expired. If the client started the verification process we reply "abandoned" here, otherwise if the client never arrived in our environment the status will be "expired"
- 9121 : Review: Review status is issued whenever automation engine could not issue a conclusive decision and the verification session needs to be reviewed by a human. This status will be sent depending on service agreement.

## Decision webhook Response

This is the description of the payload sent to Webhook decisions URL. The result of the verification is sent back to the vendor once the verification has been processed.

In most cases we send decision webhook instantly after decision is made with an exception of "resubmission_requested" status. In case resubmission is required we allow end user to resubmit session data instantly without a need to exit the flow. If end user does't do it within 5 minutes we'll send out webhook with resubmission_requested decision.


```json
{
    "status": "success",
    "verification": {
        "id": "12df6045-3846-3e45-946a-14fa6136d78b",
        "code": 9001,
        "person": {
            "gender": null,
            "idNumber": null,
            "lastName": "MORGAN",
            "firstName": "SARAH",
            "citizenship": null,
            "dateOfBirth": "1967-03-30",
            "nationality": null,
            "yearOfBirth": "1967",
            "placeOfBirth": "MADRID",
            "pepSanctionMatch": null
        },
        "reason": null,
        "status": "approved",
        "comments": [],
        "document": {
            "type": "DRIVERS_LICENSE",
            "number": "MORGA753116SM9IJ",
            "country": "GB",
            "validFrom": null,
            "validUntil": "2022-04-20"
        },
        "reasonCode": null,
        "vendorData": "12345678",
        "decisionTime": "2019-11-06T07:18:36.916Z",
        "acceptanceTime": "2019-11-06T07:15:27.000Z",
        "additionalVerifiedData": {
            "driversLicenseCategory": {
                "B": true
            },
            "driversLicenseCategoryFrom": {
                "B": "2019-10-06"
            },
            "driversLicenseCategoryUntil": {
                "B": "2025-10-05"
            }
        },
        "riskLabels": [
            {
                "label": "document_integration_level_crosslinked_with_fraud",
                "category": "document"
            },
            {
                "label": "document_integration_level_crosslinked_with_multiple_declines",
                "category": "document"
            }
        ]
    },
    "technicalData": {
        "ip": "186.153.67.122"
    }
}
```


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
