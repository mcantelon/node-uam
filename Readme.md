# lam: local web application manager

Node-based local web applications are interesting. They can run on any
operating system with Node installed on it. They are easy to write if you're
familiar with web technologies. As browser technologies evolve, they will
likely become more commonplace.

Local web applications feel a bit weird to use though. If you use them
regularly you end up having to do things like creating shell aliases to run
them. There is also no definitive list of them to search through to find them.

This tool attempts to improve the situation a bit. lam makes it easy to
discover local web applications and launch them in the browser. lam does
this by leveraging the Node Package Manager (npm). 

Normally you have to do this to end up running a local web application:

1. Hear about the local web application
2. Install the local web application
3. Create a shell alias to conveniently run the local web application
4. Run the local web application
5. Navigate to the local web application in your browser

With lam it's easier:

1. Discover local web applications using "lam search"
2. Install and run the local web applications using "lam install <package>"

Once you've installed a package using lam you can run it using
"lam run <package>". If the package's name doesn't conflict with a lam
command you can also run it using "lam <pacakge>".

To list packages that you've installed using lam, you can enter the command
"lam ls" or "lam ls <search pattern>".

To list all packages that exist, you can enter the command "lam search" or
"lam search <search pattern>".

### Requirements

lam requires Node and npm.

### Developers

If you've developed a local web application and want to publish it to the
local web application registry, simply include a "local" element in your
package's package.json file. The element should be hash with a "start"
element and, optionally, a "port" element (if your local web application
can't have a port specified when run using the command-line).

Here's an example package.json specification for a local web application
which can be run on any port:

  "local": {
    "start": "nide init -p {port}"
  },

Note that the "{port}" in the "start" element gets replaced with any
available port when the web application is launched.

Here's an example package.json specification for a local web application
which can only be run on a specific port:

  "local": {
    "start": "node /Users/mike/programming/js/lam/finance/app.js",
    "port": 3000
  }

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
