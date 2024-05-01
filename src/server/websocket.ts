import { ServerWebSocket } from "bun";

export type RestSocketHandler<DataType> = (
    ws: ServerWebSocket<DataType>,
    message: string | Buffer,
) => void | Promise<void>

type OpenHandler<DataType> = (
    ws: ServerWebSocket<DataType>,
) => void | Promise<void>;

type DrainHandler<DataType> = (
    ws: ServerWebSocket<DataType>
) => void | Promise<void>;

type CloseHandler<DataType> = (
    ws: ServerWebSocket<DataType>,
      code: number,
      reason: string,
) => void | Promise<void>;

export interface ExtraHandler<DataType> {
    open?: OpenHandler<DataType> | undefined;
    close?: CloseHandler<DataType> | undefined;
    drain?: DrainHandler<DataType> | undefined;
}