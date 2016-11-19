TinyShowz on the webz, yo

### Deployment
1. You must have the node builpack even though this is a Ruby app - `heroku buildpacks:add --index 1 heroku/nodejs`. This is because we need the webpack postinstall script to run.
2. Migrate on each deploy: `heroku buildpacks:add https://github.com/gunpowderlabs/buildpack-ruby-db-migrate.git`
3. `git push production master`
