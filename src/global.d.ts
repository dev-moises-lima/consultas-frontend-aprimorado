import Echo from "laravel-echo"
export {}

declare global {
    interface Window {
        Echo: Echo
    }
}
