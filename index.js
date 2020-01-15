const https = require('https');
const options = require('./options');
const branchprotection = require('./branch-protection-payload');
const headers = require('./headers');
const issueComments= require('./issue-creation-payload');

exports.handler = (event, context, callback) => {
    
    const actionType = event.action;
    if(actionType != "created"){
        callback(null, {"statusCode": "200", "message": "Webservice only respond to create repository request"});
        return;
    }
    
    //Gather org, repo and user details from github org webhook post.
    const repoDetails = event.repository;
    const orgDetails = event.organization;
    const userDetails = event.sender;
    const orgName = orgDetails.login;
    const repoName = repoDetails.name;
    const branchName = 'master';
    const userName = userDetails.login;
    
    //create http request parameters for both branch protection and issue comments calls.
    const githubHostName = 'api.github.com';
    const repoPath= '/repos/' + orgName + '/' + repoName;
    const branchProtectionPath = repoPath + '/branches/' + branchName + '/protection';
    const issueCreationPath = repoPath + '/issues';
    
    // create header for POST and PUT requests
    const headersData = headers.getData(repoName, process.env.githubToken);
    
    // create Options set for branch protection and issue creation requests
    const optionsBranchProtection = options.getData('PUT', githubHostName, branchProtectionPath, headersData);
    const optionsIssueCreation = options.getData('POST', githubHostName, issueCreationPath, headersData);
    
    //Populate protection json required by github api to update the branch protection.
    const protectBranchItems = branchprotection.getPayload(userName);
    const payloadForProtectBranch = JSON.stringify(protectBranchItems);
    
    //Populate issue creation json required by github api to create a new issue.
    const issueCommentspayload = issueComments.getPayload(userName, protectBranchItems);                          
    const payloadIssueJson = JSON.stringify(issueCommentspayload);
    
    function sendRequest(optionsload, payload) {
        return new Promise((resolve, reject) => {
            const req = https.request(optionsload, (resp) => {
                resp.on('data', (chunk) => {
         
                });
    
                resp.on('end', () => {
                    resolve();
                });
        });
        
         req.on("error", (err) => {
            reject(err);
        });
        req.write(payload);
        req.end();
    });
    }
    
    sendRequest(optionsBranchProtection, payloadForProtectBranch)
        .then(data => {
                sendRequest(optionsIssueCreation, payloadIssueJson)
                .then(data => {
                    console.log("Issue was created successfully with protection branch attribute. ")
                })
                .catch(error => {
                    console.log("Was unable to create the issue automatically.Please check the issue's section on your repository on Github.")
                })
    
        })
        .catch(error => {
            console.log("Unable to make the master branch of repository :" + repoName + " protected automatically");
            console.log("Dont worry, you can still make your branch protected via Github UI." + 
                        "For more details check : https://help.github.com/en/enterprise/2.16/admin/developer-workflow/configuring-protected-branches-and-required-status-checks#enabling-a-protected-branch-for-a-repository");
    });
};
