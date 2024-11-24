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

  private getFormattedToken(): string {
    const token = sessionStorage.getItem("token") || "";
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
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
      Authorization: this.getFormattedToken(),
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
      Authorization: this.getFormattedToken(),
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

  publish(destination: string, message: unknown): void {
    if (this.isConnect && this.client) {
      console.log(`Enviando mensaje a ${destination}:`, message);

      const headers: StompHeaders = {
        Authorization: this.getFormattedToken(),
      };

      this.client.publish({
        destination,
        body: JSON.stringify(message),
        headers,
      });
    } else {
      console.error(
        "No se puede enviar el mensaje. No está conectado al servidor WebSocket."
      );
    }
  }
}

export default StompService;
