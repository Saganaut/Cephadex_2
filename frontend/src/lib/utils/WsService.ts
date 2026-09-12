import type { MutableRefObject } from 'react'

// import { GameManagerMessageTypes } from '../constants'

type MessageHandler = (message: MessageEvent) => void
type ErrorHandler = (event: Event) => void
type CloseHandler = (event: CloseEvent) => void
type OpenHandler = () => void
type disconnectHandler = () => void

class WebSocketService {
    private readonly socketRef: MutableRefObject<WebSocket | null>
    private readonly messageHandlers = new Set<MessageHandler>()
    private errorHandler: ErrorHandler | null = null
    private closeHandler: CloseHandler | null = null
    private readonly disconnectHandler: disconnectHandler | null = null
    private openHandler: OpenHandler | null = null

    constructor(socketRef: MutableRefObject<WebSocket | null>) {
        this.socketRef = socketRef
    }

    connect(url: string): void {
        this.socketRef.current = new WebSocket(url)
        this.socketRef.current.onopen = () => {
            // if (this.openHandler) {
            //   this.socketRef.current?.send(
            //     JSON.stringify(GameManagerMessageTypes.JOINED_PLAYER)
            //   );
            // }
        }
        this.socketRef.current.onmessage = (event) => {
            this.messageHandlers.forEach((handler) => {
                handler(event)
            })
        }
        this.socketRef.current.onerror = (error) => {
            if (this.errorHandler != null) {
                this.errorHandler(error)
            }
        }

        this.socketRef.current.onclose = (event) => {
            if (this.closeHandler != null) {
                this.closeHandler(event)
            }
            if (this.socketRef.current != null) {
                this.socketRef.current.close()
                this.socketRef.current = null
            }
        }
    }
    // TODO: remove all handlers
    disconnect(): void {
        if (this.disconnectHandler != null) {
            this.disconnectHandler()
        }
        if (this.socketRef.current?.readyState === 1) {
            this.socketRef?.current?.close()
            this.socketRef.current = null
        }
    }
    send(message: unknown): void {
        if (
            this.socketRef != null &&
            this.socketRef.current?.readyState === WebSocket.OPEN
        ) {
            this.socketRef.current.send(JSON.stringify(message))
        } else {
            console.error('Websocket is not connected')
        }
    }
    addMessageHandler(handler: MessageHandler): void {
        this.messageHandlers.add(handler)
    }
    removeMessageHandler(handler: MessageHandler): void {
        this.messageHandlers.delete(handler)
    }

    setErrorHandler(handler: ErrorHandler): void {
        this.errorHandler = handler
    }

    setCloseHandler(handler: CloseHandler): void {
        this.closeHandler = handler
    }

    setOpenHandler(handler: OpenHandler): void {
        this.openHandler = handler
    }
}

export const createWebSocketService = (
    socketRef: MutableRefObject<WebSocket | null>
) => new WebSocketService(socketRef)
