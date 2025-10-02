const readline = require('readline');
const bcrypt = require('bcrypt')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on("line", (line) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(line, salt, (err, hash) => {
            console.log("hashing passwd :", hash);
            rl.close();
        });
    });
});

rl.on("close", () => {
    process.exit();
});

