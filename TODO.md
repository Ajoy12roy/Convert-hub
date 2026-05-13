# TODO

- [ ] Update `app/api/remove-bg/route.ts`
  - [ ] Remove `export const config` block
  - [ ] Accept JSON body `{ url: string }`
  - [ ] Fetch image bytes from URL
  - [ ] Keep Cloudinary transformation + upload_stream logic unchanged

- [ ] Update `app/image/page.tsx`
  - [ ] Upload selected file directly to Cloudinary from the browser (secure_url result)
  - [ ] Send `{ url: secure_url }` to `/api/remove-bg` instead of uploading `FormData`

- [ ] Verify build: run `npm run build`
- [ ] Smoke test: upload a large (20MB) image and confirm background removal works

