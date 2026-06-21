# AI LaTeX Workflow

The LaTeX tab supports an external-AI workflow:

1. Copy or download the generated prompt.
2. Send the prompt plus the user's resume facts to the user's own AI tool.
3. Ask the AI tool to return only a complete single-file `.tex` document.
4. Paste that `.tex` into the LaTeX source editor.
5. Generate PDF in ResumeTeX.

Structured resume drafts still render through the HTML/SVG preview path. When the LaTeX source is manually changed, the compile worker switches to `latexmk -xelatex` so pasted AI output is compiled as real LaTeX.

The prompt forbids external images/SVG assets, hand-drawn icons, shell escape, `minted`, and unguarded custom fonts so generated code can compile in the server worker. If icons are used, the prompt asks for standard TeX Live packages such as `fontawesome5` with a text-label fallback.
