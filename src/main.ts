import { buildLoadstring, validateScriptUrl } from "./loadstring";
import "./style.css";

const input = document.querySelector<HTMLInputElement>("#url-input")!;
const errorEl = document.querySelector<HTMLParagraphElement>("#url-error")!;
const outputEl = document.querySelector<HTMLElement>("#snippet-output")!;
const copyBtn = document.querySelector<HTMLButtonElement>("#copy-btn")!;
const copyLabel = copyBtn.querySelector<HTMLSpanElement>(".copy-label")!;

let resetTimer: number | undefined;

function render(): void {
  const raw = input.value;
  if (!raw.trim()) {
    errorEl.hidden = true;
    outputEl.textContent = 'loadstring(game:HttpGet("…"))()';
    outputEl.classList.add("empty");
    copyBtn.disabled = true;
    return;
  }

  const result = validateScriptUrl(raw);
  if (!result.ok) {
    errorEl.textContent = result.error;
    errorEl.hidden = false;
    outputEl.textContent = "—";
    outputEl.classList.add("empty");
    copyBtn.disabled = true;
    return;
  }

  errorEl.hidden = true;
  outputEl.textContent = buildLoadstring(result.url);
  outputEl.classList.remove("empty");
  copyBtn.disabled = false;
}

async function copySnippet(): Promise<void> {
  const text = outputEl.textContent ?? "";
  if (!text || copyBtn.disabled) return;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }

  copyBtn.classList.add("copied");
  copyLabel.textContent = "Copied!";
  window.clearTimeout(resetTimer);
  resetTimer = window.setTimeout(() => {
    copyBtn.classList.remove("copied");
    copyLabel.textContent = "Copy";
  }, 1600);
}

input.addEventListener("input", render);
copyBtn.addEventListener("click", () => void copySnippet());
render();
