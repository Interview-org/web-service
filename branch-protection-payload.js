exports.getPayload = function (userName) {
  return {
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
};
