#!/bin/bash
git add .
git commit -m "$1"
gulp live build
(cd ../gh-pages.aluxian.com && git add . && git commit -m "$1" && git push)
