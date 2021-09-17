var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Bug = require('./Bug');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, required: true, trim: true },
    token: { type: String, trim: true },
    isadmin: { type: Boolean , required:true},
    bugs: [{ type: Schema.Types.ObjectId, ref: 'bug' }],
  },
  { timestamps: true }
  );

userSchema.statics.FindByEmailAndPassword = function (email, password) {
  var userobj = null;
  return new Promise(function (resolve, reject) {
    User.findOne({ email: email })
      .then((responce) => {
        if (!responce) reject('User Not Found');
        userobj = responce;
        return bcrypt.compare(password, responce.password);
      })
      .then((isMathched) => {
        if (!isMathched) reject('Invalid Credincials');
        resolve(userobj);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt
      .hash(user.password, 10)
      .then((responce) => {
        user.password = responce;
        next();
      })
      .catch((err) => {
        next(err);
      });
  }else{
    next()
  }
  
});


// userSchema.pre("save",function(next){
//   var user = this
//   // check weather password filed is modified
//   if(user.isModified("password")){
//     bcrypt.hash(user.password,10).then(hashPassword=>{
//       user.password = hashPassword
//       next()
//     }).catch(err=>{
//       next(err)
//     })
//   }
// })
userSchema.pre('remove', function (next) {
  Bug.deleteMany({ user: this._id })
    .then((reaponce) => {
      next();
    })
    .catch((err) => {
      next(err);
    });
});
var User = mongoose.model('user', userSchema);

module.exports = User;
