var pdf = require('phantom-html2pdf');
var fs =require('fs');
var XLSX = require('xlsx');
var buf = fs.readFileSync("./test.xlsx");
var wb = XLSX.read(buf, {type:'buffer'});
var pdftojpg = require('pdf2jpg.js');
var path = require('path');
var temp = require('temp').track();
var assert = require('assert');

var tab = wb.Sheets[wb.SheetNames[0]];
// console.log(tab);
// console.log(tab.A4.v);

var pdfOptions = {
  html: '<!DOCTYPE html><html lang="en"><body><h1>'+tab.A4.v+' sdfsdfs</h1></body></html>',
  paperSize: {
    format: 'A4',
    orientation: 'landscape', // portrait
    border: '1cm'
  }
};

pdf.convert(pdfOptions, function(err, result) {

	/* Using a buffer and callback */
	result.toBuffer(function(returnedBuffer) {});

	/* Using a readable stream */
	var stream = result.toStream();

	/* Using the temp file path */
	var tmpPath = result.getTmpPath();

	/* Using the file writer and callback */
	result.toFile("./file.pdf", function() {
    var testFile = path.join(__dirname, 'file.pdf');
    temp.open({suffix: '.jpg'}, function(err, tempFile) {
      var dest = path.join(__dirname, 'file.jpg');
      var resolutionRatio = '300';
      pdftojpg.convert(testFile, dest, resolutionRatio, function (err) {
        if (err) {
          throw err;
        } else {
          var buffer = fs.readFileSync(dest);
          assert(buffer[0] === 0xff && buffer[1] === 0xd8);
        }
      });
    });
  });
});