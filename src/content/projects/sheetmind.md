---
title: SheetMind
description: An assistant inside Excel, built in the manner of Cursor.
tags: [generative-ai]
draft: false
status: shipped
year: 2025
stack: [Python, FastAPI, Ollama]
problem: >
  Spreadsheet work is a sequence of small, precise operations — a sum, a format,
  a chart, a check for duplicates — and the usual language-model demo answers
  them by describing the operations in a chat window that cannot touch the sheet.
approach: >
  An add-in, loaded through Excel's Script Lab, talks to a local FastAPI service,
  which talks to a local model through Ollama. The model proposes operations. The
  add-in performs them through Office.js, so the sheet changes on the machine
  where the workbook already is. Nothing in the design requires the workbook to
  be uploaded. If the local model is not running, the add-in still loads.
outcome: >
  A local assistant for a stated class of sheet operations: summaries, formatting,
  simple charts, and checks such as duplicates and outliers. The repository
  demonstrates that split — the model proposes, the add-in writes — and the
  decision to keep the model on the same machine as the file. No accuracy on
  those operations is reported here.
repository: https://github.com/ranjeetds/SheetMind
---
