"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "@/components/editor/ConfirmModal";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { AITemplate } from "@/types/ai-types";

type AIStep = "template" | "processing" | "compare";

interface EditWithAIModalProps {
  isOpen: boolean;
  selectedText: string;
  templates: AITemplate[];
  isTemplatesLoading: boolean;
  onGenerated?: (text: string) => void;
  onClose: () => void;
  onApply: (finalText: string) => void;
  handleRequestEditWithAI: (
    template: AITemplate,
    text: string,
  ) => Promise<string>;
}

export default function EditWithAIModal({
  isOpen,
  selectedText,
  templates,
  isTemplatesLoading,
  onGenerated,
  onClose,
  onApply,
  handleRequestEditWithAI,
}: EditWithAIModalProps) {
  const [step, setStep] = useState<AIStep>("template");
  const [aiText, setAIText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [chosenResult, setChosenResult] = useState<"original" | "ai" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("template");
      setAIText("");
      setSelectedTemplate(null);
      setChosenResult(null);
      setConfirmOpen(false);
      setError(null);
    }
  }, [isOpen]);
  if (!isOpen) return null;

  const applyTemplate = async () => {
    if (!selectedTemplate) return;
    setStep("processing");
    setError(null);
    try {
      const editedText = await handleRequestEditWithAI(
        selectedTemplate,
        selectedText,
      );
      setAIText(editedText);
      onGenerated?.(editedText);
      setStep("compare");
    } catch (e) {
      setError(
        "AI-editing failed. Please try again or choose a different template.",
      );
      setStep("template");
    }
  };

  const openConfirm = (result: "original" | "ai") => {
    setChosenResult(result);
    setConfirmOpen(true);
  };

  const confirmApply = () => {
    onApply(chosenResult === "ai" ? aiText : selectedText);
    setConfirmOpen(false);
    onClose();
  };

  const renderDisclaimerTooltip = (props: any) => (
    <Tooltip
      id="aiDisclaimerTooltip"
      {...props}
      style={{ ...props.style, fontSize: "0.8rem" }}
    >
      AI can be wrong, so check your changes before saving.
    </Tooltip>
  );

  return (
    <>
      <div
        className="modal show d-block"
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(6px)",
          zIndex: 1040,
        }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div
            className="modal-content border-0 shadow-lg"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "20px",
              color: "#000",
            }}
          >
            <div className="modal-header border-0 pb-0 px-4 pt-4">
              <div>
                <h5
                  className="fw-bold mb-0 text-uppercase tracking-wider"
                  style={{ fontSize: "1.2rem" }}
                >
                  Edit with AI
                </h5>
                <small className="text-muted">Edit text with AI</small>
              </div>
              <button className="btn-close shadow-none" onClick={onClose} />
            </div>

            <div className="modal-body p-4">
              {step === "template" && (
                <div className="row g-4">
                  <div className="col-md-5">
                    <label className="small fw-bold text-uppercase opacity-50 mb-2 d-block">
                      Original selected text
                    </label>
                    <div
                      className="p-3 shadow-sm border-0"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "12px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        fontSize: "0.95rem",
                        lineHeight: "1.6",
                      }}
                    >
                      {selectedText}
                    </div>
                  </div>

                  <div className="col-md-7">
                    <label className="small fw-bold text-uppercase opacity-50 mb-2 d-block">
                      Choose AI-editing template
                    </label>

                    {isTemplatesLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border spinner-border-sm opacity-25" />
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-2 mb-3">
                        {templates.map((template) => (
                          <label
                            key={template.id}
                            className="p-3 shadow-sm d-flex align-items-center gap-3"
                            style={{
                              cursor: "pointer",
                              backgroundColor:
                                selectedTemplate?.id === template.id
                                  ? "#fff"
                                  : "rgba(255, 255, 255, 0.5)",
                              borderRadius: "10px",
                              border:
                                selectedTemplate?.id === template.id
                                  ? "1.5px solid #000"
                                  : "1.5px solid transparent",
                            }}
                          >
                            <input
                              type="radio"
                              className="form-check-input m-0 shadow-none"
                              name="aiTemplate"
                              style={{ border: "1px solid #000" }}
                              checked={selectedTemplate?.id === template.id}
                              onChange={() => setSelectedTemplate(template)}
                            />
                            <span className="fw-bold">{template.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {selectedTemplate && (
                      <div
                        className="p-3 mb-3 border-start border-dark border-3 bg-white shadow-sm italic small text-muted"
                        style={{ borderRadius: "0 8px 8px 0" }}
                      >
                        {selectedTemplate.description}
                      </div>
                    )}

                    {error && (
                      <div className="p-2 mb-3 text-danger small bg-danger bg-opacity-10 rounded text-center">
                        {error}
                      </div>
                    )}

                    <button
                      className="w-100 py-3 fw-bold text-uppercase tracking-widest shadow-sm"
                      style={{
                        backgroundColor: selectedTemplate ? "#000" : "#ccc",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        cursor: selectedTemplate ? "pointer" : "not-allowed",
                      }}
                      disabled={!selectedTemplate}
                      onClick={applyTemplate}
                    >
                      Start AI-editing
                    </button>
                  </div>
                </div>
              )}

              {step === "processing" && (
                <div className="text-center py-5 my-5">
                  <div
                    className="spinner-grow text-dark mb-4"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h4 className="fw-bold text-uppercase tracking-widest">
                    AI is working on your text
                  </h4>
                  <p className="text-muted">
                    {selectedTemplate ? selectedTemplate.label : ""}
                  </p>
                </div>
              )}

              {step === "compare" && (
                <div className="animate-fade-in">
                  <div className="d-flex justify-content-between align-items-center mb-4 px-1">
                    <h6 className="fw-bold text-uppercase opacity-50 mb-0">
                      Compare results
                    </h6>
                    <button
                      className="bg-transparent border-0 text-dark fw-bold small p-0"
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => setStep("template")}
                    >
                      Change template
                    </button>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <div
                        className="h-100 p-4 shadow-sm"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.5)",
                          borderRadius: "15px",
                        }}
                      >
                        <span className="badge bg-secondary mb-3 text-uppercase p-2">
                          Original selected text
                        </span>
                        <div
                          className="small opacity-75"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {selectedText}
                        </div>
                        <button
                          className="btn btn-outline-dark w-100 mt-4 border-2 fw-bold"
                          onClick={onClose}
                        >
                          Keep original
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div
                        className="h-100 p-4 shadow-sm bg-white position-relative"
                        style={{
                          borderRadius: "15px",
                          border: "1px solid #000",
                          userSelect: "none",
                        }}
                      >
                        <span className="badge bg-dark mb-3 text-uppercase p-2">
                          AI-edited variant
                        </span>
                        <div
                          className="small fw-bold"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {aiText}
                        </div>

                        <OverlayTrigger
                          placement="top"
                          overlay={renderDisclaimerTooltip}
                          delay={{ show: 200, hide: 150 }}
                        >
                          <button
                            className="btn btn-outline-dark w-100 mt-4 border-2 fw-bold"
                            onClick={() => openConfirm("ai")}
                          >
                            Replace text
                          </button>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Confirm replacement"
        message="Are you sure you want to replace the selected original fragment with the generated AI variant?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={confirmApply}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
