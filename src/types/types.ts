import { Response } from "express";

export interface SSEClient {
    id: string;
    res: Response;
}
