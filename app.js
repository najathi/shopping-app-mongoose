const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5dfcd6ce7f6d864a0017029b")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//mongoose.connect() - Opens the default mongoose connection. Options passed take precedence over options included in connection strings.
mongoose
  .connect(
    "mongodb+srv://najathi:tMfsfowoGt1XooAO@cluster0-0bot6.mongodb.net/shopping?retryWrites=true&w=majority"
  )
  .then(result => {
    // .findOne() - If i give no argument, it will always give me back the first user it finds and then here.
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "najathi",
          email: "najathi@live.com",
          cart: { items: [] }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
