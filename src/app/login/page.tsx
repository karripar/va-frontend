"use client";

import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { handleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    if (!credentialResponse.credential) {
      console.error("No credential received");
      setError("No credential received from Google");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use auth service to verify token
      const authResponse = await authService.verifyGoogleToken(
        credentialResponse.credential
      );

      // Store token and login user
      authService.storeToken(authResponse.token);
      handleLogin(authResponse.user);

      if (process.env.NODE_ENV === "development") {
        console.log("Authentication successful:", authResponse);
      }

      router.push("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      console.error("Authentication error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google authentication failed");
    setError("Google authentication failed");
  };

  return (
    <div className="mt-8 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-lg p-6 bg-[var(--va-grey-50)]">
        <div className="text-center">
          <Image
            className="mx-auto my-4"
            alt="Logo"
            src="/images/liito-oravat/Toteutunut merkki.png"
            width={140}
            height={140}
          />
          <h1
            className="md:text-2xl text-xl tracking-wider text-[var(--typography)] my-6"
            style={{ fontFamily: "var(--font-machina-bold)" }}
          >
            KIRJAUDU SISÄÄN
          </h1>
          <p
            className="md:text-lg text-md text-[var(--typography)]"
            style={{ fontFamily: "var(--font-montreal-mono)" }}
          >
            Kirjaudu sisään Metropolia tunnuksilla päästäksesi käyttämään
            sovellusta
          </p>
        </div>

        <div className="bg-[var(--background)] p-8 m-4 my-6 rounded-lg shadow-md border border-[var(--va-border)]">
          <div className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm text-center p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>

            {loading && (
              <div className="text-center text-sm text-[var(--typography)]">
                Kirjaudutaan sisään...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
