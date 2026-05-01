import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables manually without relying on dotenv module
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || '';
            // Handle quotes and simple typos
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            // Fix the common typo where "your_api" prefixes the key
            if (key === 'STITCH_API_KEY' && value.startsWith('your_api')) {
                value = value.replace('your_api', '');
            }
            process.env[key] = value;
        }
    });
}

const apiKey = process.env.STITCH_API_KEY;

if (!apiKey) {
    console.error('Error: STITCH_API_KEY is not defined in .env.local');
    process.exit(1);
}

// Start the MCP server
const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
    '-y',
    'mcp-remote',
    'https://stitch.googleapis.com/mcp',
    '--header',
    `"X-Goog-Api-Key: ${apiKey}"`
], {
    stdio: ['inherit', 'pipe', 'inherit'],
    shell: true
});

// Filter stdout to only pass valid JSON-RPC messages to the parent's stdout.
// mcp-remote incorrectly logs some debug messages to stdout, which breaks the MCP protocol.
let buffer = '';
child.stdout.on('data', (data) => {
    buffer += data.toString();
    let lines = buffer.split('\n');
    buffer = lines.pop(); // keep the last incomplete line in the buffer
    
    for (const line of lines) {
        if (line.trim().startsWith('{')) {
            process.stdout.write(line + '\n');
        } else {
            process.stderr.write(line + '\n');
        }
    }
});

child.on('error', (err) => {
    console.error('Failed to start MCP server:', err);
});
