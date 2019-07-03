const config = require('./utils/config')
const app = require('./app');
const http = require('http')

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})