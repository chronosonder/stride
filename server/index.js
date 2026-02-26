const app = require('./src/app');
const port = 5000;


app.listen(port, () => {
    console.log(`Server online on port ${port}`);
})