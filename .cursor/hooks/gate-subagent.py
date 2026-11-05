#!/usr/bin/env python3
import json
import sys

sys.stdin.read()
print(json.dumps({
    "permission": "deny",
    "user_message": "Субагент для дневника выключен: три файла правят в одном чате.",
}))
