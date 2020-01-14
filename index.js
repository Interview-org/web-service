const https = require('https');

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
    
    const protectBranchItems = {
        required_status_checks: {
            strict: true,
            contexts: []
        },
        enforce_admins: true,
        required_pull_request_reviews: {
        dismissal_restrictions: {
          users: [userName],
          teams: []
        },
        dismiss_stale_reviews: true,
        require_code_owner_reviews: true,
        required_approving_review_count: 2
        },    
        restrictions: {
            users: [userName],
            teams: [],
            apps: []
        }
    };

    //Populate protection json required by github api to update the branch protection.
    const payloadForProtectBranch = JSON.stringify(protectBranchItems);
    
    
    // create header to send PUT to github api
    /* Please note, Accept header is hard coded as per github documentation.
       see thread here : https://github.com/octokit/rest.js/issues/1368
       This might change in future and we need to update Accept header, but currently as per github documentaiton,
       use : application/vnd.github.luke-cage-preview+json
       for more information , please see https://developer.github.com/v3/repos/branches/#update-branch-protection */
    const headers = {
        'User-Agent':repoName,
        "Authorization": 'Token d61f46105d3cd961dd10d9d92396463bcf7db42d',
        "Content-Type": 'application/json',
        "Accept":'application/vnd.github.luke-cage-preview+json'
    };
    
    const options = {
    port: 443,
    protocol: 'https:',
    host: 'api.github.com',
    path: '/repos/' + orgName + '/' + repoName +'/branches/' + branchName + '/protection',
    method: 'PUT',
    headers: headers,
    };


    const req = https.request(options, res => {
        console.log("statusCode: ${res.statusCode}");
        res.on('data', d => {
            process.stdout.write(d);
          });
    });

    req.on('error', error => {
      console.error(error);
    });

    req.write(payloadForProtectBranch);
    req.end();
    
    //////////////////////////////////////////////////
   
   const options1 = {
    protocol: 'https:',
    host: 'api.github.com',
    path: '/repos/' + orgName + '/' + repoName +'/issues',
    method: 'POST',
    headers: headers,
    };
    
    const req1 = https.request(options1, res1 => {
        console.log("statusCode: ${res1.statusCode}");
        res1.on('data', d => {
            process.stdout.write(d);
          });
    });

    req1.on('error', error => {
      console.error(error);
    });

    const issueNotifyUser = "@" + userName;
    const issueShortComments = "<br/> Master branch in this repoistory has been made protected and following properties applies to it<br/>";
    const issueLongComments = "<br/><br/>- Require branches to be up to date before merging: " + protectBranchItems.required_status_checks.strict + 
                              "<br/><br/>- The list of status checks to require in order to merge into this branch: " + protectBranchItems.required_status_checks.contexts.length + 
                              "<br/><br/>- Enforce all configured restrictions for administrators: " +  protectBranchItems.enforce_admins +
                              "<br/><br/>- Automatically dismiss approving reviews when someone pushes a new commit: " + protectBranchItems.required_pull_request_reviews.dismiss_stale_reviews +
                              "<br/><br/>- Blocks merging pull requests until code owners review them: " + protectBranchItems.required_pull_request_reviews.require_code_owner_reviews +
                              "<br/><br/>- Number of reviewers required to approve pull requests: " + protectBranchItems.required_pull_request_reviews.required_approving_review_count +
                              "<br/><br/>- Restrict who can push to the protected branch";
                              
    const payloadIssueJson = JSON.stringify({
        title: "Master Branch is now Protected Branch",
        body: issueNotifyUser + issueShortComments + issueLongComments
    });
    req1.write(payloadIssueJson);
    req1.end(); 
    
    //https://github.com/github-solution-architect
};
