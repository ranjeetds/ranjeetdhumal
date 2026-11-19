---
title: Gestify
description: Controls a Mac with hand gestures from the webcam, using MediaPipe for the tracking, with an optional model layered on.
tags: [computer-vision]
draft: false
status: shipped
year: 2025
stack: [Python, MediaPipe]
problem: >
  Hand tracking is usually demonstrated as a cursor that roughly follows a
  pinch. The interesting problems start after that: distinguishing a gesture
  from the motion that got there, supporting two hands, and giving the tracking
  something to do besides moving a pointer.
approach: >
  A Python library on top of webcam tracking. Documented controls cover cursor
  movement, click, drag, and scroll, with cooldown and smoothing so a held pose
  does not fire continuously, plus two-hand gestures for zoom and rotation. The
  same tracking drives three small scenes shipped in the repository: a shape
  puzzle, a two-player paddle game, and a piano played from the fingers.
outcome: >
  A public library and three scenes that exercise it. The repository shows how
  the gestures are factored from the games. It does not report a recognition
  accuracy, and this page does not invent one.
repository: https://github.com/ranjeetds/gestify
---
