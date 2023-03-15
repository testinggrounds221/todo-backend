const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const db = require("./models/");
const axios = require("axios")
const cors = require("cors");
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

app.use(cors());
app.use(bodyParser.json());


function success(res, payload) {
	return res.status(200).json(payload);
}

const checkJwt = auth({
	audience: 'http://localhost:3000/',
	issuerBaseURL: 'https://dev-hdklbyherefykad5.us.auth0.com/'
});

const checkScopes = requiredScopes('read:todo');

app.get("/todos", async (req, res, next) => {
	console.log("res")
	try {
		const todos = await db.Todo.find({});
		return success(res, todos);
	} catch (err) {
		console.log("err");
		console.log(err);
		next({ status: 400, message: "failed to get todos" });
	}
});

app.post("/todos", async (req, res, next) => {
	try {
		const todo = await db.Todo.create(req.body);
		return success(res, todo);
	} catch (err) {
		next({ status: 400, message: "failed to create todo" });
	}
});

app.put("/todos/:id", async (req, res, next) => {
	try {
		const todo = await db.Todo.findByIdAndUpdate(req.params.id, req.body, {
			new: true
		});
		return success(res, todo);
	} catch (err) {
		next({ status: 400, message: "failed to update todo" });
	}
});

app.delete("/todos/:id", async (req, res, next) => {
	try {
		const item = await db.Todo.findByIdAndRemove(req.params.id);
		return success(res, item);
	} catch (err) {
		next({ status: 400, message: "failed to delete todo" });
	}
});

app.post("/login", async (req, res, next) => {
	console.log("IN LOGIN")
	try {
		var options = {
			method: 'POST',
			url: 'https://dev-hdklbyherefykad5.us.auth0.com/oauth/token',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			data: new URLSearchParams({
				grant_type: 'password',
				username: req.body.email,
				password: req.body.password,
				audience: 'https://dev-hdklbyherefykad5.us.auth0.com/mfa/',
				// scope: 'read:sample',
				client_id: '2QIExYYaaARX2lrOmurgOPX7lTnDGvna',
				client_secret: 'RZJx-lFNAF_T8qnCfjmCe7fNkhGkHMrj7g7gCuSurcYGPlhPfDUqCkKToNevU0YC'
			})
		};
		console.log(options)
		axios.request(options).then(function (response) {
			// console.log(response);
			res.send(response.data.access_token)
		}).catch(function (error) {
			console.log("Error")

			console.log(error.response)
			res.status(401);
			console.log(error)
			res.send({ code: 401, message: error.response })
			// res.send(error.message);
		});
	} catch (err) {
		next({ status: 400, message: err.message });
	}
});


// to https://dev-hdklbyherefykad5.us.auth0.com/oauth/token


app.use((err, req, res, next) => {
	return res.status(err.status || 400).json({
		status: err.status || 400,
		message: err.message || "there was an error processing request"
	});
});


app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});


