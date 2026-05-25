"use client";

import { useEffect } from "react";
import { verifyServerSession } from "@/actions/auth";

export function SessionWatcher() {
  useEffect(() => {
    // This calls the server action which checks the session ID in the Node.js runtime.
    // If there's a mismatch (NPM server was restarted), it will automatically log out and redirect to /login.
    verifyServerSession().catch(console.error);
  }, []);

  return null;
}
