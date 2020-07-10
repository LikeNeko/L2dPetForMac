//
let username = "1330040125@qq.com",
    password = "fvsanevipxcwiahe",
    host = "imap.qq.com",
    port = 993;
const {webContents} = require("electron")
const{ MailListener }= require("mail-listener5");
let mailListener = new MailListener({
    username: username,
    password: password,
    host: host,
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    // debug:console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX", // mailbox to monitor
    searchFilter: [
        // "ALL"
        "UNSEEN",
        "NEW"
    ], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: { directory: "attachments/" } ,// specify a download directory for attachments
    // keepalive:{
    //     interval:1000,
    //     idleInterval:1000,
    //     forceNoop:false
    // }
});

mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
    log("imapConnected");
});

mailListener.on("mailbox", function(mailbox){
    log( mailbox.messages.total,"Total mails"); // this field in mailbox gives the total number of emails
});

mailListener.on("server:disconnected", function(){
    log("imapDisconnected");
    mailListener.start(); // start listening

});

mailListener.on("error", function(err){
    log(err);
});

mailListener.on("headers", function(headers, seqno){
    // do something with mail headers
});

mailListener.on("body", function(body, seqno){
    // do something with mail body
})

mailListener.on("attachment", function(attachment, path, seqno){
    // do something with attachment
});
let arr = [];
mailListener.on("mail", function(mail, seqno) {
    // do something with the whole email as a single object
    log(mail.subject,'新邮件')
    log(seqno,'seq')
    if (arr.indexOf(seqno)>=0){
        return;
    }
    arr.push(seqno)
    webContents.fromId(1).send('mail',{title:mail.subject});
})
