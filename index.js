const   http = require('http'), //This module provides the HTTP server functionalities
        path = require('path'), //provides utilities for working with file and directory paths
        express = require('express'), //allows this app to respond to HTTP requests, defines the routing and renders back the required content
        fs = require('fs'), //allows to work with the file system: read and write files back
        xmlParse = require('xslt-processor').xmlParse, //allows to work with XML files
        xsltProcess = require('xslt-processor').xsltProcess, //allows us to uitlise XSL Transformations
        xml2js = require('xml2js'); // XML <-> JSON conversion

        const   router = express(), 
        server = http.createServer(router);

        router.use(express.static(path.resolve(__dirname,'views'))); //We serve static content from "views" folder
        router.use(express.urlencoded({extended: true})); //We allow the data sent from the client to be encoded in a URL targeting our end point
        router.use(express.json()); //We include support for JSON

        router.get('/get/html', function(req, res) {

            res.writeHead(200, {'Content-Type' : 'text/html'});
        
            let xml = fs.readFileSync('TechShop.xml', 'utf8'),
                xsl = fs.readFileSync('TechShop.xsl', 'utf8');
        
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

        router.post('/post/json', function (req, res) {

            function appendJSON(obj) {
        
                console.log(obj)
        
                XMLtoJSON('TechShop.xml', function (err, result) {
                    if (err) throw (err);
                    
                    result.catalog.section[obj.sec_n].entry.push({'brand': obj.brand, 'price': obj.price});
        
                    console.log(JSON.stringify(result, null, "  "));
        
                    JSONtoXML('TechShop.xml', result, function(err){
                        if (err) console.log(err);
                    });
                });
            };
        
            appendJSON(req.body);
        
            res.redirect('back');
        
        });
        
        router.post('/post/delete', function (req, res) {
        
            function deleteJSON(obj) {
        
                console.log(obj)
        
                XMLtoJSON('TechShop.xml', function (err, result) {
                    if (err) throw (err);
                    
                    delete result.catalog.section[obj.section].entry[obj.entree];
        
                    console.log(JSON.stringify(result, null, "  "));
        
                    JSONtoXML('TechShop.xml', result, function(err){
                        if (err) console.log(err);
                    });
                });



        server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
            const addr = server.address();
            console.log("Server listening at", addr.address + ":" + addr.port)
        });
        
