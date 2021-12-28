const   http = require('http'), //This module provides the HTTP server functionalities
        path = require('path'), //provides utilities for working with file and directory paths
        express = require('express'), //allows this app to respond to HTTP requests, defines the routing and renders back the required content
        fs = require('fs'), //allows to work with the file system: read and write files back
        xmlParse = require('xslt-processor').xmlParse, //allows to work with XML files
        xsltProcess = require('xslt-processor').xsltProcess, //allows us to uitlise XSL Transformations
        xml2js = require('xml2js'); // XML <-> JSON conversion

        const   router = express(), 
        server = http.createServer(router);

        router.get('/get/html', function(req, res) {

            res.writeHead(200, {'Content-Type' : 'text/html'});
        
            let xml = fs.readFileSync('PaddysCafe.xml', 'utf8'),
                xsl = fs.readFileSync('PaddysCafe.xsl', 'utf8');
        
            console.log(xml);
            console.log(xsl);
        
            let doc = xmlParse(xml),
                stylesheet = xmlParse(xsl);
        
            console.log(doc);
            console.log(stylesheet);
        
            let result = xsltProcess(doc, stylesheet);
        
            console.log(result);
        
            res.end(result.toString());
        
        });

        server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
            const addr = server.address();
            console.log("Server listening at", addr.address + ":" + addr.port)
        });
        
        
