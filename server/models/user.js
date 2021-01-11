/**
 * User model
 */
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    username: String,
    createAt: { type: Date, default: Date.now }
}, {
    collation: 'users'
});

userSchema.methods.validPassword = function(pwd){
    return (this.password === pwd);
}

module.exports = mongoose.model('user', userSchema);