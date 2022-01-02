const   http = require('http'), //HTTP server functionalities
        path = require('path'), //utilities for working with file and directory paths
        express = require('express'), //allowing this app to respond to HTTP requests, defines the routing and renders back the required content
        fs = require('fs'), //allowing to work with the file system: read and write files back
        xmlParse = require('xslt-processor').xmlParse, //allowing to work with XML files
        xsltProcess = require('xslt-processor').xsltProcess, //uitlising XSL Transformations
        xml2js = require('xml2js'); //XML <-> JSON conversion

const   router = express(), 
        server = http.createServer(router);

router.use(express.static(path.resolve(__dirname,'views'))); //serving content from "views" folder
router.use(express.urlencoded({extended: true})); //data sent from the client to be encoded in a URL targeting our end point
router.use(express.json()); //support for JSON

// reading XML file and converting into JSON
function XMLtoJSON(filename, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function(err, xmlStr) {
      if (err) throw (err);
      xml2js.parseString(xmlStr, {}, cb);
    });
};
  
  //converting JSON to XML and save it
function JSONtoXML(filename, obj, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
};

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

    function appendJSON(obj) {//addining brands into the table

        console.log(obj)

        XMLtoJSON('TechShop.xml', function (err, result) {
            if (err) throw (err);
            
            result.catalog.section[obj.sec_n].entry.push({'brand': obj.brand, 'price': obj.price}); //addidng into the the xml file

            console.log(JSON.stringify(result, null, "  "));

            JSONtoXML('TechShop.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    appendJSON(req.body);

    res.redirect('back');//send back to the main page 

});

router.post('/post/delete', function (req, res) { //deleting from the table

    function deleteJSON(obj) {

        console.log(obj)

        XMLtoJSON('TechShop.xml', function (err, result) {
            if (err) throw (err);
            
            delete result.catalog.section[obj.section].entry[obj.entree]; //deleting from the xml file

            console.log(JSON.stringify(result, null, "  "));

            JSONtoXML('TechShop.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    deleteJSON(req.body);

    res.redirect('back'); //send back to the main page 

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    const addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port)
});
