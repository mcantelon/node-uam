# uam: unhosted web application manager

Node-based unhosted web applications are pretty neat. They can run on any
operating system with Node installed on it. They are, with the Node Package
Manager, super easy to install. And they are easy to write if you're familiar
with web technologies. As browser technologies evolve, they will likely become
more commonplace.

Unhosted web applications feel a bit weird to use though. If you use them
regularly you end up having to do things like creating shell aliases to run
them. There is also no easy way to search for them on the web.

This tool attempts to improve the situation a bit. `uam` makes it easy to
discover unhosted web applications others have created, install them, and
launch them in your browser. uam does this by leveraging the Node Package
Manager (npm). 

Normally you have to do this to end up running a local web application:

1. Hear about the local web application
2. Install the local web application
3. Create a shell alias to conveniently run the local web application
4. Run the local web application (making sure it's TCP/IP port doesn't
   conflict with anything else you're running.
5. Navigate to the local web application in your browser

With uam it's easier:

1. Discover local web applications using `uam search`
2. Install and run the local web applications using `uam install <package>`

Once you've installed a package using uam you can run it using the following
command syntax.

    uam run <package>

`uam`, when running a package, will find a free TCP/IP port and set the
`PORT` environmental variable to this port. This way if the uam packages you
run can reference `PORT` and you can avoid TCP/IP port conflicts. 

If the package's name doesn't conflict with a uam command you can also run it
using the following command syntax.

    uam <package>

To list packages that you've installed using uam, you can use the following
command syntax.

    uam ls

To only list packages with names matching a pattern, use the following command
syntax.

    uam ls <search pattern>

Similarly, to search for packages you might want to install, you can use the
following command syntax.

    uam search

To only show packages with names matching a pattern, use the following command
syntax.

    uam search <search pattern>

__Note:__ If you encounter errors while searching, try setting npm to use
a mirror, such as registry.npmjs.eu. Example:

    npm config set registry http://registry.npmjs.eu

When you have no more use for a package, you can remove it using the following
command:

    uam rm <package>

### Requirements and Installation

uam requires Node and npm. Install using the following command.

    npm install -g uam

### Developers

If you've developed a local web application and want to publish it to the
local web application registry, simply include a "uam" element in your
package's package.json file. The element should be hash with a "start"
element and, optionally, a "port" element (if your local web application
can't have a port specified when run using the command-line).

Here's an example package.json specification for a local web application
which can be run on any port:

  "uam": {
    "start": "nide init -p {port}"
  },

Note that the "{port}" in the "start" element gets replaced with any
available port when the web application is launched.

Here's an example package.json specification for a local web application
which can only be run on a specific port:

  "uam": {
    "start": "node /Users/mike/programming/js/uam/finance/app.js",
    "port": 3000
  }

If you want an example of implementing a uam-friendly npm package, check
out `uam-example` (https://github.com/mcantelon/node-uam-example).

## License 

(The MIT License)

Copyright (c) 2011 Mike Cantelon &lt;mcantelon@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
