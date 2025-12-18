"use client";

import { useEnokiFlow } from "@mysten/enoki/react";
import { useEffect } from "react";

export function AuthHandler() {
  const flow = useEnokiFlow();

  useEffect(() => {
    // Check if the URL has the OAuth callback token (in hash or query params)
    const hash = window.location.hash;
    const hasIdToken = hash.includes("id_token");

    if (hasIdToken) {
      console.log("Token detected! Handling callback...");

      // Process the token to create the zkLogin session
      flow
        .handleAuthCallback()
        .then(() => {
          console.log("Login Success!");
          // Clean the URL (remove the ugly token)
          window.history.replaceState(null, "", window.location.pathname);
        })
        .catch((err) => {
          console.error("Login Failed:", err);
          // If the error is about missing sign-in flow, clear the hash anyway
          if (err.message?.includes("sign-in flow")) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        });
    }
  }, []); // Remove flow from deps to only run once on mount

  return null; // This component is invisible
}
