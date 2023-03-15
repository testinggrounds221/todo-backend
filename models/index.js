const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://user:pass@cluster0.ap8k7tq.mongodb.net/?retryWrites=true&w=majority', {
	keepAlive: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.set('debug', true);
mongoose.Promise = Promise;

module.exports.Todo = require("./todo");