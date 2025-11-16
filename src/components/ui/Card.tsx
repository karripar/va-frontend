import React, { useState, useEffect, useContext } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FiExternalLink, FiEdit2, FiX, FiCheck, FiFile } from "react-icons/fi";
import { AuthContext } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  useInstructionVisibility,
  useToggleInstructionVisibility,
  useInstructionLinks,
  useUpdateInstructionLink,
} from "@/hooks/instructionHooks";
import { useFileUpload } from "@/hooks/useFileUpload";

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

  // fetch steps visibility
  const { visibility, loading } = useInstructionVisibility();
  const { toggleVisibility } = useToggleInstructionVisibility();

  // fetch instruction links
  const { links } = useInstructionLinks();
  const { updateLink, loading: updating } = useUpdateInstructionLink();
  const { language } = useLanguage();

  const getLabel = (
    language: string,
    fi?: string,
    en?: string,
    fallback?: string
  ) => {
    if (language === "en") return en ?? fallback ?? fi ?? "";
    return fi ?? fallback ?? en ?? "";
  };

  // Admin UI translations
  const adminTranslations = {
    fi: {
      editLink: "Muokkaa linkkiä",
      oldUrl: "Vanha osoite:",
      newUrl: "Lisää uusi osoite tai lataa tiedosto:",
      uploadFile: "Lataa tiedosto",
      acceptedTypes: "Hyväksytyt tiedostotyypit: PDF, PPT, PPTX, DOC, DOCX",
      selectFile: "Valitse tiedosto",
      selected: "Valittu:",
      uploading: "Ladataan...",
      uploadAndUpdate: "Lataa & päivitä",
      update: "Päivitä",
      cancel: "Peruuta",
      hideStep: "Piilota vaihe",
      showStep: "Näytä vaihe",
    },
    en: {
      editLink: "Edit link",
      oldUrl: "Current URL:",
      newUrl: "Enter new URL or upload file:",
      uploadFile: "Upload file",
      acceptedTypes: "Accepted file types: PDF, PPT, PPTX, DOC, DOCX",
      selectFile: "Select file",
      selected: "Selected:",
      uploading: "Uploading...",
      uploadAndUpdate: "Upload & update",
      update: "Update",
      cancel: "Cancel",
      hideStep: "Hide step",
      showStep: "Show step",
    },
  };

  const t =
    adminTranslations[language as keyof typeof adminTranslations] ||
    adminTranslations.fi;

  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    steps.map(() => true)
  );

  // check what link is being edited
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [editingHref, setEditingHref] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // set the visible states
  useEffect(() => {
    if (!loading && visibility.length > 0) {
      setVisibleSteps(visibility);
    }
  }, [visibility, loading]);

  // hide/unhide a step as a admin
  const handleToggleVisibility = async (index: number) => {
    if (!isAdmin) {
      return;
    }

    const newVisibility = await toggleVisibility(index);
    if (newVisibility !== null) {
      setVisibleSteps((prev) => {
        const updated = [...prev];
        updated[index] = newVisibility;
        return updated;
      });
    }
  };

  // edit a link (only an admin)
  const handleStartEditLink = (
    stepIndex: number,
    label: string,
    currentHref: string
  ) => {
    const key = `${stepIndex}-${label}`;
    setEditingLink(key);
    setEditingHref(currentHref);
  };

  // cancel editing
  const handleCancelEdit = () => {
    setEditingLink(null);
    setEditingHref("");
    setSelectedFile(null);
  };

  // save edited link
  const handleSaveLink = async (
    stepIndex: number,
    label: string,
    linkId?: string
  ) => {
    if (!linkId) return;

    const result = await updateLink(linkId, { href: editingHref });
    if (result) {
      setEditingLink(null);
      setEditingHref("");
    }
  };

  // upload file and save the returned URL as the link
  const { uploadFile, uploading } = useFileUpload();

  const handleUploadAndSave = async (linkId?: string) => {
    if (!linkId || !selectedFile) return;

    const uploadResponse = await uploadFile(selectedFile);
    if (uploadResponse?.url) {
      // isFile=true since it is an uploaded document
      const result = await updateLink(linkId, {
        href: uploadResponse.url,
        isFile: true,
        isExternal: false, // uploaded files are on upload-server/uploads
      });
      if (result) {
        setEditingLink(null);
        setEditingHref("");
      }
    }
    setSelectedFile(null);
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
            className={`relative border border-[var(--va-grey-50)] rounded-lg bg-[var(--va-card)] shadow-md hover:shadow-lg transition-shadow p-2 text-left pb-4 ${
              !visibleSteps[i] ? "opacity-50" : ""
            }`}
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center bg-[var(--va-orange)] text-white rounded-full ">
              {i + 1}
            </div>
            <div className="flex gap-2">
              {/*if admin toggle visibility of a step*/}
              {isAdmin && (
                <button
                  name="Toggle Step Visibility"
                  onClick={() => handleToggleVisibility(i)}
                  className="hover:text-[var(--va-orange)] transition-colors cursor-pointer flex justify-end w-full"
                  aria-label={visibleSteps[i] ? t.hideStep : t.showStep}
                  title={visibleSteps[i] ? t.hideStep : t.showStep}
                >
                  {visibleSteps[i] ? (
                    <FaRegEye size={24} />
                  ) : (
                    <FaRegEyeSlash size={24} />
                  )}
                </button>
              )}
            </div>
            {/* display the visible steps */}
            {visibleSteps[i] && (
              <>
                <h3
                  className="sm:text-2xl text-xl tracking-wide text-[var(--va-orange)] sm:my-8 my-4 sm:px-8 px-4"
                  style={{ fontFamily: "var(--font-machina-bold)" }}
                >
                  {step.title}
                </h3>
                <div
                  className="my-4 mb-6 text-md leading-7 sm:px-8 px-4 tracking-normal"
                  style={{
                    fontFamily: "var(--font-montreal-mono)",
                  }}
                >
                  {step.text}
                </div>
                {/* display the links */}
                {(() => {
                  // get all links for steps from backend
                  const stepLinks = links.filter((l) => l && l.stepIndex === i);

                  if (stepLinks.length === 0) return null;

                  return (
                    <div className="w-max-full sm:mx-6 mx-1 flex flex-col justify-center">
                      {stepLinks.map((dbLink) => {
                        const href = dbLink.href;
                        const isExternal = dbLink.isExternal;
                        const isFile = dbLink.isFile;
                        // get labelFi/labelEn from backend, fallback to href if both are missing
                        const displayLabel =
                          getLabel(language, dbLink.labelFi, dbLink.labelEn) ||
                          dbLink.labelFi ||
                          dbLink.labelEn ||
                          href;

                        const linkKey = `${i}-${displayLabel}`;
                        const isEditing = editingLink === linkKey;

                        return (
                          <div
                            key={`${i}-${href}-${displayLabel}`}
                            className="flex flex-col"
                          >
                            {!isEditing && (
                              <div className="flex items-center sm:gap-2 gap-1">
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-[var(--va-orange)] px-2 mb-2 mt-1 inline-block text-[var(--background)] uppercase hover:scale-102 sm:px-4 py-2 rounded-full sm:text-md text-sm tracking-wider text-center"
                                  style={{
                                    fontFamily: "var(--font-machina-bold)",
                                  }}
                                >
                                  <span className="inline-flex items-center gap-2 px-2 break-words">
                                    {displayLabel}
                                    <div className="flex flex-row justify-between gap-1">
                                      {isFile && <FiFile size={16} />}
                                      {isExternal && (
                                        <FiExternalLink
                                          size={20}
                                          className="pb-1"
                                        />
                                      )}
                                    </div>
                                  </span>
                                </a>
                                {isAdmin && (
                                  <button
                                    onClick={() =>
                                      handleStartEditLink(i, displayLabel, href)
                                    }
                                    className="p-2 text-[var(--va-orange)] hover:bg-[var(--va-grey-50)] rounded-md transition-colors"
                                    title={t.editLink}
                                  >
                                    <FiEdit2 size={20} />
                                  </button>
                                )}
                              </div>
                            )}

                            {/* edit links */}
                            {isAdmin && isEditing && (
                              <div className="p-4 sm:p-8 rounded-lg space-y-3 my-3">
                                <label
                                  style={{
                                    fontFamily: "var(--font-machina-bold)",
                                  }}
                                  className="text-lg text-[var(--va-orange)] block"
                                >
                                  {displayLabel}
                                </label>
                                <div>
                                  <label className="text-sm text-[var(--va-dark-grey)] my-4 block">
                                    {t.oldUrl}
                                  </label>
                                  <p className="text-sm text-[var(--typography)] bg-white p-2 rounded border border-[var(--va-border)] break-all">
                                    {href}
                                  </p>
                                </div>

                                <div>
                                  <label className="text-sm text-[var(--va-dark-grey)] block my-4 pt-2">
                                    {t.newUrl}
                                  </label>
                                  <input
                                    type="text"
                                    onChange={(e) =>
                                      setEditingHref(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-[var(--va-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--va-orange)] bg-[var(--background)]"
                                    placeholder="https://..."
                                  />
                                </div>

                                {/* upload a document */}
                                <div className="space-y-4 mt-4">
                                  <div className="bg-white p-4 rounded border border-dashed border-[var(--va-orange-50)] hover:border-[var(--va-orange)] transition-colors my-6">
                                    <div className="flex flex-col items-center mx-2">
                                      <FiFile className="h-12 w-12 text-[var(--va-orange)] my-2" />
                                      <h4 className="my-4 text-base font-bold text-[var(--va-dark-grey)]">
                                        {t.uploadFile}
                                      </h4>
                                      <p className="my-2 text-sm text-[var(--typography)] px-4">
                                        {t.acceptedTypes}
                                      </p>
                                      <div className="my-4 w-full sm:px-6">
                                        <input
                                          type="file"
                                          accept=".pdf,.ppt,.pptx,.doc,.docx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                          onChange={(e) => {
                                            const f =
                                              e.target.files &&
                                              e.target.files[0];
                                            setSelectedFile(f || null);
                                          }}
                                          className="hidden"
                                          id={`file-upload-${i}-${displayLabel}`}
                                        />
                                        <label
                                          htmlFor={`file-upload-${i}-${displayLabel}`}
                                          className="flex items-center justify-center w-full py-2 bg-[var(--va-grey-50)] text-[var(--typography)] border border-[var(--va-border)] text-sm hover:bg-[var(--va-orange)] hover:text-white transition-colors cursor-pointer rounded-full text-center"
                                        >
                                          {t.selectFile}
                                        </label>
                                      </div>
                                      {selectedFile && (
                                        <p className="my-2 text-sm text-[var(--va-dark-grey)] px-4">
                                          {t.selected} {selectedFile.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* buttons for updating and canceling */}
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                      onClick={() =>
                                        selectedFile
                                          ? handleUploadAndSave(dbLink?._id)
                                          : handleSaveLink(
                                              i,
                                              displayLabel,
                                              dbLink?._id
                                            )
                                      }
                                      disabled={updating || uploading}
                                      className="flex-1 px-4 py-2 bg-[var(--va-orange)] text-white hover:opacity-90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 rounded-full"
                                    >
                                      <FiCheck size={16} />
                                      {selectedFile
                                        ? uploading
                                          ? t.uploading
                                          : t.uploadAndUpdate
                                        : t.update}
                                    </button>

                                    <button
                                      onClick={handleCancelEdit}
                                      className="flex-1 px-4 py-2 bg-[var(--va-dark-grey)] text-white  hover:opacity-90 transition-colors flex items-center justify-center gap-2 rounded-full"
                                    >
                                      <FiX size={16} />
                                      {t.cancel}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
