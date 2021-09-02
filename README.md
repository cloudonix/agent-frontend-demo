# Demo Agent In Conference Room

To use this demo, make sure you have a Cloudonix account (or create one at https://cockpit.cloudonix.io) with a domain and one or more subscriber accounts and/or interconnects to PSTN (for more details about these requirements, see below).

1. Find your Cloudonix API key in the [Cloudonix Cockpit](https://cockpit.cloudonix.io)
2. Have at least one agent account (either a subscriber, or a number you can dial to through an interconnect/outbound trunk).
3. Have one or more "customer" numbers (either subscribers, or numbers you can dial to through an interconnect/outbound trunk).
4. Clone this repository to your computer.
5. Install the Angular CLI by running `npm install -g @angular/cli`
6. Install required dependencies by running `npm install`
7. Start the application using `ng serve --open`

Alternatively, if you already have all the necessary keys and numbers and just want to get on with playing with the application,
you can try our [hosted demo here on GitHub](https://cloudonix.github.io/agent-frontend-demo/).

## Workflow

1. Enter your Cloudonix API Key into the main screen and click "OK".
2. If you have access to more than one domain, the next screen will let you select the domain where you want to run the workflow.
3. In "Connect Agent" screen, enter the agent's number and click "Connet".
4. The agent's phone/UA should start ringing. The agent should answer the call or abort the workflow by rejecting the call or pressing the "End Session" button in the UI.
5. Once the agent is connected, the "Call Customer" screen can be used to enter the number of a customer and dialing out to it.
6. When a customer is called, the ringtone of the customer should be heard in the agent's phone/UA. The customer connection can be either accepted or rejected by the customer, or cancelled by using the "Disconnect Customer" button in the UI.
7. The agent's session can be terminated by using the "End Session" button in the UI, or by hanging up the agent's phone/UA.

## Cloudonix Account Requirements

### API Key

You can see your personal API Key by logging into the Cloudonix Cockpit, then navigate to "Settings" then open the "API Keys" tab. Your personal API key will be presented at the top of the page.

Alternatively, you can create a custom API key just for this workflow by clicking the "Add API Key" button.

### Agent Account

Usually the agent would be a subscriber in the Cloudonix domain. If you'd rather connect an agent using a phone on the public telephony network, see the "Interconnect" section below.

To connect a subscriber, log into the Cloudonix Cockpit and navigate to "Subscribers". If you have more than one domain, you'd then need to select the domain where you want to run the application, then click the "➕" button. In the dialog that opens, specify an agent number in the "MSISDN #" field (we do not actually required this to be a number - most text would work as a "number"), and either write down the automatically generated password or set another password, then click the "Create" button.

You can now use a "soft phone" software (Such as Zoiper or Bria) to register the agent with Cloudonix subscribers service, with these settings:

* Account: use the number you specified and your Cloudonix domain name separated by a `@` character - like an email. For example, if you'r domain is `example.com` and you selected `1234` as your agent number, use: `1234@example.com`.

* Password: the password you used when creating the agent account.

* Proxy server/SIP server: `sip.cloudonix.io`

* Protocol: TLS

* Port: 443

Once the agent soft phone is registered, the agent can start handling calls.

### Interconnect

To connect customers (or an agent) through a public phone number, you first need to connect your Cloudonix domain to a public telephony access provider (sometimes known as a DID provider). Make sure you enable "incoming calls" (sometimes called "inbound") and specify the Cloudonix interconnect server details - address: `border.cloudonix.io`; protocol: "UDP", port number: 5060.

Once you have an account with an access provider, log in to the Cloudonix Cockpit and navigate to "Outbound Trunks". If you have more than one domain, you'd then need to select the domain where you want to connect the telephony access provider, then click the "➕" button. In the dialog that opens, give the new interconnect setting a name, then enter the connection details that you got from your access provider - including:

* "Address" - this would be the address of your access provider's SIP server or "trunk" IP address.
* "Port" - this would be the port number for your access provider account. The default port number (5060) often does not need to be changed.
* "Prefix" - your access provider will often assign (or let you choose) an access code to be used for "incoming calls". This may be called a "CLI prefix" or a "trunk" prefix.

You should now be able to create calls to public telephone numbers.

