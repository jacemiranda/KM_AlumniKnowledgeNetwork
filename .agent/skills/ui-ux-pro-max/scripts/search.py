#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import sys
import io
import csv

from core import CSV_CONFIG, AVAILABLE_STACKS, MAX_RESULTS, search, search_stack
from design_system import generate_design_system

# UTF-8 fix for Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
if sys.stderr.encoding and sys.stderr.encoding.lower() != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


def format_output(result):
    if "error" in result:
        return f"Error: {result['error']}"

    output = []
    if result.get("stack"):
        output.append(f"## UI Pro Max Stack Guidelines")
        output.append(f"**Stack:** {result['stack']} | **Query:** {result['query']}")
    else:
        output.append(f"## UI Pro Max Search Results")
        output.append(f"**Domain:** {result['domain']} | **Query:** {result['query']}")

    output.append(f"**Source:** {result['file']} | **Found:** {result['count']} results\n")

    for i, row in enumerate(result['results'], 1):
        output.append(f"### Result {i}")
        for key, value in row.items():
            value_str = str(value)
            if len(value_str) > 300:
                value_str = value_str[:300] + "..."
            output.append(f"- **{key}:** {value_str}")
        output.append("")

    return "\n".join(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="UI Pro Max Search")

    # ✅ FIX: query is now optional
    parser.add_argument("query", nargs="?", default="", help="Search query")

    parser.add_argument("--domain", "-d", choices=list(CSV_CONFIG.keys()), help="Search domain")
    parser.add_argument("--stack", "-s", choices=AVAILABLE_STACKS, help="Stack-specific search")
    parser.add_argument("--max-results", "-n", type=int, default=MAX_RESULTS, help="Max results")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    # ✅ NEW: list mode
    parser.add_argument("--list", action="store_true", help="List ALL entries in a domain")

    # Design system
    parser.add_argument("--design-system", "-ds", action="store_true")
    parser.add_argument("--project-name", "-p", type=str, default=None)
    parser.add_argument("--format", "-f", choices=["ascii", "markdown"], default="ascii")

    # Persistence
    parser.add_argument("--persist", action="store_true")
    parser.add_argument("--page", type=str, default=None)
    parser.add_argument("--output-dir", "-o", type=str, default=None)

    args = parser.parse_args()

    # =========================
    # DESIGN SYSTEM
    # =========================
    if args.design_system:
        result = generate_design_system(
            args.query,
            args.project_name,
            args.format,
            persist=args.persist,
            page=args.page,
            output_dir=args.output_dir
        )
        print(result)

    # =========================
    # STACK SEARCH
    # =========================
    elif args.stack:
        result = search_stack(args.query, args.stack, args.max_results)

        if args.json:
            import json
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(format_output(result))

    # =========================
    # DOMAIN SEARCH / LIST MODE
    # =========================
    else:
        if args.list:
            if not args.domain:
                print("Error: --list requires --domain")
                sys.exit(1)

            file_path = CSV_CONFIG[args.domain]["file"]

            with open(file_path, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                data = list(reader)

            # Optional: sort cleanly
            data = sorted(data, key=lambda x: list(x.values())[0])

            result = {
                "domain": args.domain,
                "query": "ALL",
                "file": file_path,
                "count": len(data),
                "results": data[:args.max_results] if args.max_results else data
            }

        else:
            result = search(args.query, args.domain, args.max_results)

        if args.json:
            import json
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(format_output(result))