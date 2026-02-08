# Local Testing Guide

## Testing the MCP Server Locally

You can test the Eventbrite MCP server locally without publishing to npm.

### Method 1: Direct Node Execution (Simplest)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Set your API token:**
   ```bash
   export EVENTBRITE_API_TOKEN="your_token_here"
   ```

4. **Run the server:**
   ```bash
   node dist/server.js
   ```

The server will start and communicate via stdio (standard input/output). You can test it by sending MCP protocol messages via stdin.

### Method 2: MCP Inspector (Recommended for Testing)

The MCP Inspector is a tool for testing MCP servers interactively.

1. **Install MCP Inspector:**
   ```bash
   npm install -g @modelcontextprotocol/inspector
   ```

2. **Build your server:**
   ```bash
   npm run build
   ```

3. **Run with Inspector:**
   ```bash
   EVENTBRITE_API_TOKEN="your_token" mcp-inspector node dist/server.js
   ```

4. **Open the Inspector UI** in your browser (URL will be shown in terminal)

5. **Test your tools** interactively through the web interface

### Method 3: Local Path in MCP Client

You can configure your MCP client (like Claude Desktop) to use the local development version:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Update your MCP client config** to use the local path:

   ```json
   {
     "mcpServers": {
       "eventbrite-local": {
         "command": "node",
         "args": ["/absolute/path/to/eventbrite-mcp/dist/server.js"],
         "env": {
           "EVENTBRITE_API_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

3. **Restart your MCP client** to load the local server

4. **Test the tools** through your MCP client interface

### Method 4: npm link (For Development)

Use `npm link` to install the package globally from your local directory:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Create global link:**
   ```bash
   npm link
   ```

3. **Use in MCP client config:**
   ```json
   {
     "mcpServers": {
       "eventbrite": {
         "command": "eventbrite-mcp",
         "env": {
           "EVENTBRITE_API_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

4. **Unlink when done:**
   ```bash
   npm unlink -g @prmichaelsen/eventbrite-mcp
   ```

### Development Workflow

For active development with auto-rebuild:

1. **Start watch mode:**
   ```bash
   npm run watch
   ```

2. **In another terminal, run the server:**
   ```bash
   EVENTBRITE_API_TOKEN="your_token" node dist/server.js
   ```

3. **Restart the server** after each rebuild to test changes

### Testing Individual Tools

You can test tools by sending MCP protocol messages via stdin:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | EVENTBRITE_API_TOKEN="your_token" node dist/server.js
```

### Debugging

Enable debug logging by setting the log level:

```bash
LOG_LEVEL=debug EVENTBRITE_API_TOKEN="your_token" node dist/server.js
```

## Getting Your API Token

1. Visit https://www.eventbrite.com/platform/api-keys
2. Sign in to your Eventbrite account
3. Copy your Private Token
4. Use it in the commands above

## Troubleshooting

### "EVENTBRITE_API_TOKEN environment variable is required"
- Make sure you've set the token before running the server
- Check that the token is valid and not expired

### "Module not found" errors
- Run `npm install` to install dependencies
- Run `npm run build` to compile TypeScript

### Server not responding
- Check that the build completed successfully
- Verify the server process is running
- Check for error messages in the console

### Tools not appearing in MCP client
- Restart your MCP client after configuration changes
- Verify the path to dist/server.js is correct
- Check MCP client logs for connection errors

## Next Steps

Once local testing is complete and you're ready to publish:

```bash
npm publish
```

Then users can install with:
```bash
npx @prmichaelsen/eventbrite-mcp
```
