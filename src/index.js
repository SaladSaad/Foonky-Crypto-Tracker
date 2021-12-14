'use strict';
const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require('axios');
const ipc = electron.ipcRenderer;
const fs = require('fs');

const notifyBtn = document.getElementById('notifyBtn');
let notifyList = [];
let check = document.getElementById('notify-check');

/* MODEL- DATA MANAGEMENT START */

function loadJSON(choice){

    let fileData = fs.readFileSync("./assets/Update_Values.json");
    fileData = JSON.parse(fileData);
    if(choice==null){
        return fileData;
    }
    else{
        return fileData[choice];
    }
};


// Writes provided target price to specified crypto in HTML and JSON
function writeJSON(cryptoCurrency, newTargetPrice) {
    let fileData = loadJSON();
    let cryptoData=fileData.cryptos;

    //writing to HTML
    let cryptoTargetID = document.getElementById(cryptoCurrency + 'TargetPrice');
    cryptoTargetID.innerHTML = ' $' + newTargetPrice.toLocaleString('en');

    //locating cryptocurrency key value pair in JSON
    let index = 0;
    for (var i = 0; i < cryptoData.length; i++) {
        if (cryptoData[i].name == cryptoCurrency) {
            index = i;
        }
    }

    //Replacing old value in JSON with new value.
    cryptoData[index].value = newTargetPrice;
    fileData.cryptos=cryptoData;
    fileData = JSON.stringify(fileData);
    fs.writeFileSync("./assets/Update_Values.json", fileData);

};

function deleteRow(r){
  let fileData=loadJSON();
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById("mainTable").deleteRow(i);
}

//Acquires current value of specified crypto and updates prior value in HTML with current value
function getUSD(cryptoName) {
    var fileData = loadJSON('cryptos');
    var cryptoPrice = document.getElementById(cryptoName + 'Price');
    var url = "https://min-api.cryptocompare.com/data/price?fsym=" + cryptoName + "&tsyms=USD";
    axios.get(url)
        .then(res => {
            //updating crypto value on page
            var cryptos = res.data.USD;
            cryptoPrice.innerText = '$' + cryptos.toLocaleString('en') //make proper number format with comma separation

            //getting all crytos. Localizing target $ for specific crypto
            for (var i = 0; i < fileData.length; i++) {
                if (fileData[i].name == cryptoName) {
                    var cryptoTargetPrice = fileData[i].value;
                }
            }
            if (cryptoTargetPrice <= cryptos) {
                notifyList.push(cryptoName);
            }
        })
}

/* MODEL - DATA MANAGEMENT END */


/* VIEW - UPDATE PAGE START */

//Dynamically creates table based on data in JSON
var table = document.getElementById('mainTable');
(function addRows() {
    var fileData = loadJSON('cryptos');
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    for (var i = 0; i < fileData.length; i++) {
        var cryptoName = fileData[i].name;
        var cryptoTargetPrice = fileData[i].value;

        var tr = tbody.insertRow();
        tr.id = cryptoName;

        var nameContainer = tr.insertCell();
        var priceContainer = tr.insertCell();
        var targetContainer = tr.insertCell();
        var deleteContainer = tr.insertCell();

        /* Name container start */
        var name = document.createElement('h3');
        name.id = 'cryptoName';
        var name_content = document.createTextNode(cryptoName)
        name.appendChild(name_content);
        nameContainer.appendChild(name);
        /*-- Name container end --*/


        /* Price Container start */
        var cryptoPrice = document.createElement('h3')
        cryptoPrice.id = cryptoName + 'Price';
        const price_placeholder = document.createTextNode('Loading...');
        cryptoPrice.appendChild(price_placeholder);
        priceContainer.appendChild(cryptoPrice);
        /* --Price Container end --*/


        /* Target container start */
        var upSvg = document.createElement('img');
        upSvg.src = "../assets/images/up.svg";
        upSvg.width = 20;

        var targetPrice = document.createElement('span');
        targetPrice.id = cryptoName + 'TargetPrice';
        var targetPriceContent = document.createTextNode(' $' + cryptoTargetPrice.toLocaleString('en'))
        targetPrice.appendChild(targetPriceContent);

        var p = document.createElement('p');
        p.appendChild(upSvg);
        p.appendChild(targetPrice);
        targetContainer.appendChild(p);
        /*-- Target container end --*/

        /* Test button container */
        let a=document.createElement('a');
        a.className='icon brands fa-twitter delete';
        a.href='#';
        a.onclick=function(){deleteRow(this)};

        let brandSpan=document.createElement('span');
        brandSpan.className='label';
        brandSpan.innerText='Twitter'

        a.appendChild(brandSpan);
        deleteContainer.appendChild(a);


        getUSD(cryptoName);
        setInterval(getUSD, 30000, cryptoName);
    }
    //timeout allows getUSD to populate notifyList
    setTimeout(notify, 5000);
})();


//checks if getUSD pushed notifylist. Empties list when done.
function notify() {
    if (notifyList!=null){
        if (check.checked) {
            var myNotification = new Notification('Crypto Alert', {
                body: notifyList + ' just beat your target price!'
            });
            notifyList=[];
        }
    }

    setInterval(notify, 30000)
}

/* VIEW - UPDATE PAGE END */

/* CONTROLLER - MANAGE INFORMATION FLOW */

//if check is changed at runtime, updates here
check.addEventListener('click', function(event) {
    check = document.getElementById('notify-check');
    let fileData=loadJSON();

    fileData.checked=check.checked;
    fileData=JSON.stringify(fileData);
    fs.writeFileSync("./assets/Update_Values.json", fileData);

});

(function checkChecked(){
    //get value from json and plug into check here.
    let fileData=loadJSON('checked');
    check.checked=fileData;
})();

function deleter(){
    let table=document.getElementById('mainTable');

    console.log('bruh');
}


notifyBtn.addEventListener('click', function(event) {
    const modalPath = path.join('file://', __dirname, 'add.html')
    let win = new BrowserWindow({
        frame: false,
        alwaysOnTop: true,
        width: 660,
        height: 400,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.on('closed', function() {
        win = null
    })
    win.loadURL(modalPath);
    win.show();
})


//on receiving value for targetPrice, do x

ipc.on('newTargetPrice', function(event, cryptoCurrency, newTargetPrice) {
    newTargetPrice = Number(newTargetPrice); //without conversion, newTargetPrice is recieved as string
    writeJSON(cryptoCurrency, newTargetPrice);
})

/* CONTROLLER - MANAGER INFORMATION FLOW END */
