---
title: Document-grounded chatbot
description: A retrieval-augmented chatbot on Azure OpenAI, shipped as a Flask and React application.
tags: [retrieval, language]
draft: false
status: shipped
year: 2024
stack: [Azure OpenAI, Flask, React]
problem: >
  The reply had to come from a set of documents and a database, rather than
  from the model on its own.
approach: >
  Retrieval over the documents and the database, with Azure OpenAI writing the
  reply, and a Flask and React application in front. Built at Accenture. This
  is separate from the later RAG starter kit.
outcome: >
  A grounded chatbot with a shipped interface, from the Accenture role. The
  repository is not public.
---
