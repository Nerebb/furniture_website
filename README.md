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

## Fundamental feature

- Schema Table: https://drawsql.app/teams/personal-821/diagrams/fundamental

### User

> [x] Create User: LoginId and password.\
> [x] Login User: Credential(LoginID - password) - SignOn: Github - Google.\
> [x] User can have many Account: each Account is a SignIn options: Credential, Github or Google.\
> [x] Available Role : admin, creator, shipper, customer.\
> [x] Update owned profile.\
> [x] Delete - deactivate own's account.\
> [x] Product purchased History / on delivery / shipper info.\

- Role : admin.

> [x] Set User Role\
> [x] Re-write any products, account, description, ...\
> [x] Delete - deactivate others account - products

- Role : creator

> [ ] Re-write on product description, image\
> [ ] Post new product - (pending)

- Role : shipper

> [ ] Product that purchased\
> [ ] User's purchased info : Name - Nickname - phoneNumber - address - email\
> [ ] Estimate deliverytime : Google API

### Session

> [x] Store JWT token data - client cookies only show session token
> [ ] an F2A auth for multiple devices

### Product

- Hompage

> [x] TopCategory: Top sale products\
> [x] Featured : New products

- Search

> [x] Filter by search Input
> [x] Filter by color - checkboxes\
> [x] Filter by category - checkboxes\
> [x] Filter by price - checkboxes or input type select

- Product detail

> [x] Product infomation: Images, description, available, price, etc...\
> [ ] Route history - viewed last product\
> [x] View products that have same category - color

### Category

> [x] GET - all category\
> [x] CREATE/POST/DELTE - Admin only

### Color

> [x] GET - Color of each products\
> [x] CREATE/POST/DELETE - Admin only

### Reviews

> [x] List of product's reviews.\
> [x] Auth User: CREATE - POST - DELETE owned reviews\
> [x] Admin : DELETE any reviews

### WishList

> [x] CRUD by all users\

### OrderItem

> [x] Auth User: GET - owned purchased products\
> [x] purchasedPrice\
> [x] status - purchased Product status: 'Pending', 'On delivery', etc...

## Core feature

### ProductTemplate

Template for creator to write content for each products\

> [ ] Templates are components contains title and content

###

> [ ] Google API: connect shipper and customer
