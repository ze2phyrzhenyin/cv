# Test Plan

Current coverage:

- LaTeX escaping
- LaTeX document generation
- Resume quality checks
- File-backed compile job creation and public response shaping
- File-backed resume version creation and PDF metadata attachment

Next coverage:

- API route validation
- Editor state updates
- Template regression fixtures
- Browser screenshot checks for desktop and mobile, including PDF iframe state
- Worker timeout, memory, and malicious input tests
- Docker worker smoke test in CI when the TeX image is available
