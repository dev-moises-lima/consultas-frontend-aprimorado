// global.d.ts (ou dentro de um arquivo .ts, se preferir)
import Echo from "laravel-echo";
export {};

declare global {
    interface Window {
        Echo: Echo;
    }
}
