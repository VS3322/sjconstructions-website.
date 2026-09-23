# Insights content workflow

The website ships with three reviewed starter articles. The scheduled generator selects the next topic in `topics.json`, creates a draft article and updates the Insights listing in a new pull request.

## Enable the generator

1. In the GitHub repository, open **Settings → Secrets and variables → Actions**.
2. Add a repository secret named `OPENAI_API_KEY`.
3. Optionally add `OPENAI_MODEL` to choose a supported text model. If omitted, the workflow uses `gpt-5-mini`.
4. Open the **Generate blog draft** workflow under the repository’s Actions tab and run it once to confirm the setup.

The workflow runs on the first day of each month and creates a pull request. Review the claims, local applicability, links and final wording before merging. Merging the pull request publishes the article through Cloudflare Pages.

Never put the API key in an HTML file, JavaScript served to visitors or a Git commit.
