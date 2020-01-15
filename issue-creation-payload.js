exports.getPayload = function (userName, protectBranchItems) {
  
    const issueNotifyUser = "@" + userName;
    const issueShortComments = "<br/> Master branch in this repoistory has been made protected and following properties applies to it<br/>";
    const issueLongComments = "<br/><br/>- Require branches to be up to date before merging: " + protectBranchItems.required_status_checks.strict + 
                              "<br/><br/>- The list of status checks to require in order to merge into this branch: " + protectBranchItems.required_status_checks.contexts.length + 
                              "<br/><br/>- Enforce all configured restrictions for administrators: " +  protectBranchItems.enforce_admins +
                              "<br/><br/>- Automatically dismiss approving reviews when someone pushes a new commit: " + protectBranchItems.required_pull_request_reviews.dismiss_stale_reviews +
                              "<br/><br/>- Blocks merging pull requests until code owners review them: " + protectBranchItems.required_pull_request_reviews.require_code_owner_reviews +
                              "<br/><br/>- Number of reviewers required to approve pull requests: " + protectBranchItems.required_pull_request_reviews.required_approving_review_count +
                              "<br/><br/>- Restrict who can push to the protected branch";
                              
  return {
      title: "Master Branch is now Protected Branch",
      body: issueNotifyUser + issueShortComments + issueLongComments
  };
};
