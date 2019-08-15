# Getting Started

You'll want to first import the edmit-meal-database.sql into a mysql database.

The connection values are hard coded into ./src/lib/db.ts, but it by default expects a server located on localhost, on the default port, with a root user with no password. -- In the real world this would be _very_ different.

From the root of the workspace, you'll want to run `yarn install`, `yarn webpack` to build the SPA, and then `yarn dev` to serve the application.

From there you can then visit http://localhost:8080.

## Responses to Additional Questions

## Why did you select tho chosen frotend and backend tech?

I chose NodeJS/Typescript for the backend because I feel that it is a great option for rapid prototyping, there's an excellent ecoysystem of tooling available, and outside of anything that might need deep computational work makes for a good "first version". It also presents a good glue layer if we were to find later on that parts of the prototype need to be replaced with upstream services that are implemented in more robust runtimes.

I chose the graphql interface layer, as it removes the need to develop DTOs and endpoints to provide specific DTOs for specific circumstances instead making all of the information available and the client just requests what it needs.

The datastore is a mysql relational database, as a general preference if there's any level of relational data involved I will tend toward a relational database as the "source of truth" and will develop initially against the relational database, and then, once application usage has been analyzed, will introduce other data stores as needed based on application use cases/feature requirements, ie: Adding elasticsearch to handle advanced full text search while synchronizing the underlying elasticsearch data with the database.

I chose React for the frontend as an SPA (served directly by backend web service for simplicity's sake). I find that the development velocity of React based interfaces to be advantageous to making fast and robust features.

## What are some limitations of the technology you've chosen?

GraphQL does require a dataloader implementation of some sort to prevent N+1 query problems, which could overwhelm the data store. The lack of true reflection in Javascript/Typescript doesn't allow for building SQL queries that only return just the fields requested by the graphql queries. As a result, currently the entire record is retrieved from the database and just the requested fields are returned to the client which is wasteful.

Other runtimes are often faster and exhibit better memory usage than NodeJS for the same code and workload.

While I'm using Typescript, which is a superset of Javascript, in a runtime environment all the guarantees that Typescript provides are lost and non-conforming data can still cause bugs since there's little run time type checking.

## How would you change the user stories or proposed functionality to better align with the product goal?

I would introduce functionality that minimizes the number of ingredients across the set of returned recipes to maximize reuse. So that if I buy a loaf of bread for my meals on Monday, I want to encourage recipes that also use bread on later days of the week to prevent food potentially going to waste.
