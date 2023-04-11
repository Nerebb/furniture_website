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

1. Enviroment schema

```console
# Connect prisma to database: https://www.prisma.io/docs/guides/development-environment/environment-variables#expanding-variables

DATANEXT_PUBLIC_BASE_URL=

# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# NextAuth Sign-on
# See the documentation for more detail:
 - GitHub: https://next-auth.js.org/providers/github
 - Goolge: https://next-auth.js.org/providers/google

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_ID=
GOOGLE_SECRET=

# NEXT_AUTH JWT KEY
SECRET= superandomkey
```

2. Termninal

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
> [ ] Follows others User.

- Role : admin.

> [ ] Dashboard info: total sale, product, etc...\
> [ ] Set User Role\
> [ ] Re-write any products, account, description, ...\
> [ ] Delete - deactivate others account - products

- Role : creator

> [ ] Re-write on product description, image\
> [ ] Post new product - (pending)

- Role : shipper

> [ ] Product that purchased\
> [ ] User's purchased info : Name - Nickname - phoneNumber - address - email\
> [ ] Estimate deliverytime : Google API

### Session

> [ ] Store JWT token data - client cookies only show session token
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
> [ ] CREATE/POST/DELTE - Admin only

### Color

> [x] GET - Color of each products\
> [ ] CREATE/POST/DELETE - Admin only

### Reviews

> [ ] List of product's reviews.\
> [ ] Auth User: CREATE - POST - DELETE owned reviews\
> [ ] Admin : DELETE any reviews

### WishList

> [x] CRUD by all users\

### OrderItem

> [ ] CRUD - Admin only\
> [x] Auth User: GET - owned purchased products\
> [x] purchasedPrice\
> [x] status - purchased Product status: 'Pending', 'On delivery', etc...

## Core feature

### ProductTemplate

Template for creator to write content for each products\

> [ ] Templates are components contains title and content

###

> [ ] Google API: connect shipper and customer
