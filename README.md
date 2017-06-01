# Installing silversurfer 2 Backend

## Step 1: Install Node, NPM

Install Node and NPM on your machine; this typically requires administrative access, 
e.g. become root or use `sudo` (or use a Windows installer).

You must be running at least Node 4.x.x and npm 3.x.x. You can verify 
what, if any, versions you have installed by running `node -v` and 
`npm -v` in a terminal window.

You can download current versions of these tools [here](https://nodejs.org/en/download/current/).

If you use a Linux-like environment, you are encouraged to use your
package manager to install these tools.

If you use OS X, you may wish to consider installing via [HomeBrew](http://brew.sh/).

## Step 2: Check out the source code

IMPORTANT NOTE: This, and all following steps, should be run as a regular (non-root) user.
Strange problems occur with package installation when you are the root user, or from using
the `sudo` command.

In a command shell, make a clone of the git repository:

`$ git clone https://git.pehr.in/mpierre/silversurfer2-backend.git backend`

Then enter the directory created. All further commands will be run inside that directory.

`$ cd backend`

## Step 3: Install the NPM dependencies

`$ npm install`

## Step 4: Run the development server

`$ nodemon ./server.js`

(This will compile and run the node-based web API available at http://localhost:63145/. When application files are changed, 
the server will automatically reload to reflect the changes.

Note: This will provide local access only (e.g. as per URL above).
