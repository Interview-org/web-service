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
branch-protection-payload.js| Content in the second column
issue-creation-payload.js| Content from cell 2
headers.js| Content in the second column
options.js| Content in the second column


## How to run the web service

1.) Use the existing service

If someone want to use the existing webservice , then please add me in your github org , and use the below mentioned web service URL in the ORG webhhooks.You need to add me to your org because this webservice uses my github personal access token.If you want to use your own creditinals, then you can run the same code in AWS lambda and use your own githubtoken ( see section below of using the code to create your web service.)

    https://93lj2cittc.execute-api.eu-west-2.amazonaws.com/test/branchtest


2.) Use the code in this repository to create your own service.
If someone want to use the existing webservice , then please add me in your github org , and use the follwoing web service URL in the ORG webhhooks :

https://93lj2cittc.execute-api.eu-west-2.amazonaws.com/test/branchtest

Then you will able to automate the branch protection with new issue creation having branch protection attributes.

If you want to create your own webservice, then please follow the following steps :

prerequestie :

* How to create API gateway and connect to AWS lambda function (https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-with-lambda-integration.html)

* create AWS Lambda function, import the git repository containing all the node modules required to run the lambda function.
* create personal api token for your github user
* Update the enviornmental variable for AWS lambda function with key value as "githubToken" : your perosnal github token
* Create APIgateway on AWS for Post request
* Goto Organization setting on your github account > Goto Webhooks and in the URl, add the Apigateway URL
* Relax and enjoy the magic of Automation


