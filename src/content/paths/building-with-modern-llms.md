---
title: Building with Modern LLMs
description: Using a language model as a component. The path is about the system around the model — context, retrieval, evaluation, and the decision not to train.
tags: [llms]
draft: false
level: intermediate
topics: [generative-ai, python-cs]
overview: >
  This path is about the system, not about prompting tricks. A language model
  contributes a conditional distribution over tokens. Everything a product does
  with that — the text it is shown, the documents placed beside the question,
  the decision to fine-tune, the test that runs on every change — is
  engineering around the distribution. The modules are in dependency order.
  You cannot judge retrieval until you know what the model actually receives.
  You cannot decide to train until you know what a failure of context looks
  like. The last module is the one that keeps the earlier ones from rotting
  after the demo.
outcome: Build a small retrieval-backed system, measure it, and separate the model's failures from the system's.
order: 5
modules:
  - title: What the model receives
    outcome: >
      You can take a prompt, show its tokens, and explain one behaviour that
      changes when the tokenization changes and the string does not.
    concepts:
      - Token ids
      - Context as a budget
      - The next-token distribution
    why: >
      Debugging at the level of the paragraph you typed misses the object the
      model used. A split word, a duplicated instruction, a context so long
      that the relevant line is one position among thousands. These are
      properties of the token sequence. Looking at it is cheap and it ends a
      class of arguments about what the model "understood."
    next: >
      Once the input is a sequence you can inspect, changing that sequence on
      purpose is an interface. The next module treats the prompt as a contract.
  - title: The prompt as a contract
    outcome: >
      You can write a prompt as a specification of inputs and of the shape of
      a valid output, and you can test it the way you would test a function.
    concepts:
      - A fixed task, not a conversation
      - Output structure
      - Examples as specification
    why: >
      A prompt that only works when you are watching is not an interface. The
      contract is boring. Given this kind of input, return this kind of object,
      and fail in a way the caller can detect. Examples belong in the contract
      when they pin down a format, and they hurt when they are a substitute for
      saying what the format is.
    next: >
      Some facts should not live in the prompt or the weights. The next module
      puts them in a store and fetches them at the moment of use.
  - title: Retrieval
    outcome: >
      You can describe a retrieval step as embed, fetch, and place into the
      context, and you can name a failure that belongs to each of those three.
    concepts:
      - Chunks
      - Neighbourhood in an embedding
      - Attention is not lookup
    why: >
      The model does not search your documents. Your system searches, then asks
      the model to read. Confusing the two produces evaluations that blame the
      model for a chunk that cut a sentence in half, or praise the model for an
      answer it could have given with the documents removed. The three stages
      fail differently and have to be checked separately.
    next: >
      When retrieval and prompting are not enough, training is one option. The
      next module is about when it is the wrong one.
  - title: When not to train
    outcome: >
      You can separate a failure of missing knowledge from a failure of format
      or context, and you can say what fine-tuning can and cannot add.
    concepts:
      - Weights versus context
      - Adapters
      - The cost of a training set
    why: >
      Fine-tuning changes the distribution. It does not install a database.
      It is the right move when the behaviour you want is a style or a format
      that should happen even with no documents attached, and you have examples
      of it. It is the wrong move when the failure was a missing paragraph you
      could have retrieved. Most systems that "need a custom model" have not
      yet exhausted the context.
    next: >
      Whatever you chose will drift. The last module is the test that notices.
  - title: A test that survives the demo
    outcome: >
      You can attach a small regression set to a language-model feature and
      say which failures belong to the model, the retrieval, and the parsing
      of the output.
    concepts:
      - Frozen examples
      - Slice-level failures
      - Parsing as part of the system
    why: >
      A demo is one input that worked while you held the prompt. A system is a
      set of inputs you can rerun after every change. The set does not have to
      be large. It has to include the cases that broke last time, and it has
      to check the structured result, not your impression of the paragraph.
      When it fails, the earlier modules tell you which stage to open.
    next: >
      The path ends at a small retrievable system with a test. Making it an
      agent is a different path, and it starts from this one.
---
