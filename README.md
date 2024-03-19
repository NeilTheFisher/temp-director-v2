**ENV var required**

_This is the Director MYSQL variables:_

- MYSQL_SOCKET_ADDRESS
- MYSQL_SOCKET_PORT
- MYSQL_DATABASE
- MYSQL_USER=
- MYSQL_PASSWORD

_This is for the express server:_

- SESSION_SECRET="thisismysessionsecret"

_This is for the ACS endpoint so we can send Subscriber API request (soap)_

- ACS_API_ENDPOINT (this is the ACS-UI actually)
- ACS_API_IMPU_TEMPLATE="sip:+<MDN>@test.5grcs.com,tel:+<MDN>"
- ACS_API_IMPI_TEMPLATE="+<MDN>@test.5grcs.com"
- ACS_PROVISIONING_PATH="/soap/?wsdl"

_This is the port of this HTTP server._
HTTP_PORT="3000"

You can run the project locally using npm run dev.

I have created a structure in the repo where there is a model folder, but those are currently simple type objects. The goal is to eventually have full classes using ORM.
Because we have no ORM at the moment, we need to do manual SQL queries.
When we have moved ALL the routes from PHP Laravel Director project to this new node.js Director-API, we will be able to remove passport from Director and use it 100% here.
For now we need the user to hit Director (PHP) with oauth/token route to generate the jwt required. Then all other requests can be sent here since we have the public key to authenticate it.

_Certificates_
The repo currently contains self-signed certificates which should NOT be used in production.

ANOTHER SUPER IMPORTANT TODO, the private key and public key for the jwt are currently comitted inside Director's repo. Here we only have the public key. Still those keys should be generated at deploy time inside Terraform.
