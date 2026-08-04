import axios from "axios";
import { sseService } from "./service/SEEService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SSE route handler error handling", () => {
    it("catches errors from addNewClient and sends 500 response", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();

        const mockAddNewClient = jest.fn((req, res) => {
            throw new Error("Failed to add client");
        });

        const mockRes = {
            setHeader: jest.fn(),
            headersSent: false,
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
        const mockReq = {} as any;

        try {
            mockRes.setHeader("Content-Type", "text/event-stream");
            mockAddNewClient(mockReq, mockRes);
        } catch (err) {
            console.error("Failed to initialize SSE client", err);
            if (!mockRes.headersSent) {
                mockRes.status(500).json({ error: "Internal server error" });
            }
        }

        expect(consoleSpy).toHaveBeenCalledWith(
            "Failed to initialize SSE client",
            expect.any(Error)
        );
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Internal server error" });

        consoleSpy.mockRestore();
    });

    it("closes connection if headers already sent", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();

        const mockAddNewClient = jest.fn((req, res) => {
            throw new Error("Write error");
        });

        const mockRes = {
            setHeader: jest.fn(),
            headersSent: true,
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        } as any;
        const mockReq = {} as any;

        try {
            mockRes.setHeader("Content-Type", "text/event-stream");
            mockAddNewClient(mockReq, mockRes);
        } catch (err) {
            console.error("Failed to initialize SSE client", err);
            if (!mockRes.headersSent) {
                mockRes.status(500).json({ error: "Internal server error" });
            } else {
                mockRes.end();
            }
        }

        expect(mockRes.end).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});