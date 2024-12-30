import axios, { AxiosInstance } from "axios";

import {
  PipelineInput,
  RunStatus,
  StartPipelineResponse,
  GumloopConfig,
} from "../types";

export class GumloopClient {
  private api: AxiosInstance;
  private userId: string;
  private projectId?: string;

  constructor(config: GumloopConfig) {
    this.userId = config.userId;
    this.projectId = config.projectId;

    this.api = axios.create({
      baseURL: "https://api.gumloop.com/api/v1",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async runFlow(
    flowId: string,
    inputs: Record<string, any>,
    pollInterval: number = 1000,
    timeout?: number
  ): Promise<Record<string, any>> {
    // Convert inputs to pipeline_inputs format
    const pipelineInputs: PipelineInput[] = Object.entries(inputs).map(
      ([key, value]) => ({
        input_name: key,
        value,
      })
    );

    // Start the flow
    const requestBody = {
      user_id: this.userId,
      saved_item_id: flowId,
      pipeline_inputs: pipelineInputs,
      ...(this.projectId && { project_id: this.projectId }),
    };

    const { data } = await this.api.post<StartPipelineResponse>(
      "/start_pipeline",
      requestBody
    );

    const runId = data.run_id;
    console.log(`Started automation run: ${data.url}`);

    // Poll until completion
    const startTime = Date.now();

    while (true) {
      if (timeout && Date.now() - startTime > timeout) {
        throw new Error("Flow execution timed out");
      }

      const status = await this.getRunStatus(runId);

      if (status.state === "DONE" && status.outputs) {
        return status.outputs;
      } else if (status.state === "FAILED") {
        throw new Error(
          `Flow execution failed: ${status.log?.join("\n") || "Unknown error"}`
        );
      } else if (["TERMINATING", "TERMINATED"].includes(status.state)) {
        throw new Error(
          `Flow execution was terminated: ${
            status.log?.join("\n") || "Unknown error"
          }`
        );
      }

      await this.delay(pollInterval);
    }
  }

  async getRunStatus(runId: string): Promise<RunStatus> {
    const params = {
      run_id: runId,
      user_id: this.userId,
      ...(this.projectId && { project_id: this.projectId }),
    };

    const { data } = await this.api.get<RunStatus>("/get_pl_run", { params });

    return data;
  }
}
