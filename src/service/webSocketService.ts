// src/stompService.ts
import { Client, IMessage, StompSubscription, StompHeaders } from "@stomp/stompjs";

type CallbackFunction = (message: unknown) => void;

class StompService {
  private client: Client | null;
  private callbacks: { [destination: string]: CallbackFunction };
  private isConnect: boolean;
  private subscriptions: { [destination: string]: StompSubscription };

  constructor() {
    this.client = null;
    this.callbacks = {};
    this.isConnect = false;
    this.subscriptions = {};
  }

  connect(url: string, onConnectCallback?: () => void): void {
    const socketUrl = `${url}`;

    this.client = new Client({
      brokerURL: socketUrl,
      debug: (str: string) => {
        console.log(str);
      },
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Conectado a WebSocket");
        this.isConnect = true;
        this.processSubscriptions();

        if (onConnectCallback) {
          onConnectCallback();
        }
      },

      onWebSocketClose: (event: CloseEvent) => {
        console.log("WebSocket cerrado:");
        console.log(event);
      },

      onWebSocketError: (event: Event) => {
        console.error("WebSocket error:");
        console.error(event);
      },

      onDisconnect: () => {
        console.log("Desconectado de WebSocket");
        this.isConnect = false;
      },

      onStompError: (frame) => {
        console.error("Error en STOMP: " + frame.headers["message"]);
      },
    });

    // Establecer las cabeceras STOMP personalizadas
    this.client.connectHeaders = {
      Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
    };

    this.client.activate();
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
    }
  }

  subscribe(destination: string, callback: CallbackFunction): void {
    if (!this.client) {
      console.error("No se puede suscribir. El cliente no está inicializado.");
      return;
    }

    const headers: StompHeaders = {
      Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
    };

    const subscription = this.client.subscribe(
      destination,
      (msg: IMessage) => {
        const message = JSON.parse(msg.body);
        callback(message);
      },
      headers
    );

    this.subscriptions[destination] = subscription;
  }

  unsubscribe(destination: string): void {
    if (this.subscriptions[destination]) {
      this.subscriptions[destination].unsubscribe();
      delete this.subscriptions[destination];
      delete this.callbacks[destination];
    }
  }

  private processSubscriptions(): void {
    Object.keys(this.callbacks).forEach((destination) => {
      if (!this.subscriptions[destination] && this.client) {
        const callback = this.callbacks[destination];
        const subscription = this.client.subscribe(
          destination,
          (msg: IMessage) => {
            const message = JSON.parse(msg.body);
            callback(message);
          }
        );
        this.subscriptions[destination] = subscription;
      }
    });
  }

  publish(destination: string, message: unknown): void {
    if (this.isConnect && this.client) {
      console.log(`Enviando mensaje a ${destination}:`, message);
      this.client.publish({
        destination,
        body: JSON.stringify(message),
      });
    } else {
      console.error(
        "No se puede enviar el mensaje. No está conectado al servidor WebSocket."
      );
    }
  }
}

export default StompService;
