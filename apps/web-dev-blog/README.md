# Web Dev Blog

- This project is using git submodules, you can see `.gitmodules` in root of this repository.
- To install submodules use below git command
  - `git submodule update --init --recursive`
- To serve project use `npx nx serve web-dev-blog`

## Styling

- For global styling use file - `custom.scss`

## Deploy

- It uses Github actions for deployment.
- Need to renew secret (secrets.REPO_ACCESS) every year. Provide Content read-write access to home page repo - "harshrohila.github.io"
