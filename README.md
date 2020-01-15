# web-service

This web service listens for organization events when a repository is created. When the repository is created,it automatically make the master branch protected. After that it notifies the user with an @mention in an issue within the repository and  outlines the protections that were added.

## Architecture Overview
![Architecture Overview](https://github.com/Interview-org/web-service/blob/master/architecture.jpg)

 1.) When a user create/delete or update a  repository in the organization , using a webhook, a post is sent to webservice endpoint.
 
2.) Api gateway triggers the AWS lambda functions which process the post request.

3.) If a new repository was created , then a lambda function would triggers a PUT request to Github api with update branch protection to make the master branch portected.

4.) After 3 step PUT request is succesfull, it triggers POST request to github api for issue comments and create a new issue on the repository which was created in step 1.

5.) Github users can see the changes of step 2, 3 and 4 on the github UI if it navigates through the UI.
