const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => {
    res.send('Welcome to Deploy a Node.js App on Kubernetes and Minikube with Ubuntu!!!')
})

app.listen(port, () => {
    console.log(`The nodejs app listening on port ${port}`)
})