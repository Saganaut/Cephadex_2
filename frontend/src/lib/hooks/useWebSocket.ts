import {
    type MutableRefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

type WebSocketMessage =
    | string
    | ArrayBuffer
    | SharedArrayBuffer
    | Blob
    | ArrayBufferView

export enum ReadyState {
    UNINSTANTIATED = -1,
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

export type ReadyStateState = Record<string, ReadyState>

export type SendMessage = (message: WebSocketMessage) => void
export type SendJsonMessage = <T = unknown>(
    jsonMessage: T,
    keep?: boolean
) => void

const DEFAULT_RECONNECT_LIMIT = 5
const RECONNECT_TIMEOUT = 5000

interface WsOptions {
    reconnect: boolean
    reconnectAttempts: number
    onOpen?: (event: WebSocketEventMap['open']) => void
    onOpenMessage?: string
    onCloseMessage?: string
    onErrorMessage?: string
    onClose?: (event: WebSocketEventMap['close']) => void
    onMessage?: (event: WebSocketEventMap['message']) => void
    onError?: (event: WebSocketEventMap['error']) => void
    retryOnError?: boolean
}

interface WsReturn {
    data: WebSocketMessage | null
    readyState: ReadyState
    sendMessage: SendMessage
    sendJsonMessage: SendJsonMessage
    socketRef: MutableRefObject<WebSocket | null>
}

const useWebSocket = (
    url: string | (() => string | null),
    options: WsOptions
): WsReturn => {
    const [data, setData] = useState<WebSocketMessage | null>(null)
    const socketRef = useRef<WebSocket | null>(null)
    const [readyState, setReadyState] = useState<ReadyState>(ReadyState.CLOSED)
    const reconnectCount = useRef<number>(0)
    const optionsCache = useRef<WsOptions>(options)
    const actualUrl = useRef<string | null>(null)
    const startRef = useRef<() => void>(() => 0)
    optionsCache.current = options

    const sendMessage: SendMessage = useCallback((message) => {
        if (socketRef.current?.readyState === ReadyState.OPEN) {
            socketRef.current.send(message)
        }
    }, [])

    const sendJsonMessage: SendJsonMessage = useCallback(
        (message) => {
            sendMessage(JSON.stringify(message))
        },
        [sendMessage]
    )
    const processedUrl = typeof url === 'string' ? url : url()
    useEffect(() => {
        if (processedUrl !== null && socketRef.current === null) {
            let expectClose = false

            const start = async (): Promise<void> => {
                actualUrl.current = processedUrl
                if (actualUrl.current != null && socketRef.current == null) {
                    socketRef.current = new WebSocket(actualUrl.current)
                    setReadyState(ReadyState.CONNECTING)

                    socketRef.current.onopen = (
                        event: WebSocketEventMap['open']
                    ) => {
                        if (optionsCache.current.onOpen != null)
                            optionsCache.current.onOpen(event)
                        if (
                            socketRef.current != null &&
                            optionsCache.current.onOpenMessage != null
                        ) {
                            sendMessage(optionsCache.current.onOpenMessage)
                        }
                        setReadyState(ReadyState.OPEN)
                        reconnectCount.current = 0
                    }
                    socketRef.current.onmessage = (
                        event: WebSocketEventMap['message']
                    ) => {
                        if (optionsCache.current.onMessage != null)
                            optionsCache.current.onMessage(event)

                        // if (socketRef.current != null)
                        //     heartbeat(socketRef.current)()
                        setData(event.data)
                    }
                    socketRef.current.onerror = (
                        event: WebSocketEventMap['error']
                    ) => {
                        if (optionsCache.current.onError != null)
                            optionsCache.current.onError(event)
                        console.error('Websocket error:', event)
                        if (optionsCache.current.reconnect) {
                            const reconnectAttempts =
                                optionsCache.current.reconnectAttempts ??
                                DEFAULT_RECONNECT_LIMIT
                            if (reconnectCount.current < reconnectAttempts) {
                                setTimeout(() => {
                                    reconnectCount.current++
                                    startRef.current()
                                }, RECONNECT_TIMEOUT)
                            } else {
                                console.warn('Max reconnection attempts made')
                                if (
                                    socketRef.current != null &&
                                    optionsCache.current.onErrorMessage != null
                                )
                                    sendMessage(
                                        optionsCache.current.onErrorMessage
                                    )
                                if (socketRef.current != null) {
                                    socketRef.current.close(
                                        1006,
                                        'Received unknown error.  Max reconnection attempts made'
                                    )
                                    socketRef.current = null
                                }
                            }
                        }
                    }
                    socketRef.current.onclose = (
                        event: WebSocketEventMap['close']
                    ) => {
                        if (optionsCache.current.onClose != null)
                            optionsCache.current.onClose(event)
                        setReadyState(ReadyState.CLOSED)
                        if (optionsCache.current.reconnect) {
                            const reconnectAttempts =
                                optionsCache.current.reconnectAttempts ??
                                DEFAULT_RECONNECT_LIMIT
                            if (reconnectCount.current < reconnectAttempts) {
                                setTimeout(() => {
                                    reconnectCount.current++
                                    startRef.current()
                                }, RECONNECT_TIMEOUT)
                            } else {
                                if (
                                    socketRef.current != null &&
                                    optionsCache.current.onCloseMessage != null
                                ) {
                                    sendMessage(
                                        optionsCache.current.onCloseMessage
                                    )
                                }

                                console.warn('Max reconnection attempts made')
                            }
                        }
                    }
                }
            }
            startRef.current = () => {
                if (!expectClose) {
                    if (socketRef.current != null) socketRef.current = null
                    void start()
                }
            }
            void start()
            return () => {
                expectClose = true
                if (socketRef.current != null) {
                    if (
                        socketRef.current != null &&
                        optionsCache.current.onCloseMessage != null
                    ) {
                        sendMessage(optionsCache.current.onCloseMessage)
                    }
                    socketRef.current.close(1000, 'Component unmounted')
                    socketRef.current = null
                }
            }
        }
    }, [sendMessage, processedUrl])

    return {
        data,
        readyState,
        sendMessage,
        sendJsonMessage,
        socketRef,
    }
}

// const heartbeat = (ws: WebSocket) => {
//     const PINGTIMEOUT = 25000
//     const TIMEOUTTIMEOUT = 60000
//     const MESSAGE = { type: 'ping' }
//     let messageAccepted = false

//     const pingTimer = setInterval(() => {
//         try {
//             ws.send(JSON.stringify(MESSAGE))
//         } catch (error) {}
//     }, PINGTIMEOUT)

//     const timeoutTimer = setInterval(() => {
//         if (!messageAccepted) {
//             ws.close(3008, 'No response from server')
//         } else {
//             messageAccepted = false
//         }
//     }, TIMEOUTTIMEOUT)

//     ws.addEventListener('close', () => {
//         clearInterval(pingTimer)
//         clearInterval(timeoutTimer)
//     })

//     return () => {
//         messageAccepted = true
//     }
// }
// const heartbeat = (ws: WebSocket) => {
//     const TIMEOUT = 60000 // 60 seconds
//     const PING_INTERVAL = 25000 // 25 seconds
//     const MESSAGE = { type: 'ping' }

//     let messageAccepted = true // Assume connection is alive

//     const heartbeatInterval = setInterval(() => {
//         if (!messageAccepted) {
//             ws.close(3008, 'No response from server')
//         } else {
//             messageAccepted = false
//             try {
//                 ws.send(JSON.stringify(MESSAGE))
//             } catch (error) {
//                 console.error('Failed to send ping:', error)
//             }
//         }
//     }, PING_INTERVAL)

//     ws.addEventListener('message', (event: MessageEvent<string>) => {
//         const data = JSON.parse(event.data)
//         if (data.type === 'pong') {
//             messageAccepted = true
//         }
//     })

//     ws.addEventListener('close', () => {
//         clearInterval(heartbeatInterval)
//     })

//     return () => {
//         messageAccepted = true
//     }
// }
export { useWebSocket }
