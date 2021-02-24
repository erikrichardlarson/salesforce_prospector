chrome.runtime.onMessage.addListener(receiver);

var salesforceDetails = {};

function receiver(request, sender, sendResponse) {
  if (request.command == 'account_details') {
    var results = request.account_details;
    if (!results['accounts'].length) {
      document.getElementById("loading-div").style.display = "none";
      document.getElementById('results-container').innerHTML = `<div id="login-div" class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
              <div>
                <h2 class="text-center text-3xl font-extrabold text-gray-900">
                  No results found for ${results.query}
                </h2>
              </div>
            </div>
          </div>`;
      return
    }
    var searchResultsHTML = '';
    searchResultsHTML += `<h6 class="mt-6 text-center text-xl font-extrabold text-gray-900">
        Found ${results.accounts.length} result${results.accounts.length > 1 ? 's' : ''} for "${results.query}"</h6>`

    results.accounts.map(function (result, index) {
      var oppContacts = '';
      var i;
      if (!result.mostRecentOpp.records[0] || !result.mostRecentOpp.records[0].OpportunityContactRoles) {
        oppContacts += `<li class="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div class="w-0 flex-1 flex items-center">
                  <span class="ml-2 flex-1 w-0 truncate">
                  No Opportunity Contacts
                  </span>
                </div>
              </li>`;
      }
      else {
        for (i = 0; i < result.mostRecentOpp.records[0].OpportunityContactRoles.records.length; i++) {
          oppContacts += `<li class="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div class="w-0 flex-1 flex items-center">
                  <span class="ml-2 flex-1 w-0 truncate">
                  ${result.mostRecentOpp.records[0].OpportunityContactRoles.records[i].Contact.Name}
                  </span>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <a target="_blank" href="${results.instance_url}/${result.mostRecentOpp.records[0].OpportunityContactRoles.records[i].ContactId}" class="font-medium text-indigo-600 hover:text-indigo-500">
                    View
                  </a>
                </div>
              </li>`;
        }

      }
      var oppData = '';
      if (result.mostRecentOpp.records[0]) {
        oppData += `<dd id="last-opp" class="mt-1 text-sm text-gray-900 space-y-1">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            ${result.mostRecentOpp.records[0].Name}
            </span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            ${result.mostRecentOpp.records[0].StageName}
            </span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            ${new Date(result.mostRecentOpp.records[0].CreatedDate).toLocaleDateString()}
            </span>
          </dd>`
      }
      else {
        oppData += `<dd id="last-opp" class="mt-1 text-sm text-gray-900 space-y-1">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            No Opportunity
            </span>
          </dd>`
      }



      searchResultsHTML += `<div class="max-w-xl mx-auto py-5 px-12">
        <!-- This is a result card, needs to be put into a results div, background should be white, top of div should have "Found n result(s) for "<query>" " -->
        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div class="shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
            <a target="_blank" href=${results.instance_url}/${result.account.records[index].Id}>
              <h3 class="text-lg leading-6 font-medium text-gray-900">
              ${result.account.records[index].Name}
              </h3>
            </a>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    Owner
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    ${result.account.records[index].Owner.Name}
                    </span>
                    <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    ${result.account.records[index].Owner.UserRole.Name}
                    </span>
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    Total Opportunities
                  </dt>
                  <dd id="opp-count" class="mt-1 text-sm text-gray-900">
                    <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      ${result.oppCount.records[0].expr0}
                    </span>
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    Tasks Past 14 Days
                  </dt>
                  <dd id="task-count" class="mt-1 text-sm text-gray-900">
                    <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      ${result.taskCount.records[0].expr0}
                    </span>
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">
                    Last Opportunity
                  </dt> `
        + oppData +
        `</div>
                <div class="sm:col-span-2 overflow-auto max-h-32">
                  <dt class="text-sm font-medium text-gray-500">
                    Opportunity Contacts
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 ">
                    <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">`
        + oppContacts +
        `</ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>`
      document.getElementById("loading-div").style.display = "none";
      document.getElementById('results-container').innerHTML = searchResultsHTML;
    })
  }
}

window.addEventListener('load', function () {

  const REDIRECT_URI = chrome.identity.getRedirectURL('provider_cb');
  const OAUTH_ENDPOINT = 'https://login.salesforce.com/services/oauth2/authorize';

  function loginToSalesforce() {
    chrome.identity.launchWebAuthFlow({
      url: `${OAUTH_ENDPOINT}?response_type=token&client_id=3MVG9i1HRpGLXp.oVnkgUZt.CSpwPsYGsSBTZVh1eB2rlvvUSXlVJzyUjn7t43m18Js7XyS2I_I8ZNdyF8Afv&redirect_uri=${REDIRECT_URI}`,
      interactive: true
    }, (authorizeResponse) => {
      const parseQueryString = (url) => {
        const res = {};
        const hash = new URL(decodeURIComponent(url)).hash;
        const pairs = hash.slice(1).split('&');
        for (let i = 0; pairs[i]; i++) {
          const [key, value] = pairs[i].split('=');
          res[key] = value;
        }
        return res;
      }
      const connection = parseQueryString(authorizeResponse);
      chrome.runtime.sendMessage({
        command: "sf_connection",
        connection: connection
      })
    })
  }

  chrome.runtime.sendMessage({ command: "init" }, function (response) {
    if (response.authed) {
      document.getElementById("login-div").remove()
    }
    else {
      document.getElementById("loading-div").style.display = "none";
      loginToSalesforce()
    }
  })
})



