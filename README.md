# Installing silversurfer

## Step 1: Install Node, NPM and gulp

Install Node and NPM on your machine; this typically requires administrative access, 
e.g. become root or use `sudo` (or use a Windows installer).

You must be running at least Node 4.x.x and npm 3.x.x. You can verify 
what, if any, versions you have installed by running `node -v` and 
`npm -v` in a terminal window.

You can download current versions of these tools [here](https://nodejs.org/en/download/current/).

If you use a Linux-like environment, you are encouraged to use your
package manager to install these tools.

If you use OS X, you may wish to consider installing via [HomeBrew](http://brew.sh/).

The `gulp` build tool also requires root access to install a binary in `/usr/bin`, so should
be installed using `sudo` now:

`$ sudo npm install -g gulp`

Once installed, you should be able to run the `gulp` command from anywhere.

## Step 2: Check out the source code

IMPORTANT NOTE: This, and all following steps, should be run as a regular (non-root) user.
Strange problems occur with package installation when you are the root user, or from using
the `sudo` command.

In a command shell, make a clone of the git repository:

`$ git clone https://git.pehr.in/kwilliams/silversurfer`

Then enter the directory created. All further commands will be run inside that directory.

`$ cd silversurfer`

## Step 3: Install the NPM dependencies

`$ npm install`

## Step 4: Build Semantic UI dependency

Semantic is actually a separate project whose source tree will eventually be removed
to its own repository, where we only need to pull in the build result. For now, though,
you need to build the output yourself.

`$ cd semantic && gulp build && cd ..`

## Step 5: Run the development server

`$ npm run server`

(This will compile and run the node-based development server, and should automatically 
open your preferred browser to http://localhost:3000/. When application files are changed, 
the server will automatically reload the app in your browser to reflect the changes.
Configuration changes require a restart.

Note: This will provide local access only (e.g. as per URL above). To allow remote
access to the host, provide a HOST=value argument in the string before running the
server:

`$ HOST=192.168.0.10 npm run server`

## Step 6: Run unit tests

`$ npm run test`

This runs the code linter TSLint, then if it exists with code 0 runs the Karma testrunner
application in the browser according to config/karma.conf.js (Chrome at time of writing).

Code that does not pass TSLint will not be unit testing. Code can be linted independently
by running `npm run tslint` or just `npm run lint` to identify and resolve code quality
issues.

### Headless unit testing

For production servers or in instances where it is undesirable to run a new Chrome instance
to conduct unit testing, unit tests may be executed headlessly inside PhantomJS using the
following command:

`$ npm run headlesstest`

The same reporting output is displayed. This may or may not be quicker than running Karma
through Chrome.

## Step 7: Build files for production

`$ npm run build:prod`

The required files will be placed in the `${project_root}/dist` directory and can be served
locally using a basic web server, such as Python's SimpleHTTPServer:

`$ python -m SimpleHTTPServer 8000`

For actual production environments a more robust server (e.g. nginx) is recommended.

# Running End 2 End tests on silversurfer

To run end 2 end tests on silversurfer, run the command `$ npm run protractor` in the command line. 
A browser window should open up and perform all the tests and then, you should see the results
appear in your terminal window.
