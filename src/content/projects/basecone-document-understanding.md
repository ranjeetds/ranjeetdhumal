---
title: Basecone document understanding
description: Splitting, reading, and checking the invoices and receipts that pass through Basecone.
tags: [documents, language]
draft: false
status: active
year: 2024
stack: [Gemini, LLaMA, Phi, LoRA]
problem: >
  Basecone, used in the Netherlands and Belgium, processes over six million
  invoices and receipts a month. A file can hold more than one document, and
  the fields a booking needs — totals, tax, vendor — have to be read off the page.
approach: >
  Document-split algorithms separate a file that contains more than one invoice.
  Receipt classification and field recognition use Gemini 2.5 Flash. Invoice
  field extraction is a fine-tune of LLaMA and Phi with supervised fine-tuning,
  PEFT, and LoRA. Outlier detection flags an extracted field before it is booked.
outcome: >
  The current document-understanding work at Wolters Kluwer, from June 2024.
  Split, reading, and the check before booking are separate steps.
---
