# Risks

- PDF generation now runs in a separate worker process, but the default development mode uses local `latexmk`. Use Docker mode for hostile input.
- Browser print output varies slightly across browsers.
- The generated LaTeX assumes XeLaTeX and CJK fonts in the future worker image.
- Current storage is local-only and not suitable for multi-device use.
- Source editing affects `.tex` export, while visual preview remains structured-data driven.
