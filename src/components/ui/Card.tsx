import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FiExternalLink, FiEdit2, FiFile, FiEdit } from "react-icons/fi";
import { AuthContext } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  useInstructionVisibility,
  useToggleInstructionVisibility,
  useInstructionLinks,
  useUpdateInstructionLink,
  useInstructionSteps,
  useUpdateInstructionStep,
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
  const isAdmin = user?.user_level_id === 2 || user?.user_level_id === 3; // 2 = Admin, 3 = superadmin

  // fetch instruction steps
  const { stepsMap } = useInstructionSteps();

  // fetch steps visibility
  const { visibility, loading } = useInstructionVisibility();
  const { toggleVisibility } = useToggleInstructionVisibility();
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    steps.map(() => true)
  );
  const { updateStep } = useUpdateInstructionStep();

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

  const translations: Record<string, Record<string, string>> = {
    fi: {
      editLink: "Muokkaa linkkiä",
      oldUrl: "Nykyinen osoite:",
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
      updateContent: "Päivitä sisältöä",
      editStepTitle: "Muokkaa vaiheen sisältöä",
      editStepDisclaimer:
        "Päivitäthän ohjeet sekä suomeksi että englanniksi. Tyhjäksi jätetyt kentät eivät päivity.",
      currentTitleFi: "Nykyinen otsikko (FI):",
      currentTitleEn: "Nykyinen otsikko (EN):",
      currentTextFi: "Nykyinen teksti (FI):",
      currentTextEn: "Nykyinen teksti (EN):",
      linkUpdated: "Linkki päivitetty onnistuneesti",
      linkUpdateFailed: "Linkin päivitys epäonnistui",
      stepUpdated: "Vaihe päivitetty onnistuneesti",
      stepUpdateFailed: "Vaiheen päivitys epäonnistui",
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
      updateContent: "Update content",
      editStepTitle: "Edit step content",
      editStepDisclaimer:
        "Please update instructions in both Finnish and English. Empty fields will not be updated.",
      currentTitleFi: "Current title (FI):",
      currentTitleEn: "Current title (EN):",
      currentTextFi: "Current text (FI):",
      currentTextEn: "Current text (EN):",
      linkUpdated: "Link updated",
      linkUpdateFailed: "Failed to update link",
      stepUpdated: "Step updated successfully",
      stepUpdateFailed: "Failed to update step",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.fi;

  // check what link is being edited
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [editingHref, setEditingHref] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // step edit state (admin only)
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [newTitleFi, setNewTitleFi] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newTextFi, setNewTextFi] = useState("");
  const [newTextEn, setNewTextEn] = useState("");
  // client-side limits
  const TITLE_MAX = 150;
  const TEXT_MAX = 4000;
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    window.setTimeout(() => setNotification(null), 4000);
  };

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

  // cancel link editing
  const handleCancelEdit = () => {
    clearLinkEditingFields();
  };

  // clear step editing fields and close the step editor
  const clearStepEditingFields = (close = true) => {
    if (close) setEditingStepIndex(null);
    setNewTitleFi("");
    setNewTitleEn("");
    setNewTextFi("");
    setNewTextEn("");
  };

  // clear link editing fields
  const clearLinkEditingFields = () => {
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

    // basic client-side validation
    const lower = editingHref.trim().toLowerCase();
    if (!editingHref.trim()) {
      showNotification("error", t.linkUpdateFailed || "Invalid href");
      return;
    }
    if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
      showNotification("error", t.linkUpdateFailed || "Invalid href");
      return;
    }

    try {
      const result = await updateLink(linkId, { href: editingHref.trim() });
      if (result) {
        clearLinkEditingFields();
        showNotification("success", t.linkUpdated);
      } else {
        showNotification("error", t.linkUpdateFailed);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const text = msg ? `${t.linkUpdateFailed}: ${msg}` : t.linkUpdateFailed;
      showNotification("error", text);
    }
  };

  // upload file and save the returned URL as the link
  const { uploadFile, uploading } = useFileUpload();

  const handleUploadAndSave = async (linkId?: string) => {
    if (!linkId || !selectedFile) return;
    try {
      const uploadResponse = await uploadFile(selectedFile);
      if (uploadResponse?.url) {
        // isFile=true since it is an uploaded document
        const result = await updateLink(linkId, {
          href: uploadResponse.url,
          isFile: true,
          isExternal: false, // uploaded files are on upload-server/uploads
        });
        if (result) {
          clearLinkEditingFields();
          showNotification("success", t.linkUpdated);
          return;
        }
      }
      showNotification("error", t.linkUpdateFailed);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const text = msg ? `${t.linkUpdateFailed}: ${msg}` : t.linkUpdateFailed;
      showNotification("error", text);
    }
  };

  return (
    <div className="w-full relative">
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-1/2 top-80 transform -translate-x-1/2 z-100 px-4 py-2 rounded-md text-md shadow-sm max-w-xl w-auto text-center ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-100"
              : "bg-red-50 text-red-800 border border-red-100"
          }`}
        >
          {notification.text}
        </div>
      )}

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
              <div className="flex gap-3 items-center justify-end px-1 py-1">
                {/* if admin toggle visibility of a step */}
                {isAdmin && (
                  <>
                    {/* single content edit button per step */}
                    <button
                      onClick={() => {
                        setEditingStepIndex(i === editingStepIndex ? null : i);
                        clearStepEditingFields(false);
                      }}
                      className="hover:text-[var(--va-orange)] transition-colors cursor-pointer"
                      aria-label={t.updateContent}
                      title={t.updateContent}
                      role="button"
                    >
                      <FiEdit size={22} />
                    </button>
                    <button
                      name="Toggle Step Visibility"
                      onClick={() => handleToggleVisibility(i)}
                      className="hover:text-[var(--va-orange)] transition-colors cursor-pointer"
                      aria-label={visibleSteps[i] ? t.hideStep : t.showStep}
                      title={visibleSteps[i] ? t.hideStep : t.showStep}
                      role="button"
                    >
                      {visibleSteps[i] ? (
                        <FaRegEye size={24} />
                      ) : (
                        <FaRegEyeSlash size={24} />
                      )}
                    </button>
                  </>
                )}
              </div>
              {/* display the visible steps */}
              {visibleSteps[i] && (
                <>
                  <h3
                    className="sm:text-2xl text-xl tracking-wide text-[var(--va-orange)] sm:my-8 my-4 sm:px-8 px-4  break-words"
                    style={{ fontFamily: "var(--font-machina-bold)" }}
                  >
                    {step.title}
                  </h3>
                  <div
                    className="my-4 mb-6 text-md leading-7 sm:px-8 px-4 tracking-normal break-words"
                    style={{
                      fontFamily: "var(--font-montreal-mono)",
                    }}
                  >
                    {step.text}
                  </div>
                  {/* form for admins to edit instruction step content */}
                  {isAdmin && editingStepIndex === i && (
                    <div className="sm:mx-6 mx-2 my-6 p-4 border border-[var(--va-border)] rounded-lg">
                      <label
                        className="text-lg text-[var(--va-orange)]"
                        style={{
                          fontFamily: "var(--font-machina-bold)",
                        }}
                      >
                        {t.editStepTitle}
                      </label>
                      <p className="text-sm text-[var(--typography)] my-6">
                        {t.editStepDisclaimer}
                      </p>

                      <div className="mb-6">
                        <div className="text-sm text-[var(--typography)] my-4  break-words">
                          {t.currentTitleFi}{" "}
                          <b>{stepsMap[i]?.titleFi || "-"}</b>
                        </div>
                        <input
                          value={newTitleFi}
                          onChange={(e) =>
                            setNewTitleFi(e.target.value.slice(0, TITLE_MAX))
                          }
                          placeholder="Uusi otsikko (FI)"
                          maxLength={TITLE_MAX}
                          aria-describedby={`titleFi-help-${i}`}
                          className="w-full px-3 py-2 border border-[var(--va-border)] rounded-md text-sm bg-[var(--background)]"
                        />
                        <div
                          id={`titleFi-help-${i}`}
                          className="text-xs text-[var(--typography)] mt-1 justify-end flex px-1"
                        >
                          {newTitleFi.length}/{TITLE_MAX}
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-sm text-[var(--typography)] my-4  break-words">
                          {t.currentTitleEn}{" "}
                          <b>{stepsMap[i]?.titleEn || "-"}</b>
                        </div>
                        <input
                          value={newTitleEn}
                          onChange={(e) =>
                            setNewTitleEn(e.target.value.slice(0, TITLE_MAX))
                          }
                          placeholder="Uusi otsikko (EN)"
                          maxLength={TITLE_MAX}
                          aria-describedby={`titleEn-help-${i}`}
                          className="w-full px-3 py-2 border border-[var(--va-border)] rounded-md text-sm bg-[var(--background)]"
                        />
                        <div
                          id={`titleEn-help-${i}`}
                          className="text-xs text-[var(--typography)] mt-1 justify-end flex px-1"
                        >
                          {newTitleEn.length}/{TITLE_MAX}
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-sm text-[var(--typography)]">
                          {t.currentTextFi}
                        </div>
                        <div className="mb-2 text-sm py-4 break-words">
                          {stepsMap[i]?.textFi || "-"}
                        </div>
                        <textarea
                          value={newTextFi}
                          onChange={(e) =>
                            setNewTextFi(e.target.value.slice(0, TEXT_MAX))
                          }
                          placeholder="Uusi teksti (FI)"
                          maxLength={TEXT_MAX}
                          aria-describedby={`textFi-help-${i}`}
                          className="w-full px-3 py-2 border border-[var(--va-border)] rounded-md text-sm bg-[var(--background)] h-30"
                        />
                        <div
                          id={`textFi-help-${i}`}
                          className="text-xs text-[var(--typography)] mt-1 justify-end flex px-1"
                        >
                          {newTextFi.length}/{TEXT_MAX}
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-sm text-[var(--typography)]">
                          {t.currentTextEn}
                        </div>
                        <div className="mb-2 text-sm py-4 break-words">
                          {stepsMap[i]?.textEn || "-"}
                        </div>
                        <textarea
                          value={newTextEn}
                          onChange={(e) =>
                            setNewTextEn(e.target.value.slice(0, TEXT_MAX))
                          }
                          placeholder="Uusi teksti (EN)"
                          maxLength={TEXT_MAX}
                          aria-describedby={`textEn-help-${i}`}
                          className="w-full px-3 py-2 border border-[var(--va-border)] rounded-md text-sm bg-[var(--background)] h-30"
                        />
                        <div
                          id={`textEn-help-${i}`}
                          className="text-xs text-[var(--typography)] mt-1 justify-end flex px-1"
                        >
                          {newTextEn.length}/{TEXT_MAX}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-3">
                        <button
                          role="button"
                          onClick={async () => {
                            const updates: Record<string, string> = {};
                            if (newTitleFi.trim())
                              updates.titleFi = newTitleFi.trim();
                            if (newTitleEn.trim())
                              updates.titleEn = newTitleEn.trim();
                            if (newTextFi.trim())
                              updates.textFi = newTextFi.trim();
                            if (newTextEn.trim())
                              updates.textEn = newTextEn.trim();
                            if (Object.keys(updates).length === 0) {
                              clearStepEditingFields();
                              return;
                            }
                            try {
                              const result = await updateStep(i, updates);
                              if (result) {
                                showNotification("success", t.stepUpdated);
                              } else {
                                showNotification("error", t.stepUpdateFailed);
                              }
                            } catch (err: unknown) {
                              const msg =
                                err instanceof Error
                                  ? err.message
                                  : String(err);
                              const text = msg
                                ? `${t.stepUpdateFailed}: ${msg}`
                                : t.stepUpdateFailed;
                              showNotification("error", text);
                            }
                            clearStepEditingFields();
                          }}
                          className="px-4 py-2 bg-[var(--va-orange)] text-white rounded-md"
                        >
                          {t.update}
                        </button>
                        <button
                          role="button"
                          onClick={() => clearStepEditingFields()}
                          className="px-4 py-2 bg-[var(--va-grey-50)] rounded-md border border-[var(--va-border)]"
                        >
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* display the links */}
                  {(() => {
                    // get all links for steps from backend
                    const stepLinks = links.filter(
                      (l) => l && l.stepIndex === i
                    );

                    if (stepLinks.length === 0) return null;

                    return (
                      <div className="w-max-full sm:mx-6 mx-1 flex flex-col justify-center">
                        {stepLinks.map((dbLink) => {
                          const href = dbLink.href;
                          const isExternal = dbLink.isExternal;
                          const isFile = dbLink.isFile;
                          // get labelFi/labelEn from backend, fallback to href if both are missing
                          const displayLabel =
                            getLabel(
                              language,
                              dbLink.labelFi,
                              dbLink.labelEn
                            ) ||
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
                                  {!isExternal &&
                                  !isFile &&
                                  href &&
                                  href.startsWith("/") ? (
                                    <Link
                                      href={href}
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
                                    </Link>
                                  ) : (
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
                                  )}
                                  {isAdmin && (
                                    <>
                                      <button
                                        role="button"
                                        onClick={() =>
                                          handleStartEditLink(
                                            i,
                                            displayLabel,
                                            href
                                          )
                                        }
                                        className="p-2 text-[var(--va-orange)] hover:bg-[var(--va-grey-50)] rounded-md transition-colors"
                                        title={t.editLink}
                                      >
                                        <FiEdit2 size={20} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}

                              {/* edit links */}
                              {isAdmin && isEditing && (
                                <div className="my-4 sm:mx-0 mx-1 p-4 m-1 border border-[var(--va-border)] rounded-lg">
                                  <label
                                    style={{
                                      fontFamily: "var(--font-machina-bold)",
                                    }}
                                    className="text-lg text-[var(--va-orange)] block"
                                  >
                                    {displayLabel}
                                  </label>
                                  <div>
                                    <label className="text-sm text-[var(--typography)] my-4 block">
                                      {t.oldUrl}
                                    </label>
                                    <p className="text-sm text-[var(--typography)] bg-white p-2 rounded border border-[var(--va-border)] break-all">
                                      {href}
                                    </p>
                                  </div>

                                  <div>
                                    <label className="text-sm text-[var(--typography)] block my-4 pt-2">
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
                                        <h4 className="my-4 text-base font-bold text-[var(--typography)]">
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
                                            className="flex items-center justify-center w-full py-2 bg-[var(--va-grey-50)] text-[var(--typography)] border border-[var(--va-border)] text-sm hover:bg-[var(--va-orange)] hover:text-white transition-colors cursor-pointer rounded-full text-center break-words"
                                          >
                                            {t.selectFile}
                                          </label>
                                        </div>
                                        {selectedFile && (
                                          <p className="my-2 text-sm text-[var(--typography)] px-4 break-words max-w-full">
                                            {t.selected} {selectedFile.name}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* buttons for updating and canceling */}
                                    <div className="flex flex-row gap-2">
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
                                        className="px-4 py-2 bg-[var(--va-orange)] text-white rounded-md"
                                        role="button"
                                      >
                                        {selectedFile
                                          ? uploading
                                            ? t.uploading
                                            : t.uploadAndUpdate
                                          : t.update}
                                      </button>

                                      <button
                                        role="button"
                                        onClick={handleCancelEdit}
                                        className="px-4 py-2 bg-[var(--va-grey-50)] rounded-md border border-[var(--va-border)]"
                                      >
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
    </div>
  );
};
