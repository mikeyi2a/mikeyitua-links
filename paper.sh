#!/bin/bash
# Helper to call Paper MCP tools
# Usage: ./paper.sh <tool_name> '<json_arguments>'

TOOL_NAME=$1
ARGS=$2
ID=$((RANDOM))

RESPONSE=$(curl -s -X POST http://127.0.0.1:29979/mcp \
  -H "Content-Type: application/json" \
  -d "{\"jsonrpc\":\"2.0\",\"id\":$ID,\"method\":\"tools/call\",\"params\":{\"name\":\"$TOOL_NAME\",\"arguments\":$ARGS}}")

# Extract just the JSON data from the SSE response
echo "$RESPONSE" | grep '^data: ' | sed 's/^data: //' | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    result = data.get('result', {})
    contents = result.get('content', [])
    for c in contents:
        if c.get('type') == 'text':
            try:
                parsed = json.loads(c['text'])
                print(json.dumps(parsed, indent=2))
            except:
                print(c['text'])
except Exception as e:
    print(f'Error: {e}')
    print(sys.stdin.read() if hasattr(sys.stdin, 'read') else '')
"
