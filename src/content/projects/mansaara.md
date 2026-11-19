---
title: Mansaara
description: A desk for a transport company — vehicles, trips, documents, and where the trucks are.
tags: [operations]
draft: false
status: active
year: 2025
stack: [TypeScript, React, FastAPI, PostgreSQL, AWS]
problem: >
  A fleet's day is split across the trucks, the trips, the drivers, the fuel,
  and the paper that has to travel with the load. Those records usually live
  in different places, so a lorry receipt, an invoice, and a location are three
  lookups.
approach: >
  A React desk in front of a FastAPI service. Fleets, vehicles, loads and trips,
  drivers, lorry receipts, invoices, fuel, documents, and live tracking are
  separate API modules, behind a login and roles. Positions come from a GPS
  service of their own. The database is Postgres. The API runs on AWS. The
  repositories are private.
outcome: >
  A product with a public site and a private operating desk. The site is the
  introduction. This note does not repeat the site's customer counts, ratings,
  or certifications.
url: https://main.d1ss1s65auabsx.amplifyapp.com/
---
