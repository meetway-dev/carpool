# Bugfix Command Template

- Locate the failing area by reading the minimal affected files.
- Keep changes localized to the existing feature or service.
- Preserve current request/response formats and error handling.
- Do not add new abstractions unless directly needed.
- If a validation bug exists, update the corresponding schema in `validators/`.
- If a data bug exists, update the corresponding service or model.
