# Furniture Website

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [Fundamental Features](#fundamental-feature)
- [Core Features](#core-feature)

## General Info

This is a furniture e-commerce website using NextJs - a SSR to increase speed, improving user expericence

- Variety of templates for content writer to improve products
- Reviews of each products that depends on purchased Customers
- Improving Logistic with googleAPI - connect nearby shippers
- Dashboard - which an overview for admin

## Technologies

Project is created with YARN:

- NextJs Typescript
- Prisma (SQL database)

Others packages:

- NextAuth
- TailwindCss with SASS implement
- Ag-grid
- Classnames
- Formik - Yup
- React-toastify
- SwiperJs

## Setup

yarn install - install dependencies\
npx prisma generate - create prismaClient\
npx prisma migrate dev --name init - create SQL tables with names init\
yarn dev - start server

```console
yarn install
npx prisma generate
npx prisma migrate dev --name init
yarn dev
```

## ERD

- ERD : https://drawsql.app/teams/personal-821/diagrams/fundamental

---

## User Story

### Authentication

- [x] As a user, I can register for a account with Credential: {loginId,password,email} and SignOn with Google, Github
- [x] As a user, I can sign in with my {loginId,password} or SignOn Google; Github

### Customer

- [x] As a customer, I can see many product layout on the website
- [x] As a customer, I search, filter through all product not deleted
- [x] As a customer, I can see detail of each product, and add to shopping cart
- [x] As a customer, I can writes a preview for product that has been ordered
- [x] As a customer, I can see the website is responsive for the minium of Desktop, Iphone, and Tablet
- [x] As a customer, I can visit routes that allowed

### Admin

- [x] As a Admin, I can do any features that user can
- [x] As a Admin, I can search, filter though all product includes already delete
- [x] As a Admin, I can Create, updates any database tables which Enum table not included
- [x] As a Admin, I can permit product reviews which to shows on websites

---

## Endpoint

### AuthApi

There are two methods

- Using Next-Auth:

```Javascript
/**
 * @method GET /api/auth/signin
 * @description Displays the built-in/unbranded sign-in page.
 * @access everyone
 * /
```

```Javascript
/**
 * @method POST /api/auth/signin/:provider
 * @description Starts a provider-specific sign-in flow
 * @param provider Currently have signOn from Google and Github
 * @access Browser that have CSRF token - stored in cookies - generated from /api/auth/csrf
 * @return Signed CSRF token as cookies
 *
 * @Frontend Callmethod: signIn(provider,options)
```

```Javascript
/**
 * @method Get /api/auth/signout
 * @description Displays the built-in/unbranded sign-out page.
 * @access everyone
 * /
```

```Javascript
/**
 * @method POST /api/auth/signout
 * @description Handles signing the user out - check if cookies are valid - then remove cookies
 * @access SignedIn user
 *
 * @Frontend Callmethod: signOn({callbackUrl})
 * /
```

- JWT Token

```Javascript
/**
 * @method POST /api/auth/customLogin
 * @description Credential signIn only: Check if loginId and password are matched then return Signed JWT token to browser
 * @return access_token : a signed JWT token
 * @access everyone
 * /
```

### Product

```Javascript
/**
 * @method GET /api/products?id=<productId>&id=<productId>&limit=<number>&skip=<number>&rating=<number>&fromPrice=<number>&toPrice=<number>&available=<boolean>&name=<string>&cateId=<number|number[]>&colorHex=<string[]>&roomId=<number|number[]>&createdDate=<Date>&isFeaturedProduct=<boolean>&filter=keyof ProductTable&sort=<'asc' | 'desc'>
 * @description get Products witch filter/search params
 * @param role JWT token
 * @param props searchParams of product
 * @return ProductCard[]
 */

```

```Javascript
/**
 * @method DELETE /api/product?id=<productId>&id=<productId>&id=<productId>
 * @description SoftDelete manyProducts depends on productId
 * @return message
 * @access role === 'admin'
 */
```

```Javascript
/**
 * @method GET /api/products/:productId
 * @description Get one ProductDetail by id
 * @return ProductDetail
*/
```

```Javascript
/**
 * @method PUT /api/products/:productId
 * @description Update product by id
 * @body {name,description,price,available,isFeatureProduct,colors,cateIds,roomIds,imageUrls,creatorId,avgRating}
 * @access Admin can update all fields, Creator - only update description
 * @response message
*/
```

```Javascript
/**
 * @method POST /api/products/:productId
 * @description Create new product
 * @body {name,description,price,available,isFeatureProduct,colors,cateIds,roomIds,imageIds,creatorId}
 * @access admin only
 * @response message
*/
```

```Javascript
/**
 * @method DELETE /api/products/:productId
 * @description SoftDelete one product by id
 * @access admin only
 * @response message
*/
```

### Order

```Javascript
/**
 * @method GET /api/order?id=<string|string[]>&subTotal=<number>&billingAddress=<string>&status=<enum>&ownerId=<userId>&limit=<number>&filter=<keyof Order table>&sort=<'asc'|'desc'>&skip=<number>&createdDate=<Date>&updatedAt=<Date>
 * @description Get owned orders with search params and filtered
 * @access Only admin can search with id, others will use token.userId as id field in search
 * @return ResponseOrders[]
 */
```

```Javascript
/**
 * @method POST /api/order
 * @description Create new order
 * @body {products,billingAddress,shippingAddress}
 * @access Admin only
 * @return ResponseOrder
 */
```

```Javascript
/**
 * @method GET /api/order/:orderId
 * @description get one Order that contains details of Order items
 * @return ResponseOrder
 */
```

```Javascript
/**
 * @method DELETE  /api/order/:orderId?userId=<string>
 * @description update Order status to canceled (soft delete)
 * @access Only admin can access userId from req.query, others will get userId from JWT token
 * @return message
 */
```

### Review

```Javascript
/**
 * @method GET /api/review?id=<string>&ownerId=<string>&productId=<string>&likedUsers=<string[]>&totalLike=<number>&content=<string>&rating<number>&createdDate=<Date>&updatedAt=<Date>&limit=<number>&skip=<number>&filter=<keyof ProductReview>&sort=<'asc' | 'desc'>&isPending=<boolean>
 * @description Get reviews by filter/search
 * @access Only admin can access isPending
 * @return ResponseReview[]
 */
```

```Javascript
/**
 * @method POST /api/review
 * @description Create new product review
 * @body {userId,productId,content,rating}
 * @access Only admin can access userId, others will get from Jwt Token
 * @return message
 */
```

```Javascript
/**
 * @method DELETE /api/review?id=<string>
 * @description Delete pernament many product reviews by id
 * @access Only Admin
 * @return message
 */
```

```Javascript
/**
 * @method GET /api/review/:reviewId
 * @description Get one productReview by reviewId
 * @access everyone
 * @return ResponseReview
 */
```

```Javascript
/**
 * @method PUT /api/review/:reviewId?userId
 * @description Update likes of product review Or update content of owned productReview
 * @param body {likedUser} || {id,ownerId,productId,content,rating}
 * @access login required - Only admin can access userId from req.query which replace ownerId
 * @return message
 */
```

```Javascript
/**
 * @method PUT /api/review/:reviewId
 * @description update owned product review
 * @param review {id,ownerId,productId,content,rating}
 * @access login required - Only admin can access userId from req.query
 * @return message
 */
```

```Javascript
/**
 * @method DELETE /api/review/:reviewId
 * @description delete pernament product review by reviewId
 * @access login required
 */
```

### User

```Javascript
/**
 * @method GET /api/user?id=<string>&name=<string>&nickName=<string>&address=<string>&email=<string>&gender=<Gender>&role=<Role>&phoneNumber=<string>&birthDay=<Date>&createdDate=<Date>&updatedAt=<Date>&userVerified=<Date>&emailVerified=<Date>&deleted=<Date>
 * @description get users by filter/search
 * @access Only admin
 * @return User[]
 */
```

```Javascript
/**
 * @method DELETE /api/user?id=<string|string[]>
 * @description soft delete user
 * @access Only admin
 * @return message
 */
```

```Javascript
/**
 * @method GET /api/user/:userId
 * @description Get one user profile
 * @access Only admin can access userId in req.query - others get userId from JWT token
 * @return UserProfile
 */
```

```Javascript
/**
 * @method PUT /api/user/:id
 * @description Update login user profile only
 * @body everyone - {name,nickName,address,email,gender,phoneNumber,birthDay}
 *       Admin -    {emailVerified,userVerified,deleted}
 * @access Only admin can access id in req.query - others get id from JWT token
 * @return res.body message:"Update complete"
*/
```

```Javascript
/**
 * @method DELETE
 * @description soft delete owned account
 * @access Login user only
 * @return message
*/
```

```Javascript
/**
 * @method GET /api/user/shoppingCart
 * @access Login user
 * @return  UserShoppingCart
 */
```

```Javascript
/**
 * @method PUT /api/user/shoppingCart
 * @description add new product to owned Shoppingcart
 * @body {productId,color,quantities}
 * @access Login user
 * @return message
 */
```

```Javascript
/**
 * @method POST /api/user/shoppingCart
 * @description Update existed item in owned shoppingcart
 * @body {cartItemId,color,quantities}
 * @access Login user
 * @return message
 */
```

```Javascript
/**
 * @method DELETE /api/user/shoppingCart?cartItemId=<string>
 * @description Delete one item in owned shopping cart by CartItemId
 * @access Login user
 * @return message
 */
```

```Javascript
/**
 * @method GET /api/user/wishlist
 * @description Get owned wishlist product
 * @access Login user
 * @return ProductCard[]
 */
```

```Javascript
/**
 * @method PUT|POST /api/user/wishlist?productId=<string>
 * @description upsert productId to wishlist
 * @access Login user
 * @return message
 */
```

```Javascript
/**
 * @method DELETE /api/user/wishlist?productId=<string>
 * @description Remove ONE product from owned wishlist - PERNAMENT
 * @access Login user
 * @return message
 */
```

### Category

```Javascript
/**
 * @method GET /api/category?id=<string>&filter=<"id"||"label">&sort=<"asc"||"desc">&limit=<number>&skip=<number>
 * @description Get categories by filter/search
 * @access everyone
 * @returns Category | Category[]
 */
```

```Javascript
/**
 * @method PUT /api/category
 * @description update one category by Id
 * @body {id:number,label:string}
 * @access Admin
 * @return Category
 */
```

```Javascript
/**
 * @method POST /api/category
 * @description create category
 * @body {id:number,label:string}
 * @access Admin
 * @return Category
 */
```

```Javascript
/**
 * @method DELETE /api/category?id=<string>
 * @description pernament delete category
 * @access Admin
 * @return message
 */
```

### Room

```Javascript
/**
 * @method GET /api/room?id=<string>&filter=<"id"||"label">&sort=<"asc"||"desc">&limit=<number>&skip=<number>
 * @description Get categories by filter/search
 * @access everyone
 * @return Room | Room[]
 */
```

```Javascript
/**
 * @method PUT /api/room
 * @description update one room by Id
 * @body {id:number,label:string}
 * @access Admin
 * @return room
 */
```

```Javascript
/**
 * @method POST /api/room
 * @description create room
 * @body {id:number,label:string}
 * @access Admin
 * @return room
 */
```

```Javascript
/**
 * @method DELETE /api/room?id=<string>
 * @description pernament delete room
 * @access Admin
 * @return message
 */
```

### Color

```Javascript
/**
 * @method GET /api/color?id=<string>&filter=<"hex"||"label">&sort=<"asc"||"desc">&limit=<number>&skip=<number
 * @description Get colors by filter/search
 * @returns Color | Color[]
 */
```

```Javascript
/**
 * @method PUT|POST /api/color
 * @description upsert one color by id - label is optional
 * @body {hex:id,label:string}
 * @access Admin
 * @return message
 */
```

```Javascript
/**
 * @method DELETE /api/color?id=<string | string[]>
 * @description pernament delete colors
 * @access Admin
 * @returns Color
 */
```
