# Gumloop JavaScript/TypeScript Client

A JavaScript/TypeScript client for the Gumloop API that makes it easy to run and monitor Gumloop flows.

## Installation

```bash
npm install gumloop
```

## Usage

```typescript
import { GumloopClient } from "gumloop";

// Initialize the client
const client = new GumloopClient({
  apiKey: "your_api_key",
  userId: "your_user_id",
});

// Run a flow and wait for outputs
async function runFlow() {
  try {
    const output = await client.runFlow("your_flow_id", {
      recipient: "example@email.com",
      subject: "Hello",
      body: "World",
    });

    console.log(output);
  } catch (error) {
    console.error("Flow execution failed:", error);
  }
}

runFlow();
```

## Project-Level Usage

If you're working within a Gumloop project, you can initialize the client with a project ID:

```typescript
const client = new GumloopClient({
  apiKey: "your_project_api_key",
  userId: "your_user_id",
  projectId: "your_project_id",
});
```
