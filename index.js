const core = require('@actions/core');
const github = require('@actions/github');
const http = require("https");


try {
  // `who-to-greet` input defined in action metadata file
  const apiKey = core.getInput('api-key');
  console.log(`API KEY: ${apiKey}!`);

  const idMap = core.getInput('id-content-map');
  const map = JSON.parse(idMap);
  console.log(`the map is`, Object.keys(map));
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
 

  var options = {
    "method": "PATCH",
    "hostname": "api.sendgrid.com",
    "port": null,
    "path": "/v3/templates/d-56675e6e4d5849baaf482c909361ce73/versions/f5b752f1-289d-4bf9-a6be-774102d4d567",
    "headers": {
      "authorization": `Bearer ${apiKey}`,
      "content-type": "application/json"
    }
  };
  
  var req = http.request(options, function (res) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  
  req.write(JSON.stringify({ active: 1,
    name: 'updated2_example_name',
    html_content: '<div>some2</div>' }));
  req.end();


} catch (error) {
  core.setFailed(error.message);
}