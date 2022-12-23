const { ObjectId } = require("mongodb");

const postsCollection = require("../db").db().collection("posts");
const ObjectID = require("mongodb").ObjectId;

let Post = function (data, userid) {
    this.data = data;
    this.errors = [];
    this.userid = userid;
};

Post.prototype.cleanUp = function () {
    if (typeof this.data.title != "string") {
        this.data.title = "";
    }
    if (typeof this.data.body != "string") {
        this.data.body = "";
    }

    //get rid of bogus properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date(),
        author: ObjectID(this.userid),
    };
};

Post.prototype.validate = function () {
    if (this.data.title == "") {
        this.errors.push("you need a title.");
    }
    if (this.data.body == "") {
        this.errors.push("you need post content.");
    }
};

Post.prototype.create = function () {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        this.validate();

        if (!this.errors.length) {
            //save post in db
            postsCollection
                .insertOne(this.data)
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    this.errors.push("please try later");
                    reject(this.errors);
                });
        } else {
            reject(this.errors);
        }
    });
};

Post.findSingleById = function (id) {
    return new Promise(async function (resolve, reject) {
        if (typeof id !== "string" || !ObjectID.isValid(id)) {
            reject();
            return;
        }

        let post = await postsCollection.findOne({ _id: new ObjectID(id) });

        if (post) {
            resolve(post);
        } else {
            rej();
        }
    });
};

module.exports = Post;
