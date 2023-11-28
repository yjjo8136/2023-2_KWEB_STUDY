require('./env');
const app = require('./app');

const { ArticleDAO, UserDAO } = require("./DAO");

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`KWEB Project: Listening on port ${port}.`);
});
