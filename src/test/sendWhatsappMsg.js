// https://api.ultramsg.com/instance23262/messages/chat?token=6omouavxl2u1vatn&to=+918770792589&body=WhatsApp+API+on+UltraMsgMohit.com+works+good&priority=10
import qs from "query-string";
import http from "https";
import request from "request";
// import http from "http";

// var options = {
//   "method": "POST",
//   "hostname": "api.ultramsg.com",
//   "port": null,
//   "path": "/instance23262/messages/chat",
//   "headers": {
//     "content-type": "application/x-www-form-urlencoded"
//   }
// };

// var req = http.request(options, function (res) {
//   var chunks = [];

//   res.on("data", function (chunk) {
//     chunks.push(chunk);
//   });

//   res.on("end", function () {
//     var body = Buffer.concat(chunks);
//     console.log(body.toString());
//   });
// });
// const multiuser = ['+918770792589','+917049893593']
// req.write(qs.stringify({
//   token: '6omouavxl2u1vatn',
//   to: '+919009699148',
//   body: 'By utlra WhatsApp API on UltraMsg.com works good',
//   priority: '1',
//   referenceId: ''
// }));
// req.end();

const number = ['+918770792589'];
const message = "Hello Mohit Upadhyay, How are you"

for (let i = 0; i < number.length; i++) {
  const url = "https://api.ultramsg.com/instance23262/messages/chat?token=6omouavxl2u1vatn&to=" + number[i] + "&body="+message+"&priority=10";

  request({ url, json: true }, (err, { body }) => {
    if (err) {
      console.log('Unable connect...', 'ERROR!');
    } else {
      console.log(body);
    }
  })
}