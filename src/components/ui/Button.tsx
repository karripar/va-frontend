"use client";
import React from "react";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
}

export const Button = ({ href, children }: CTAButtonProps) => {
  return (
    <a
      href={href}
      className="px-6 py-2 rounded-full bg-[var(--va-dark-grey)] gap-2 flex w-full text-white hover:scale-105 sm:text-md text-sm tracking-wider uppercase items-center justify-center"
      style={{ fontFamily: "var(--font-machina-bold)" }}
    >
      {children}
    </a>
  );
};
