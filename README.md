# Ecommerce Rest Api

Ecommerce Rest Api is a rest api made with Express & MongoDB.

## Demo

This project deployed to the heroku and this is the heroku url.

http://mongo-express-rest-api.herokuapp.com/

## Used Technologies

This project has this technologies:

- Nodejs
- Expressjs
- MongoDB
- JsonWebToken
- Mongoose

## Enviroment Variables

This project need these enviroment variables :

- **MONGO_URL** : Need to be for mongodb connection
- **JWT_SECRET** : Need to be for access token creation

## Endpoints

These are the endpoints we're using _(will be added on new endpoints)_ :

**Users Endpoints :**

-**/api/users/ :** Getting the user information. _(Needs authorization, get request)_

-**/api/users/orders :** Getting the user orders._(Needs authorization, get request)_

-**/api/users/order/:id :** Getting the user order detail by id. _(Needs authorization, get request)_

-**/api/users/order/delete/:id :** Deleting the user order by id. _(Needs authorization, delete request)_

-**/api/users/favorites :** Getting the user favorites products. _(Needs authorization, get request)_

-**/api/users/add/favorite/:id :** Adding product by id to the user favorites. _(Needs authorization, put request)_

-**/api/users/delete/favorite/:id :** Deleting product by id to the user favorites. _(Needs authorization, delete request)_

**Product Endpoints :**

-**/api/product/all :** Getting all products. _(Get request)_

-**/api/product/:id :** Getting product information by id. _(Get request)_

-**/api/product/create :** Creating new product. _(Needs admin authorization, Get request)_

-**/api/product/delete/:id :** Deleting product by id. _(Needs admin authorization, Delete request)_

-**/api/product/update/:id :** Updating product by id. _(Needs admin authorization, Put request)_

-**/api/search :** Searching products by name. _(Get request)_

**Category Endpoints :**

-**/api/category/all :** Getting all categories. _(Get request)_

-**/api/category/:id :** Getting category by id. _(Get request)_

-**/api/category/create :** Creating a new category. _(Needs admin authorization, Post request)_

-**/api/category/update/:id :** Updating category by id. _(Needs admin authorization, Put request)_

-**/api/category/delete/:id :** Deleting category by id. _(Needs admin authorization, Delete request)_

**Auth(User auth) Endpoints :**

-**/api/auth/register :** Register a new user. _(Post request)_

-**/api/auth/login :** Login user. _(Post request)_

**Admin Endpoints :**

-**/api/admin/register :** Register a new admin. _(Post request)_

-**/api/admin/login :** Login admin. _(Post request)_

## Resources

- [Mongoose](https://mongoosejs.com)
- [Express](https://expressjs.com)

## License

This project is released under the [MIT License](LICENSE)
