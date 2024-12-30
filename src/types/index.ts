export interface PipelineInput {
  input_name: string;
  value: any;
}

export interface RunStatus {
  state:
    | "STARTED"
    | "RUNNING"
    | "DONE"
    | "FAILED"
    | "TERMINATING"
    | "TERMINATED";
  outputs?: Record<string, any>;
  log?: string[];
  url?: string;
}

export interface StartPipelineResponse {
  run_id: string;
  url: string;
}

export interface GumloopConfig {
  apiKey: string;
  userId: string;
  projectId?: string;
}
