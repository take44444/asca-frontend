import "@testing-library/jest-dom"
import {
  ReadableStream,
  TextDecoderStream,
  TextEncoderStream,
  TransformStream,
  WritableStream,
} from "node:stream/web"
import { TextDecoder, TextEncoder } from "node:util"
import { MessagePort } from "node:worker_threads"

globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder
globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder
globalThis.ReadableStream =
  ReadableStream as unknown as typeof globalThis.ReadableStream
globalThis.WritableStream =
  WritableStream as unknown as typeof globalThis.WritableStream
globalThis.TransformStream =
  TransformStream as unknown as typeof globalThis.TransformStream
globalThis.TextDecoderStream =
  TextDecoderStream as unknown as typeof globalThis.TextDecoderStream
globalThis.TextEncoderStream =
  TextEncoderStream as unknown as typeof globalThis.TextEncoderStream
globalThis.MessagePort = MessagePort as unknown as typeof globalThis.MessagePort

if (!globalThis.structuredClone) {
  globalThis.structuredClone = <T>(value: T): T =>
    JSON.parse(JSON.stringify(value)) as T
}
