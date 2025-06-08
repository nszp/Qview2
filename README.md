# QView

## Getting Started

### Installing pnpm

Install pnpm using the instructions at [pnpm.io](https://pnpm.io/installation).

### Installing moonrepo

Install moonrepo using
```bash
pnpm add -g @moonrepo/cli
```

or any other way you'd like from [their website](https://moonrepo.dev/docs/install).

### Installing frontend dependencies

```bash
moon run frontend:install
```

### Deploying the frontend to Cloudflare Pages and QMServer

1. In the `frontend` directory, run the command
```bash
pnpx wrangler pages deploy dist
```

Log in to your Cloudflare account and select or create a project.

2. To deploy to QMServer, run the command
```bash
moon run frontend:deploy -- "PATH_TO_TEMPLATE_FILE"
```
Replace `PATH_TO_TEMPLATE_FILE` with the path to your QMServer template file. 
This should be `spa.html` within the `templates` directory of your QMServer webroot.

Your React changes will now be applied to the QMServer page once the webroot is re-generated.

## The Backend

The backend is not yet in production.