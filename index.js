const   http = require('http'), //This module provides the HTTP server functionalities
        path = require('path'), //provides utilities for working with file and directory paths
        express = require('express'), //allows this app to respond to HTTP requests, defines the routing and renders back the required content
        fs = require('fs'), //allows to work with the file system: read and write files back
        xmlParse = require('xslt-processor').xmlParse, //allows to work with XML files
        xsltProcess = require('xslt-processor').xsltProcess, //allows us to uitlise XSL Transformations
        xml2js = require('xml2js'); // XML <-> JSON conversion