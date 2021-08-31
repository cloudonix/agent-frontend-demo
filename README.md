# Demo Agent In Conference Room

To use this demo, make sure you have a Cloudonix account (or create one at https://cockpit.cloudonix.io) with a domain and one or more subscriber accounts and/or interconnects to PSTN.

1. Find your Cloudonix API key in the [Cloudonix Cockpit](https://cockpit.cloudonix.io)
2. Have at least one agent account (either a subscriber, or a number you can dial to through an interconnect/outbound trunk).
3. Have one or more "customer" numbers (either subscribers, or numbers you can dial to through an interconnect/outbound trunk).
4. Clone this repository to your computer.
5. Install the Angular CLI by running `npm install -g @angular/cli`
6. Install required dependencies by running `npm install`
7. Start the application using `ng serve --open`

## Workflow

1. Enter your Cloudonix API Key into the main screen and click "OK".
2. If you have access to more than one domain, the next screen will let you select the domain where you want to run the workflow.
3. In "Connect Agent" screen, enter the agent's number and click "Connet".
4. The agent's phone/UA should start ringing. The agent should answer the call or abort the workflow by rejecting the call or pressing the "End Session" button in the UI.
5. Once the agent is connected, the "Call Customer" screen can be used to enter the number of a customer and dialing out to it.
6. When a customer is called, the ringtone of the customer should be heard in the agent's phone/UA. The customer connection can be either accepted or rejected by the customer, or cancelled by using the "Disconnect Customer" button in the UI.
7. The agent's session can be terminated by using the "End Session" button in the UI, or by hanging up the agent's phone/UA.
