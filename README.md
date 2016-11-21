TinyShowz on the webz, yo

### Deployment
1. You must have the node builpack even though this is a Ruby app - `heroku buildpacks:add --index 1 heroku/nodejs`. This is because we need the webpack postinstall script to run so it bundles a production version of our JS.
2. Migrate on each deploy: `heroku buildpacks:add https://github.com/gunpowderlabs/buildpack-ruby-rake-deploy-tasks && heroku config:set DEPLOY_TASKS='db:migrate'`
3. Send your config to heroku `heroku plugins:install heroku-config && heroku config:push -f .production.env`. User `-o` to overwrite current settings. See this for more details: https://github.com/xavdid/heroku-config.
4. `git push production master`
5. Make sure the heroku scheduler is setup to pull events from users and pages daily
