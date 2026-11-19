---
title: Super Scraper
description: Scrapes static and dynamic pages, crawls a site, and can ask an OpenAI model to generate the scraping code. Results are stored as documents or spreadsheets.
tags: [generative-ai]
draft: false
status: shipped
year: 2024
stack: [FastAPI, Next.js, LangChain]
problem: >
  A scraper written for one static page breaks when the next page is rendered in
  the browser, and a crawler that only fetches HTML never reaches it. Generating
  a new script by hand for each site does not survive a change in the markup.
approach: >
  One local tool with a FastAPI service and a Next.js interface. It fetches
  static pages and, through a browser, pages that need to run. It can follow
  links. A language-model step, via LangChain and an OpenAI model, can draft
  scraping code for a page. Results are written out as documents or spreadsheets
  rather than left in a response.
outcome: >
  A runnable scraper for the two page types and for a crawl, with generated code
  as an option rather than the only path. The repository is the implementation.
  It does not claim a success rate across sites, and a generated scraper is only
  as stable as the page it was written against.
repository: https://github.com/ranjeetds/super-scraper
---
