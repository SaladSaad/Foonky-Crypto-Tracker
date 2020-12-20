/* UNSPLASH API */


const fetch=require('node-fetch');
global.fetch=fetch;

const Unsplash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;

//USING uNSPLASH API
const unsplash = new Unsplash({ accessKey: "zS3LphJv6Fveh2_s3jpOBobLa-3sjQSvs08aarcjT2Q" });
unsplash.photos.getRandomPhoto({ tag:"sky"})
  .then(toJson)
  .then(json => {
    console.log(json.urls.regular);
    var background=document.getElementById("bg");
    background.style.setProperty("--image-url", "url("+json.urls.regular+")");

    /*-------OR Small scale unsplash source usage-------*/
    background.style.setProperty("--image-url", "url('https://source.unsplash.com/1920x1080/?sky')");
  });

//Change image constantly. Had error where style was 'unidentified'
function setBg(){
    var imageUrl='https://source.unsplash.com/daily';
    var background=document.getElementById('bg');
    background.style.setProperty("--image-url", "url("+imageUrl+")");
}
setBg();
setInterval(setBg, 300000)



/* Original html code from tutorial */

{
    <div class='row'>
        <div id="price-container">
            <p class="subtext" id="subtext"> Current BTC USD</p>
            <h1 id="price">Loading..</h1>
        </div>
        <div id="goal-container">
            <p><img src="../assets/images/up.svg"><span id="targetPrice">Choose a Target price</span></p>
        </div>
        <div id='right-container'>
            <button id='notifyBtn'>Notify me when ...</button>
        </div>
    </div>
}

/* --------------------------------- */

/* Table layout */

<tbody id='tbody'>
    <tr>
        <td>
            <h4 id="subtext"> Current BTC USD</h4>
        </td>
        <td>
            <h4 id="price">Loading..</h4>
        </td>
        <td>
            <p><img src="../assets/images/up.svg"><span id="targetPrice">Choose a Target price</span></p>
        </td>
        <td>
            <a href="#" class="button primary" id='notifyBtn'>Notify me when ...</a>
        </td>
    </tr>
</tbody>

/* Notification dictionary */
var notification={
    title: crypto + ' Alert',
    body: crypto + ' just beat your target price!',
    icon: path.join(__dirname, '../assets/images/BTC_icon.svg')
};
