import fitz  # PyMuPDF
import re

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages = [page.get_text() for page in doc]
    doc.close()
    return "\n".join(pages)

def clean_text(raw: str) -> str:
    text = re.sub(r"\n{3,}", "\n\n", raw)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()

def guess_candidate_name(text: str) -> str:
    first_line = text.strip().splitlines()[0]
    return first_line.strip() if first_line else "Unknown"

def parse_resume(pdf_bytes: bytes) -> dict:
    raw = extract_text_from_pdf(pdf_bytes)
    clean = clean_text(raw)
    return {
        "candidate_name": guess_candidate_name(clean),
        "raw_text": clean,
        "char_count": len(clean),
    }

# it separated:
# extraction
# cleaning
# transformation
# orchestration