#!/bin/sh
# 新 worktree 没有 node_modules;Vercel 也用 npm 装(见 vercel.json)
set -e
npm install --no-audit --no-fund
