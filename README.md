# node-usb-barcode
NodeJS USB 2D card reader helper for Newland HID POS. There are several libraries available for NodeJS applications.
This is extender for popular node-usb module which is used to open and read device data.
Helper helps you to transform data to readable strings as normal Barcode scanner would create in regular use.

# Dependacy

This helper is using node-usb https://github.com/tessel/node-usb package and you can install it by using npm 

# Installation
Run npm install which should install needed libraries and dependecies. 

    npm install

# Windows compatibility

This helper is made mainly for Windows. Barcode scanner acts as HID device and windows does not allow any application to use it in a way to controll it (onen, listen, send commands etc.). To override that limitation, different driver is used and you can follow instructions describer on page https://github.com/tessel/node-usb. Download Zadig app and install WinUsb drivers for your device. Keep in mind that you wont be able to use scanner on a regular way, (it won't act as keyboard any more).

# Configuration 

Use VID and PID of your device to configure it and open it. Example:

    var usbLib = require("usb");
    var vid = 0x1eab; //7851;
    var pid = 0x0022; //34;

    var device = usbLib.findByIds(vid, pid); // Find usb device by ID
    device.open(true); // open device
    device.interfaces[0].claim(); // claim interface - take controll

Different devices are using different configurations. To start polling data from device, use line below. You may have to adjust it for your needs and device configuration. Refer to node-usb documentation.

    device.interfaces[0].endpoints[0].startPoll(0, 16);

# Run
You can run the app by firing command below. To make sure it works open up http://localhost:1337 and you should see 'Hello to Scanner' message in your browser window. 

    node server.js

# How this works?

Helper is opening and reading data which is than pushed to array of chars. At the end array is converted to string without separators.
Data received from USB device looks like lines below and it represends letter **A**  (conbination of 02 00 04). Number 02 means it's capital letter and number 04 represents letter. Letter **a** would be 00 00 04.

    <Buffer 02 00 04 00 00 00 00 00 00 00 00 00 00 00 00 00>

To convert this to letters, helper is using number to letter map with two arrays of letters and signs. They are called **smallLetters** and **bigLetters**.


# Why NodeJS?

This can be used on Windows system in Electron app and with background proccess. It can deliver scanned data to any oher app using localhost sockets.io library for example.


**NOTE:** This should work for most of 2d barcode scanners. It it does not post Issue and I will do my best to respond asap.
    
