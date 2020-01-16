# web-service

This web service listens for organization events when a repository is created. When the repository is created,it automatically make the master branch protected. After that it notifies the user with an @mention in an issue within the repository and  outlines the protections that were added.

## Architecture Overview
![Architecture Overview](https://github.com/Interview-org/web-service/blob/master/architecture.jpg)

 1.) When a github user create/delete or update a  repository in the organization , using a webhook, a post is sent to webservice endpoint.
 
2.) Api gateway triggers the AWS lambda functions which process the post request.

3.) If a new repository was created , then lambda function would triggers a PUT request to Github api with update branch protection to make the master branch in recently created repository as protected.

4.) If step 3 is completed succesfully, it triggers POST request to github api for issue comments and create a new issue on the new repository and notify the user with protected branch attributes. Incase there is an error in step 3, error message is logged and this step is not executed.

5.) Github users can see the changes of step 2, 3 and 4 on the github UI.

## Modules Overview

This project has 5 .js file. Index.js is the main node file that executes the logic and implement the webservice. The other 4 js modules are required to execute the index.js code.Please find below the module description.

Module | Description
------------ | -------------
index.js| Its the main mode module which contains the main logic and handling of the webservice.It inherits all the other module as soon this runs
branch-protection-payload.js| This module contains json payload structure for updating branch protection.
issue-creation-payload.js| This module contains json payload structure for creating issues for a repository.
headers.js| This module contains the header object required for http request.
options.js| This module contains the options object required for http request.


## How to run the web service

1.) Use the existing service

* If someone want to use the existing webservice , then please add me in your github org (Username : github-solution-architect), and use the below mentioned web service URL in the ORG webhhooks.You need to add me to your org because this webservice uses my github personal access token.If you want to use your own creditinals, then you can run the same code in AWS lambda and use your own githubtoken ( see section below of using the code to create your web service.)

    https://93lj2cittc.execute-api.eu-west-2.amazonaws.com/test/branchtest


2.) Use the code in this repository to create your own service.

* Create an AWS lambda function and import the code from this repository.If you are new to AWS lambdas , check the developer's guide [here](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
* Create enviornment variable for this AWS lambda and replace it with githubToken parameter in headers.js module.( this token can be found under your github porfile setting page. for more information on generating github token, [check here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line))
* Create an AWS apigateway with post resource.
* Connect AWS lambda function with apigateway such that it is triggered when post is recieved.You can see a good example of AWS lambda with AWS apigateway on this [link](https://www.baeldung.com/aws-lambda-api-gateway)
* Deploy Apigateway and note down the apigateway URL.
* Goto your github's organization settings, webhooks section and paste the URL in the webhook.
* Create a new repository and check the status of the master.
* Relax and enjoy the magic of Automation



