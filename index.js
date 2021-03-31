const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const apiKey = core.getInput('api-key');
  console.log(`API KEY: ${apiKey}!`);

  const idMap = core.getInput('id-content-map');
  const map = JSON.stringify(idMap);
  console.log(`the map is`, Object.keys(map));
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  
  var data = JSON.stringify({
    "active": 1,
    "name": "updated2_example_name",
    "html_content": "<div>some2</div>"
  });
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
    }
  });
  
  xhr.open("PATCH", "https://api.sendgrid.com/v3/templates/d-56675e6e4d5849baaf482c909361ce73/versions/f5b752f1-289d-4bf9-a6be-774102d4d567");
  xhr.setRequestHeader("authorization", `Bearer ${apiKey}`);
  xhr.setRequestHeader("content-type", "application/json");
  
  xhr.send(data);
} catch (error) {
  core.setFailed(error.message);
}