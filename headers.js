/* Please note, Accept header is hard coded as per github documentation.
       see thread here : https://github.com/octokit/rest.js/issues/1368
       This might change in future and we need to update Accept header, but currently as per github documentaiton,
       use : application/vnd.github.luke-cage-preview+json
       for more information , please see https://developer.github.com/v3/repos/branches/#update-branch-protection */
       
exports.getData = function (repoName, githubToken) {
  return {
   "User-Agent":repoName,
   "Authorization": 'Token '+githubToken,
   "Content-Type": 'application/json',
   "Accept":'application/vnd.github.luke-cage-preview+json'
  };
};
