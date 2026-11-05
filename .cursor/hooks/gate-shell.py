#!/usr/bin/env python3
import json
import re
import sys

raw = sys.stdin.read()
try:
    data = json.loads(raw or "{}")
except json.JSONDecodeError:
    print(json.dumps({
        "permission": "deny",
        "agent_message": "Хук shell: неразобранный JSON. Команду не запускай.",
    }))
    raise SystemExit(0)

command = data.get("command") or ""
risky = re.search(
    r"""
    \bgit(\s+|$)(?=.*(commit|push|tag|rebase|reset|filter-branch))
    | \bgh\s+
    """,
    command,
    re.IGNORECASE | re.VERBOSE | re.DOTALL,
)

if risky:
    print(json.dumps({
        "permission": "ask",
        "user_message": "Агент хочет git/gh. Разреши только если ты просил выложить или закоммитить.",
        "agent_message": "Коммит и публикация режутся хуком. Не делай git commit/push и gh, пока Кирилл не написал «выложи» или «закоммить». Если просил — дождись подтверждения.",
    }))
else:
    print(json.dumps({"permission": "allow"}))
