// Type augmentation to resolve allowedHosts compatibility issue
// The protected server/vite.ts uses boolean value which conflicts with Vite's strict types
import 'vite';
declare module 'vite' {
  interface ServerOptions {
    allowedHosts?: true | string[] | boolean;
  }
}