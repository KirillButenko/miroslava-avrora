#!/usr/bin/env python3
import json
import sys

raw = sys.stdin.read()
try:
    data = json.loads(raw or "{}")
except json.JSONDecodeError:
    print(json.dumps({
        "permission": "deny",
        "agent_message": "Хук MCP: неразобранный JSON. Браузер не открывай.",
    }))
    raise SystemExit(0)

blob = " ".join([
    str(data.get("mcp_server_name") or ""),
    str(data.get("tool_name") or ""),
    str(data.get("url") or ""),
]).lower()

browser = (
    "browser" in blob
    or "computer-use" in blob
    or "computer_screenshot" in blob
    or "cursor-ide-browser" in blob
    or "cursor-computer-use" in blob
)

if browser:
    print(json.dumps({
        "permission": "ask",
        "user_message": "Агент хочет открыть браузер. Разреши только если ты просил посмотреть.",
        "agent_message": "Браузер режется хуком. Не вызывай browser MCP, пока Кирилл не написал «посмотри». Если просил — дождись подтверждения в карточке.",
    }))
else:
    print(json.dumps({"permission": "allow"}))
