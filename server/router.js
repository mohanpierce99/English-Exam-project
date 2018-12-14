function router(bundle) {
    let app = bundle.app;
    let cookieparse = bundle.cookie;
    let {
        mongoose
    } = bundle.mongoose;
    let Student = bundle.Student;
    let express = bundle.express;
    let bodyParser = bundle.bodyParser;
    let mongolib = require('./db/mongolib.js');
    let studColl = mongolib.init(mongoose, "students");
    let teacherPref = mongolib.init(mongoose, "teacherpref");
    let defaults=mongolib.defaults;

    app.use(express.static(__dirname + "./../public", {
        fallthrough: true
    }));
    app.use(cookieparse());
    app.use(bodyParser.json());
    app.get("/", (req, res) => {
        res.send('../public/index.html');
    })


    app.post('/login', (req, res) => {
        let rollno = +req.body.id;
        studColl.read({
            id: rollno
        }, true).then((data) => {
            if (!data) {
                res.status(401).send("Please Signup or enter Correct Register No");
            }
            studColl.update({
                id: rollno
            }, {
                is_loggedin: true
            }).then((data) => {
                res.cookie("auth-token", `${rollno}`, {
                    maxAge: 2400000
                });
                res.send("Successfully logged in");
            }).catch((err) => {
                res.status(404).send("Something went wrong")
            })
        })

    });


    app.get('/inspect', (req, res) => {

        console.log(`${req.cookies} is the users cookie that is stored`);
        res.send("Cookie read");
    });

    app.get('/remove', (req, res) => {
        res.clearCookie("auth-token");
        res.send("Cookie cleared");
    });

    app.post('/register', (req, res) => {
            let user = req.body;
            user.id = +user.id;
            studColl.read({
                id: user.id
            }, true).then((data) => {

                    if (!data) {
                        teacherPref.read({}, false).then((data) => {
                            let mam = data[data.length - 1];
                            delete mam._id;
                            let mainObj = Object.assign(user, mam, defaults);

                            new Student(mainObj).save().then((data) => {
                                res.send("Succesfully Registered");
                            }).catch((err) => {
                                res.status(400).send(err);
                            });
                        }).catch((err) => log(err));
                    }else{
                        res.status(401).send("Roll no already exist");

                    }

                }).catch((err) => {
                    res.status(400).send("Something went Wrong");
                });
            });
  
            }
    

module.exports = router;

function log(d) {
    console.log(d);
}