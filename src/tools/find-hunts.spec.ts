import {
  establishMcpServerAndClient,
  ExtendedClient,
} from "../../test/mcpClient";
import * as findHuntsApi from "../api/find-hunts";
import { parseCrudQuery } from "../parsers";

describe("find-hunts tool", () => {
  let client: ExtendedClient;

  beforeEach(async () => {
    client = await establishMcpServerAndClient();
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await client.close();
  });

  it("calls btw api with correct parameters", async () => {
    const spy = vi.spyOn(findHuntsApi, "findHunts");

    const mockHunts = {
      totalRecords: 2,
      hunts: [
        { id: 1, name: "Hunt 1" },
        { id: 2, name: "Hunt 2" },
      ],
    };

    spy.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockHunts,
    } as Response);

    const response = await client.callTypedTool("find-hunts", {
      dateFrom: "2024-07-01",
      dateTo: "2024-07-31",
    });

    expect(response.content[0]).toEqual({
      type: "text",
      text: "Found 2 hunts",
    });
    expect(response.structuredContent).toEqual(mockHunts);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining(
        parseCrudQuery({
          where: {
            start_date: { equals: new Date("2024-07-01").toISOString() },
            end_date: { equals: new Date("2024-07-31").toISOString() },
          },
        })
      )
    );
  });

  it("handles BTW API errors gracefully", async () => {
    const spy = vi.spyOn(findHuntsApi, "findHunts");

    spy.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({
        error: "Invalid date range",
      }),
    } as Response);

    const response = await client.callTypedTool("find-hunts", {});

    expect(response.content[0]).toEqual({
      type: "text",
      text: "BTW API error: Bad Request",
    });

    expect(response.structuredContent).toEqual({
      error: "Invalid date range",
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining(
        parseCrudQuery({
          where: {},
        })
      )
    );
  });
});
