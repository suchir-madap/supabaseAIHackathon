import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useState, useEffect } from "react"

import { CountButton } from "~features/count-button"

export const config: PlasmoCSConfig = {
  matches: ["*://*/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === "FROM_BACKGROUND") {
        setMessage(request.payload)
      }
      // Optional: Send response back to background
      sendResponse({ status: "Message received!" })
    })

    // Cleanup listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(() => {})
    }
  }, [])

  return (
    <div className="z-50 fixed top-8 right-8 flex items-center justify-center">
      <CountButton />
    </div>
  )
}

export default PlasmoOverlay