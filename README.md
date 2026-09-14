# SJ Engineering & Constructions — Website V1

Static responsive website prepared for `sjconstructions.ca`.

## Included pages
- Home
- Services
- Transportation & Road Safety
- Design-Build
- Missing Middle Housing
- About
- Partner With SJ
- Contact / Request a Quote

## Brand / contact
- Based in Bradford, Ontario
- Phone: +1 647 717 7911
- Public email: info@sjconstructions.ca
- Quote email: quotes@sjconstructions.ca
- Direct email: jithu@sjconstructions.ca

## Service area
Bradford, Caledon, Newmarket, Barrie, Aurora, Richmond Hill, Markham and surrounding communities.

## Forms
The V1 forms use `mailto:` so they work without a backend and open the visitor's email application with the form information pre-filled. Before public launch, replace them with a server-side form endpoint (Cloudflare Worker / Pages Function or equivalent) so submissions work even when visitors do not have a local email client.

## Cloudflare Pages deployment
1. Create a Cloudflare Pages project.
2. Upload the contents of the `sj_website` folder as the site output, or connect a Git repository containing these files.
3. Set the custom domain to `sjconstructions.ca` and optionally `www.sjconstructions.ca`.
4. Enable HTTPS and redirect one hostname to the other so there is a single canonical domain.
5. Configure the three domain email addresses separately through your chosen email provider.

## Before launch
- Confirm PEO requirements, including whether a Certificate of Authorization is required for the services/name being advertised.
- Replace the current raster logo with final transparent/vector logo assets when approved.
- Connect working quote and partner forms.
- Add project photos and completed-project case studies as SJ builds its track record.
- Add privacy policy once the live form/analytics stack is chosen.
