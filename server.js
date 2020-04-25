const http = require('http');
var usbLib = require("usb");

// define VID and PID for scanner
var vid = 0x1eab; //7851;
var pid = 0x0022; //34;

var device = usbLib.findByIds(vid, pid); // Find usb device by ID
device.open(true); // open device
device.interfaces[0].claim(); // claim interface

let myData = new Array();
let stringList = new Array();

const smallLetters = {
    4: 'a',
    5: 'b',
    6: 'c',
    7: 'd',
    8: 'e',
    9: 'f',
    10: 'g',
    11: 'h',
    12: 'i',
    13: 'j',
    14: 'k',
    15: 'l',
    16: 'm',
    17: 'n',
    18: 'o',
    19: 'p',
    20: 'q',
    21: 'r',
    22: 's',
    23: 't',
    24: 'u',
    25: 'v',
    26: 'w',
    27: 'x',
    28: 'y',
    29: 'z',
    30: '1',
    31: '2',
    32: '3',
    33: '4',
    34: '5',
    35: '6',
    36: '7',
    37: '8',
    38: '9',
    39: '0',
    40: 'enter',
    43: '\t',
    44: ' ',
    45: '-',
    46: '=',
    47: '[',
    48: ']',
    49: '\\',
    51: ';',
    52: '\'',
    53: '`',
    54: ',',
    55: '.',
    56: '/',
    85: '*',
    87: '+'
};

const bigLetters = {
    4: 'A',
    5: 'B',
    6: 'C',
    7: 'D',
    8: 'E',
    9: 'F',
    10: 'G',
    11: 'H',
    12: 'I',
    13: 'J',
    14: 'K',
    15: 'L',
    16: 'M',
    17: 'N',
    18: 'O',
    19: 'P',
    20: 'Q',
    21: 'R',
    22: 'S',
    23: 'T',
    24: 'U',
    25: 'V',
    26: 'W',
    27: 'X',
    28: 'Y',
    29: 'Z',
    30: '!',
    31: '@',
    32: '#',
    33: '$',
    34: '%',
    35: '^',
    36: '&',
    37: '*',
    38: '(',
    39: ')',
    45: '_',
    46: '+',
    47: '{',
    48: '}',
    49: '|',
    51: ':',
    52: '"',
    53: '~',
    54: '<',
    55: '>',
    56: '?'
};

startScan();

function startScan() {
    device.interfaces[0].endpoints[0].startPoll(0, 16); // start polling the USB for data event to fire
    device.interfaces[0].endpoints[0].on("data", function (dataBuf) { // when new data comes in a data event will be fired on the receive endpoint
        let dataArr = Array.prototype.slice.call(new Uint8Array(dataBuf, 0, 8)); // convert buffer to array
        // detect and skip Enter
        if (dataArr[2] !== 40) {
            // check for capital letters
            if (dataArr[0] === 2) {
                stringList.push(bigLetters[dataArr[2]]); // take big letter from bigLetters and push to array
            } else {
                stringList.push(smallLetters[dataArr[2]]); // take small letter from smallLetters and push to array
            }

            myData.push(dataArr[2]); // temp array for checks - push everything for now

        } else { // when "Enter" is hit, finish and print array

            if (myData[0] === 49) { // check if fist item is 49 than splice, otherwise ignore. 49 means that there is/are lower case letter(s) in array (scanned)
                stringList.splice(0, 7);
            }


            string = stringList.join(''); // convert array to string without commas
            console.log(string); // print chars array

            stringList = []; // clear chars array at the end
            myData = []; // clear temp array at the end
            console.log("Waiting for new scans...");

            // CALL ANOTHER FUNCTION HERE AND PASS STRING TO IT
            myFunc(string);
        }
    })
}



function myFunc(data) {
    console.log(data);
}

// ###################### SERVER ####################

const server = http.createServer((request, response) => {
    response.writeHead(200, {
        "Content-Type": "text/plain"
    });
    response.end("Hello to Scanner");

});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
