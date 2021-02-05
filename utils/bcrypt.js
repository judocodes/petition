const bcrypt = require('bcryptjs');

function hash(password) {
    return bcrypt.genSalt().then(salt => bcrypt.hash(password, salt));
}

module.exports = {
    hash,
    compare: bcrypt.compare,
};
