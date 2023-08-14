# Truck Transport Admin (Angular)

[Truck Transport API Repo](https://github.com/zohaibtariq/truck-transport-api-node)

[Truck Transport Customer Repo](https://github.com/zohaibtariq/truck-transport-customer-angular)

### INSTALL PACKAGES
````
npm install
````
OR
````
yarn install
````

### START DEV ENV
````
yarn start
````

### ADMIN URL
````
http://localhost:4200
````

### NOTE
#### you need to create an admin user first from mentioned below endpoint of API REPO
````
Register

POST /v1/auth/register
````
#### after registering update its role to "superuser" and set different flags to true like active, emailVerified etc than use this user for admin login.

