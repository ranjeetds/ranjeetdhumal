---
title: RAG starter kit
description: A retrieval-augmented generation starter kit built with FastAPI, OpenAI, pgvector and Next.js.
tags: [generative-ai]
draft: false
status: shipped
year: 2026
stack: [FastAPI, Next.js, pgvector, OpenAI]
problem: >
  A retrieval demo is easy to applaud and hard to inspect. The answer comes back
  as a paragraph, and the chunks that were fetched, the time they took, and the
  tokens they cost are hidden inside the call.
approach: >
  A small, readable system rather than a framework. A Next.js client posts a
  message to a FastAPI service. The service embeds the query, fetches nearest
  chunks from Postgres with pgvector, and asks the chat model to answer from
  those chunks. Routes validate input and call services. Ingest is a separate
  endpoint, including one that loads a bundled sample so the loop can be run
  without first building a corpus.
outcome: >
  The response the interface shows is the answer together with the documents,
  the latency, and the token count. That is the point of the kit: a forkable
  reference in which a wrong chunk is visible as a wrong chunk. No quality
  number is claimed for the sample corpus.
repository: https://github.com/ranjeetds/rag-starter-kit
---
