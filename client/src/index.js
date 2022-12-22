import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { ErrorBoundary } from "react-error-boundary"
import fallbackPage from "./Components/ErrorBoundary/fallbackPage"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
   <React.StrictMode>
      <ErrorBoundary FallbackComponent={fallbackPage} onReset={() => {}}>
         <App />
      </ErrorBoundary>
   </React.StrictMode>
)
