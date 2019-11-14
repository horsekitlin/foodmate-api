module.exports = {
    apps : [{
        name: 'foodmate-api',
        script: './app.js',
        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        args: 'one two',
        instances: 1,
        autorestart: true,
        watch: true,
        max_memory_restart: '1G',
        env: {
            PORT: 8990,
            NODE_ENV: 'production'
            }
        }]
    };