# sendgrid-template-version-update

This action can be used to edit an active version of sendgrid template. This removes the hectic task of manual editing.

Let's say if you want to edit multiple active versions of a sendgrid template, you can use this action. 

Sample:


```
name: Build & Update staging sendgrid templates

# Run this workflow every time a new commit pushed to your repository
on: 
  push:
    branches: [ main ]

jobs:
  build-and-update-stg-sendgrid-templates:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [10.x]
    

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies
        run: npm install
      - name: Build templates
        run: npm run build
      - name: Build templates-version-id-map file
        run: npm run get-id-content-map-stg
      - name: Update sendgrid templates with latest data
        uses: asimkt/sendgrid-template-version-update@v1.15
        with:
          api-key: ${{ secrets.SENDGRID_API_KEY_STG }}

```

Here apart from 
```
      - name: Build templates-version-id-map file
        run: npm run get-id-content-map-stg
      - name: Update sendgrid templates with latest data
        uses: asimkt/sendgrid-template-version-update@v1.15
        with:
          api-key: ${{ secrets.SENDGRID_API_KEY_STG }}

```
part, we build the files which are supposed be replaced in sendgrid. 

Now the `npm run get-id-content-map-stg` should create a key map where this action can access an object to get the data. For example, here's a sample code which should create the file using gulp.

```
gulp.task('get-id-content-map', function(done) {

  var configPath = './sendgrid-template-versions.json';
  try {
    const file = fs.readFileSync(configPath, "utf8");
    const SENDGRID_CONFIG = JSON.parse(file); 
    // These versions are copied from the sendgrid itself
    // We have to manually do these mapping now.
    const templateVersions = PRODUCTION ? SENDGRID_CONFIG.prod : SENDGRID_CONFIG.stg;
    const map = {};
    const dist = 'dist';
    // here account.html is the email template.
    const filepaths = [
      {
        key: templateVersions.account,
        path: '/account.html'
      },
      {
        key: templateVersions.emailVerification,
        path: '/verify.html'
      }
    ]

    filepaths.forEach(function(pathObj) {
      var fullPath = path.join(dist, pathObj.path);
      var fileContent = fs.readFileSync(fullPath, "utf8");
      map[pathObj.key] = fileContent;
    });

    fs.writeFile(path.join(dist, '/template-version-id-content-map.json'), JSON.stringify(map), done);
  }
  catch(e) {
    beep();
    console.log('[SENDGRID]'.bold.red + ' Sorry, there was an issue with your sendgrid-template-versions.json.');
    process.exit();
  }
  done();
});
```


The `sendgrid-template-versions.json` file will have a structure of:
```
{
    "prod": {
        "account": "d-ba07ed0e9cbd4b48b197e1114f05ada1/versions/9797f1ab-3767-1e11-8ef7-799669a61eb5",
        "emailVerification": "d-3349c73dcaf84b19bd7ef5413057a74e/versions/e789a13a-188c-40f3-983f-91c42ac2d432"
    },
    "stg": {
        "account": "d-c042e008a86b49178ba4e8810a5b317a/versions/15002109-8ddd-481a-b4c5-7e8440ffe9cc",
        "emailVerification": "d-49999995793741e69fdd207065da0f60/versions/1a129242-7610-4948-8b32-e3817d56a614"
    }
  }
  
```




Connect with me at @KTAsim if you need help.

