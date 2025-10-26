import Link from "next/link";
import React from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";

export interface StepLink {
  href: string;
  label: string;
}

export interface Step {
  title: string;
  text: React.ReactNode;
  links?: StepLink[];
  label?: string;
}

interface StepperProps {
  steps: Step[];
}

export const Stepper = ({ steps }: StepperProps) => {
  return (
    <div className="flex gap-8 flex-col my-2">
      {steps.map((step, i) => (
        <div
          key={i}
          className="relative border border-[var(--va-grey-50)] rounded-lg bg-[var(--va-card)] shadow-md hover:shadow-lg transition-shadow p-4 text-left"
        >
          <div className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center bg-[var(--va-orange)] text-white rounded-full ">
            {i + 1}
          </div>
          <h3
            className="sm:text-2xl text-xl tracking-wide text-[var(--va-orange)] sm:my-8 my-4 sm:px-8 px-4"
            style={{ fontFamily: "var(--font-machina-bold)" }}
          >
            {step.title}
          </h3>
          <p
            className="my-4 mb-6 text-md leading-7 sm:px-8 px-4 tracking-normal"
            style={{
              fontFamily: "var(--font-montreal-mono)",
            }}
          >
            {step.text}
          </p>
          {step.links && (
            <div className="w-max-full sm:mx-6 mx-2 flex flex-col justify-center">
              {step.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-full bg-[var(--va-orange)] px-2 my-2 inline-block text-[var(--background)] uppercase hover:scale-105 sm:px-4 py-2 rounded-full sm:text-md text-sm tracking-wider text-center"
                  style={{ fontFamily: "var(--font-machina-bold)" }}
                >
                  <span className="inline-flex items-center gap-2">
                    {link.label}
                    {(link.label === "Raporttiportaali" ||
                      link.label === "Oma portaali" ||
                      link.label === "Mobility Online" ||
                      link.label === "OLS-kielitesti" ||
                      link.label === "Muuttoilmoitus" ||
                      link.label === "Matkustusilmoitus") && (
                      <FiExternalLink size={20} className="pb-1 font-bold" />
                    )}
                    {(link.label === "Opintosuoritusote" ||
                      link.label === "Kielitodistus pohja" ||
                      link.label === "Säännöt ja periaatteet" ||
                      link.label === "Learning agreement" ||
                      link.label === "Vakuutustodistus") && (
                      <FaRegFilePdf size={16} />
                    )}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
