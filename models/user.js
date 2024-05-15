const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  LastName: {
    type: String,
    required: [true, "First Name is required"],
  },
  about: {
    type: String,
  },

  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: function (email) {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      },
      message: (props)  => `Email is (${props.value}) is invalid!`,
    },
  },
  passsword: {
    type: String,
  },
  passswordConfirm: {
    type: String,
  },
  
  paswordResetExpires: {
    type: String,
  },
  passwordChangedAt: {
    type: Date,
  },
  CreatedAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  otp: {
    type: Number,
  },
  otp_expiry_time: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  // only run this func if Otp is actually modified
  if (!this.isModified("otp")) return next();
  // hash the otp with cost of 12 if we increase the 12 it will increase the difficulty to decrypt more
  this.otp = await bcrypt.hash(this.otp, 12);
  next();
});

userSchema.pre("save", async function (next) {
  // only run this func if Otp is actually modified
  if (!this.IsModified("password")) return next();
  // hash the otp with cost of 12 if we increase the 12 it will increase the difficulty to decrypt more
  this.otp = await bcrypt.hash(this.password, 12);
  next();
});
//  methods are function which are used to access properties from the schemahere "correctpassword is a mwthod that ill compare passowrd"
userSchema.methods.correctpassword = async function (
  candidatePassword, //that is supplied to us by the user 1,2,3,4.5
  userPassword // that is going to be stored in db "hashedpassowrd using bcrypt package"
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.correctOTP = async function (
  candidateOTP, //that is supplied to us by the user 1,2,3,4.5
  userOTP // that is going to be stored in db "hashedpassowrd using bcrypt package"
) {
  return await bcrypt.compare(candidateOTP, userOTP);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.PasswordResetToken = crypto
    .createHash("abh256")
    .update(resetToken)
    .digest("hex");
    this.passwordResetExpires =Date.now() + 10*60*1000;

  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (timeStamp){
return timeStamp< this.passwordChangedAt;
}

// model
const User = new mongoose.model("User", userSchema);

module.exports = User;
