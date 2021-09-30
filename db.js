var mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
  })
  .then((responce) => {
    console.log('connected');
  })
  .catch((err) => {
    console.log(err);
  });
