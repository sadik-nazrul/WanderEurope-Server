const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5007;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('WanderEurope is Starting NOW');
});


app.listen(port, () => {
    console.log(`WanderEurope Listening from port ${port}`);
});