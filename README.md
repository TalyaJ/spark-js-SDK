### Spark Print SDK 

This is a prototype design of a client side SDK for leveraging the Spark Print REST API. It is intended to provide a more convenient interface for application developers. 

This SDK requires a server side implementation of the guest and access tokens. You can find various sample implementations in this repository.

### Motivation

This SDK is intended to fulfill two main goals:
* Provide an abstact layer to the Spark APIs
* Provide a higher level functionality that is achievable only by some methods of chaining/callbacking various APIs together

####Reference to the APIs
You can get full reference to the APIs by visiting these URLs:
* Authentication - https://spark.autodesk.com/developers/reference/authentication
* Print APIs - https://spark.autodesk.com/developers/reference/print
* Drive APIs - https://spark.autodesk.com/developers/reference/drive
* Print firmware APIs - https://spark.autodesk.com/developers/reference/firmware 

### Code Guidelines

In order to create a coherent code base for current and future code on this SDK, one should try to work according to the guidelines below.

#### General
As a general approach always try to use JS best practices in your code. You can find a good reference in [Google's JS guidelines](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).

The other important thing is to stick to the current conventions in this code base. 

#### Structure Guidelines
* Devide your logic between files - don't hold everything inside a single file. Each file should hold, as far as possible, only one coherent subject that identifies this file (for example - "Print Preparation").
* Each file should be self sufficient in the sense of scoping, global variables anf poluting the window namespace. 
* You are advised to apply the [module pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) to make sure you create a clear distinction between private and public methods.
* Create a clear separation between the API groups by putting the different module files in main directory (i.e. print-preparation.js should reside in the print directory)
* Utilities should be in a separate files under the "utilities" directory (i.e. request.js that handles all xhr to API)
* Consider the next structure as your guideline:
```
  - sdk
  -- src
  --- config
  ---- constants.js
  --- utilities
  ---- request.js
  ---- paginated.js
  --- auth
  ---- client.js
  --- print
  ---- print-meta.js
  ---- print-preparation.js
  ---- printer-registration.js
  ---- printer-management.js
  ---- printer-firmware.js
  --- drive
  ---- files.js
  ---- assets.js
  ---- members.js
  -- test
  --- config
  ---- constants.js
  --- utilities
  ---- request.js
  ---- paginated.js
  --- auth
  ---- client.js
  --- print
  ---- print-meta.js
  ---- print-preparation.js
  ---- printer-registration.js
  ---- printer-management.js
  ---- printer-firmware.js
  --- drive
  ---- files.js
  ---- assets.js
  ---- members.js
  -- sample-apps
  --- authentication_sample
  --- 3d_printer_sample
  --- print_preparation_sample
  --- storage_app
  --- gallery_app
  -- karma.conf.js
  -- Gruntfile.js
  -- package.json
  - authentication-server
  -- nodejs
  -- ...
  -- ...
  - README.md
  - LICENSE
  - .gitignore
```  

#### Naming conventions
* File names should follow these conventions:
  * When a file contains a primary class or object interface the file name should match the class or object name.
  * Otherwise the author should name the file to describe the contents as best as possible within a reasonable name length.
  * Use of dashes and underscores in filenames is discouraged. Upper or lower camel case for filenames is preferred.
* Variables should be camelCase
* Objects should be in PascalCase
* Constants should be all cases with underscores between words

#### More conventions
* Use constants instead of string values, for example instead of using this:
```JavaScript
if (response.code === 'error'){
  //do stuff
}
```
Use
```JavaScript
if (response.code === RESPONSE_ERROR_MSG){
  //do stuff
}
```
Where you define RESPONSE_ERROR_MSG in a separate constants file.
