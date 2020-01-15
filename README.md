# web-service

This web service listens for organization events when a repository is created. When the repository is created,it automatically make the master branch protected. After that it notifies the user with an @mention in an issue within the repository and  outlines the protections that were added.

## Architecture Overview
![Architecture Overview](https://github.com/Interview-org/web-service/blob/master/overview.jpg)
