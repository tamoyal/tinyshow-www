TinyShowz on the webz, yo

### Deployment
1. You must have the node builpack even though this is a Ruby app - `heroku buildpacks:add --index 1 heroku/nodejs`. This is because we need the webpack postinstall script to run.
2. `git push production master`
3. If you need to migrate, `heroku run rake db:migrate`
