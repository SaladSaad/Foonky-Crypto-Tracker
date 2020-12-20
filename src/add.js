'use strict';
const electron = require('electron');
const remote = electron.remote;
const ipc= electron.ipcRenderer;
const closeBtn=document.getElementById('closeBtn');
const submitBtn = document.getElementById('ipcForm');
const fs = require('fs');


closeBtn.addEventListener('click', function(event){
    var window=remote.getCurrentWindow();
    window.close();
});

function addOptions(){
    let fileData=fs.readFileSync('./assets/Update_Values.json');
    fileData=JSON.parse(fileData);
    fileData=fileData.cryptos;
    let select=document.getElementById('cryptoCurrencies')
    for (let i=0;i<fileData.length;i++){
        select.options[select.options.length]=new Option(fileData[i].name, fileData[i].name);

    }
}
addOptions();

function sendForm(event){
    event.preventDefault();
    let newTargetPrice=document.getElementById('targetPrice').value;
    let cryptoCurrency=document.getElementById('cryptoCurrencies').value;
    ipc.send('form-submission', cryptoCurrency, newTargetPrice);

    let window=remote.getCurrentWindow();
    window.close();
}
