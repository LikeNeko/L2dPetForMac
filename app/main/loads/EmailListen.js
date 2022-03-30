const {MailListener} = require("mail-listener5");

class EmailListen {
    static init() {
        let cfg = store.get('listen_mail');
        console.info('email cfg', cfg)
        let mailListener = new MailListener({
            username: cfg.username,
            password: cfg.password,
            host: cfg.host,
            port: cfg.port, // imap port
            tls: true,
            connTimeout: 10000, // Default by node-imap
            authTimeout: 5000, // Default by node-imap,
            // debug:console.log, // Or your custom function with only one incoming argument. Default: null
            tlsOptions: {rejectUnauthorized: false},
            mailbox: "INBOX", // mailbox to monitor
            searchFilter: [
                // "ALL"
                "UNSEEN",
                "NEW"
            ], // the search filter being used after an IDLE notification has been retrieved
            markSeen: true, // all fetched email willbe marked as seen and not fetched next time
            fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
            attachments: true, // download attachments as they are encountered to the project directory
            attachmentOptions: {directory: "attachments/"},// specify a download directory for attachments
            // keepalive:{
            //     interval:1000,
            //     idleInterval:1000,
            //     forceNoop:false
            // }
        });
        this.mailListener = mailListener;

        mailListener.on("server:connected", this.connect);
        mailListener.on("server:disconnected", this.disconnected);
        mailListener.on("mailbox", this.mailbox);
        mailListener.on("error", this.error);

        mailListener.on("mail", function (mail, seqno) {
            // do something with the whole email as a single object
            console.log('新邮件', mail.subject)
            console.log('seq', seqno)

            // webContents.fromId(1).send(RPC.mail,{title:mail.subject});
        })


        mailListener.on("headers", function (headers, seqno) {
            // do something with mail headers
        });

        mailListener.on("body", function (body, seqno) {
            // do something with mail body
        })

        mailListener.on("attachment", function (attachment, path, seqno) {
            // do something with attachment
        });

    }

    /**
     * 开始监听
     */
    static on() {
        this.mailListener.start(); // start listening
    }

    /**
     * 关闭监听
     */
    static off() {
        this.mailListener.stop()
    }

    /**
     * 链接成功
     * @private
     */
    static connect() {
        console.log("imapConnected");
    }

    /**
     * 链接断开
     * @private
     */
    static disconnected() {
        EmailListen.init();
    }

    /**
     * 收件箱
     * @param mailbox
     * @private
     */
    static mailbox(mailbox) {
        console.log(mailbox.messages.total, "Total mails"); // this field in mailbox gives the total number of emails
    }

    /**
     * 出错
     * @param err
     * @private
     */
    static error(err) {
        console.log('email_listen error:', err)
    }

}

module.exports = {
    EmailListen
}
