import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { FaRegEye, FaRegEyeSlash, FaRegFilePdf } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { AuthContext } from "@/context/AuthContext";

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
  // check if user is admin to hide steps
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const isAdmin = user?.user_level_id === 2; // 2 = Admin

  // set steps to visible by default
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    steps.map(() => true)
  );

  useEffect(() => {
    const saved = localStorage.getItem("instructions-step-visibility-global");

    if (saved) {
      try {
        const visibility = JSON.parse(saved);
        setVisibleSteps(visibility);
      } catch (e) {
        console.error("Failed to parse step visibility:", e);
        setVisibleSteps(steps.map(() => true));
      }
    } else {
      setVisibleSteps(steps.map(() => true));
    }
  }, []);

  // hide/unhide a step as a admin
  const toggleStepVisibility = (index: number) => {
    if (!isAdmin) {
      return;
    }

    setVisibleSteps((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];

      localStorage.setItem(
        "instructions-step-visibility-global",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  return (
    <div className="flex gap-8 flex-col my-2">
      {/* render only visible steps */}
      {steps.map((step, i) => {
        const shouldRender = isAdmin ? true : visibleSteps[i];

        if (!shouldRender) {
          return null;
        }

        return (
          <div
            key={i}
            className={`relative border border-[var(--va-grey-50)] rounded-lg bg-[var(--va-card)] shadow-md hover:shadow-lg transition-shadow p-4 text-left ${
              !visibleSteps[i] ? "opacity-50" : ""
            }`}
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center bg-[var(--va-orange)] text-white rounded-full ">
              {i + 1}
            </div>
            <div className="flex gap-2">
              {/*if admin toggle visibility*/}
              {isAdmin && (
                <button
                  onClick={() => toggleStepVisibility(i)}
                  className="hover:text-[var(--va-orange)] transition-colors cursor-pointer flex justify-end w-full"
                  aria-label={visibleSteps[i] ? "Hide step" : "Show step"}
                  title={visibleSteps[i] ? "Hide step" : "Show step"}
                >
                  {visibleSteps[i] ? (
                    <FaRegEye size={24} />
                  ) : (
                    <FaRegEyeSlash size={24} />
                  )}
                </button>
              )}
            </div>
            {visibleSteps[i] && (
              <>
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
                            <FiExternalLink
                              size={20}
                              className="pb-1 font-bold"
                            />
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
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
